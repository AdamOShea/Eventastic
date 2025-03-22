import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import Icon from "react-native-vector-icons/Ionicons";

// Pages
import SearchPage from "../pages/SearchPage";
import EventDetailsPage from "../pages/EventDetailsPage";
import AccommodationPage from "../pages/AccommodationPage";
import AccommodationDetailsPage from "../pages/AccommodationDetailsPage";
import FlightsPage from "../pages/FlightsPage";
import OutboundFlights from "../pages/OutboundFlights";
import ReturnFlights from "../pages/ReturnFlights";
import ConfirmFlights from "../pages/ConfirmFlights";

import SavedTrips from "../pages/SavedTripsPage";
import TripDetailsPage from "../pages/TripDetailsPage";

import SettingsPage from "../pages/SettingsPage";
import FriendsPage from "../pages/FriendsPage";
import FriendsTripsPage from "../pages/FriendTripsPage";


const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// 🔁 Search Tab Stack
const SearchStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="SearchPage" component={SearchPage} />
    <Stack.Screen name="EventDetails" component={EventDetailsPage} />
    <Stack.Screen name="Accommodation" component={AccommodationPage} />
    <Stack.Screen name="AccommodationDetails" component={AccommodationDetailsPage} />
    <Stack.Screen name="Flights" component={FlightsPage} />
    <Stack.Screen name="OutboundFlights" component={OutboundFlights} />
    <Stack.Screen name="ReturnFlights" component={ReturnFlights} />
    <Stack.Screen name="ConfirmFlights" component={ConfirmFlights} />
  </Stack.Navigator>
);

// 💾 Saved Trips Stack
const SavedStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="SavedTripsPage" component={SavedTrips} />
    <Stack.Screen name="TripDetails" component={TripDetailsPage} />
  </Stack.Navigator>
);

const FriendsStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="FriendsPage" component={FriendsPage} />
    <Stack.Screen name="FriendsTripsPage" component={FriendsTripsPage} />
  </Stack.Navigator>
);

const SettingsStack = () => {
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="SettingsPage" component={SettingsPage} />
  </Stack.Navigator>
}

// ✅ Main Bottom Tab Navigator
const BottomTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          height: 60,
          backgroundColor: "#6785c7",
        },
        tabBarLabelStyle: {
          fontSize: 16,
          fontWeight: "bold",
        },
        tabBarHideOnKeyboard: true,
        tabBarActiveTintColor: "#fff",
        tabBarInactiveTintColor: "#ccc",
      }}
    >
      <Tab.Screen
        name="Search"
        component={SearchStack}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="search" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Saved"
        component={SavedStack}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="bookmarks" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Friends"
        component={FriendsStack}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="people" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsPage}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="settings" color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default BottomTabNavigator;
