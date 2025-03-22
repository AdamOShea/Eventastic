import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Modal,
  TextInput,
  ScrollView,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import TripCard from "../components/TripCard";
import {searchUsers} from "../methods/searchUsers";
import {addFriend} from "../methods/addFriend";
import { useUser } from "../components/UserContext";



// Dummy friend data
const friends = [
  {
    id: "1",
    name: "Alice",
    sharedTrips: [
      { tripid: "a1", eventTitle: "Coldplay Live", eventDate: "2025-07-21", eventVenue: "Wembley", eventLocation: "London" },
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

// Simulate backend username search
const dummyUserSearch = (query) => {
  const users = ["adam23", "alicemusic", "bobster", "charliex", "dublindude", "MartaTheLoser"];
  return users.filter((u) => u.toLowerCase().includes(query.toLowerCase()));
};

const userSearch = async (query) => {
  try {
    const response = await searchUsers({ username: query }); // Wrap query in object
    console.log(response.users);
    return Array.isArray(response.users) ? response.users : [];
  } catch (err) {
    console.log("userSearch failed:", err);
    return [];
  }
};



export default function FriendsPage({ navigation }) {
  const [addFriendModal, setAddFriendModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const { currentUser } = useUser();
  const openAddFriendModal = () => {
    setAddFriendModal(true);
    setSearchQuery("");
    setSearchResults([]);
    setSelectedUser(null);
  };

  const handleSearch = async () => {
    const results = await userSearch(searchQuery);
    setSearchResults(results);
  };
  

  const handleAddFriend = async () => {
    if (selectedUser) {
      console.log("✅ Adding friend:", selectedUser.username, selectedUser.userid);
      try {
        const response = await addFriend(currentUser.userid, selectedUser.userid);
        return response;
      } catch (err) {
        console.log("handleaddfriend: ", err);
      }

      // Add actual friend logic here (e.g. API call)
      setAddFriendModal(false);
    }
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
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Friends</Text>
        <TouchableOpacity onPress={openAddFriendModal}>
          <Icon name="person-add" size={28} color="#6785c7" />
        </TouchableOpacity>
      </View>

      {/* Friends List */}
      <FlatList
        data={friends}
        keyExtractor={(item) => item.id}
        renderItem={renderFriend}
        contentContainerStyle={{ paddingBottom: 30 }}
      />

      {/* Modal */}
      <Modal visible={addFriendModal} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add a Friend</Text>

            <TextInput
              placeholder="Enter username to search"
              value={searchQuery}
              onChangeText={setSearchQuery}
              style={styles.input}
            />

            <TouchableOpacity
              style={styles.searchButton}
              onPress={() => {
                handleSearch()
              }}
            >
              <Text style={styles.searchButtonText}>Search</Text>
            </TouchableOpacity>

            <ScrollView style={{ maxHeight: 200 }}>
            {searchResults.map((user, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.resultItem,
                  selectedUser?.userid === user.userid && styles.selectedItem,
                ]}
                onPress={() => setSelectedUser(user)} // Save whole user object
              >
                <Text style={styles.resultText}>{user.username}</Text>
              </TouchableOpacity>
            ))}


            </ScrollView>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setAddFriendModal(false)}
              >
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.addButton, !selectedUser && { opacity: 0.5 }]}
                onPress={handleAddFriend}
                disabled={!selectedUser}
              >
                <Text style={styles.addText}>Add Friend</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
    paddingHorizontal: 20,
    backgroundColor: "#f5f5f5",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
    alignItems: "center",
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
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 20,
    width: "85%",
    borderRadius: 12,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 12,
    textAlign: "center",
  },
  input: {
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
  },
  resultItem: {
    padding: 10,
    borderBottomColor: "#eee",
    borderBottomWidth: 1,
  },
  selectedItem: {
    backgroundColor: "#e0ecff",
  },
  resultText: {
    fontSize: 16,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 15,
  },
  addButton: {
    backgroundColor: "#6785c7",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  addText: {
    color: "#fff",
    fontWeight: "bold",
  },
  cancelButton: {
    backgroundColor: "#ddd",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  cancelText: {
    fontWeight: "bold",
    color: "#333",
  },
  searchButton: {
    backgroundColor: "#6785c7",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 10,
  },
  searchButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  
});
