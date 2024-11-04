import React from 'react';
import { View, Text, StyleSheet, Dimensions, TextInput } from 'react-native';
import FormContainer from './FormContainer';

const FormInput = ({placeholder, title}) => {
  return (
    <>
        <Text style={{ fontWeight: 'bold' }}>{title}</Text>
        <TextInput placeholder={placeholder} style={styles.input}></TextInput>
    </>
  );
}

export default FormInput;

const styles = StyleSheet.create({
    input: {borderWidth: 1, borderColor: 'black', height: 35, borderRadius: 8, fontSize: 16, paddingLeft:10, marginBottom: 20}
})