import React from 'react';
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
    navigation.navigate('EventDetails');
  };

  const formatDetailsText = (text) => {
    if (!text) return 'No additional details provided.';
    return text
      .replace(/_/g, ' ')
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>{accommodation.accommName}</Text>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.imageScroll}>
        {parsedImages.map((imgUrl, index) => (
          <Image key={index.toString()} source={{ uri: imgUrl }} style={styles.image} />
        ))}
      </ScrollView>

      <View style={styles.card}>
        <Text style={styles.detail}>
          <Text style={styles.bold}>Check-in:</Text> {accommodation.accommCheckIn}
        </Text>
        <Text style={styles.detail}>
          <Text style={styles.bold}>Check-out:</Text> {accommodation.accommCheckOut}
        </Text>
        <Text style={styles.detail}>
          <Text style={styles.bold}>Price:</Text> {accommodation.accommPrice}
        </Text>
        <Text style={styles.detail}>
          <Text style={styles.bold}>Rating:</Text> {accommodation.accommRating}
        </Text>
        <Text style={styles.detail}>
          <Text style={styles.bold}>Details:</Text> {formatDetailsText(accommodation.accommDetails)}
        </Text>
      </View>

      <View style={styles.buttonGroup}>
        <TouchableOpacity onPress={() => Linking.openURL(accommodation.accommUrl)} style={[styles.button, styles.outlineButton]}>
          <Text style={styles.outlineButtonText}>View on Airbnb</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={handleSaveButton} style={styles.button}>
          <Text style={styles.buttonText}>Save to Trip</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 40,
    backgroundColor: '#f9f9f9',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  imageScroll: {
    marginBottom: 20,
  },
  image: {
    width: 400,
    height: 320,
    borderRadius: 12,
    marginRight: 10,
  },
  card: {
    backgroundColor: '#fff',
    padding: 18,
    borderRadius: 12,
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
  },
  detail: {
    fontSize: 16,
    marginBottom: 10,
    lineHeight: 22,
  },
  bold: {
    fontWeight: 'bold',
    color: '#333',
  },
  buttonGroup: {
    flexDirection: 'column',
    alignItems: 'center',
    gap: 12,
  },
  button: {
    backgroundColor: '#6785c7',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 10,
    marginBottom: 10,
    alignItems: 'center',
    width: '100%',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  outlineButton: {
    backgroundColor: '#fff',
    borderColor: '#6785c7',
    borderWidth: 1.5,
  },
  outlineButtonText: {
    color: '#6785c7',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
