import React, { useEffect, useState, useCallback } from "react";
import { View, Text, FlatList, StyleSheet, ActivityIndicator, RefreshControl } from "react-native";
import TripCard from "../components/TripCard";
import { fetchSavedTrips } from "../methods/fetchSavedTrips";
import { useUser } from "../components/UserContext"; // ✅ Import UserContext

export default function SavedTripsPage({ navigation }) {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { currentUser } = useUser(); // ✅ Get current user

  const loadTrips = async () => {
    if (!currentUser?.userid) return;
    setLoading(true);
    const savedTrips = await fetchSavedTrips({ userid: currentUser.userid });

    if (!Array.isArray(savedTrips) || savedTrips.length === 0) {
      setTrips([]);
    } else {
      setTrips(savedTrips);
    }

    setLoading(false);
  };

  useEffect(() => {
    loadTrips();
  }, [currentUser]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadTrips();
    setRefreshing(false);
  }, [currentUser]);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Your Saved Trips</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#6785c7" />
      ) : (
        <FlatList
          data={trips}
          keyExtractor={(item, index) => item.tripid ? item.tripid.toString() : `trip_${index}`}
          renderItem={({ item }) => (
            <TripCard
              trip={item}
              onPress={() => navigation.navigate("TripDetails", { trip: item })}
            />
          )}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={["#6785c7"]}
            />
          }
          ListEmptyComponent={<Text style={styles.noTripsText}>No saved trips found.</Text>}
          contentContainerStyle={trips.length === 0 ? styles.centeredContainer : null}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
