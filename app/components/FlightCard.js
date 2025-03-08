import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking } from 'react-native';

export default function FlightCard({ airline, price, departureTime, arrivalTime, duration, stops, bookingUrl }) {
  return (
    <TouchableOpacity style={styles.card} onPress={() => Linking.openURL(bookingUrl)}>
      <View>
        <Text style={styles.airline}>{airline}</Text>
        <Text style={styles.price}>{price}</Text>
        <Text style={styles.details}>{departureTime} → {arrivalTime} ({duration})</Text>
        <Text style={styles.details}>{stops > 0 ? `${stops} stop(s)` : 'Direct flight'}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    padding: 15,
    marginVertical: 10,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  airline: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  price: {
    fontSize: 16,
    color: '#2c3e50',
    fontWeight: '600',
  },
  details: {
    fontSize: 14,
    color: '#555',
    marginTop: 3,
  },
});
