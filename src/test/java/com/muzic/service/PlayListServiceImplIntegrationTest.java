package com.muzic.service;

import java.util.Optional;
import java.util.Set;
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.TimeUnit;

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
	public void getPlayList() throws Exception{
		CountDownLatch countDownLatch = new CountDownLatch(1);
		Optional<Set<PlayList>> playList = playListService.getPlaylists("START_DATE");
		countDownLatch.await(30, TimeUnit.SECONDS);
	}
	
	@Test
	public void getPlayListById() {
		Optional<Songs> songs = playListService.getPlaylistsSongs("415847746");
		
		Assert.assertTrue(songs.isPresent());
		System.out.println("result size:" + songs.get().getSongs().size());
		System.out.println(songs.get().getSongs());		
	}
	
	@Test
	public void refreshUSPlaylist() {
		playListService.refreshUSPlaylist();
//		System.out.println("test".matches("^[A-Za-z0-9 _]*[A-Za-z0-9][A-Za-z0-9 _()-]*"));
		
	}
	
	public static void main(String[] args) {
		System.out.println("사랑에 빠지고 싶다".matches("^[A-Za-z0-9 _]*[A-Za-z0-9][A-Za-z0-9 _()-]*"));
	}
	
}
