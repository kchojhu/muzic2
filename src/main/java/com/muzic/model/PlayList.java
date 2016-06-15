package com.muzic.model;

public class PlayList {
	private String id;
	private String imageUrl;
	private Integer numberOfSongs;
	private String name;

	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public String getImageUrl() {
		return imageUrl;
	}

	public void setImageUrl(String imageUrl) {
		this.imageUrl = imageUrl;
	}

	public Integer getNumberOfSongs() {
		return numberOfSongs;
	}

	public void setNumberOfSongs(Integer numberOfSongs) {
		this.numberOfSongs = numberOfSongs;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	@Override
	public String toString() {
		return "Name:" + name + " Id:" + id + " numberOfSongs:" + numberOfSongs + " imageUrl:" + imageUrl; 				
	}
	
	@Override
	public boolean equals(Object that) {
		if (this == that) return true;
		
		if (!(that instanceof PlayList)) return false;

		PlayList thatPlayList = (PlayList) that;
		return thatPlayList.getId().equals(this.id);
	}
	
	@Override
	public int hashCode() {
		return this.id.hashCode();
	}
	
}
