import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import InfoContainer from './InfoContainer';
import ExpandableDescription from './ExpandableDescription';
import MapComponent from './MapComponent';

export default function EventDetailsPage({ route, navigation }) {
  const { event } = route.params;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <InfoContainer event={event} />
      <ExpandableDescription event={event} />

      <MapComponent eventLocation={event.venue + " " + event.eventlocation} eventTitle={event.title} />

      {/* 🚀 Action Buttons */}
      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Save Event</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('Accommodation', { event })}
      >
        <Text style={styles.buttonText}>Search Accommodation</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('Flights', { event })}
      >
        <Text style={styles.buttonText}>Search Flights</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 50,
    padding: 20,
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  button: {
    backgroundColor: '#6785c7',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginTop: 15,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: { 
    color: '#fff', 
    fontSize: 16, 
    fontWeight: 'bold' 
  },
});
