import React, { useState } from 'react';
import { View, FlatList, Text, StyleSheet } from 'react-native';
import FlightCard from '../components/FlightCard';
import { fetchFlightsAPI } from '../methods/fetchFlights';

export default function OutboundFlights({ route, navigation }) {
  const { outboundFlights, departureAirport, arrivalAirport, departureDate, returnDate, event } = route.params;
  const [loading, setLoading] = useState(false);

  // ✅ Create a local copy of `outboundFlights` to prevent modifying `route.params`
  const sortedFlights = [...outboundFlights].sort((a, b) => {
    const timeA = new Date(`1970-01-01 ${a.departure_time.split(" on ")[0]}`);
    const timeB = new Date(`1970-01-01 ${b.departure_time.split(" on ")[0]}`);
    return timeA - timeB;
  });

  const fetchReturnFlights = async (selectedFlight) => {
    setLoading(true);

    const returnValues = {
      departureAirport: arrivalAirport, // Swapped for return trip
      arrivalAirport: departureAirport,
      departureDate: returnDate,
      direction: "Return",
      apis: ["googleFlights"],
    };

    console.log("🚀 Fetching return flights with values:", returnValues);

    const returnApiResults = await fetchFlightsAPI(returnValues);
    setLoading(false);

    const returnFlights = [...(returnApiResults.results.find(result => result.api === "googleFlights")?.data || [])];

    if (returnFlights.length > 0) {
      navigation.navigate('ReturnFlights', {
        returnFlights,
        returnValues,
        selectedOutboundFlight: { ...selectedFlight }, 
        event
      });
    } else {
      alert('No return flights found.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Traveling from {departureAirport} to {arrivalAirport}</Text>
      <Text style={styles.header}>On {departureDate}</Text>
      <Text style={styles.header}>Select an Outbound Flight</Text>
      <FlatList
        data={sortedFlights} // ✅ Using a copy of the array
        keyExtractor={(item, index) => item.id || `flight_${index}`} // ✅ Ensure unique key
        renderItem={({ item }) => (
          <FlightCard
            {...item}
            onPress={() => {
                fetchReturnFlights(item);
                console.log("🔵 Selected Flight:", item); // ✅ Debugging log
            }}
          />
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
