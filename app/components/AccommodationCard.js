import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';

export default function AccommodationCard({ navigation, id, name, price, rating, details, imageUrl }) {
  return (
    <TouchableOpacity onPress={() => navigation.navigate('AccommodationDetails', { name, price, rating, details, imageUrl })}>
      <View style={styles.card}>
        {/* 🏨 Large Image */}
        <Image source={typeof imageUrl === 'string' ? { uri: imageUrl } : imageUrl} style={styles.image} />
        {/* 📌 Title & Price */}
        <View style={styles.textContainer}>
          <Text style={styles.title}>{name}</Text>
          <Text style={styles.price}>{price}</Text>
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
    elevation: 3, // Make the card responsive
    
  },
  image: {
    width: '100%',
    height: 200,
    resizeMode: 'contain' // Large image size
  },
  textContainer: {
    padding: 10,
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 5,
  },
  price: {
    fontSize: 16,
    color: '#2c3e50',
  },
});
