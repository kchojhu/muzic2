package com.muzic.service;

import java.util.Iterator;
import java.util.List;

import org.apache.commons.lang.StringUtils;
import org.joda.time.Period;
import org.joda.time.Seconds;
import org.joda.time.format.ISOPeriodFormat;
import org.joda.time.format.PeriodFormatter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.muzic.model.Song;
import com.google.api.services.youtube.YouTube;
import com.google.api.services.youtube.model.ResourceId;
import com.google.api.services.youtube.model.SearchListResponse;
import com.google.api.services.youtube.model.SearchResult;
import com.google.api.services.youtube.model.Thumbnail;
import com.google.api.services.youtube.model.VideoListResponse;
import com.google.common.collect.Lists;

@Service
public class YoutubeServiceImpl implements YoutubeService {

	@Value("${youtube.apikey}")
	private String apiKey;

	@Value("${youtube.musicKeywords}")
	private String musicKeywords = "";

	@Value("${youtube.filter.duration}")
	private Integer musicDuration;
	
	@Autowired
	private YouTube youtube;
	
	public Song changeSong(String playlistId, Song song) {
		
		return null;
	}

	private static void prettyPrint(Iterator<SearchResult> iteratorSearchResults, String query) {

		System.out.println("\n=============================================================");
		System.out.println("   First 25 videos for search on \"" + query + "\".");
		System.out.println("=============================================================\n");

		if (!iteratorSearchResults.hasNext()) {
			System.out.println(" There aren't any results for your query.");
		}

		while (iteratorSearchResults.hasNext()) {

			SearchResult singleVideo = iteratorSearchResults.next();
			ResourceId rId = singleVideo.getId();

			// Double checks the kind is video.
			if (rId.getKind().equals("youtube#video")) {
				Thumbnail thumbnail = (Thumbnail) singleVideo.getSnippet().getThumbnails().get("default");

				System.out.println(" Video Id" + rId.getVideoId());
				System.out.println(" Title: " + singleVideo.getSnippet().getTitle());
				System.out.println(" Thumbnail: " + thumbnail.getUrl());
				System.out.println("\n-------------------------------------------------------------\n");

				YouTube.Videos.List listVideosRequest;
				// try {
				// listVideosRequest = youtube.videos().list("snippet,
				// contentDetails").setId(rId.getVideoId());
				// listVideosRequest.setKey(key);
				// VideoListResponse listResponse = listVideosRequest.execute();
				// System.out.println(listResponse);
				// } catch (IOException e) {
				// // TODO Auto-generated catch block
				// e.printStackTrace();
				// }

			}
			break;
		}
	}

	@Override
	public Song getSong(Song song) {
		try {
			String songName = song.getSongName().replaceAll("\\([^\\(]*\\)", "").replaceAll("'", "").replaceAll("`", "").trim();
			String artistName = song.getArtistName().replaceAll("\\([^\\(]*\\)", "").replaceAll("'", "").replaceAll("`", "").trim();
			YouTube.Search.List search = youtube.search().list("id,snippet");
			search.setKey(apiKey);
			search.setQ(
					StringUtils.join(Lists.newArrayList(songName, artistName, musicKeywords), " "));
			// search.set
			search.setType("video");
			//https://www.googleapis.com/youtube/v3/videoCategories?part=snippet&regionCode=US&key=AIzaSyBdH1-L-TTl2Xf_oZGJIyIr6C2PzdY1GiU
			search.setVideoCategoryId("10");
			search.setFields("items(id/kind,id/videoId,snippet/title,snippet/thumbnails/default/url)");
			search.setMaxResults(10l);
			SearchListResponse searchResponse = search.execute();

			List<SearchResult> searchResultList = searchResponse.getItems();

			if (searchResultList != null) {				
				for (SearchResult searchResult : searchResultList) {
					String title = searchResult.getSnippet().getTitle().replaceAll("'", "").replaceAll("`", "");
					
					if (title.contains("노래방") || title.contains("karaoke") || title.contains("기타강의") || !title.toLowerCase().contains(songName.toLowerCase())) {
						continue;
					}
					
					ResourceId rId = searchResult.getId();				
					YouTube.Videos.List listVideosRequest = youtube.videos().list("snippet, contentDetails").setId(rId.getVideoId());
					listVideosRequest.setKey(apiKey);
					VideoListResponse listResponse = listVideosRequest.execute();
					
					PeriodFormatter formatter = ISOPeriodFormat.standard();
					Period p = formatter.parsePeriod(listResponse.getItems().get(0).getContentDetails().getDuration());
					Seconds s = p.toStandardSeconds();
					Thumbnail thumbnail = (Thumbnail) searchResult.getSnippet().getThumbnails().get("default");
					
					if (s.getSeconds() < musicDuration & s.getSeconds() > 120 && s.getSeconds() < 600000) {
						song.setSongId(rId.getVideoId());
						song.setImage(thumbnail.getUrl());
						song.setDuration(s.getSeconds());
						return song;
					}
					
				}
			}
			

			return song;
		} catch (Exception e) {
			e.printStackTrace();
			throw new RuntimeException(e);
		}
	}

}
