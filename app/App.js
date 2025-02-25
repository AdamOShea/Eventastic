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


enableScreens();

const Stack = createStackNavigator();

function App() {

  return (
    <MenuProvider>
      <PaperProvider>
        <NavigationContainer>
          <Stack.Navigator screenOptions={{ headerShown: false }}>

            <Stack.Screen component={SearchPage} name="SearchPage" />
          </Stack.Navigator>
        </NavigationContainer>
      </PaperProvider>
    </MenuProvider>
  );
}
//  <Stack.Screen component={LoginRegisterPage} name='LoginRegisterPage'/> 
export default registerRootComponent(App);