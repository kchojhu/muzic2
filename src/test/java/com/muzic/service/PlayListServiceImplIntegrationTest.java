package com.muzic.service;

import java.util.Optional;
import java.util.Set;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import org.junit.Assert;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;

import com.muzic.Muzic2ApplicationTests;
import com.muzic.model.PlayList;


public class PlayListServiceImplIntegrationTest extends Muzic2ApplicationTests{

	@Autowired
	private PlayListService playListService;

	@Test
	public void getPlayList() {
		Optional<Set<PlayList>> playList = playListService.getPlaylists("LIKE_CNT");
		
		Assert.assertTrue(playList.isPresent());
		System.out.println(playList);		
	}
	

	
}
