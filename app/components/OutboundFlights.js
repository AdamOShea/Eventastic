import React, { useState } from 'react';
import { View, FlatList, Text, StyleSheet } from 'react-native';
import FlightCard from '../components/FlightCard';
import { fetchFlightsAPI } from '../methods/fetchFlights';

export default function OutboundFlights({ route, navigation }) {
  const { outboundFlights, departureAirport, arrivalAirport, returnDate } = route.params;
  const [returnFlights, setReturnFlights] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchReturnFlights = async (selectedFlight) => {
    setLoading(true);

    const returnValues = {
      departureAirport: arrivalAirport,
      arrivalAirport: departureAirport,
      departureDate: returnDate,
      direction: "Return",
      apis: ["googleFlights"]
    };

    console.log("🚀 Fetching return flights with values:", returnValues);

    const returnApiResults = await fetchFlightsAPI(returnValues);

    setLoading(false);

    if (returnApiResults?.results?.length) {
      setReturnFlights(returnApiResults.results);
      navigation.navigate('ReturnFlights', { returnFlights: returnDate.toISOString() });
    } else {
      alert('No return flights found.');
    }
  };

  const extractTime = (departureTime) => {
    // Extract only the "4:45 PM" part
    const timeString = departureTime.split(" on ")[0].trim();
    
    // Convert to 24-hour format
    return convertTo24Hour(timeString);
  };
  
  const convertTo24Hour = (timeString) => {
    let [time, modifier] = timeString.split(" "); // Split "4:45 PM" -> ["4:45", "PM"]
    let [hours, minutes] = time.split(":").map(Number); // Split "4:45" -> [4, 45]
  
    if (modifier === "PM" && hours !== 12) {
      hours += 12; // Convert PM times (except 12 PM)
    } else if (modifier === "AM" && hours === 12) {
      hours = 0; // Convert 12 AM to 00:00
    }
  
    return hours * 60 + minutes; // Return total minutes for correct sorting
  };
  

  return (
    <View style={styles.container}>
    <Text style={styles.header}>Traveling from {departureAirport} to {arrivalAirport} </Text> 
      <Text style={styles.header}>Select an Outbound Flight</Text>
      <FlatList
        data={[...outboundFlights].sort((a, b) => {
            const timeA = extractTime(a.departure_time);
            const timeB = extractTime(b.departure_time);

            return timeA - timeB; // Sort in ascending order (earliest first)
        })}
        keyExtractor={(item, index) => item.id || `flight_${index}`} // ✅ Ensure unique key
        renderItem={({ item }) => (
            <FlightCard
            {...item}
            onPress={() => fetchReturnFlights(item)}
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
