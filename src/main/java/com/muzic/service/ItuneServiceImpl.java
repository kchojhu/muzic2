package com.muzic.service;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.Optional;
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

import com.muzic.model.Song;
import com.muzic.model.Songs;
import com.muzic.util.ApplicationUtil;
import com.google.api.client.util.Lists;

@Service("ituneService")
public class ItuneServiceImpl implements MusicChartSerice {
	private String playlistKey = "playlist/";
	@Value("${itune.url}")
	private String songUrl;

	@Autowired
	private RestTemplate restTemplate;

	@Autowired
	private YoutubeService youtubeService;

	@Autowired
	private FirebaseService firebaseService;


//	@Scheduled(fixedRate = 3600000)
	@Scheduled(fixedRate = 21600000,initialDelay=21600000)
	public void refreshSongsInterval() {
//		System.out.println("refresh");
		refreshSongs(false);
	}
	
	@Override
	public void refreshSongs(Boolean useCache) {
		Optional<Map<String, Object>> menu = firebaseService.read("menu");
		menu.ifPresent(menuMap-> {
			Map<String, Object> countriesMap = (Map<String, Object>) menuMap.get("countries");
			
			countriesMap.values().forEach((country) -> {
				Map<String, Object> countryMap = (Map<String, Object>) country;
				String countryCode = countryMap.get("countryCode").toString();
				System.out.println("countryCode" + countryCode);
				if (!countryCode.equalsIgnoreCase("kr") && !countryCode.equalsIgnoreCase("us")) {
					getSongs(countryCode, useCache);					
				}
			});
			
		});
		
	}

	@SuppressWarnings("unchecked")
	@Override
	public Songs getSongs(String country) {
		return getSongs(country, true);
	}

	@Override
	public Songs getSongs() {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public Songs getSongs(String country, boolean useCache) {
		LocalDate now = LocalDate.now();
		Songs songs = new Songs();
		Optional<List<Song>> results = firebaseService.readList(playlistKey + country + "/top", Song.class);
		if (results.isPresent() && useCache) {
			songs.getSongs().addAll(results.get());
			return songs;
		}

		UriComponentsBuilder builder = UriComponentsBuilder.fromHttpUrl(songUrl.replaceFirst("country", country == "us" ? "" : country));
		UriComponents components = builder.build(true);
		List<Map<String, Object>> songsList = Lists.newArrayList();
		Map<String, Object> result = restTemplate.getForObject(components.toUri(), Map.class);
		if (result.containsKey("results")) {
			songsList.addAll((List<Map<String, Object>>) result.get("results"));
		}


		songsList.forEach(s -> {
			Integer rank = null;

			if (s.get("rank") != null) {

				String rankString = s.get("rank").toString().replace(".", "");

				if (StringUtils.isNumeric(rankString)) {
					rank = Integer.parseInt(rankString);
				}

			}

			if (rank != null) {
				Song song = new Song();
				song.setRank(rank);
				song.setArtistName(s.get("artist/_text").toString());
				song.setSongName(s.get("title/_text").toString());
				songs.getSongs().add(song);
			}

		});

		songs.getSongs().parallelStream().forEach(song -> {
			youtubeService.getSong(song);
		});

		songs.setSongs(songs.getSongs().stream().filter(song -> song.getSongId() != null).collect(Collectors.toList()));
		firebaseService.writeList(playlistKey + country + "/top-" +  ApplicationUtil.getDateFormatKey(now), songs.getSongs());
		firebaseService.writeList(playlistKey + country + "/top", songs.getSongs());

		return songs;

	}

	@Override
	public Songs getSongs(boolean useCache) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public void refreshSongs() {
		// TODO Auto-generated method stub
		
	}

}
