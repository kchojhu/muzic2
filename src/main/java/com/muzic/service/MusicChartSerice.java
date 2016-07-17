package com.muzic.service;

import com.muzic.model.Songs;

public interface MusicChartSerice {

	Songs getSongs();
	
	Songs getSongs(String country);

	Songs getSongs(boolean useCache);
	

	void refreshSongs();

	Songs getSongs(String country, boolean useCache);

	default void refreshSongs(Boolean useCache) {
		
	}

	default void refreshSongsInterval() {
		
	}

	default Songs getGenre(String type, Boolean useCache) {
		return null;
	}

	
}
