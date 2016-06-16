package com.muzic.controller;

import java.io.File;
import java.io.IOException;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Properties;
import java.util.Set;

import org.apache.commons.io.FileUtils;
import org.apache.commons.lang.math.NumberUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.google.api.client.util.Lists;
import com.google.api.client.util.Maps;
import com.muzic.model.PlayList;
import com.muzic.model.Songs;
import com.muzic.service.MusicChartSerice;
import com.muzic.service.PlayListService;

@RestController
@RequestMapping("/chart")
public class MusicChartController {

	@Autowired
	@Qualifier("kPopService")
	private MusicChartSerice kPopService;

	@Autowired
	@Qualifier("usPoPService")
	private MusicChartSerice usPopService;

	@Autowired
	@Qualifier("jPoPService")
	private MusicChartSerice jPopService;

	@Autowired
	@Qualifier("mellonService")
	private MusicChartSerice mellonService;

	@Autowired
	@Qualifier("mellonArtistService")
	private MusicChartSerice mellonArtistService;

	@Autowired
	private PlayListService playListService;

	@Autowired
	@Qualifier("ituneService")
	private MusicChartSerice ituneService;
	private String[] countryList = { "Korean", "American", "Japanese", "Dance" };

	private File artistIdFile = new File(
			System.getProperty("user.home") + File.separator + "tmp2" + File.separator + "artistId.properties");

	@RequestMapping("/playlist/{playlistType}")
	public ResponseEntity<Set<PlayList>> getPlaylist(@PathVariable String playlistType) {

		Optional<Set<PlayList>> playList = playListService.getPlaylists(playlistType);
		if (playList != null && playList.isPresent()) {
			return new ResponseEntity<Set<PlayList>>(playList.get(), HttpStatus.OK);
		}
		return null;
	}

	@RequestMapping("/playlist-songs/{playlistId}")
	public ResponseEntity<Songs> getPlaylistSongsById(@PathVariable String playlistId) {

		Optional<Songs> songs = playListService.getPlaylistsSongs(playlistId);

		if (songs != null && songs.isPresent()) {
			return new ResponseEntity<Songs>(songs.get(), HttpStatus.OK);
		}
		return null;
	}

	@RequestMapping("/musicDropdown")
	public ResponseEntity<List<Map<String, String>>> musicDropDownValues() throws IOException {
		Properties prop = new Properties();
		prop.load(FileUtils.openInputStream(artistIdFile));

		List<Map<String, String>> values = Lists.newArrayList();

		for (String country : countryList) {
			Map<String, String> musicValue = Maps.newHashMap();
			musicValue.put("name", country);
			musicValue.put("value", country);
			values.add(musicValue);
		}

		prop.forEach((k, v) -> {
			Map<String, String> musicValue = Maps.newHashMap();
			musicValue.put("name", v.toString());
			musicValue.put("value", k.toString());
			values.add(musicValue);
		});

		return new ResponseEntity<List<Map<String, String>>>(values, HttpStatus.OK);
	}

	@RequestMapping("/top100")
	public Songs top100(@RequestParam String country) {
		if (NumberUtils.isNumber(country)) {
			return mellonArtistService.getSongs(country);
		}

		switch (country) {
		case "Korea":
			return kPopService.getSongs();
		case "America":
			return usPopService.getSongs();
		case "Japan":
			return jPopService.getSongs();
		case "Dance":
			return mellonService.getSongs(country);
		}
		return null;
	}

	@RequestMapping("/ituneTop100")
	public Songs ituneTop100(@RequestParam String country) {
		return ituneService.getSongs(country);
	}

}
