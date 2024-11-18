import React, {useState} from 'react';
import FormContainer from './FormContainer';
import FormInput from './FormInput';
import FormSubmitButton from './FormSubmitButton';
import {register} from '../methods/register';
import {Alert} from 'react-native';
import { login } from '../methods/login';
import { StackActions } from '@react-navigation/native';



const RegisterForm = ({navigation}) => {
  const [userInfo, setUserInfo] = useState({
    username: '',
    password: '',
    confirmPassword: '',
    email: ''
  });

  const {username, password, confirmPassword, email} = userInfo;

  const handleOnChangeText = (value, fieldName) => {
    setUserInfo({...userInfo, [fieldName]: value});
  };

  const submitForm = async () => {
    //isvalid
    console.log(userInfo);
    register(userInfo).then(async (response) => {
      console.log(response); // This will log the resolved message.
      
      if (response.message === "User created successfully") {
        Alert.alert('Success', "Registered: " + username);
        const loginResponse = await login(email, password);
        navigation.dispatch(
          StackActions.replace('SearchPage', {
            user: loginResponse.user
          })
        );
      } else {
        Alert.alert('Error', response);
      }
    });
    
    
  }

  return (
    <FormContainer>
      <FormInput value={username} onChangeText={(value) => handleOnChangeText(value, 'username')} title='Username' placeholder='example123'></FormInput>
      <FormInput value={email} onChangeText={(value) => handleOnChangeText(value, 'email')} autoCapitalize='none' title='Email' placeholder='email@google.com'></FormInput>
      <FormInput value={password} onChangeText={(value) => handleOnChangeText(value, 'password')} secureTextEntry autoCapitalize='none' title='Password' placeholder='*******'></FormInput>
      <FormInput value={confirmPassword} onChangeText={(value) => handleOnChangeText(value, 'confirmPassword')} secureTextEntry autoCapitalize='none' title='Confirm Password' placeholder='*******'></FormInput>
      <FormSubmitButton onPress={submitForm} title='Register'></FormSubmitButton>
    </FormContainer>
  );
}

export default RegisterForm;
