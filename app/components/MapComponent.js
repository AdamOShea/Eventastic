import React, { useState, useEffect } from 'react';
import { View, ActivityIndicator, Text, StyleSheet } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { getGeolocation } from '../methods/getGeolocation';

export default function MapComponent({ eventLocation, eventTitle }) {
  const [region, setRegion] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCoordinates = async () => {
      const geoData = await getGeolocation(eventLocation);
      if (geoData) {
        setRegion({
          latitude: geoData.latitude,
          longitude: geoData.longitude,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        });
      }
      setLoading(false);
    };

    fetchCoordinates();
  }, [eventLocation]);

  return (
    <View style={styles.mapContainer}>
      {loading ? (
        <ActivityIndicator size="large" color="#6785c7" />
      ) : region ? (
        <MapView style={styles.map} initialRegion={region}>
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
