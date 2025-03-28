// Component that renders a Google Map displaying the event location, with functionality to view it in fullscreen mode.


import React, { useState, useEffect } from 'react';
import { View, ActivityIndicator, Text, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { getGeolocation } from '../methods/getGeolocation';
import Constants from 'expo-constants';

const GOOGLE_MAPS_API_KEY = Constants.expoConfig.extra.googleMapsApiKey;

export default function MapComponent({ eventVenue, eventLocation, eventTitle }) {
  const [region, setRegion] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showFullMap, setShowFullMap] = useState(false);

  useEffect(() => {
    // Fetches geolocation coordinates based on event venue and location.
    const fetchCoordinates = async () => {
      let geoData = await getGeolocation(`${eventVenue}, ${eventLocation}`);
      if (!geoData) {
        geoData = await getGeolocation(eventLocation);
      }
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
  }, [eventVenue, eventLocation]);

  // Helper method to render map view with specified styles and scrollability.
  const renderMap = (style, scroll = false) =>
    region && (
      <MapView
        style={style}
        initialRegion={region}
        provider={PROVIDER_GOOGLE}
        scrollEnabled={scroll}
        zoomEnabled={true}
        pitchEnabled={true}
        rotateEnabled={true}
      >
        <Marker coordinate={region} title={eventTitle} description={eventLocation} />
      </MapView>
    );

  return (
    <View style={styles.wrapper}>
      {loading ? (
        <ActivityIndicator size="large" color="#6785c7" />
      ) : region ? (
        <>
          <TouchableOpacity style={styles.mapContainer} onPress={() => setShowFullMap(true)} activeOpacity={0.85}>
            {renderMap(styles.map)}
            <Text style={styles.tapHint}>Tap to expand</Text>
          </TouchableOpacity>

          {/* Fullscreen Modal */}
          <Modal visible={showFullMap} animationType="slide">
            <View style={styles.modalContainer}>
              {renderMap(styles.fullMap, true)}
              <TouchableOpacity style={styles.closeButton} onPress={() => setShowFullMap(false)}>
                <Text style={styles.closeText}>Close Map</Text>
              </TouchableOpacity>
            </View>
          </Modal>
        </>
      ) : (
        <Text style={styles.errorText}>⚠️ Failed to load map.</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
    marginTop: 20,
  },
  mapContainer: {
    height: 180,
    borderRadius: 20,
    borderColor: '#ccc',
    borderWidth: 1,
    overflow: 'hidden',
    position: 'relative',
  },
  map: {
    flex: 1,
  },
  tapHint: {
    position: 'absolute',
    bottom: 6,
    right: 10,
    fontSize: 12,
    color: '#555',
    backgroundColor: 'rgba(255,255,255,0.8)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  errorText: {
    color: 'red',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 10,
  },
  modalContainer: {
    flex: 1,
  },
  fullMap: {
    flex: 1,
  },
  closeButton: {
    backgroundColor: '#6785c7',
    paddingVertical: 12,
    alignItems: 'center',
  },
  closeText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
