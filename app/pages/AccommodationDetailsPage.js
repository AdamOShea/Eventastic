import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Linking } from 'react-native';
import { useEvent } from '../components/EventContext'; // ✅ Import context

export default function AccommodationDetailsPage({ navigation }) {
  const { selectedAccommodation } = useEvent(); // ✅ Retrieve accommodation from context

  if (!selectedAccommodation) {
    console.warn("⚠️ No accommodation selected. Redirecting...");
    navigation.navigate('AccommodationPage'); // ✅ Redirect if accommodation is missing
    return null;
  }

  const handleSaveButton = () => {
    console.log("saved accomm to trip, ", selectedAccommodation.name);
    navigation.navigate('EventDetails');
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>{selectedAccommodation.name}</Text>
      
      {/* 🖼️ Display All Images */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.imageScroll}>
        {selectedAccommodation.images?.map((imgUrl, index) => (
          <Image key={index} source={{ uri: imgUrl }} style={styles.image} />
        ))}
      </ScrollView>

      {/* ℹ️ Accommodation Details */}
      <Text style={styles.detail}><Text style={styles.bold}>Price:</Text> {selectedAccommodation.price}</Text>
      <Text style={styles.detail}><Text style={styles.bold}>Rating:</Text> {selectedAccommodation.rating}</Text>
      <Text style={styles.detail}><Text style={styles.bold}>Details:</Text> {selectedAccommodation.details || 'No additional details provided.'}</Text>

      {/* 🔗 Open Room URL */}
      <TouchableOpacity onPress={() => Linking.openURL(selectedAccommodation.roomUrl)} style={styles.button}>
        <Text style={styles.buttonText}>View on Airbnb</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => handleSaveButton()} style={styles.button}>
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
