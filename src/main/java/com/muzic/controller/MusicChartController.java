package com.muzic.controller;

import java.io.File;
import java.io.IOException;
import java.util.Collections;
import java.util.Enumeration;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Map;
import java.util.Properties;

import org.apache.commons.io.FileUtils;
import org.apache.commons.lang.math.NumberUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.muzic.model.Songs;
import com.muzic.service.MusicChartSerice;
import com.google.api.client.util.Lists;
import com.google.api.client.util.Maps;

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
	@Qualifier("ituneService")
	private MusicChartSerice ituneService;
	private String[] countryList = {"Korean","American","Japanese", "Dance"}; 
	
	private File artistIdFile = new File(
			System.getProperty("user.home") + File.separator + "tmp2" + File.separator + "artistId.properties");
	
	@RequestMapping("/musicDropdown")
	public ResponseEntity<List<Map<String, String>>> musicDropDownValues() throws IOException {
		Properties prop = new Properties();
		prop.load(FileUtils.openInputStream(artistIdFile));
		
		List<Map<String, String>> values = Lists.newArrayList();
		
		for (String country: countryList) {			
			Map<String,String> musicValue = Maps.newHashMap();
			musicValue.put("name", country);
			musicValue.put("value", country);
			values.add(musicValue);
		}
		
		prop.forEach((k, v) -> {			
			Map<String,String> musicValue = Maps.newHashMap();
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
		case "Korean":
			return kPopService.getSongs();
		case "American":
			return usPopService.getSongs();
		case "Japanese":
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
