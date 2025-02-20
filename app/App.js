import React, { useEffect, useRef } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer} from '@react-navigation/native';
import LoginRegisterPage from './components/LoginRegisterPage';
import SearchPage from './components/SearchPage';
import { registerRootComponent } from 'expo';
import 'react-native-gesture-handler';
import {enableScreens} from 'react-native-screens';

enableScreens();

const Stack = createStackNavigator();

function App() {

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{headerShown: false}}>
        
        <Stack.Screen component={SearchPage} name='SearchPage'/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}
//  <Stack.Screen component={LoginRegisterPage} name='LoginRegisterPage'/> 
export default registerRootComponent(App);