import React, { useState, useRef } from 'react';
import { StyleSheet, TextInput, Alert } from 'react-native';
import FormContainer from './FormContainer';
import FormInput from './FormInput';
import FormSubmitButton from './FormSubmitButton';
import { login } from '../methods/login';
import { StackActions } from '@react-navigation/native';

const LoginForm = ({ navigation }) => {
  const [userInfo, setUserInfo] = useState({
    email: 'test@gmail.com',
    password: 'password',
  });

  const { email, password } = userInfo;

  // Refs for inputs
  const passwordRef = useRef(null);

  const submitForm = async () => {
    console.log(userInfo);
    login(userInfo).then((response) => {
      console.log(response);

      if (response.message === "Signed in") {
        Alert.alert('Success', "Signed in");
        setUserInfo({ email: '', password: '' }); // Reset form fields
        navigation.dispatch(
          StackActions.replace('SearchPage', {
            user: response.user
          })
        );
      } else { 
        Alert.alert('Error', response.message);
      }
    });
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
