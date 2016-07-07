package com.muzic.service;

import java.time.LocalDate;
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
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponents;
import org.springframework.web.util.UriComponentsBuilder;

import com.google.common.collect.Lists;
import com.google.common.collect.Sets;
import com.muzic.model.PlayList;
import com.muzic.model.Song;
import com.muzic.model.Songs;
import com.muzic.util.ApplicationUtil;

@Service("playServiceService")
public class PlayListServiceImpl implements PlayListService {

	private String playlistKey = "playlist/kr/playlist";
	
	@Value("${korean.playlist.url}")
	private String playListUrl;

	@Value("${korean.playlist.songs.url}")
	private String playListIdUrl;

	@Autowired
	private RestTemplate restTemplate;

	@Autowired
	private YoutubeService youtubeService;
	
	@Autowired
	private FirebaseService firebaseService;
	private String newPlayListCacheKey = "START_DATE";
	private String topFavPlayListCacheKey = "CNT_LIKE";
	
	@Scheduled(fixedRate = 3600000)
	public void refreshSongs() {
	}
	
	private Optional<String> getPlayListId(String playListId) {
		Pattern pattern = Pattern.compile("(\\d+)");
		Matcher matcher = pattern.matcher(playListId);
		while (matcher.find()) {
			if (!matcher.group(1).equals("0")) {
				return Optional.of(matcher.group(1));
			}
		}

		return Optional.empty();

	}

	private Optional<Integer> getTotalSongCount(String totalCount) {
		Pattern pattern = Pattern.compile("(\\d+)");
		Matcher matcher = pattern.matcher(totalCount);
		matcher.find();
		if (matcher.group(1) != null) {
			return Optional.of(Integer.valueOf(matcher.group(1)));
		}
		return Optional.empty();

	}

	@Override
	public Optional<Set<PlayList>> getPlaylists(String type) {
		Optional<List<PlayList>> results = firebaseService.readList(playlistKey, PlayList.class);
		
		if (results.isPresent() && false) {
			Set<PlayList> playListSet = Sets.newHashSet(results.get().iterator());
			return Optional.of(playListSet);
		}

		
		Set<PlayList> playListSet = new LinkedHashSet<>();
		for (int i = 0; i < 100; i += 20) {
			UriComponentsBuilder builder = UriComponentsBuilder.fromHttpUrl(playListUrl
					.replaceFirst("playlisttype", type).replaceFirst("startIndexValue", String.valueOf(i + 1)));
			UriComponents components = builder.build(true);

			Map<String, Object> result = restTemplate.getForObject(components.toUri(), Map.class);

			if (result.containsKey("results")) {
				List<Map<String, Object>> resultsMap = (List<Map<String, Object>>) result.get("results");
				if (resultsMap != null && !resultsMap.isEmpty()) {
					playListSet.addAll(resultsMap.stream().map(resultMap -> {
						PlayList playList = new PlayList();
						playList.setName(resultMap.get("name").toString());
						playList.setImageUrl(resultMap.get("image").toString().split("\\?")[0]);
						Optional<String> playListId = getPlayListId(resultMap.get("playlistid").toString());
						playListId.ifPresent(id -> playList.setId(id));
						getTotalSongCount(resultMap.get("totalsongs").toString())
								.ifPresent(totalSongCount -> playList.setNumberOfSongs(totalSongCount));

						return playList;
					}).collect(Collectors.toCollection(LinkedHashSet::new)));
				}
			}
		}

		if (playListSet != null && !playListSet.isEmpty()) {
			firebaseService.writeList(playlistKey, Lists.newArrayList(playListSet));
			
			playListSet.forEach(playList -> {
				getPlaylistsSongs(playList.getId());
			});
			
			return Optional.of(playListSet);
		}

		return Optional.empty();
	}

	@Override
	public Optional<Songs> getPlaylistsSongs(String playListId) {
		LocalDate now = LocalDate.now();

		Songs songs = new Songs();

		Optional<List<Song>> results = firebaseService.readList(playlistKey + "-playListId", Song.class);
		
		if (results.isPresent()) {
			songs.getSongs().addAll(results.get());
			return Optional.of(songs);
		}
		
		UriComponentsBuilder builder = UriComponentsBuilder
				.fromHttpUrl(playListIdUrl.replaceFirst("playlistIdValue", playListId));
		UriComponents components = builder.build(true);

		Map<String, Object> result = restTemplate.getForObject(components.toUri(), Map.class);

		if (result != null && result.containsKey("results")) {
			List<Map<String, Object>> resultsMap = (List<Map<String, Object>>) result.get("results");			
			if (resultsMap != null && !resultsMap.isEmpty()) {
				List<Song> songList = resultsMap.stream().map(resultMap -> {
					Song song = new Song();
					try {
						song.setArtistName(resultMap.get("artist/_text").toString());
						song.setRank(Integer.valueOf(resultMap.get("rank").toString()));
						song.setSongName(resultMap.get("title/_text").toString());

						return song;						
					} catch (Exception e) {
						System.out.println(song);
						e.printStackTrace();
						return null;
					}
				}).filter(p -> p != null).collect(Collectors.toList());

				if (songList != null && !songList.isEmpty()) {
					
					songList.parallelStream().unordered().forEach(song -> {
						youtubeService.getSong(song);
					});
					songs.setSongs(songList.stream().filter(song -> song.getSongId() != null).collect(Collectors.toList()));
					firebaseService.writeList(playlistKey + "-" + playListId, songs.getSongs(), false);
					return Optional.of(songs);
				}

			}
		}

		return Optional.empty();
	}

	// @Scheduled(fixedRate = 86400)
	// public void refreshSongs(String country) {
	// cacheService.deleteCache(country);
	// }

}
