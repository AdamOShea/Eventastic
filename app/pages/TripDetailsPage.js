import React from "react";
import { View, ScrollView, Text, StyleSheet } from "react-native";
import InfoContainer from "../components/InfoContainer";
import AccommodationCard from "../components/AccommodationCard";
import FlightCard from "../components/FlightCard";

export default function TripDetailsPage({ route }) {
  const { trip } = route.params;

  let imageSource;

  try {
        const images = JSON.parse(trip.eventImages || '[]'); // safely parse
        if (images.length > 0) {
          imageSource = { uri: images[0] }; // ✅ access first image
        }
      } catch (err) {
        //console.warn('❌ Failed to parse eventImages:', err);
      }



  let accommImages;
  let accommFirstImage;

  try {
      accommImages = JSON.parse(trip.accommImages || '[]'); // safely parse
    if (images.length > 0) {
      accommFirstImage = accommImages[0] // ✅ access first image
    }
  } catch (err) {
    //console.warn('❌ Failed to parse eventImages:', err);
  }
  // Build event object
  const event = {
    eventTitle: trip.eventTitle,
    eventDate: trip.eventDate,
    eventVenue: trip.eventVenue,
    eventLocation: trip.eventLocation,
    eventLink: trip.eventLink,
    eventImages: imageSource
    
  };

  // Build accommodation object
  const accommodation = trip.accommName && {
    accommName: trip.accommName,
    accommPrice: trip.accommPrice,
    accommRating: trip.accommRating,
    accommImages: accommImages,
    accommFirstImage: accommFirstImage
  };

  // Build outbound flight object
  const outboundFlight = trip.outFlightAirline && {
    flightAirline: trip.outFlightAirline,
    flightDepartureAirport: trip.outFlightDeparture,
    flightArrivalAirport: trip.outFlightArrival,
    flightDuration: trip.outFlightDuration,
    flightPrice: trip.outFlightPrice,
    flightDepartureTime: trip.outFlightDepartureTime,
    flightArrivalTime: trip.outFlightArrivalTime
  };

  // Build return flight object
  const returnFlight = trip.returnFlightAirline && {
    flightAirline: trip.returnFlightAirline,
    flightDepartureAirport: trip.returnFlightDeparture,
    flightArrivalAirport: trip.returnFlightArrival,
    flightDuration: trip.returnFlightDuration,
    flightPrice: trip.returnFlightPrice,
    flightDepartureTime: trip.returnFlightDepartureTime,
    flightArrivalTime: trip.returnFlightArrivalTime
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Trip Details</Text>

      <InfoContainer event={event} />

      {accommodation && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🏨 Accommodation</Text>
          <AccommodationCard {...accommodation} />
        </View>
      )}

      {outboundFlight && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>✈️ Outbound Flight</Text>
          <FlightCard {...outboundFlight} />
        </View>
      )}

      {returnFlight && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>✈️ Return Flight</Text>
          <FlightCard {...returnFlight} />
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
