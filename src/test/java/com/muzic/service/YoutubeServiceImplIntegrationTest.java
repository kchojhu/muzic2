package com.muzic.service;

import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;

import com.muzic.Muzic2ApplicationTests;
import com.muzic.model.Song;

public class YoutubeServiceImplIntegrationTest extends Muzic2ApplicationTests {

	@Autowired
	private YoutubeService youtubeService;

	@Test
	public void push() throws Exception {
		Song song = new Song();
		song.setSongId("pjdhqCZQGlQ");
		song.setSongName("We're A Miracle kdasjfo;adfojofjadsafjdfsaj");
		song.setArtistName("Christina Aguilera");
		System.out.println("here:" + youtubeService.replaceSong(song));
	}
	

}
