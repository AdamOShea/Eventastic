import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

export default function SearchButton({ onPress, text }) {
  return (
    <TouchableOpacity style={styles.searchButton} onPress={onPress}>
      <Text style={styles.buttonText}>{text}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  searchButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 12,
    borderRadius: 10,
    marginTop: 30,
    marginBottom: 30,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold', textAlign: 'center' },
});
