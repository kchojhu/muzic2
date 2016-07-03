package com.muzic.service;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.CountDownLatch;

import javax.annotation.PostConstruct;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.google.common.collect.Lists;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import com.google.firebase.database.DataSnapshot;
import com.google.firebase.database.DatabaseError;
import com.google.firebase.database.DatabaseReference;
import com.google.firebase.database.FirebaseDatabase;
import com.google.firebase.database.ValueEventListener;

@Service
public class FirebaseServiceImpl implements FirebaseService {

	@Value("${firebase.url}")
	private String firebaseUrl;

	
	@PostConstruct
	public void init() {
		FirebaseOptions options = new FirebaseOptions.Builder().setServiceAccount(this.getClass().getResourceAsStream("/google-services.json")).setDatabaseUrl(firebaseUrl).build();
		FirebaseApp.initializeApp(options);
	}
	
	public String getFirebaseUrl() {
		return firebaseUrl;
	}

	public void setFirebaseUrl(String firebaseUrl) {
		this.firebaseUrl = firebaseUrl;
	}
	
	public void update(String dataref, Map<String, Object> updateMap) {
		DatabaseReference databaseReference = FirebaseDatabase.getInstance().getReference(dataref);
		databaseReference.updateChildren(updateMap);		
	}
	
	@Override
	public void writeList(String dataPoint, List objects) {
		try {
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
	
//	@Override
//	public void writeList(String dataPoint, List objects) {
//		try {
//			DatabaseReference databaseReference = FirebaseDatabase.getInstance().getReference(dataPoint);
//			maps.forEach(map -> databaseReference.push().setValue(map));
//		} catch (Exception e) {
//			e.printStackTrace();
//			throw new RuntimeException(e);
//		}
//		
//		
//	}
	

	
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


}
