package com.muzic.service;

import java.io.File;
import java.io.Serializable;
import java.util.Date;
import java.util.Set;

import org.apache.commons.io.FileUtils;
import org.apache.commons.lang.SerializationUtils;
import org.springframework.stereotype.Service;

import com.google.api.client.util.Sets;

@Service
public class CacheServiceImpl implements CacheService{

	private File cacheDiretory = new File(System.getProperty("user.home") + File.separator + "tmp3");
	
	@Override
	public Set<String> getKeys() {
		Set<String> keys = Sets.newTreeSet();
		String[] extention = {"ser"};
		
		FileUtils.listFiles(cacheDiretory, extention, false).forEach(file -> {
			keys.add(file.getName().replace(".ser", ""));
		});
		return keys;
	}
	
	@Override
	public void saveCache(Object o, String key) {
		try {
			if (!cacheDiretory.exists()) {
				FileUtils.forceMkdir(cacheDiretory);
			}
			
			File cacheFile = new File(cacheDiretory.getAbsolutePath() + File.separator + key +".ser");
			
			FileUtils.deleteQuietly(cacheFile);
		
			byte[] b = SerializationUtils.serialize((Serializable) o);

			FileUtils.writeByteArrayToFile(cacheFile, b);
			
		}catch (Exception e) {
			throw new RuntimeException(e);
		}
		
		
	}

	@SuppressWarnings("unchecked")
	@Override
	public <T>T getCache(String key) {
		try {
			File cacheFile = new File(cacheDiretory.getAbsolutePath() + File.separator + key +".ser");
			
			if (cacheFile.exists()) {
				
				long diff = new Date().getTime() - cacheFile.lastModified();

				// only return cache that is less than 24 hours
				if (diff > ( 24 * 60 * 60 * 1000)) {
					return null;
				}
				
				return (T) SerializationUtils.deserialize(FileUtils.readFileToByteArray(cacheFile));							
			}
		} catch (Exception e) {
			deleteCache(key);
		}
		
		return null;
	}

	@Override
	public void deleteCache(String key) {
		try {
			File cacheFile = new File(cacheDiretory.getAbsolutePath() + File.separator + key +".ser");
			FileUtils.deleteQuietly(cacheFile);
		} catch (Exception e) {
			// ignore exceptions
		}
		
	}

}
