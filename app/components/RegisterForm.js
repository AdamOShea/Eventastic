import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import FormContainer from './FormContainer';
import FormInput from './FormInput';
import FormSubmitButton from './FormSubmitButton';


const RegisterForm = () => {
  return (
    <FormContainer>
      <FormInput title='Username' placeholder='example123'></FormInput>
      <FormInput title='Email' placeholder='email@google.com'></FormInput>
      <FormInput title='Password' placeholder='*******'></FormInput>
      <FormInput title='Confirm Password' placeholder='*******'></FormInput>
      <FormSubmitButton title='Login'></FormSubmitButton>
    </FormContainer>
  );
}

export default RegisterForm;

const styles = StyleSheet.create({
    
})