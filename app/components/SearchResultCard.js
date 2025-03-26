import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { format } from 'date-fns';
import { useEvent } from './EventContext';

export default function SearchResultCard({ item, navigation }) {
  let imageSource = require('../assets/eventastic.png'); // fallback

  try {
    const images = JSON.parse(item.eventImages || '[]');
    if (images.length > 0) {
      imageSource = { uri: images[0] };
    }
  } catch (err) {}

  const { setSelectedEvent } = useEvent();

  const handlePress = () => {
    setSelectedEvent(item);
    navigation.navigate('EventDetails');
  };

  return (
    <TouchableOpacity onPress={handlePress} style={styles.card}>
      <Image source={imageSource} style={styles.image} />

      <View style={styles.info}>
        <Text style={styles.date}>{format(new Date(item.eventDate), 'EEE, dd MMM yyyy')}</Text>
        <Text style={styles.title}>{item.eventTitle}</Text>
        <Text style={styles.location}>
          {item.eventLocation?.trim()}{item.eventVenue ? ` • ${item.eventVenue}` : ''}
        </Text>

        {item.eventPrice !== null && item.eventPrice !== undefined && (
          <View style={styles.priceTag}>
            <Text style={styles.priceText}>
              {parseFloat(item.eventPrice) === 0 ? 'Price on website' : `€${item.eventPrice}`}
            </Text>
          </View>
        )}

      
      </View>
    </TouchableOpacity>
  );
}


const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 14,
    marginVertical: 10,
    marginHorizontal: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  image: {
    width: '100%',
    height: 180,
  },
  info: {
    padding: 15,
  },
  date: {
    color: '#888',
    fontSize: 14,
    marginBottom: 6,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#333',
  },
  location: {
    fontSize: 14,
    color: '#555',
    marginBottom: 8,
  },
  priceTag: {
    backgroundColor: '#eef2ff',
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
  },
  priceText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
});
