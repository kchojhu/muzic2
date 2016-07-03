package com.muzic.model;

import java.io.Serializable;
import java.util.Map;

import com.google.common.collect.Maps;

public class Song implements Serializable{
	private String songId;
	private String artistName;
	private String songName;
	private Integer rank;
	private Integer duration;
	private String image;
	
	public Song() {
		super();
	}
	
	public Song(Map<String, String> songMap) {
		this();
		this.songId = songMap.get("songId");
		this.artistName = songMap.get("artistName");
		this.songName = songMap.get("songName");
		this.rank = Integer.valueOf(songMap.get("rank"));
		this.duration = Integer.valueOf(songMap.get("duration"));
		this.image = songMap.get("image");
	}
	
	public Map<String, String> toMap() {
		Map<String, String> songMap = Maps.newHashMap();
		songMap.put("songId", this.songId);
		songMap.put("artistName", this.artistName);
		songMap.put("songName", this.songName);
		songMap.put("rank", this.rank.toString());
		songMap.put("duration", this.duration.toString());
		songMap.put("image", this.image);
		return songMap;
	}
	
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
	public boolean equals(Object that) {
		if (this == that) return true;
		
		if (!(that instanceof Song)) return false;

		Song thatSong = (Song) that;
		return thatSong.getSongName().equals(songName) && thatSong.getArtistName().equals(artistName);
	}
	
	@Override
	public int hashCode() {
		return (songName + artistName).hashCode();
	}

	@Override
	public String toString() {
		return "Rank:" + rank + " Song Name:" + songName + " Artist Name:" + artistName + " Song Id:" + songId + " Duration:" + duration;
	}

}
