import React from "react";
import { View, ScrollView, Text, StyleSheet } from "react-native";
import InfoContainer from "../components/InfoContainer";
import AccommodationCard from "../components/AccommodationCard";
import FlightCard from "../components/FlightCard";

export default function TripDetailsPage({ route }) {
  const { trip } = route.params;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Trip Details</Text>

      {/* Event Details */}
      <InfoContainer event={trip.event} />

      {/* Accommodation (if available) */}
      {trip.accommodation && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🏨 Accommodation</Text>
          <AccommodationCard {...trip.accommodation} />
        </View>
      )}

      {/* Outbound Flight (if available) */}
      {trip.outboundFlight && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>✈️ Outbound Flight</Text>
          <FlightCard {...trip.outboundFlight} />
        </View>
      )}

      {/* Return Flight (if available) */}
      {trip.returnFlight && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>✈️ Return Flight</Text>
          <FlightCard {...trip.returnFlight} />
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  header: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
  },
  section: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
});
