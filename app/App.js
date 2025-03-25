import "react-native-url-polyfill/auto";
import React, { useEffect } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import { registerRootComponent } from 'expo';
import 'react-native-gesture-handler';
import { enableScreens } from 'react-native-screens';
import { MenuProvider } from 'react-native-popup-menu';
import { Provider as PaperProvider } from 'react-native-paper';
import { PermissionsAndroid, Platform } from 'react-native';
import { UserProvider } from "./components/UserContext";
import { EventProvider } from "./components/EventContext";
import { FiltersProvider } from "./components/FiltersContext";

import LoginRegisterPage from './pages/LoginRegisterPage';

import BottomTabNavigator from "./components/BottomTabNavigator";

enableScreens();

const Stack = createStackNavigator();

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

function App() {
  useEffect(() => {
    requestLocationPermission();
  }, []);

  return (
    <UserProvider>
      <EventProvider>
        <FiltersProvider>
          <MenuProvider>
            <PaperProvider>
              <NavigationContainer>
                <Stack.Navigator screenOptions={{ headerShown: false }}>
                  <Stack.Screen name="LoginRegisterPage" component={LoginRegisterPage} />
                  <Stack.Screen name="Tabs" component={BottomTabNavigator} />
                </Stack.Navigator>
              </NavigationContainer>
            </PaperProvider>
          </MenuProvider>
        </FiltersProvider>
      </EventProvider>
    </UserProvider>
  );
}

export default registerRootComponent(App);
