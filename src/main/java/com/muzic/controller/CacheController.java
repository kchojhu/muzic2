package com.muzic.controller;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.muzic.service.CacheService;
import com.google.common.collect.Maps;

@RestController
@RequestMapping("/cache")
public class CacheController {

	@Autowired
	private CacheService cacheService;

	@RequestMapping(method = RequestMethod.GET)
	public Map<String, Object> getKeys() {
		Map<String, Object> result = Maps.newHashMap();
		result.put("result", cacheService.getKeys());
		return result;
	}
	
	@RequestMapping("/deleteKey/{key}")
	public void deleteKey(@PathVariable String key) {
		cacheService.deleteCache(key);
	}	
	
}
