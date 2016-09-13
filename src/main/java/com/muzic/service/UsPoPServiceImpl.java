package com.muzic.service;

import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponents;
import org.springframework.web.util.UriComponentsBuilder;

import com.google.api.client.util.Lists;
import com.muzic.model.Genre;
import com.muzic.model.Song;
import com.muzic.model.Songs;
import com.muzic.util.ApplicationUtil;

@Service("usPoPService")
public class UsPoPServiceImpl implements MusicChartSerice {

	private String playlistKey = "playlist/us/top";

	@Value("${uspop.url}")
	private String[] songUrls;

	@Value("${us.genre.url}")
	private String genreUrls;

	@Autowired
	private RestTemplate restTemplate;

	private List<Genre> genres;

	private String genrelistKey = "genre/us/";

	@Autowired
	private FirebaseService firebaseService;

	@Autowired
	private YoutubeService youtubeService;

	@Scheduled(fixedRate = 41600000, initialDelay = 41600000)
	@Override
	public void refreshSongs() {
		getGenreConfigruation().stream().forEach(genre -> {
			getGenre(genre.getName(), false);
		});
		getSongs(false);
	}

	public List<Genre> getGenreConfigruation() {
		if (genres == null) {
			genres = firebaseService.readList("menu/genre/america", Genre.class).get();
		}
		return genres;
	}

	public Songs getGenre(String type, Boolean useCache) {
		Genre genre = getGenreConfigruation().stream().filter(v -> {
			return v.getName().equalsIgnoreCase(type);
		}).findFirst().get();
		String genreKey = genrelistKey + genre.getName().replaceAll(" ", "");

		Optional<List<Song>> results = firebaseService.readList(genreKey, Song.class);
		Songs songs = new Songs();
		if (results.isPresent() && useCache) {
			songs.getSongs().addAll(results.get());
			return songs;
		}

		Calendar calendar = Calendar.getInstance();
		calendar.set(Calendar.DAY_OF_WEEK, Calendar.SATURDAY);
		SimpleDateFormat dateformat = new SimpleDateFormat("yyyy-MM-dd");

		List<Map<String, Object>> songsList = Lists.newArrayList();
		for (int i = 0; i < 40; i++) {
			UriComponentsBuilder builder = UriComponentsBuilder
					.fromHttpUrl(genreUrls.replaceAll("genreType", genre.getKey()).replaceAll("genreDate",
							dateformat.format(calendar.getTime())));
			UriComponents components = builder.build(true);

			Map<String, Object> result = restTemplate.getForObject(components.toUri(), Map.class);
			if (result.containsKey("results")) {
				songsList.addAll((List<Map<String, Object>>) result.get("results"));
			}

			calendar.add(Calendar.DATE, -7);
		}

		songsList.forEach(s -> {
			try {
				Song song = new Song();
				song.setArtistName(s.get("artist").toString());
				song.setSongName(s.get("title").toString());
				if (!songs.getSongs().contains(song)) {
					songs.getSongs().add(song);
				}

			} catch (Exception e) {
				// ignore
			}

		});

		songs.getSongs().parallelStream().forEach(song -> {
			youtubeService.getSong(song);
		});

		songs.setSongs(songs.getSongs().stream().filter(song -> song.getSongId() != null).collect(Collectors.toList()));
		firebaseService.writeList(genreKey, songs.getSongs(), true);
		return songs;
	}

	// @PostConstruct
	public void init() {
		this.getSongs();
	}

	@SuppressWarnings("unchecked")
	@Override
	public Songs getSongs() {
		return getSongs(true);
	}

	@Override
	public Songs getSongs(String country) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public Songs getSongs(boolean useCache) {
		Optional<List<Song>> results = firebaseService.readList(playlistKey, Song.class);
		Songs songs = new Songs();
		if (results.isPresent() && useCache) {
			songs.getSongs().addAll(results.get());
			return songs;
		}

		songs = getGenre("pop", true);
		firebaseService.writeList(playlistKey, songs.getSongs());
		return getGenre("pop", true);
	}

	@Override
	public Songs getSongs(String country, boolean useCache) {
		// TODO Auto-generated method stub
		return null;
	}

}
