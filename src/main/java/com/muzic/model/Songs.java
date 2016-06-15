package com.muzic.model;

import java.io.Serializable;
import java.util.List;

import com.google.common.collect.Lists;

public class Songs extends JsonResponse implements Serializable {
	private List<Song> songs = Lists.newArrayList();

	private String dummyText = "phuongtm";

	public String getDummyText() {
		return dummyText;
	}

	public void setDummyText(String dummyText) {
		this.dummyText = dummyText;
	}

	public List<Song> getSongs() {
		return songs;
	}

	public void setSongs(List<Song> songs) {
		this.songs = songs;
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
