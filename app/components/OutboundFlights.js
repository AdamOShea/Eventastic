import React, { useState } from 'react';
import { View, FlatList, Text, StyleSheet } from 'react-native';
import FlightCard from '../components/FlightCard';
import { fetchFlightsAPI } from '../methods/fetchFlights';
import { useEvent } from './EventContext'; // ✅ Import context

export default function OutboundFlights({ route, navigation }) {
  const { outboundFlights, departureAirport, arrivalAirport, returnDate } = route.params;
  const { setSelectedOutboundFlight } = useEvent(); // ✅ Store selected outbound flight in context
  const [loading, setLoading] = useState(false);

  const fetchReturnFlights = async (selectedFlight) => {
    setLoading(true);
    setSelectedOutboundFlight(selectedFlight); // ✅ Save selected flight

    const returnValues = {
      departureAirport: arrivalAirport, // Swapping for return trip
      arrivalAirport: departureAirport,
      departureDate: returnDate,
      direction: "Return",
      apis: ["googleFlights"]
    };

    console.log("🚀 Fetching return flights with values:", returnValues);

    const returnApiResults = await fetchFlightsAPI(returnValues);
    setLoading(false);

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

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Select an Outbound Flight</Text>
      <FlatList
        data={[...outboundFlights].sort((a, b) => {
          return new Date(`1970-01-01 ${a.departure_time.split(" on ")[0]}`) - 
                 new Date(`1970-01-01 ${b.departure_time.split(" on ")[0]}`);
        })}
        keyExtractor={(item, index) => item.id || `flight_${index}`}
        renderItem={({ item }) => (
          <FlightCard {...item} onPress={() => fetchReturnFlights(item)} />
        )}
      />
      {loading && <Text style={styles.loadingText}>Loading return flights...</Text>}
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
  loadingText: {
    textAlign: 'center',
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
});
