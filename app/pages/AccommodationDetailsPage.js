import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Linking,
} from 'react-native';
import { useEvent } from '../components/EventContext';

export default function AccommodationDetailsPage({ navigation, route }) {
  const { setSelectedAccommodation } = useEvent();
  const accommodation = route.params?.accommDetails;

  if (!accommodation) {
    console.warn("⚠️ No accommodation passed. Redirecting...");
    navigation.navigate('AccommodationPage');
    return null;
  }

  let parsedImages = [];
  try {
    parsedImages = Array.isArray(accommodation.accommImages)
      ? accommodation.accommImages
      : JSON.parse(accommodation.accommImages || '[]');
  } catch (err) {
    console.warn("Failed to parse accommodation images:", err);
  }

  const handleSaveButton = () => {
    setSelectedAccommodation(accommodation);
    console.log("✅ Saved to context:", accommodation.accommName);
    navigation.navigate('EventDetails');
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>{accommodation.accommName}</Text>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.imageScroll}>
        {parsedImages.map((imgUrl, index) => (
          <Image key={index} source={{ uri: imgUrl }} style={styles.image} />
        ))}
      </ScrollView>

      <Text style={styles.detail}>
        <Text style={styles.bold}>Price:</Text> {accommodation.accommPrice}
      </Text>
      <Text style={styles.detail}>
        <Text style={styles.bold}>Rating:</Text> {accommodation.accommRating}
      </Text>
      <Text style={styles.detail}>
        <Text style={styles.bold}>Details:</Text>{' '}
        {accommodation.accommDetails || 'No additional details provided.'}
      </Text>

      <TouchableOpacity onPress={() => Linking.openURL(accommodation.accommUrl)} style={styles.button}>
        <Text style={styles.buttonText}>View on Airbnb</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={handleSaveButton} style={styles.button}>
        <Text style={styles.buttonText}>Save Accommodation to Trip</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
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
    height: 220,
    paddingTop: 50,
    marginBottom: 15,
  },
  image: {
    width: 300,
    height: 300,
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
