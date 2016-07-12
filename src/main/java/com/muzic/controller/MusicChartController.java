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
import com.muzic.model.Song;
import com.muzic.model.Songs;
import com.muzic.service.FirebaseService;
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
	@Qualifier("mellonService")
	private MusicChartSerice mellonService;

	@Autowired
	@Qualifier("mellonArtistService")
	private MusicChartSerice mellonArtistService;

	@Autowired
	private PlayListService playListService;

	@Autowired
	private FirebaseService firebaseService;
	
	
	@Autowired
	@Qualifier("ituneService")
	private MusicChartSerice ituneService;

	@RequestMapping("/firebase")
	public Map<String, Object> getFirebase(String dataRef) {
		Optional<Map<String, Object>> result = firebaseService.read(dataRef);
		if (result.isPresent()) {
			return result.get();
		}
		return null;
		
	}
	
	
	@RequestMapping("/refreshplaylist")
	public void refreshPlaylist() {
		kPopService.refreshSongs();
		playListService.refreshUSPlaylist();
		ituneService.refreshSongs();
	}
	
	@RequestMapping("/refreshitune")
	public void refreshItune(@RequestParam(required=false, value="true") Boolean useCache) {
		ituneService.refreshSongs(useCache);
	}
	
	@RequestMapping("/playlist/{playlistType}")
	public ResponseEntity<Set<PlayList>> getPlaylist(@PathVariable String playlistType) {

		Optional<Set<PlayList>> playList = playListService.getPlaylists(playlistType);
		if (playList != null && playList.isPresent()) {
			return new ResponseEntity<Set<PlayList>>(playList.get(), HttpStatus.OK);
		}
		return null;
	}

	@RequestMapping("/playlist-songs")
	public ResponseEntity<List<Song>> getPlaylistSongsById(@RequestParam String dataRef) {

		Optional<List<Song>> songs = firebaseService.readList(dataRef, Song.class);

		if (songs.isPresent()) {
			return new ResponseEntity<List<Song>>(songs.get(), HttpStatus.OK);
		}
		
		return null;
	}
//
//	@RequestMapping("/musicDropdown")
//	public ResponseEntity<List<Map<String, String>>> musicDropDownValues() throws IOException {
//		System.out.println("hello");
//		Properties prop = new Properties();
//		prop.load(FileUtils.openInputStream(artistIdFile));
//
//		List<Map<String, String>> values = Lists.newArrayList();
//
//		prop.forEach((k, v) -> {
//			Map<String, String> musicValue = Maps.newHashMap();
//			musicValue.put("name", v.toString());
//			musicValue.put("value", k.toString());
//			values.add(musicValue);
//		});
//
//		return new ResponseEntity<List<Map<String, String>>>(values, HttpStatus.OK);
//	}
//
//	@RequestMapping("/genre/{genreId}")
//	public Songs getGenre(@PathVariable String genreId) {
//		return mellonArtistService.getSongs(genreId);
//	}
	
	
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
			return mellonService.getSongs(country);
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
