import React, { useState } from "react";
import {
  View,
  ScrollView,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";
import TappableInfoContainer from "../components/TappableInfoContainer";
import TripAccommodationCard from "../components/TripAccommodationCard";
import TripFlightCard from "../components/TripFlightCard";

export default function FriendTripDetails({ route, navigation }) {
  const { trip } = route.params;

  let accommImages = [];
  let accommFirstImage;

  try {
    accommImages = JSON.parse(trip.accommImages || "[]");
    if (accommImages.length > 0) {
      accommFirstImage = accommImages[0];
    }
  } catch (err) {
    console.warn("❌ Failed to parse accommImages:", err);
  }


  const event = {
    eventTitle: trip.eventTitle,
    eventDate: trip.eventDate,
    eventVenue: trip.eventVenue,
    eventLocation: trip.eventLocation,
    eventLink: trip.eventLink,
    eventImages: trip.eventImages,
  };

  const accommodation = trip.accommName && {
    accommName: trip.accommName,
    accommPrice: trip.accommPrice,
    accommRating: trip.accommRating,
    accommImages,
    accommFirstImage,
    accommUrl: trip.accommUrl,
  };

  const outboundFlight = trip.outFlightAirline && {
    flightAirline: trip.outFlightAirline,
    flightDepartureAirport: trip.outFlightDeparture,
    flightArrivalAirport: trip.outFlightArrival,
    flightDuration: trip.outFlightDuration,
    flightPrice: trip.outFlightPrice,
    flightDepartureTime: trip.outFlightDepartureTime,
    flightArrivalTime: trip.outFlightArrivalTime,
    flightUrl: trip.outFlightUrl,
  };

  const returnFlight = trip.returnFlightAirline && {
    flightAirline: trip.returnFlightAirline,
    flightDepartureAirport: trip.returnFlightDeparture,
    flightArrivalAirport: trip.returnFlightArrival,
    flightDuration: trip.returnFlightDuration,
    flightPrice: trip.returnFlightPrice,
    flightDepartureTime: trip.returnFlightDepartureTime,
    flightArrivalTime: trip.returnFlightArrivalTime,
    flightUrl: trip.returnFlightUrl,
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.header}>Trip Details</Text>
      </View>

      <TappableInfoContainer event={event} />

      {accommodation && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Accommodation</Text>
          <TripAccommodationCard {...accommodation} />
        </View>
      )}

      {outboundFlight && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>✈️ Outbound Flight</Text>
          <TripFlightCard {...outboundFlight} />
        </View>
      )}

      {returnFlight && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>✈️ Return Flight</Text>
          <TripFlightCard {...returnFlight} />
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    paddingTop: 50,
    backgroundColor: "#f5f5f5",
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  header: {
    fontSize: 22,
    fontWeight: "bold",
  },
  shareButton: {
    backgroundColor: "#6785c7",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  sharedButton: {
    backgroundColor: "#4CAF50",
  },
  shareButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16
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
