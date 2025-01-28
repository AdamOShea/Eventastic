import React, { useEffect, useRef } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer} from '@react-navigation/native';
import LoginRegisterPage from './components/LoginRegisterPage';
import SearchPage from './components/SearchPage';

const Stack = createStackNavigator();

export default function App() {

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{headerShown: false}}>
        <Stack.Screen component={LoginRegisterPage} name='LoginRegisterPage'/>
        <Stack.Screen component={SearchPage} name='SearchPage'/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}
  
