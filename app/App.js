import { StatusBar } from 'expo-status-bar';
import { ScrollView, StyleSheet, Text, TouchableWithoutFeedback, View, Dimensions, Animated } from 'react-native';
import React, { useEffect, useRef } from 'react';
import axios from 'axios';
import LoginHeader from './components/LoginHeader';
import LoginSelector from './components/LoginSelector';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';


const {width} = Dimensions.get('window')


export default function App() {

  const animation = useRef(new Animated.Value(0)).current;
  const scrollView = useRef();
  const loginColourInterpolate = animation.interpolate({
    inputRange: [0, width],
    outputRange: ['rgba(32,69,41,1)', 'rgba(27,27,51,0.4)']
  })

  const registerColourInterpolate = animation.interpolate({
    inputRange: [0, width],
    outputRange: ['rgba(27,27,51,0.4)', 'rgba(32,69,41,1)']
  })

  

  return (
        <View style={{flex: 1, paddingTop: 90, backgroundColor: 'white'}}>
          <View style={{height:80}}>
            <LoginHeader heading='EireLive'>
            </LoginHeader>
          </View>
          <View style={{flexDirection:'row', padding: 30}}>
            <LoginSelector backgroundColor={loginColourInterpolate} title='login' onPress={() => scrollView.current.scrollTo({x: 0})}></LoginSelector>
            <LoginSelector backgroundColor={registerColourInterpolate} title='Register' onPress={() => scrollView.current.scrollToEnd()}></LoginSelector>
              
          </View>
          <ScrollView 
          ref={scrollView}
          horizontal 
          pagingEnabled 
          showsHorizontalScrollIndicator={false}
          scrollEventThrottle={16}
          onScroll={Animated.event([{nativeEvent: {contentOffset: {x: animation}}}], {useNativeDriver: false})}
          >
            <LoginForm></LoginForm>
            <ScrollView>
              <RegisterForm></RegisterForm>
            </ScrollView>
          </ScrollView>
        </View>
        
  );
}
  
const styles = StyleSheet.create({
  
})