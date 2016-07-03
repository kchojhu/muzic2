package com.muzic.service;

import java.util.List;
import java.util.Optional;

public interface FirebaseService {

	void writeList(String dataPoint, List list);

	<T> Optional<List<T>> readList(String dataPoint, Class<T> t);

}
