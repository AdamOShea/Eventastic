import { ScrollView, StyleSheet, Text, TouchableWithoutFeedback, View, Dimensions, Animated } from 'react-native';
import React, { useEffect, useRef } from 'react';
import LoginHeader from './LoginHeader';
import LoginSelector from './LoginSelector';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';


const {width} = Dimensions.get('window')


export default function LoginRegisterPage({navigation}) {

  const animation = useRef(new Animated.Value(0)).current;
  const scrollView = useRef();
  const loginColourInterpolate = animation.interpolate({
    inputRange: [0, width],
    outputRange: ['#6785c7', 'rgba(27,27,51,0.4)']
  })

  const registerColourInterpolate = animation.interpolate({
    inputRange: [0, width],
    outputRange: ['rgba(27,27,51,0.4)', '#6785c7']
  })

  

  return (
        <View style={{flex: 1, paddingTop: 90, backgroundColor: 'white'}}>
          <View style={{height:160}}>
            <LoginHeader >
            </LoginHeader>
          </View>
          <View style={{flexDirection:'row', padding: 30}}>
            <LoginSelector backgroundColor={loginColourInterpolate} title='Login' onPress={() => scrollView.current.scrollTo({x: 0})}></LoginSelector>
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
            <LoginForm navigation = {navigation}></LoginForm>
            <ScrollView>
              <RegisterForm navigation = {navigation}></RegisterForm>
            </ScrollView>
          </ScrollView>
        </View>
        
  );
}