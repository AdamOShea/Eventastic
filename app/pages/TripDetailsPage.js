import React from "react";
import { View, ScrollView, Text, StyleSheet } from "react-native";
import TappableInfoContainer from "../components/TappableInfoContainer";
import TripAccommodationCard from "../components/TripAccommodationCard";
import TripFlightCard from "../components/TripFlightCard";

export default function TripDetailsPage({ route }) {
  const { trip } = route.params;

  // let imageSource;

  // try {
  //       const images = JSON.parse(trip.eventImages || '[]'); // safely parse
  //       if (images.length > 0) {
  //         imageSource = { uri: images[0] }; // ✅ access first image
  //       }
  // } catch (err) {
  //       //console.warn('❌ Failed to parse eventImages:', err);
  // }

  let accommImages = [];
  let accommFirstImage;
  
  try {
    accommImages = JSON.parse(trip.accommImages || '[]'); // properly set as array
    if (accommImages.length > 0) {
      accommFirstImage = accommImages[0]; // ✅ string URL
    }
  } catch (err) {
    console.warn('❌ Failed to parse accommImages:', err);
  }
  

  


  // Build event object
  const event = {
    eventTitle: trip.eventTitle,
    eventDate: trip.eventDate,
    eventVenue: trip.eventVenue,
    eventLocation: trip.eventLocation,
    eventLink: trip.eventLink,
    eventImages: trip.eventImages
    
  };

  // Build accommodation object
  const accommodation = trip.accommName && {
    accommName: trip.accommName,
    accommPrice: trip.accommPrice,
    accommRating: trip.accommRating,
    accommImages,            // full array
    accommFirstImage,        // string
    accommUrl: trip.accommUrl,
  };
  

  // Build outbound flight object
  const outboundFlight = trip.outFlightAirline && {
    flightAirline: trip.outFlightAirline,
    flightDepartureAirport: trip.outFlightDeparture,
    flightArrivalAirport: trip.outFlightArrival,
    flightDuration: trip.outFlightDuration,
    flightPrice: trip.outFlightPrice,
    flightDepartureTime: trip.outFlightDepartureTime,
    flightArrivalTime: trip.outFlightArrivalTime,
    flightUrl: trip.outFlightUrl
  };

  // Build return flight object
  const returnFlight = trip.returnFlightAirline && {
    flightAirline: trip.returnFlightAirline,
    flightDepartureAirport: trip.returnFlightDeparture,
    flightArrivalAirport: trip.returnFlightArrival,
    flightDuration: trip.returnFlightDuration,
    flightPrice: trip.returnFlightPrice,
    flightDepartureTime: trip.returnFlightDepartureTime,
    flightArrivalTime: trip.returnFlightArrivalTime,
    flightUrl: trip.returnFlightUrl
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Trip Details</Text>

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
