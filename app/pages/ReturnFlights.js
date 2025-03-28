// Screen component for selecting return flights, displaying sorted flight options based on price, and navigating to confirmation screen after selection.
import React from 'react';
import { View, FlatList, Text, StyleSheet } from 'react-native';
import FlightCard from '../components/FlightCard';
import { useEvent } from '../components/EventContext';

export default function ReturnFlights({ route, navigation }) {
  const { returnFlights, returnDate } = route.params;
  const { selectedOutboundFlight, setSelectedReturnFlight } = useEvent();

  // Handles return flight selection and navigates to flight confirmation screen.
  const handleReturnFlightSelection = (selectedReturnFlight) => {
    setSelectedReturnFlight(selectedReturnFlight);
    navigation.navigate('ConfirmFlights');
  };

  // Parses numeric price values from flight data for accurate sorting.
  const parsePrice = (priceString) => {
    if (!priceString) return Infinity;
    const numberMatch = priceString.match(/[\d,]+(\.\d{1,2})?/);
    if (!numberMatch) return Infinity;
    return parseFloat(numberMatch[0].replace(/,/g, ''));
  };

  const sortedReturnFlights = [...returnFlights].sort(
    (a, b) => parsePrice(a.flightPrice) - parsePrice(b.flightPrice)
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Your Selected Outbound Flight</Text>
      <FlightCard {...selectedOutboundFlight} />

      <Text style={styles.header}>Select a Return Flight</Text>
      <Text style={styles.header}>Return Date: {returnDate}</Text>

      {sortedReturnFlights.length > 0 ? (
        <FlatList
          data={sortedReturnFlights}
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
    paddingTop: 50,
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
