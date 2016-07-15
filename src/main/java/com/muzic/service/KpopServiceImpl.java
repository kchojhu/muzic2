package com.muzic.service;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

import javax.annotation.PostConstruct;

import org.apache.commons.lang.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponents;
import org.springframework.web.util.UriComponentsBuilder;

import com.google.api.client.util.Lists;
import com.google.api.client.util.Sets;
import com.muzic.model.Song;
import com.muzic.model.Songs;
import com.muzic.util.ApplicationUtil;

@Service("kPopService")
public class KpopServiceImpl implements MusicChartSerice {

	private String playlistKey = "playlist/kr/top";
	
	@Value("${kpop.urls}")
	private String[] kpopUrls;

	@Autowired
	private RestTemplate restTemplate;

	@Autowired
	private YoutubeService youtubeService;

	@Autowired
	private FirebaseService firebaseService;
	
	
	@Scheduled(fixedRate = 21600000, initialDelay=21600000)
	@Override
	public void refreshSongs() {
		getSongs(false);
	}
	
	@Override
	public Songs getSongs(boolean useCache) {
		LocalDate now = LocalDate.now();

		Songs songs = new Songs();

		Optional<List<Song>> results = firebaseService.readList(playlistKey, Song.class);
		
		if (results.isPresent() && useCache) {
			songs.getSongs().addAll(results.get());
			return songs;
		}
		
		List<Map<String, Object>> songsList = Lists.newArrayList();

		for (String kpopUrl : kpopUrls) {
			UriComponentsBuilder builder = UriComponentsBuilder.fromHttpUrl(kpopUrl);
			UriComponents components = builder.build(true);

			Map<String, Object> result = restTemplate.getForObject(components.toUri(), Map.class);
			if (result.containsKey("results")) {
				songsList.addAll((List<Map<String, Object>>) result.get("results"));
			}
		}
		
		Set<String> songTitle = Sets.newHashSet();

		songsList.forEach(s -> {
			Integer rank = null;

			if (s.get("rank") != null) {
				if (StringUtils.isNumeric(s.get("rank").toString())) {
					rank = Integer.parseInt(s.get("rank").toString());
				} 
			}

			if (rank != null) {
				Song song = new Song();
				song.setRank(rank);
				song.setArtistName(s.get("artist").toString().split(Pattern.quote("|"))[0]);
				song.setSongName(s.get("title").toString());
				
				if (!songTitle.contains(song.getSongName())) {					
					songs.getSongs().add(song);
				}				
			}

		});

		songs.getSongs().parallelStream().forEach(song -> {
			youtubeService.getSong(song);
		});

		
		songs.setSongs(songs.getSongs().stream().filter(song -> song.getSongId() != null).collect(Collectors.toList()));
		firebaseService.writeList(playlistKey, songs.getSongs());
		firebaseService.writeList(playlistKey + "-" + ApplicationUtil.getDateFormatKey(now), songs.getSongs());
		
		return songs;

		
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
	public Songs getSongs(String country, boolean useCache) {
		// TODO Auto-generated method stub
		return null;
	}


}
