package com.muzic.service;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.TimeUnit;

import org.junit.Before;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;

import com.google.api.client.util.Maps;
import com.google.common.collect.Lists;
import com.muzic.Muzic2ApplicationTests;
import com.muzic.model.Songs;


public class KpopServiceImplIntegrationTest extends Muzic2ApplicationTests{

	@Autowired
	private KpopServiceImpl kpopService;
	
	
	@Test
	public void getSongs() throws Exception{
		CountDownLatch countDownLatch = new CountDownLatch(1);
		kpopService.getSongs();
		countDownLatch.await(10, TimeUnit.SECONDS);
//		Optional<List<Map<String, String>>> results = firebaseService.read("playlist/kpop/20160702");
//		System.out.println(results.get().size());
		
	}

	
}
