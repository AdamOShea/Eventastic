import React from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';


const FormSubmitButton = ({title, onPress}) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.container}>
        <Text style={{fontSize: 18, color: 'white'}}>{title}</Text>
    </TouchableOpacity>
  );
}

export default FormSubmitButton;

const styles = StyleSheet.create({
    container: {
        height: 45,
        backgroundColor: 'rgba(32,69,41,1)',
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center'
    }
})