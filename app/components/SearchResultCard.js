import React from 'react';
import { View, Text, StyleSheet, Image, } from 'react-native';
import { format } from 'date-fns';

export default function SearchResultCard({item}) {
  return (
    <View style={styles.card}>
      <Image source={ require( '../assets/eventastic.png')} style={styles.image} />
      <View style={styles.details}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.date}>{format(new Date(item.date), 'dd-LLL-yyyy')}</Text>
        <Text style={styles.location}>{item.eventlocation.trim()}, {item.venue}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    height: 150,
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
    marginVertical: 8,
    marginHorizontal: 16,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    alignItems: 'center',
  },
  image: {
    width: 70,
    height: 70,
    borderRadius: 8,
    marginRight: 10,
  },
  details: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  date: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  location: {
    fontSize: 14,
    color: '#888',
    marginTop: 2,
  },
});