// Reusable text input component for forms, optionally displaying a label/title.


import React from 'react';
import { View, Text, StyleSheet, TextInput } from 'react-native';

const FormInput = React.forwardRef(({ placeholder, title, ...props }, ref) => {
  return (
    <View style={styles.container}>
      {title && <Text style={styles.label}>{title}</Text>}
      <TextInput
        {...props}
        ref={ref}
        placeholder={placeholder}
        style={styles.input}
      />
    </View>
  );
});

export default FormInput;

const styles = StyleSheet.create({
  container: {

  },
  label: {
    fontWeight: 'bold',
    marginBottom: 6,
  },
  input: { borderWidth: 1, borderColor: 'black', height: 45, borderRadius: 8, fontSize: 16, paddingLeft:10, marginBottom: 20}
});
