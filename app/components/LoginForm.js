import React, { useState, useRef } from 'react';
import { StyleSheet, TextInput, Alert } from 'react-native';
import FormContainer from './FormContainer';
import FormInput from './FormInput';
import FormSubmitButton from './FormSubmitButton';
import { login } from '../methods/login';
import { StackActions } from '@react-navigation/native';
import { useUser } from "./UserContext";


const LoginForm = ({ navigation }) => {
  const [userInfo, setUserInfo] = useState({
    email: 'test@gmail.com',
    password: 'password',
  });

  const { email, password } = userInfo;
  const { setCurrentUser } = useUser();

  // Refs for inputs
  const passwordRef = useRef(null);

  const submitForm = async () => {
    try {
      const response = await login(userInfo);
      console.log("Login response:", response);
  
      if (response.message === "Signed in") {
        setUserInfo({ email: '', password: '' });
        setCurrentUser(response.user);
        navigation.dispatch(StackActions.replace('Tabs'));
      } else {
        Alert.alert('Error', response.message);
      }
    } catch (err) {
      console.error("❌ Login error:", err);
      Alert.alert('Error', 'Something went wrong while logging in.');
    }
  };
  

  const handleOnChangeText = (value, fieldName) => {
    setUserInfo({ ...userInfo, [fieldName]: value });
  };

  return (
    <FormContainer>
      {/* Email Input */}
      <FormInput
        value={email}
        onChangeText={(value) => handleOnChangeText(value, 'email')}
        autoCapitalize='none'
        title='Email'
        placeholder='email@google.com'
        returnKeyType="next"
        onSubmitEditing={() => passwordRef.current?.focus()} // Move to password input
        blurOnSubmit={false}
      />

      {/* Password Input */}
      <FormInput
        ref={passwordRef}
        value={password}
        secureTextEntry
        onChangeText={(value) => handleOnChangeText(value, 'password')}
        autoCapitalize='none'
        title='Password'
        placeholder='*******'
        returnKeyType="done"
        onSubmitEditing={submitForm} // Submit form on done
      />

      {/* Submit Button */}
      <FormSubmitButton onPress={submitForm} title='Login' />
    </FormContainer>
  );
};

export default LoginForm;

const styles = StyleSheet.create({});
