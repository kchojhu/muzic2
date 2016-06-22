package com.muzic.service;

import java.util.List;
import java.util.Map;
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

@Service("kPopService")
public class KpopServiceImpl implements MusicChartSerice {

	@Value("${kpop.urls}")
	private String[] kpopUrls;

	@Autowired
	private RestTemplate restTemplate;

	@Autowired
	private YoutubeService youtubeService;

	@Autowired
	private CacheService cacheService;
	
	private String cacheSongKey = "kpop";

	@Scheduled(fixedRate = 3600000)
	public void refreshSongs() {
		cacheService.deleteCache(cacheSongKey);
	}
	
	@PostConstruct
	public void init() {
		this.getSongs();
	}

	@SuppressWarnings("unchecked")
	@Override
	public Songs getSongs() {

		Songs cache = cacheService.getCache(cacheSongKey);
		if (cache != null) {
			return cache;
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

		Songs songs = new Songs();

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

		cacheService.saveCache(songs, cacheSongKey);
		
		return songs;
	}

	@Override
	public Songs getSongs(String country) {
		// TODO Auto-generated method stub
		return null;
	}

}
