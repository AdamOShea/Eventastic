import React from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/Ionicons";
import TripCard from "../components/TripCard";

// Dummy data
const friends = [
  {
    id: "1",
    name: "Alice",
    sharedTrips: [
      { tripid: "a1", eventTitle: "Coldplay Live", eventDate: "2025-07-21", eventVenue: "Wembley", eventLocation: "London" },
      { tripid: "a2", eventTitle: "Glastonbury", eventDate: "2025-06-28", eventVenue: "Pilton", eventLocation: "Somerset" },
    ],
  },
  {
    id: "2",
    name: "Bob",
    sharedTrips: [
      { tripid: "b1", eventTitle: "Taylor Swift Tour", eventDate: "2025-08-05", eventVenue: "Aviva", eventLocation: "Dublin" },
    ],
  },
];

export default function FriendsPage() {
  const navigation = useNavigation();

  const goToAddFriends = () => {
    navigation.navigate("AddFriendPage");
  };

  const goToFriendTrips = (friend) => {
    navigation.navigate("FriendTripsPage", { friend });
  };

  const renderFriend = ({ item }) => (
    <TouchableOpacity onPress={() => goToFriendTrips(item)} style={styles.friendContainer}>
      <Text style={styles.friendName}>{item.name}'s Trips</Text>
      {item.sharedTrips.slice(0, 2).map((trip) => (
        <TripCard key={trip.tripid} trip={trip} />
      ))}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Friends</Text>
        <TouchableOpacity onPress={goToAddFriends}>
          <Icon name="person-add" size={28} color="#6785c7" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={friends}
        keyExtractor={(item) => item.id}
        renderItem={renderFriend}
        contentContainerStyle={{ paddingBottom: 30 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 50,
    paddingHorizontal: 20,
    backgroundColor: "#f5f5f5",
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
  friendContainer: {
    backgroundColor: "#fff",
    padding: 15,
    marginBottom: 15,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  friendName: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
});
