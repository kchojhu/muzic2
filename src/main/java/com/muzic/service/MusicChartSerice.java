package com.muzic.service;

import com.muzic.model.Songs;

public interface MusicChartSerice {

	Songs getSongs();
	
	Songs getSongs(String country);
	
}
