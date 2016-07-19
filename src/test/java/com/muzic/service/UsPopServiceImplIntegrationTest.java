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


public class UsPopServiceImplIntegrationTest extends Muzic2ApplicationTests{

	@Autowired
	private UsPoPServiceImpl usPopService;
	
	
	@Test
	public void getGenre() throws Exception{
		usPopService.getGenre("pop-songs", false);
		
	}

	
}
