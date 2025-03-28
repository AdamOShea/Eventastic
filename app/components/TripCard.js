import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { format } from 'date-fns';

export default function TripCard({ trip, onPress }) {
  if (!trip || !trip.eventTitle) return null;

  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <Text style={styles.title} numberOfLines={1}>
        {trip.eventTitle}
      </Text>
      <Text style={styles.date}>
        {format(new Date(trip.eventDate), 'dd-LLL-yyyy')}
      </Text>
      <Text style={styles.location} numberOfLines={1}>
        {trip.eventVenue}, {trip.eventLocation}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    padding: 15,
    marginVertical: 10,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    height: 110, // 🔒 Fixed height
    justifyContent: 'space-between', // Distribute items vertically
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
  },
  date: {
    fontSize: 14,
    color: "#666",
  },
  location: {
    fontSize: 14,
    color: "#444",
  },
});
