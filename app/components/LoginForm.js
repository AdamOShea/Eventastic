import React from 'react';
import { View, Text, StyleSheet, Dimensions, TextInput } from 'react-native';
import FormContainer from './FormContainer';
import FormInput from './FormInput';
import FormSubmitButton from './FormSubmitButton';

const LoginForm = () => {
  return (
    <FormContainer>
        <FormInput title='Email' placeholder='email@google.com'></FormInput>
        <FormInput title='Password' placeholder='*******'></FormInput>
        <FormSubmitButton title='Login'></FormSubmitButton>
    </FormContainer>
  );
}

export default LoginForm;

const styles = StyleSheet.create({
    
})