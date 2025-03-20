import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

export default function TripCard({ trip, onPress }) {
  if (!trip || !trip.title) return null; // ✅ Prevents crash

  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <Text style={styles.title}>{trip.eventTitle}</Text>
      <Text style={styles.date}>{trip.eventDate}</Text>
      <Text style={styles.location}>{trip.eventVenue}, {trip.eventLocation}</Text>
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
