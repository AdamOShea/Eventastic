import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';

export default function AccommodationCard({
  navigation,
  accommName,
  accommPrice,
  accommRating,
  accommFirstImage,
  accommImages,
  accommUrl,
  accommDetails
}) {
  const handleSelectAccommodation = () => {
    navigation.navigate('AccommodationDetails', {
      accommDetails: {
        accommName,
        accommPrice,
        accommRating,
        accommFirstImage,
        accommImages,
        accommUrl,
        accommDetails
      }
    });
  };

  return (
    <TouchableOpacity onPress={handleSelectAccommodation} activeOpacity={0.8}>
      <View style={styles.card}>
        <Image
          source={typeof accommFirstImage === 'string' ? { uri: accommFirstImage } : accommFirstImage}
          style={styles.image}
        />
        <View style={styles.textContainer}>
          <Text style={styles.title}>{accommName}</Text>
          <Text style={styles.price}>Total Price: {accommPrice}</Text>
          <Text style={styles.rating}>{accommRating}</Text>
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
