import React from 'react';
import { View, FlatList, Text, StyleSheet } from 'react-native';
import FlightCard from '../components/FlightCard';

export default function ReturnFlights({ route, navigation }) {
  const { returnFlights, returnValues, selectedOutboundFlight, event } = route.params;

  const handleFlightSelection = (selectedReturnFlight) => {
    navigation.navigate('ConfirmFlights', {
      selectedOutboundFlight,
      selectedReturnFlight,
      event
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Your Selected Outbound Flight</Text>
      <FlightCard {...selectedOutboundFlight} /> 

      <Text style={styles.header}>Select a Return Flight</Text>

      <Text style={styles.header}>
        {returnValues.departureDate ? String(returnValues.departureDate) : "No Date Available"}
      </Text>

      {returnFlights.length > 0 ? (
        <FlatList
          data={[...returnFlights]} 
          keyExtractor={(item, index) => item.id || `flight_${index}`} 
          renderItem={({ item }) => (
            <FlightCard {...item} onPress={() => handleFlightSelection(item)} />
          )}
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
    paddingTop: 50
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
