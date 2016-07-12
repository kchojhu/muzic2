package com.muzic.service;

import java.util.Collection;
import java.util.List;
import java.util.Map;
import java.util.Optional;

public interface FirebaseService {

	void writeList(String dataPoint, List list);

	<T> Optional<List<T>> readList(String dataPoint, Class<T> t);

	void writeList(String dataPoint, List objects, boolean override);

	Optional<Map<String, Object>> read(String dataPoint);

	boolean dataRefExists(String dataPoint);
	
	void write(String dataPoint, Map<String, Object> map);

	<T>Optional<T> read(String dataPoint, Class<T> t);

}
