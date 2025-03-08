import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, ActivityIndicator } from 'react-native';
import DatePicker from 'react-native-neat-date-picker';
import { format } from 'date-fns';
import NoImageInfoContainer from './NoImageInfoContainer';
import SearchButton from '../components/SearchButton';
import FlightCard from '../components/FlightCard';
import FormInput from '../components/FormInput';
import { fetchFlightsAPI } from '../methods/fetchFlights';

export default function FlightsPage({ route, navigation }) {
  const { event, savedAccommodation } = route.params; // ✅ Check for saved accommodation

  const eventDate = new Date(event.date);
  const today = new Date();
  const tomorrow = new Date(today.getTime() + 86400000);

  const [departureAirport, setDepartureAirport] = useState('');
  const [departureDate, setDepartureDate] = useState(eventDate);
  const [returnDate, setReturnDate] = useState(new Date(eventDate.getTime() + 86400000));
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchFlights = async () => {
    if (!departureAirport) {
      alert('Please enter a departure airport.');
      return;
    }

    setLoading(true);
    setFlights([]); // Clear existing list before fetching

    const values = {
      departureAirport,
      destinationAirport: event.eventlocation,
      departureDate: format(departureDate, 'yyyy-MM-dd'),
      returnDate: format(returnDate, 'yyyy-MM-dd'),
    };

    console.log("🚀 Fetching flights with values:", values);

    const apiResults = await fetchFlightsAPI(values);

    if (apiResults?.results) {
      const fetchedFlights = apiResults.results.map((flight, index) => ({
        id: flight.flight_id ? flight.flight_id.toString() : `flight_${index}`,
        airline: flight.airline,
        price: `${flight.currency_symbol}${flight.price}`,
        departureTime: flight.departure_time,
        arrivalTime: flight.arrival_time,
        duration: flight.duration,
        stops: flight.stops,
        bookingUrl: flight.booking_url,
      }));

      setFlights(fetchedFlights);
    } else {
      console.log("❌ No flights found.");
    }

    setLoading(false);
  };

  return (
    <View style={styles.container}>
      {/* Event Information */}
      <NoImageInfoContainer event={event} />

      {/* ✅ Saved Accommodation Information */}
      {savedAccommodation && (
        <View style={styles.accommodationContainer}>
          <Text style={styles.accomTitle}>📍 Your Saved Accommodation</Text>
          <Text style={styles.accomText}><Text style={styles.bold}>Name:</Text> {savedAccommodation.name}</Text>
          <Text style={styles.accomText}><Text style={styles.bold}>Location:</Text> {savedAccommodation.location}</Text>
          <Text style={styles.accomText}><Text style={styles.bold}>Check-In:</Text> {format(new Date(savedAccommodation.checkIn), 'dd-MMM-yyyy')}</Text>
          <Text style={styles.accomText}><Text style={styles.bold}>Check-Out:</Text> {format(new Date(savedAccommodation.checkOut), 'dd-MMM-yyyy')}</Text>
        </View>
      )}

      {/* Departure Airport Input */}
      <FormInput
        value={departureAirport}
        onChangeText={(value) => setDepartureAirport(value)}
        title="Departure Airport"
        placeholder="Enter departure airport code (e.g., DUB)"
      />

      {/* Date Picker */}
      <TouchableOpacity style={styles.dateButton} onPress={() => setShowDatePicker(true)}>
        <Text style={styles.buttonText}>
          {format(departureDate, 'dd-MMM-yyyy')} → {format(returnDate, 'dd-MMM-yyyy')}
        </Text>
      </TouchableOpacity>

      <DatePicker
        isVisible={showDatePicker}
        mode="range"
        minDate={tomorrow}
        startDate={departureDate}
        endDate={returnDate}
        onConfirm={(range) => {
          setDepartureDate(new Date(range.startDate));
          setReturnDate(new Date(range.endDate));
          setShowDatePicker(false);
        }}
        onCancel={() => setShowDatePicker(false)}
      />

      {/* Search Button */}
      <SearchButton text="Search Flights" onPress={fetchFlights} />

      {/* Loading Indicator */}
      {loading && <Text style={styles.loadingText}>Loading flights...</Text>}

      {/* Flight List */}
      <FlatList
        data={flights}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <FlightCard navigation={navigation} {...item} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
    paddingHorizontal: 15,
  },
  dateButton: {
    width: '100%',
    backgroundColor: '#6785c7',
    paddingVertical: 12,
    borderRadius: 10,
    marginVertical: 15,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  loadingText: {
    textAlign: 'center',
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  accommodationContainer: {
    backgroundColor: '#f5f5f5',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
  },
  accomTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  accomText: {
    fontSize: 14,
    color: '#333',
    marginBottom: 3,
  },
  bold: {
    fontWeight: 'bold',
  },
});
