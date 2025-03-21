import React, { useEffect, useState, useCallback } from "react";
import { View, Text, FlatList, StyleSheet, ActivityIndicator, RefreshControl } from "react-native";
import TripCard from "../components/TripCard";
import { fetchSavedTrips } from "../methods/fetchSavedTrips"; // ✅ API call to get trips

export default function SavedTripsPage({ navigation }) {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadTrips = async () => {
    setLoading(true);
    const savedTrips = await fetchSavedTrips({ userid: "4100febd-1cb8-45ed-91e8-ca242ac97e6f" });

    //console.log("🔍 Processed trips for FlatList:", savedTrips);

    if (!Array.isArray(savedTrips) || savedTrips.length === 0) {
      //console.error("❌ API returned an invalid trip format or empty array.");
      setTrips([]);
    } else {
      setTrips(savedTrips);
    }

    setLoading(false);
  };

  useEffect(() => {
    loadTrips();
  }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadTrips();
    setRefreshing(false);
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Your Saved Trips</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#6785c7" />
      ) : (
        <FlatList
          data={trips}
          keyExtractor={(item, index) => item.tripid ? item.tripid.toString() : `trip_${index}`} // ✅ Prevents crashing
          renderItem={({ item }) => {
            //console.log("🔍 Rendering TripCard:", item);
            return (
              <TripCard
                trip={item}
                onPress={() => navigation.navigate("TripDetails", { trip: item })}
              />
            );
          }}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={["#6785c7"]} />}
          ListEmptyComponent={<Text style={styles.noTripsText}>No saved trips found.</Text>}
          contentContainerStyle={trips.length === 0 ? styles.centeredContainer : null} // ✅ Center "No trips found" message
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, // ✅ Use flex to prevent nesting issues
    paddingTop: 50,
    padding: 20,
    backgroundColor: "#f5f5f5",
    
  },
  centeredContainer: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
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
