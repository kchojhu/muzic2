package com.muzic.service;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.TimeUnit;

import org.junit.Before;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;

import com.google.api.client.util.Maps;
import com.google.common.collect.Lists;
import com.muzic.Muzic2ApplicationTests;
import com.muzic.model.Song;
import com.muzic.model.Songs;

public class FirebaseServiceImplIntegrationTest extends Muzic2ApplicationTests {

	@Autowired
	private FirebaseServiceImpl firebaseService;

	@Test
	public void readList() throws Exception {
		Optional<List<Song>> results = firebaseService.readList("playlist/korean/top-20160703", Song.class);
		if (!results.isPresent()) {
			System.out.println("no data");
		} else {			
			System.out.println(results.get().size());
			results.get().stream().forEach(System.out::println);
		}

	}
	
	@Test
	public void update() throws Exception {
		CountDownLatch countDownLatch = new CountDownLatch(1);
		Map<String, Object> updateMap = Maps.newHashMap();
		updateMap.put("rank", "100");
		firebaseService.update("playlist/korean/top-20160703/-KLlnWQhoxjkjR7IO4Hz", updateMap);
		countDownLatch.await(10, TimeUnit.SECONDS);
	}
	
	@Test
	public void writeList2() throws Exception {
		CountDownLatch countDownLatch = new CountDownLatch(1);
		List<Song> maps = Lists.newArrayList();
		for (int i = 0; i < 10; i++) {			
			Song song1 = new Song();
			song1.setArtistName("zzzlah" + i);
			song1.setDuration(100);
			song1.setImage("blahimage" + i);
			song1.setRank(i);
			song1.setSongId("difaidja" + i);
			song1.setSongName("ok.... + " + i);
			maps.add(song1);
		}

		firebaseService.writeList("playlist/kr/top", maps);
		countDownLatch.await(10, TimeUnit.SECONDS);

	}
	

	@Test
	public void writeList() throws Exception {
		CountDownLatch countDownLatch = new CountDownLatch(1);
		List<Song> maps = Lists.newArrayList();
		for (int i = 0; i < 10; i++) {			
			Song song1 = new Song();
			song1.setArtistName("zzzlah" + i);
			song1.setDuration(100);
			song1.setImage("blahimage" + i);
			song1.setRank(i);
			song1.setSongId("difaidja" + i);
			song1.setSongName("ok.... + " + i);
			maps.add(song1);
		}

		firebaseService.writeList("playlist/korea/top-20160702", maps);
		countDownLatch.await(10, TimeUnit.SECONDS);

	}

}
