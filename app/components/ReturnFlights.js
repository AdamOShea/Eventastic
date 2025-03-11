import React from 'react';
import { View, FlatList, Text, StyleSheet } from 'react-native';
import FlightCard from '../components/FlightCard';

export default function ReturnFlights({ route }) {
  const { returnFlights } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Select a Return Flight</Text>
      
      {returnFlights.length > 0 ? (
        <FlatList
            data={returnFlights}
            keyExtractor={(item, index) => item.id || `flight_${index}`} // ✅ Ensure unique key
            renderItem={({ item }) => <FlightCard {...item} />}
        />
      
      ) : (
        <Text style={styles.noFlightsText}>No return flights available.</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
  },
  header: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  noFlightsText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: '#666',
  },
});
