import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity } from 'react-native';
import { format } from 'date-fns';

export default function EventDetailsPage({ route, navigation }) {
  const { event } = route.params; // Access the passed event object
  const imageSource =
    event.seller?.toLowerCase() === 'ticketmaster'
      ? require('../assets/ticketmaster.png')
      : require('../assets/eventastic.png');

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image source={imageSource} style={styles.image} />
      <Text style={styles.title}>{event.title}</Text>

      

      <Text style={styles.detail}><Text style={styles.label}>Date:</Text> {format(new Date(event.date), 'dd-LLL-yyyy')}</Text>
      <Text style={styles.detail}><Text style={styles.label}>Location:</Text> {event.eventlocation.trim()}, {event.venue}</Text>
      <Text style={styles.detail}><Text style={styles.label}>Artist:</Text> {event.artist || 'N/A'}</Text>
      <Text style={styles.detail}><Text style={styles.label}>Genre:</Text> {event.genre || 'N/A'}</Text>
      <Text style={styles.detail}><Text style={styles.label}>Price:</Text> €{event.price || 'N/A'}</Text>
      <Text style={styles.detail}><Text style={styles.label}>Event Type:</Text> {event.eventtype || 'N/A'}</Text>
      <Text style={styles.detail}><Text style={styles.label}>Seller:</Text> {event.seller || 'N/A'}</Text>
      <Text style={styles.detail}><Text style={styles.label}>Event Link:</Text> {event.eventlink || 'No link available'}</Text>


      <TouchableOpacity
        style={styles.button}
      >
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
        <Text style={styles.buttonText}>Search Accommodation & Flights</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop:50,
    padding: 20,
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  image: {
    width: 200,
    height: 200,
    borderRadius: 10,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  detail: {
    fontSize: 16,
    marginBottom: 8,
    width: '100%',
  },
  label: {
    fontWeight: 'bold',
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
  buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});
