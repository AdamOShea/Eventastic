import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView } from 'react-native';

export default function AccommodationCard({ navigation, id, name, price, rating, details, imageUrl, images, roomUrl }) {
  return (
    <TouchableOpacity 
      onPress={() => navigation.navigate('AccommodationDetails', { name, price, rating, details, images, roomUrl })}
      activeOpacity={0.8}
    >
      <View style={styles.card}>
        {/* 🏨 Display First Image */}
        <Image source={typeof imageUrl === 'string' ? { uri: imageUrl } : imageUrl} style={styles.image} />

        {/* 📌 Title, Price & Rating */}
        <View style={styles.textContainer}>
          <Text style={styles.title}>{name}</Text>
          <Text style={styles.price}>{price}</Text>
          <Text style={styles.rating}>{rating}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    overflow: 'hidden',
    marginVertical: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  image: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  textContainer: {
    padding: 12,
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 4,
  },
  price: {
    fontSize: 16,
    color: '#2c3e50',
    fontWeight: '600',
  },
  rating: {
    fontSize: 14,
    color: '#888',
    marginTop: 3,
  },
});
