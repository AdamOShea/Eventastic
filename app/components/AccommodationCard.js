import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

export default function AccommodationCard({ navigation, id, name, price, rating, details }) {
  return (
    <TouchableOpacity onPress={() => navigation.navigate('AccommodationDetails', { name, price, rating, details })}>
      <View style={styles.card}>
        <Text style={styles.title}>{name}</Text>
        <Text>{price}</Text>
        <Text>{rating}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#f8f8f8',
    padding: 15,
    borderRadius: 10,
    marginTop: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    alignItems: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});
