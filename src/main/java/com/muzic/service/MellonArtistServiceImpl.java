package com.muzic.service;

import java.io.File;
import java.io.IOException;
import java.util.List;
import java.util.Map;
import java.util.Properties;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

import javax.annotation.PostConstruct;

import org.apache.commons.io.FileUtils;
import org.apache.commons.lang.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponents;
import org.springframework.web.util.UriComponentsBuilder;

import com.muzic.model.Song;
import com.muzic.model.Songs;
import com.google.api.client.util.Lists;

@Service("mellonArtistService")
public class MellonArtistServiceImpl implements MusicChartSerice {

	private File artistIdFile = new File(
			System.getProperty("user.home") + File.separator + "tmp2" + File.separator + "artistId.properties");

	@Value("${korean.artist.url}")
	private String koreanArtistUrlTemplate;

	@Autowired
	private RestTemplate restTemplate;

	@Autowired
	private YoutubeService youtubeService;

	@Autowired
	private CacheService cacheService;

	private String getSongId(String artistId) throws IOException {
		Properties prop = new Properties();
		prop.load(FileUtils.openInputStream(artistIdFile));

		return prop.getProperty(artistId);

	}

	// @Scheduled(fixedRate = 60000)
	// public void refreshSongs() {
	// cacheService.deleteCache("Dance");
	// }

//	@PostConstruct
	public void init() {
		this.getSongs();
		try {
			artistIdFile.createNewFile();
		} catch (IOException e) {
			e.printStackTrace();
		}
	}

	@SuppressWarnings("unchecked")
	@Override
	public Songs getSongs(String artistId) {

		Songs cache = cacheService.getCache(artistId);
		if (cache != null) {
			return cache;
		}

		List<Map<String, Object>> songsList = Lists.newArrayList();
		Songs songs = new Songs();


		UriComponentsBuilder builder = UriComponentsBuilder.fromHttpUrl(koreanArtistUrlTemplate.replaceAll("fn1ArtistId", artistId));
		UriComponents components = builder.build(true);

		Map<String, Object> result = restTemplate.getForObject(components.toUri(), Map.class);
		if (result.containsKey("results")) {
			songsList.addAll((List<Map<String, Object>>) result.get("results"));
		}

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
				song.setArtistName(s.get("artist/_text").toString().split(Pattern.quote("("))[0].trim());
				song.setSongName(s.get("title/_text").toString().split(Pattern.quote("("))[0].trim());
				songs.getSongs().add(song);
			}

		});
		songs.getSongs().parallelStream().forEach(song -> {
			youtubeService.getSong(song);
		});

		songs.setSongs(songs.getSongs().stream().filter(song -> song.getSongId() != null).collect(Collectors.toList()));

		cacheService.saveCache(songs, artistId);

		return songs;
	}

	@Override
	public Songs getSongs() {
		return null;
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

	@Override
	public Songs getSongs(String country, boolean useCache) {
		// TODO Auto-generated method stub
		return null;
	}

}
