package com.muzic.service;

import java.util.Optional;
import java.util.Set;

import com.muzic.model.PlayList;
import com.muzic.model.Songs;

public interface PlayListService {

	Optional<Set<PlayList>> getPlaylists(String type);
	
	Optional<Songs> getPlaylistsSongs(String playListId);
	
	
}
