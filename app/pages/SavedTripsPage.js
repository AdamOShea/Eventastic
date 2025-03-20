import React, { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet, ActivityIndicator, TouchableOpacity } from "react-native";
import TripCard from "../components/TripCard";
import { fetchSavedTrips } from "../methods/fetchSavedTrips"; // ✅ API call to get trips

export default function SavedTripsPage({ navigation }) {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTrips = async () => {
      const savedTrips = await fetchSavedTrips();
      setTrips(savedTrips || []);
      setLoading(false);
    };
    loadTrips();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Your Saved Trips</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#6785c7" />
      ) : trips.length > 0 ? (
        <FlatList
          data={trips}
          keyExtractor={(item) => item.tripId.toString()}
          renderItem={({ item }) => (
            <TripCard
              trip={item}
              onPress={() => navigation.navigate("TripDetailsPage", { trip: item })}
            />
          )}
        />
      ) : (
        <Text style={styles.noTripsText}>No saved trips found.</Text>
      )}
    </View>
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
  noTripsText: {
    fontSize: 16,
    textAlign: "center",
    color: "#666",
  },
});
