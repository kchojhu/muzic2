package com.muzic.model;

import java.io.Serializable;
import java.util.List;
import java.util.Map;
import java.util.stream.Collector;
import java.util.stream.Collectors;

import com.google.common.collect.Lists;

public class Songs extends JsonResponse implements Serializable {
	private List<Song> songs = Lists.newArrayList();


	public List<Song> getSongs() {
		return songs;
	}

	public void setSongs(List<Song> songs) {
		this.songs = songs;
	}

	public List<Map<String, String>> toSongMaps() {
		return songs.stream().map(song -> song.toMap()).collect(Collectors.toList());
	}
	
	@Override
	public String toString() {
		StringBuffer stringBuffer = new StringBuffer();

		songs.forEach(song -> {
			stringBuffer.append("\n" + song.toString());
		});

		return stringBuffer.toString();
	}

}
