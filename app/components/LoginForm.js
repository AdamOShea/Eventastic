import React, {useState} from 'react';
import { StyleSheet } from 'react-native';
import FormContainer from './FormContainer';
import FormInput from './FormInput';
import FormSubmitButton from './FormSubmitButton';
import { login } from '../methods/login';
import {Alert} from 'react-native';

const LoginForm = () => {

  const [userInfo, setUserInfo] = useState({
    email: '',
    password: '',
    
  });

  const {email, password} = userInfo;

  const submitForm = () => {
    //isvalid
    console.log(userInfo);
    login(userInfo).then((response) => {
      console.log(response); // This will log the resolved message.
      
      if (response.message === "Signed in") {
        Alert.alert('Success', "Signed in");
      } else {
        Alert.alert('Error', response.message);
      }
    });
  }

  const handleOnChangeText = (value, fieldName) => {
    setUserInfo({...userInfo, [fieldName]: value});
  };


  return (
    <FormContainer>
        <FormInput value={email} onChangeText={(value) => handleOnChangeText(value, 'email')} autoCapitalize='none' title='Email' placeholder='email@google.com'></FormInput>
        <FormInput value={password} secureTextEntry onChangeText={(value) => handleOnChangeText(value, 'password')} autoCapitalize='none' title='Password' placeholder='*******'></FormInput>
        <FormSubmitButton onPress={submitForm} title='Login'></FormSubmitButton>
    </FormContainer>
  );
}

export default LoginForm;

const styles = StyleSheet.create({
    
})