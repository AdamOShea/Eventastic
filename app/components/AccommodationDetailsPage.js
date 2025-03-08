import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Linking } from 'react-native';

export default function AccommodationDetailsPage({ route }) {
  const { name, price, rating, details, images, roomUrl } = route.params;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>{name}</Text>
      
      {/* 🖼️ Display All Images */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.imageScroll}>
        {images.map((imgUrl, index) => (
          <Image key={index} source={{ uri: imgUrl }} style={styles.image} />
        ))}
      </ScrollView>

      {/* ℹ️ Accommodation Details */}
      <Text style={styles.detail}><Text style={styles.bold}>Price:</Text> {price}</Text>
      <Text style={styles.detail}><Text style={styles.bold}>Rating:</Text> {rating}</Text>
      <Text style={styles.detail}><Text style={styles.bold}>Details:</Text> {details || 'No additional details provided.'}</Text>

      {/* 🔗 Open Room URL */}
      <TouchableOpacity onPress={() => Linking.openURL(roomUrl)} style={styles.button}>
        <Text style={styles.buttonText}>View on Airbnb</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Save Accommodation to Trip</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  imageScroll: {
    marginBottom: 15,
  },
  image: {
    width: 300,
    height: 200,
    borderRadius: 10,
    marginHorizontal: 5,
  },
  detail: {
    fontSize: 16,
    marginBottom: 8,
    width: '100%',
  },
  bold: {
    fontWeight: 'bold',
  },
  button: {
    marginTop: 15,
    backgroundColor: '#6785c7',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
