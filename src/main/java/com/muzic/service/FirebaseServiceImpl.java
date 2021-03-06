package com.muzic.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;
import java.util.Optional;
import java.util.concurrent.CountDownLatch;
import java.util.function.Predicate;

import javax.annotation.PostConstruct;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import com.google.common.collect.Lists;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import com.google.firebase.database.DataSnapshot;
import com.google.firebase.database.DatabaseError;
import com.google.firebase.database.DatabaseReference;
import com.google.firebase.database.DatabaseReference.CompletionListener;
import com.google.firebase.database.FirebaseDatabase;
import com.google.firebase.database.ValueEventListener;

@Service
public class FirebaseServiceImpl<T> implements FirebaseService {

	@Autowired
	private RestTemplate restTemplate;

	@Value("${firebase.url}")
	private String firebaseUrl;

	@Value("${firebase.keyFileName}")
	private String firebaseKeyFileName;
	
	@PostConstruct
	public void init() {
		FirebaseOptions options = new FirebaseOptions.Builder()
				.setServiceAccount(this.getClass().getResourceAsStream("/" + firebaseKeyFileName))
				.setDatabaseUrl(firebaseUrl).build();
		FirebaseApp.initializeApp(options);
	}

	public String getFirebaseUrl() {
		return firebaseUrl;
	}

	public void setFirebaseUrl(String firebaseUrl) {
		this.firebaseUrl = firebaseUrl;
	}

	@Override
	public void update(String dataref, Map<String, Object> updateMap) {
		try {
			DatabaseReference databaseReference = FirebaseDatabase.getInstance().getReference(dataref);
			CountDownLatch lock = new CountDownLatch(1);
			databaseReference.updateChildren(updateMap, new CompletionListener() {

				@Override
				public void onComplete(DatabaseError arg0, DatabaseReference arg1) {
					lock.countDown();

				}
			});

			lock.await();
		} catch (InterruptedException e) {
			new RuntimeException(e);
		}
	}

	@Override
	public boolean dataRefExists(String dataPoint) {
		Optional<List<Object>> results = readList(dataPoint, Object.class);
		return results.isPresent();
	}

	@Override
	public void writeList(String dataPoint, List objects, boolean override) {

		try {
			System.out.println("write:" + dataPoint);
			if (!override && dataRefExists(dataPoint)) {
				return;
			}

			DatabaseReference databaseReference = FirebaseDatabase.getInstance().getReference(dataPoint);

			databaseReference.removeValue(new DatabaseReference.CompletionListener() {

				@Override
				public void onComplete(DatabaseError arg0, DatabaseReference arg1) {
					objects.forEach(o -> databaseReference.push().setValue(o));
				}

			});

		} catch (Exception e) {
			e.printStackTrace();
			throw new RuntimeException(e);
		}

	}

	@Override
	public void writeList(String dataPoint, List objects) {
		writeList(dataPoint, objects, true);

	}

	// @Override
	// public void writeList(String dataPoint, List objects) {
	// try {
	// DatabaseReference databaseReference =
	// FirebaseDatabase.getInstance().getReference(dataPoint);
	// maps.forEach(map -> databaseReference.push().setValue(map));
	// } catch (Exception e) {
	// e.printStackTrace();
	// throw new RuntimeException(e);
	// }
	//
	//
	// }

	@Override
	public Optional<String> findDataRefWith(String dataRef, Map<String, Object> searchMap) {
		Optional<Map<String, Object>> dataMap = read(dataRef);
		
		if (dataMap.isPresent()) {
			for (Entry<String, Object> entry: dataMap.get().entrySet()) {
				Map<String, Object> entryMap = (Map<String, Object>) entry.getValue();
				boolean match = true;
				for (Entry<String, Object> searchEntry: searchMap.entrySet()) {
					System.out.println("search value:" + searchEntry.getValue() + " map value:" + entryMap.get(searchEntry.getKey()));
					if (entryMap.containsKey(searchEntry.getKey()) && entryMap.get(searchEntry.getKey()).toString().equals(searchEntry.getValue().toString())) {
						continue;
					}
					match = false;
					break;
				}
				if (match) {
					return Optional.of(dataRef + "/" + entry.getKey());
				}
			}
		}
		// TODO Auto-generated method stub
		return Optional.empty();
	}
	
