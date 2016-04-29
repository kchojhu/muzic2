package com.muzic.model;

import java.io.Serializable;

public class Song implements Serializable{
	private String songId;
	private String artistName;
	private String songName;
	private Integer rank;
	private Integer duration;
	private String image;

	
	
	public String getImage() {
		return image;
	}

	public void setImage(String image) {
		this.image = image;
	}

	public Integer getDuration() {
		return duration;
	}

	public void setDuration(Integer duration) {
		this.duration = duration;
	}

	public String getSongId() {
		return songId;
	}

	public void setSongId(String songId) {
		this.songId = songId;
	}

	public String getArtistName() {
		return artistName;
	}

	public void setArtistName(String artistName) {
		this.artistName = artistName;
	}

	public String getSongName() {
		return songName;
	}

	public void setSongName(String songName) {
		this.songName = songName;
	}

	public Integer getRank() {
		return rank;
	}

	public void setRank(Integer rank) {
		this.rank = rank;
	}

	@Override
	public String toString() {
		return "Rank:" + rank + " Song Name:" + songName + " Artist Name:" + artistName + " Song Id:" + songId + " Duration:" + duration;
	}

}
