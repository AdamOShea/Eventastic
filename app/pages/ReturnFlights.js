import React from 'react';
import { View, FlatList, Text, StyleSheet } from 'react-native';
import FlightCard from '../components/FlightCard';
import { useEvent } from '../components/EventContext'; //  Import context

export default function ReturnFlights({ route, navigation }) {
  const { returnFlights, returnDate } = route.params;
  const { selectedOutboundFlight, setSelectedReturnFlight } = useEvent(); //  Store selected return flight

  const handleReturnFlightSelection = (selectedReturnFlight) => {
    setSelectedReturnFlight(selectedReturnFlight); //  Save selected return flight
    navigation.navigate('ConfirmFlights'); //  Navigate to confirmation screen
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Your Selected Outbound Flight</Text>
      <FlightCard {...selectedOutboundFlight} />

      <Text style={styles.header}>Select a Return Flight</Text>
      <Text style={styles.header}>Return Date: {returnDate}</Text>

      {returnFlights.length > 0 ? (
        <FlatList
          data={[...returnFlights]} //  Ensure it's a new array
          keyExtractor={(item, index) => item.id || `flight_${index}`}
          renderItem={({ item }) => (
            <FlightCard {...item} onPress={() => handleReturnFlightSelection(item)} />
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
