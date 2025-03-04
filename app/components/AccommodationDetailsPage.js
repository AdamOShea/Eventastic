import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

export default function AccommodationDetailsPage({ route }) {
  const { name, price, rating, details } = route.params;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>{name}</Text>
      <Text style={styles.detail}><Text style={styles.bold}>Price:</Text> {price}</Text>
      <Text style={styles.detail}><Text style={styles.bold}>Rating:</Text> {rating}</Text>
      <Text style={styles.detail}><Text style={styles.bold}>Details:</Text> {details || 'No additional details provided.'}</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  detail: {
    fontSize: 16,
    marginBottom: 8,
    width: '100%',
  },
  bold: {
    fontWeight: 'bold',
  },
});
