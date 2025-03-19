import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import FlightCard from '../components/FlightCard';
import SearchButton from '../components/SearchButton';
import { useEvent } from './EventContext';

export default function ConfirmFlights({ navigation }) {
  const {
    selectedOutboundFlight,
    selectedReturnFlight,
    
  } = useEvent();

  const handleSaveFlights = () => {
    console.log("Flights saved:", selectedOutboundFlight, selectedReturnFlight);
    navigation.navigate('EventDetails'); // ✅ Navigate back to Event Details
  };



  return (
    <View style={styles.container}>
      <Text style={styles.header}>Your Selected Flights</Text>

      <Text style={styles.subHeader}>Outbound Flight on {selectedOutboundFlight.departure_time.split(" on ")[1]}</Text>
      <FlightCard {...selectedOutboundFlight} />

      <Text style={styles.subHeader}>Return Flight on {selectedReturnFlight.departure_time.split(" on ")[1]}</Text>
      <FlightCard {...selectedReturnFlight} />

      <SearchButton text="Save Flights & Return" onPress={handleSaveFlights}></SearchButton>
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
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  subHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 5,
  },
  saveButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    borderRadius: 10,
    marginTop: 20,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
