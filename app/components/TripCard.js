import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

export default function TripCard({ trip, onPress }) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <Text style={styles.title}>{trip.event.title}</Text>
      <Text style={styles.date}>{trip.event.date}</Text>
      <Text style={styles.location}>{trip.event.venue}, {trip.event.eventlocation}</Text>
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
