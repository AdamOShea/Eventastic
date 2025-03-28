// Component rendering flight information as a card, including airline, price, departure/arrival times, and stops.


import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking } from 'react-native';

export default function FlightCard({
  flightAirline,
  flightPrice,
  flightDepartureTime,
  flightArrivalTime,
  flightArrivalAirport,
  flightArrivalCode,
  flightDepartureAirport,
  flightDepartureCode,
  flightDuration,
  flightStops,
  flightUrl,
  onPress
}) {

  // Formats flight time strings for display by removing unnecessary date details.
  const formatTime = (time) => {
    return time.split(" on ")[0];
  };

  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      {/* Airline & Price */}
      <View style={styles.header}>
        <Text style={styles.airline}>{flightAirline}</Text>
        <Text style={styles.price}>{flightPrice}</Text>
      </View>

      {/* Flight Details */}
      <View style={styles.flightDetails}>
        {/* Departure Info */}
        <View style={styles.flightInfo}>
          <Text style={styles.time}>{formatTime(flightDepartureTime)}</Text>
          <Text style={styles.airport}>
            {flightDepartureCode}
          </Text>
        </View>

        {/* Flight Duration */}
        <View style={styles.flightPath}>
          <Text style={styles.duration}>{flightDuration}</Text>
          <View style={styles.line} />
          <Text style={styles.stops}>{flightStops > 0 ? `${flightStops} stop(s)` : 'Direct'}</Text>
        </View>

        {/* Arrival Info */}
        <View style={styles.flightInfo}>
          <Text style={styles.time}>{formatTime(flightArrivalTime)}</Text>
          <Text style={styles.airport}>
            {flightArrivalCode}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    padding: 20,
    marginVertical: 10,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  airline: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  price: {
    fontSize: 18,
    fontWeight: '600',
    color: '#27ae60',
  },
  flightDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  flightInfo: {
    alignItems: 'center',
    flex: 1,
  },
  time: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#34495e',
  },
  airport: {
    fontSize: 12,
    color: '#7f8c8d',
    marginTop: 2,
  },
  flightPath: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  duration: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#7f8c8d',
    marginBottom: 2,
  },
  line: {
    width: 60,
    height: 2,
    backgroundColor: '#bdc3c7',
    marginVertical: 4,
  },
  stops: {
    fontSize: 12,
    color: '#7f8c8d',
  },
});
