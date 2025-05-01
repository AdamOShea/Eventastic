// User registration form component managing input states, validation, user registration, automatic login, and navigation upon successful registration.

import React, { useState, useRef } from 'react';
import { Alert } from 'react-native';
import FormContainer from './FormContainer';
import FormInput from './FormInput';
import FormSubmitButton from './FormSubmitButton';
import { register } from '../methods/register';
import { login } from '../methods/login';
import { StackActions } from '@react-navigation/native';
import { useUser } from "./UserContext";

const RegisterForm = ({ navigation }) => {
  const [userInfo, setUserInfo] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const { username, email, password, confirmPassword } = userInfo;

  const { setCurrentUser } = useUser();

  // Refs for inputs to navigate between fields
  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const confirmPasswordRef = useRef(null);

  // Updates the state based on input changes for registration fields.
  const handleOnChangeText = (value, fieldName) => {
    setUserInfo({ ...userInfo, [fieldName]: value });
  };

  // Handles form submission, user registration, and auto-login on successful registration.
  const submitForm = async () => {
    try {
      console.log("userInfo at submit:", userInfo); // Confirm values here explicitly
      const registerResponse = await register(userInfo);
      console.log("Register response:", registerResponse);
  
      if (registerResponse.message === "User created successfully") {
        
        const loginResponse = await login(userInfo);
        console.log("Login response after registration:", loginResponse);
  
        if (loginResponse.message === "Signed in") {
          setCurrentUser(loginResponse.user);
          navigation.dispatch(StackActions.replace('Tabs'));
        } else {
          Alert.alert('Login Error', loginResponse.message);
        }
      } else if (registerResponse.message === "User already exists") {
        Alert.alert('Error', 'User already exists. Please login instead.');
      } else {
        Alert.alert('Registration Error', registerResponse);
      }
    } catch (err) {
      console.error("Registration/Login error:", err);
      Alert.alert('Error', 'Something went wrong while registering or logging in.');
    }
  };
  
  

  return (
    <FormContainer>
      {/* Username Input */}
      <FormInput
        value={username}
        onChangeText={(value) => handleOnChangeText(value, 'username')}
        title="Username"
        placeholder="example123"
        returnKeyType="next"
        onSubmitEditing={() => emailRef.current?.focus()} // Move to next field
        blurOnSubmit={false}
      />

      {/* Email Input */}
      <FormInput
        ref={emailRef}
        value={email}
        onChangeText={(value) => handleOnChangeText(value, 'email')}
        autoCapitalize="none"
        title="Email"
        placeholder="email@google.com"
        returnKeyType="next"
        onSubmitEditing={() => passwordRef.current?.focus()} // Move to next field
        blurOnSubmit={false}
      />

      {/* Password Input */}
      <FormInput
        ref={passwordRef}
        value={password}
        onChangeText={(value) => handleOnChangeText(value, 'password')}
        secureTextEntry
        autoCapitalize="none"
        title="Password"
        placeholder="*******"
        returnKeyType="next"
        onSubmitEditing={() => confirmPasswordRef.current?.focus()} // Move to next field
        blurOnSubmit={false}
      />

      {/* Confirm Password Input */}
      <FormInput
        ref={confirmPasswordRef}
        value={confirmPassword}
        onChangeText={(value) => handleOnChangeText(value, 'confirmPassword')}
        secureTextEntry
        autoCapitalize="none"
        title="Confirm Password"
        placeholder="*******"
        returnKeyType="done"
        onSubmitEditing={submitForm} // Submit form on "Done"
      />

      {/* Submit Button */}
      <FormSubmitButton onPress={submitForm} title="Register" />
    </FormContainer>
  );
};

export default RegisterForm;
