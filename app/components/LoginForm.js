import React, {useState} from 'react';
import { View, Text, StyleSheet, Dimensions, TextInput } from 'react-native';
import FormContainer from './FormContainer';
import FormInput from './FormInput';
import FormSubmitButton from './FormSubmitButton';

const LoginForm = () => {

  const [userInfo, setUserInfo] = useState({
    password: '',
    email: ''
  });

  const {password, email} = userInfo;

  const submitForm = () => {
    //isvalid
    console.log(userInfo);
    login(userInfo);
  }

  const login = async (values) => {
    try {
      const res = await client.post('/login-user', {
      ...values
      });
      console.log(res.data);
    }catch (err) {
      console.error(err);
    }
  }

  return (
    <FormContainer>
        <FormInput value={email} onChangeText={(value) => handleOnChangeText(value, 'email')} title='Email' placeholder='email@google.com'></FormInput>
        <FormInput value={password} secureTextEntry onChangeText={(value) => handleOnChangeText(value, 'password')} title='Password' placeholder='*******'></FormInput>
        <FormSubmitButton onPress={submitForm} title='Login'></FormSubmitButton>
    </FormContainer>
  );
}

export default LoginForm;

const styles = StyleSheet.create({
    
})