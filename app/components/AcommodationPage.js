import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { WebView } from 'react-native-webview';
import { getGoogleMapsEmbed } from '../methods/getGoogleMapsEmbed'; // Import the secure method

export default function AccommodationPage({ route }) {
  const { event } = route.params;

  // 📅 Initialize dates: Check-in = Event Date, Check-out = +1 Day
  const eventDate = new Date(event.date);
  const [checkInDate, setCheckInDate] = useState(eventDate);
  const [checkOutDate, setCheckOutDate] = useState(new Date(eventDate.getTime() + 86400000)); // +1 day

  const [showCheckInPicker, setShowCheckInPicker] = useState(false);
  const [showCheckOutPicker, setShowCheckOutPicker] = useState(false);
  const [googleMapsUrl, setGoogleMapsUrl] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🗺 Fetch Google Maps Embed URL securely from backend
  useEffect(() => {
    const fetchMapsUrl = async () => {
      const embedUrl = await getGoogleMapsEmbed(event.eventlocation);
      if (embedUrl) {
        setGoogleMapsUrl(embedUrl);
      }
      setLoading(false);
    };

    fetchMapsUrl();
  }, [event.eventlocation]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Search Accommodation for:</Text>
      <Text style={styles.eventTitle}>{event.title}</Text>
      <Text>📍 Location: {event.eventlocation}, {event.venue}</Text>
      <Text>📅 Event Date: {event.date}</Text>

      {/* 🗓 Check-in Date Picker */}
      <TouchableOpacity style={styles.dateButton} onPress={() => setShowCheckInPicker(true)}>
        <Text style={styles.buttonText}>Check-in: {checkInDate.toDateString()}</Text>
      </TouchableOpacity>
      {showCheckInPicker && (
        <DateTimePicker
          value={checkInDate}
          mode="date"
          display="default"
          minimumDate={eventDate}
          onChange={(event, selectedDate) => {
            setShowCheckInPicker(false);
            if (selectedDate) setCheckInDate(selectedDate);
          }}
        />
      )}

      {/* 🗓 Check-out Date Picker */}
      <TouchableOpacity style={styles.dateButton} onPress={() => setShowCheckOutPicker(true)}>
        <Text style={styles.buttonText}>Check-out: {checkOutDate.toDateString()}</Text>
      </TouchableOpacity>
      {showCheckOutPicker && (
        <DateTimePicker
          value={checkOutDate}
          mode="date"
          display="default"
          minimumDate={new Date(checkInDate.getTime() + 86400000)}
          onChange={(event, selectedDate) => {
            setShowCheckOutPicker(false);
            if (selectedDate) setCheckOutDate(selectedDate);
          }}
        />
      )}

      {/* 🌍 Google Maps Embed */}
      <View style={styles.mapContainer}>
        {loading ? (
          <ActivityIndicator size="large" color="#6785c7" />
        ) : googleMapsUrl ? (
          <WebView source={{ uri: googleMapsUrl }} style={styles.map} />
        ) : (
          <Text style={styles.errorText}>⚠️ Failed to load Google Maps.</Text>
        )}
      </View>

      {/* 🏨 Search Accommodation Button */}
      <TouchableOpacity
        style={styles.searchButton}
        onPress={() => {
          console.log('Searching for accommodation:', {
            checkIn: checkInDate.toISOString().split('T')[0],
            checkOut: checkOutDate.toISOString().split('T')[0],
            location: event.eventlocation,
          });
          // Call accommodation API here
        }}
      >
        <Text style={styles.buttonText}>Search Accommodation</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, alignItems: 'center' },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 10 },
  eventTitle: { fontSize: 18, marginVertical: 8, fontWeight: 'bold' },
  dateButton: {
    backgroundColor: '#6785c7',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginTop: 15,
    width: '100%',
    alignItems: 'center',
  },
  searchButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginTop: 30,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  mapContainer: {
    width: '100%',
    height: 250,
    marginTop: 20,
    borderRadius: 10,
    overflow: 'hidden',
  },
  map: {
    flex: 1,
  },
  errorText: {
    color: 'red',
    fontSize: 14,
    textAlign: 'center',
  },
});
