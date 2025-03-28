// Screen component for selecting outbound flights, displaying flight options sorted by price, and initiating search for corresponding return flights upon selection.
import React, { useState } from 'react';
import { View, FlatList, Text, StyleSheet, ActivityIndicator } from 'react-native';
import FlightCard from '../components/FlightCard';
import { fetchFlightsAPI } from '../methods/fetchFlights';
import { useEvent } from '../components/EventContext';

export default function OutboundFlights({ route, navigation }) {
  const { outboundFlights, departureAirport, arrivalAirport, returnDate, direct } = route.params;
  const { setSelectedOutboundFlight } = useEvent();
  const [loading, setLoading] = useState(false);
  const [selectedFlightId, setSelectedFlightId] = useState(null);

  // Parses numeric flight price from string for sorting purposes.
  const parsePrice = (priceString) => {
    if (!priceString) return Infinity;
    const numberMatch = priceString.match(/[\d,]+(\.\d{1,2})?/);
    if (!numberMatch) return Infinity;
    return parseFloat(numberMatch[0].replace(/,/g, ''));
  };

  // Fetches return flights based on selected outbound flight and navigates to return flights selection screen.
  const fetchReturnFlights = async (selectedFlight) => {
    setLoading(true);
    setSelectedFlightId(selectedFlight.id || selectedFlight.flightDepartureTime); // fallback key
    setSelectedOutboundFlight(selectedFlight);

    const returnValues = {
      departureAirport: arrivalAirport,
      arrivalAirport: departureAirport,
      departureDate: returnDate,
      direction: "Return",
      apis: ["googleFlights"],
      direct: direct
    };

    const returnApiResults = await fetchFlightsAPI(returnValues);
    setLoading(false);
    setSelectedFlightId(null);

    const returnFlights = [...(returnApiResults.results.find(result => result.api === "googleFlights")?.data || [])];

    if (returnFlights.length > 0) {
      navigation.navigate('ReturnFlights', {
        returnFlights,
        returnDate,
      });
    } else {
      alert('No return flights found.');
    }
  };

  const sortedFlights = [...outboundFlights].sort(
    (a, b) => parsePrice(a.flightPrice) - parsePrice(b.flightPrice)
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Select an Outbound Flight</Text>

      <FlatList
        data={sortedFlights}
        keyExtractor={(item, index) => item.id || `flight_${index}`}
        renderItem={({ item }) => (
          <View>
            <FlightCard
              {...item}
              disabled={loading}
              loading={loading && selectedFlightId === (item.id || item.flightDepartureTime)}
              onPress={() => fetchReturnFlights(item)}
            />
          </View>
        )}
      />

      {loading && (
        <View style={styles.spinnerContainer}>
          <ActivityIndicator size="large" color="#6785c7" />
          <Text style={styles.loadingText}>Loading return flights...</Text>
        </View>
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
  spinnerContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
});
