package com.muzic.service;

import java.util.List;
import java.util.Map;
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
import com.google.api.client.util.Lists;

@Service("usPoPService")
public class UsPoPServiceImpl implements MusicChartSerice {

	@Value("${uspop.url}")
	private String[] songUrls;

	@Autowired
	private RestTemplate restTemplate;

	@Autowired
	private YoutubeService youtubeService;

	@Autowired
	private CacheService cacheService;

	private String cacheSongKey = "pop";

	public void refreshSongs() {
		cacheService.deleteCache(cacheSongKey);
	}

//	@PostConstruct
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

		for (String songUrl : songUrls) {
			UriComponentsBuilder builder = UriComponentsBuilder.fromHttpUrl(songUrl);
			UriComponents components = builder.build(true);

			Map<String, Object> result = restTemplate.getForObject(components.toUri(), Map.class);
			if (result.containsKey("results")) {
				songsList.addAll((List<Map<String, Object>>) result.get("results"));
			}
		}

		Songs songs = new Songs();

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

		cacheService.saveCache(songs, cacheSongKey);

		return songs;
	}

	@Override
	public Songs getSongs(String country) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public Songs getSongs(boolean useCache) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public Songs getSongs(String country, boolean useCache) {
		// TODO Auto-generated method stub
		return null;
	}

}
