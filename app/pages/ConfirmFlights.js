import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import FlightCard from '../components/FlightCard';
import SearchButton from '../components/SearchButton';
import { useEvent } from '../components/EventContext';

export default function ConfirmFlights({ navigation }) {
  const {
    selectedOutboundFlight,
    selectedReturnFlight,
  } = useEvent();

  const handleSaveFlights = () => {
    console.log("Flights saved:", selectedOutboundFlight, selectedReturnFlight);
    navigation.navigate('EventDetails'); // Navigate back to Event Details
  };

  const getNumericPrice = (price) => {
    if (!price) return 0;
    const parsed = parseFloat(String(price).replace(/[^0-9.]/g, ''));
    return isNaN(parsed) ? 0 : parsed;
  };

  const totalPrice =
    getNumericPrice(selectedOutboundFlight?.flightPrice) +
    getNumericPrice(selectedReturnFlight?.flightPrice);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Your Selected Flights</Text>

      <Text style={styles.subHeader}>
        Outbound Flight on {selectedOutboundFlight.flightDepartureTime.split(" on ")[1]}
      </Text>
      <FlightCard {...selectedOutboundFlight} />

      <Text style={styles.subHeader}>
        Return Flight on {selectedReturnFlight.flightDepartureTime.split(" on ")[1]}
      </Text>
      <FlightCard {...selectedReturnFlight} />

      {/* ✨ Total Price Section */}
      <View style={styles.totalBox}>
        <Text style={styles.totalLabel}>Estimated Total Price</Text>
        <Text style={styles.totalPrice}>€{totalPrice.toFixed(2)}</Text>
      </View>

      <SearchButton text="Save Flights & Return" onPress={handleSaveFlights} />
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
  totalBox: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginVertical: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#444',
  },
  totalPrice: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#27ae60',
    marginTop: 5,
  },
});
