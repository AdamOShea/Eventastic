import React from 'react';
import { View, Text, StyleSheet, Dimensions, TextInput } from 'react-native';
import FormContainer from './FormContainer';

const FormInput = props => {
  const { placeholder, title } = props;
  return (
    <>
        <Text style={{ fontWeight: 'bold' }}>{title}</Text>
        <TextInput {...props} placeholder={placeholder} style={styles.input}></TextInput>
    </>
  );
}

export default FormInput;

const styles = StyleSheet.create({
    input: { borderWidth: 1, borderColor: 'black', height: 45, borderRadius: 8, fontSize: 16, paddingLeft:10, marginBottom: 20}
})