	@Override
	public Optional<Map<String, Object>> read(String dataPoint) {
		try {
			System.out.println(firebaseUrl + dataPoint + ".json");
			Map<String, Object> result = restTemplate.getForObject(firebaseUrl + dataPoint + ".json", Map.class);

			return Optional.of(result);

		} catch (Exception e) {
			new RuntimeException(e);
		}
		return Optional.of(new HashMap<String, Object>());
	}

	@Override
	public <T> Optional<T> read(String dataPoint, Class<T> t) {
		try {
			DatabaseReference databaseReference = FirebaseDatabase.getInstance().getReference(dataPoint);
			System.out.println(dataPoint);
			System.out.println(databaseReference.getKey());
			CountDownLatch lock = new CountDownLatch(1);
			final List<T> results = Lists.newArrayList();
			databaseReference.addListenerForSingleValueEvent(new ValueEventListener() {

				@Override
				public void onDataChange(DataSnapshot dataSnapshot) {
					results.add(dataSnapshot.getValue(t));
					lock.countDown();
				}

				@Override
				public void onCancelled(DatabaseError error) {
					System.out.println(error);
					lock.countDown();

				}
			});

			lock.await();

			if (results.isEmpty()) {
				return Optional.empty();
			}

			return Optional.of(results.get(0));
		} catch (Exception e) {
			e.printStackTrace();
			throw new RuntimeException(e);
		}

	}

	@Override
	public <T> Optional<List<T>> readList(String dataPoint, Class<T> t) {

		try {
			DatabaseReference databaseReference = FirebaseDatabase.getInstance().getReference(dataPoint);
			System.out.println(dataPoint);
			System.out.println(databaseReference.getKey());
			CountDownLatch lock = new CountDownLatch(1);
			final List<T> results = Lists.newArrayList();
			databaseReference.addListenerForSingleValueEvent(new ValueEventListener() {

				@Override
				public void onDataChange(DataSnapshot dataSnapshot) {
					System.out.println("datasnapshot:" + dataSnapshot.getChildrenCount());
					dataSnapshot.getChildren().forEach(song -> results.add(song.getValue(t)));
					lock.countDown();
				}

				@Override
				public void onCancelled(DatabaseError error) {
					System.out.println(error);
					lock.countDown();

				}
			});

			lock.await();

			if (results.isEmpty()) {
				return Optional.empty();
			}

			return Optional.of(results);
		} catch (Exception e) {
			e.printStackTrace();
			throw new RuntimeException(e);
		}

	}

	@Override
	public void push(String dataPoint, Object data) {
		try {
			DatabaseReference databaseReference = FirebaseDatabase.getInstance().getReference(dataPoint);
			CountDownLatch lock = new CountDownLatch(1);
			databaseReference.push().setValue(data, new CompletionListener() {
				
				@Override
				public void onComplete(DatabaseError arg0, DatabaseReference arg1) {
					lock.countDown();					
				}
			});
			lock.await();
		} catch (Exception e) {
			e.printStackTrace();
			throw new RuntimeException(e);
			
		}
	}
	
	@Override
	public void write(String dataPoint, Map<String, Object> map) {
		try {
			DatabaseReference databaseReference = FirebaseDatabase.getInstance().getReference(dataPoint);
			CountDownLatch lock = new CountDownLatch(1);
			databaseReference.setValue(map, new CompletionListener() {

				@Override
				public void onComplete(DatabaseError arg0, DatabaseReference arg1) {
					lock.countDown();

				}
			});

			lock.await();
		} catch (InterruptedException e) {
			e.printStackTrace();
			throw new RuntimeException(e);
		}

	}

}
