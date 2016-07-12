package com.muzic.service;

import java.util.concurrent.CountDownLatch;
import java.util.concurrent.TimeUnit;

import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;

import com.muzic.Muzic2ApplicationTests;


public class ItuneServiceImplIntegrationTest extends Muzic2ApplicationTests{

	@Autowired
	private ItuneServiceImpl ituneService;


	
	@Test
	public void getSongs() throws Exception{
		CountDownLatch countDownLatch = new CountDownLatch(1);
		ituneService.getSongs("us");
		countDownLatch.await(10, TimeUnit.SECONDS);
		
	}

	@Test
	public void refresh() throws Exception {
		ituneService.refreshSongs();
	}
	
	
	
}
