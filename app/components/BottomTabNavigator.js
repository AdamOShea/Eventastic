import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import Icon from "react-native-vector-icons/Ionicons";

// Import your screens
import SearchPage from "../pages/SearchPage";
import SavedTrips from "../pages/SavedTripsPage";
import SettingsPage from "../pages/SettingsPage";
import HostingPage from "../pages/HostingPage";

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// ✅ Create the Tab Navigator
const BottomTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false, // ✅ Hide headers
        tabBarStyle: {
          height: 60,
          backgroundColor: "#6785c7", // ✅ Customize navbar color
        },
        tabBarLabelStyle: {
            fontSize: 16, // ✅ Increase text size
            fontWeight: "bold",
        },
        tabBarHideOnKeyboard: true,
        tabBarActiveTintColor: "#fff", // ✅ Active tab color
        tabBarInactiveTintColor: "#ccc", // ✅ Inactive tab color
      }}
    >
      <Tab.Screen 
        name="Search" 
        component={SearchPage}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="search" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen 
        name="Saved" 
        component={SavedTrips} 
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="bookmarks" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen 
        name="Hosting" 
        component={HostingPage} 
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
