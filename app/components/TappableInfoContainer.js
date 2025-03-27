import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { format } from 'date-fns';
import { Linking } from 'react-native';

export default function InfoContainer({ event }) {
  let imageSource = require('../assets/eventastic.png');

  try {
    const images = JSON.parse(event.eventImages || '[]'); // safely parse
    if (images.length > 0) {
      imageSource = { uri: images[0] }; //  access first image
    }
  } catch (err) {
    //console.warn('❌ Failed to parse eventImages:', err);
  }

  const handlePress = (event) => {
    if (event?.eventLink && typeof event.eventLink === 'string') {
      Linking.openURL(event.eventLink).catch(err => {
        console.warn("Failed to open URL:", err);
      });
    } else {
      console.warn("Invalid or missing event link.");
    }
  };

  return (
    <TouchableOpacity onPress={() => handlePress(event)}>
        <View style={styles.container}>
        <Image source={imageSource} style={styles.image} />
        <Text style={styles.title}>{event.eventTitle}</Text>
        <Text style={styles.detail}>
            <Text style={styles.label}>Date:</Text> {format(new Date(event.eventDate), 'dd-LLL-yyyy')}
        </Text>
        <Text style={styles.detail}>
            <Text style={styles.label}>Location:</Text> {event.eventLocation.trim()}, {event.eventVenue}
        </Text>
        <Text style={styles.detail}>
            <Text style={styles.label}>Price:</Text><Text style={styles.priceLabel}> €{event.eventPrice}</Text>
        </Text>
        </View>
    </TouchableOpacity>
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
  priceLabel: {
    fontWeight: 'bold',
    color: '#27ae60'
  },
});
