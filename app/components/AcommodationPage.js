import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function AccommodationPage({ route }) {
  const { event } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Search Accommodation for:</Text>
      <Text style={styles.eventTitle}>{event.title}</Text>
      <Text>Location: {event.eventlocation}, {event.venue}</Text>
      <Text>Date: {event.date}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, alignItems: 'center' },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 10 },
  eventTitle: { fontSize: 18, marginVertical: 8 },
});
