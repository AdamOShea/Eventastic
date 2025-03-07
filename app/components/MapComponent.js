import React, { useState, useEffect } from 'react';
import { View, ActivityIndicator, Text, StyleSheet } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { getGeolocation } from '../methods/getGeolocation';
import Constants from 'expo-constants';

const GOOGLE_MAPS_API_KEY = Constants.expoConfig.extra.googleMapsApiKey;

export default function MapComponent({ eventVenue, eventLocation, eventTitle }) {
  const [region, setRegion] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCoordinates = async () => {
      let geoData = await getGeolocation(`${eventVenue}, ${eventLocation}`);
      
      if (!geoData) {
        console.warn(`❌ Failed for "${eventVenue}, ${eventLocation}", trying just "${eventLocation}"`);
        geoData = await getGeolocation(eventLocation);
      }

      if (geoData) {
        setRegion({
          latitude: geoData.latitude,
          longitude: geoData.longitude,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        });
      } else {
        console.error(`❌ Failed to get coordinates for both "${eventVenue}, ${eventLocation}" and "${eventLocation}"`);
      }

      setLoading(false);
    };

    fetchCoordinates();
  }, [eventVenue, eventLocation]);

  return (
    <View style={styles.mapContainer}>
      {loading ? (
        <ActivityIndicator size="large" color="#6785c7" />
      ) : region ? (
        <MapView style={styles.map} initialRegion={region} provider={PROVIDER_GOOGLE}>
          <Marker coordinate={region} title={eventTitle} description={eventLocation} />
        </MapView>
      ) : (
        <Text style={styles.errorText}>⚠️ Failed to load map.</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  mapContainer: { width: '100%', height: 300, marginTop: 20, borderRadius: 10 },
  map: { flex: 1 },
  errorText: { color: 'red', fontSize: 14, textAlign: 'center' },
});
