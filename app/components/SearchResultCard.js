import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { format } from 'date-fns';
import { useEvent } from './EventContext'; 


export default function SearchResultCard({ item, navigation, onPress }) {
  let imageSource = require('../assets/eventastic.png'); // fallback

try {
  const images = JSON.parse(item.eventImages || '[]'); // safely parse
  if (images.length > 0) {
    imageSource = { uri: images[0] }; // ✅ access first image
  }
} catch (err) {
  //console.warn('❌ Failed to parse eventImages:', err);
}


  const { setSelectedEvent } = useEvent();

  const handlePress = (item) => {
    setSelectedEvent(item);
    navigation.navigate('EventDetails');
  }



  return (
    <TouchableOpacity onPress={() => handlePress(item)}>
      <View style={styles.card}>
        <Image source={imageSource} style={styles.image} />
        <View style={styles.details}>
          <Text style={styles.title}>{item.eventTitle}</Text>
          <Text style={styles.date}>{format(new Date(item.eventDate), 'dd-LLL-yyyy')}</Text>
          <Text style={styles.location}>{item.eventLocation.trim()}, {item.eventVenue}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    height: 150,
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
    marginVertical: 8,
    marginHorizontal: 16,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    alignItems: 'center',
  },
  image: {
    width: 70,
    height: 70,
    borderRadius: 8,
    marginRight: 10,
  },
  details: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  date: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  location: {
    fontSize: 14,
    color: '#888',
    marginTop: 2,
  },
});
