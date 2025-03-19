import "react-native-url-polyfill/auto";
import React, { useEffect, useRef } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer} from '@react-navigation/native';
import LoginRegisterPage from './components/LoginRegisterPage';
import SearchPage from './components/SearchPage';
import { registerRootComponent } from 'expo';
import 'react-native-gesture-handler';
import {enableScreens} from 'react-native-screens';
import { MenuProvider } from 'react-native-popup-menu';
import { Provider as PaperProvider } from 'react-native-paper';
import EventDetailsPage from "./components/EventDetailsPage";
import AccommodationPage from "./components/AccommodationPage";
import AccommodationDetailsPage from "./components/AccommodationDetailsPage";
import FlightsPage from "./components/FlightsPage";
import OutboundFlights from "./components/OutboundFlights";
import ReturnFlights from "./components/ReturnFlights";
import ConfirmFlights from "./components/ConfirmFlights";
import { PermissionsAndroid, Platform } from 'react-native';
import { EventProvider } from "./components/EventContext";

enableScreens();



const requestLocationPermission = async () => {
  if (Platform.OS === 'android') {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: "Location Permission",
          message: "This app needs access to your location to show nearby events.",
          buttonNeutral: "Ask Me Later",
          buttonNegative: "Cancel",
          buttonPositive: "OK",
        }
      );
      console.log("Location Permission: ", granted);
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } catch (err) {
      console.warn(err);
      return false;
    }
  }
};

const Stack = createStackNavigator();

function App() {

useEffect(() => {
    requestLocationPermission();
  }, []);

  return (
    <EventProvider>
      <MenuProvider>
        <PaperProvider>
          <NavigationContainer>
            <Stack.Navigator screenOptions={{ headerShown: false }}>
              <Stack.Screen component={LoginRegisterPage} name='LoginRegisterPage'/> 
              <Stack.Screen component={SearchPage} name="SearchPage" />
              <Stack.Screen component={EventDetailsPage} name="EventDetails" />
              <Stack.Screen component={AccommodationPage} name="Accommodation" />
              <Stack.Screen component={AccommodationDetailsPage} name="AccommodationDetails"  />
              <Stack.Screen component={FlightsPage} name="Flights" />
              <Stack.Screen component={OutboundFlights} name="OutboundFlights"/>
              <Stack.Screen component={ReturnFlights} name="ReturnFlights"/>
              <Stack.Screen component={ConfirmFlights} name="ConfirmFlights"/>
            </Stack.Navigator>
          </NavigationContainer>
        </PaperProvider>
      </MenuProvider>
    </EventProvider>
  );
}
//  
export default registerRootComponent(App);