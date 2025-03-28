import React, { useState, useEffect } from "react";
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
import { updateTripSharing } from "../methods/updateTripSharing";
import { estimateTotal } from '../methods/estimateTripTotal';
import { fetchTripById } from "../methods/fetchTripById"; // ✅ Make sure this exists

export default function TripDetailsPage({ route, navigation }) {
  const { tripid } = route.params;
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrip = async () => {
      try {
        const latestTrip = await fetchTripById(tripid);
        setTrip(latestTrip);
      } catch (err) {
        console.error("❌ Failed to fetch trip:", err);
      } finally {
        setLoading(false);
      }
    };

    const unsubscribe = navigation.addListener("focus", fetchTrip);
    return unsubscribe;
  }, [navigation]);

  const toggleSharing = async () => {
    try {
      const updated = await updateTripSharing({
        tripid: trip.tripid,
        shared: !trip.shared,
      });

      if (updated?.message === "Trip sharing status updated") {
        setTrip(prev => ({ ...prev, shared: !prev.shared }));
      } else {
        Alert.alert("Update failed", "Could not update sharing status.");
      }
    } catch (err) {
      console.error("Error toggling share:", err);
      Alert.alert("Error", "An error occurred while sharing the trip.");
    }
  };

  if (loading || !trip) {
    return (
      <View style={styles.container}>
        <Text>Loading trip...</Text>
      </View>
    );
  }


  const event = {
    eventTitle: trip.eventTitle,
    eventDate: trip.eventDate,
    eventVenue: trip.eventVenue,
    eventLocation: trip.eventLocation,
    eventLink: trip.eventLink,
    eventImages: trip.eventImages,
    eventPrice: trip.eventPrice
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


  const estimatedTotal = estimateTotal(trip);


  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.header}>Trip Details</Text>
        <TouchableOpacity
          onPress={toggleSharing}
          style={[
            styles.shareButton,
            sharedStatus && styles.sharedButton, // Apply green styling if shared
          ]}
        >
          <Text style={styles.shareButtonText}>
            {sharedStatus ? "Shared" : "Share"}
          </Text>
        </TouchableOpacity>

      </View>

      {(estimatedTotal > 0) && (
        <View style={styles.estimateBox}>
          <Text style={styles.estimateTitle}>Estimated Trip Total</Text>
          <Text style={styles.estimateValue}>~ €{estimatedTotal.toFixed(2)}</Text>
        </View>
      )}

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
  estimateBox: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    alignItems: "center",
  },
  estimateTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 5,
    color: "#333",
  },
  estimateValue: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#27ae60",
  },
});
