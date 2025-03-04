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
import AccommodationPage from "./components/AcommodationPage";
import AccommodationDetailsPage from "./components/AccommodationDetailsPage";
import FlightsPage from "./components/FlightsPage";


enableScreens();

const Stack = createStackNavigator();

function App() {

  return (
    <MenuProvider>
      <PaperProvider>
        <NavigationContainer>
          <Stack.Navigator screenOptions={{ headerShown: false }}>
            
            <Stack.Screen component={SearchPage} name="SearchPage" />
            <Stack.Screen component={EventDetailsPage} name="EventDetails" />
            <Stack.Screen component={AccommodationPage} name="Accommodation" />
            <Stack.Screen component={AccommodationDetailsPage} name="AccommodationDetails"  />
            <Stack.Screen component={FlightsPage} name="Flights" />
          </Stack.Navigator>
        </NavigationContainer>
      </PaperProvider>
    </MenuProvider>
  );
}
//  <Stack.Screen component={LoginRegisterPage} name='LoginRegisterPage'/> 
export default registerRootComponent(App);