import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { format } from 'date-fns';

export default function InfoContainer({ event }) {
  let imageSource;

  if (event.image?.startsWith('http')) {
    // If the image is a URL, use { uri: event.image }
    imageSource = { uri: event.eventImages[0] };
  } else {
    // Default image if none is provided
    imageSource = require('../assets/eventastic.png');
  }

  return (
    <View style={styles.container}>
      <Image source={imageSource} style={styles.image} />
      <Text style={styles.title}>{event.eventTitle}</Text>
      <Text style={styles.detail}>
        <Text style={styles.label}>Date:</Text> {format(new Date(event.eventDate), 'dd-LLL-yyyy')}
      </Text>
      <Text style={styles.detail}>
        <Text style={styles.label}>Location:</Text> {event.eventLocation.trim()}, {event.eventVenue}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    backgroundColor: '#ffffff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
  },
  image: {
    width: 200,
    height: 200,
    borderRadius: 10,
    marginBottom: 15,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  detail: {
    fontSize: 16,
    marginBottom: 8,
    width: '100%',
  },
  label: {
    fontWeight: 'bold',
  },
});
