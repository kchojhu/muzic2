package com.muzic.service;

import java.util.LinkedHashSet;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponents;
import org.springframework.web.util.UriComponentsBuilder;

import com.muzic.model.PlayList;
import com.muzic.model.Songs;

@Service("playServiceService")
public class PlayListServiceImpl implements PlayListService {

	@Value("${korean.playlist.url}")
	private String playListUrl;

	@Autowired
	private RestTemplate restTemplate;

	@Autowired
	private YoutubeService youtubeService;

	@Autowired
	private CacheService cacheService;

	private Optional<String> getPlayListId(String playListId) {		
		Pattern pattern = Pattern.compile("(\\d+)");
		Matcher matcher = pattern.matcher(playListId);
		while(matcher.find()) {
			if (!matcher.group(1).equals("0")) {		
				return Optional.of(matcher.group(1)) ;
			}
		}
		
		return Optional.empty();
		
	}
	
	private Optional<Integer> getTotalSongCount(String totalCount) {		
		Pattern pattern = Pattern.compile("(\\d+)");
		Matcher matcher = pattern.matcher(totalCount);
		matcher.find();
		if (matcher.group(1) != null) {			
			return Optional.of(Integer.valueOf(matcher.group(1))) ;
		} 		
		return Optional.empty();
		
	}
	
	@Override
	public Optional<Set<PlayList>> getPlaylists(String type) {

		UriComponentsBuilder builder = UriComponentsBuilder.fromHttpUrl(playListUrl.replaceFirst("playlisttype", type));
		UriComponents components = builder.build(true);

		Map<String, Object> result = restTemplate.getForObject(components.toUri(), Map.class);
		
		if (result.containsKey("results")) {
			List<Map<String, Object>> resultsMap = (List<Map<String, Object>>) result.get("results");
			System.out.println("result size:" + resultsMap.size());
			if (resultsMap != null && !resultsMap.isEmpty()) {
				Set<PlayList> playListSet =
				 resultsMap.stream().map(resultMap -> {
					PlayList playList = new PlayList();
					playList.setName(resultMap.get("name").toString());
					playList.setImageUrl(resultMap.get("image").toString().split("\\?")[0]);
					Optional<String> playListId = getPlayListId(resultMap.get("playlistid").toString());
					playListId.ifPresent(id -> playList.setId(id));
					getTotalSongCount(resultMap.get("totalsongs").toString()).ifPresent(totalSongCount -> playList.setNumberOfSongs(totalSongCount));

					return playList;				
				}).collect(Collectors.toCollection(LinkedHashSet::new));
				 
				
				if (playListSet != null && !playListSet.isEmpty()) {
					return Optional.of(playListSet);					
				}				
			}

			
		}
		
		return Optional.empty();
	}

	@Override
	public Optional<Songs> getPlaylistsSongs(String playListId) {
		// TODO Auto-generated method stub
		return Optional.empty();
	}
	
//	@Scheduled(fixedRate = 86400)
//	public void refreshSongs(String country) {
//		cacheService.deleteCache(country);
//	}



}
