package com.muzic.service;

import java.util.Set;

public interface CacheService {

	void deleteCache(String key);
	
	void saveCache(Object o, String key);
	
	<T> T getCache(String key);

	Set<String> getKeys();
	
}
