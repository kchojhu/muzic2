package com.muzic.service;

import java.util.Optional;
import java.util.Set;

import org.junit.Assert;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;

import com.muzic.Muzic2ApplicationTests;
import com.muzic.model.PlayList;
import com.muzic.model.Songs;


public class PlayListServiceImplIntegrationTest extends Muzic2ApplicationTests{

	@Autowired
	private PlayListService playListService;

	@Test
	public void getPlayList() {
		Optional<Set<PlayList>> playList = playListService.getPlaylists("LIKE_CNT");
		
		Assert.assertTrue(playList.isPresent());
		System.out.println("result size:" + playList.get().size());
		System.out.println(playList);		
	}
	
	@Test
	public void getPlayListById() {
		Optional<Songs> songs = playListService.getPlaylistsSongs("415847746");
		
		Assert.assertTrue(songs.isPresent());
		System.out.println("result size:" + songs.get().getSongs().size());
		System.out.println(songs.get().getSongs());		
	}
	

	
}
