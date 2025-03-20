import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import DatePicker from 'react-native-neat-date-picker';
import { format } from 'date-fns';
import NoImageInfoContainer from '../components/NoImageInfoContainer';
import SearchButton from '../components/SearchButton';
import FormInput from '../components/FormInput';
import { fetchFlightsAPI } from '../methods/fetchFlights';
import { useEvent, selectedAccommodation } from '../components/EventContext'; 


export default function FlightsPage({ navigation }) {
  const { selectedEvent } = useEvent(); 

  // Ensure the event exists before using its data
  if (!selectedEvent) {
    console.warn("No event selected. Redirecting to search page...");
    navigation.navigate("SearchPage");
    return null; // Prevent rendering if event is missing
  }

  const eventDate = new Date(selectedEvent.date);
  const today = new Date();
  const tomorrow = new Date(today.getTime() + 86400000);

  const [departureAirport, setDepartureAirport] = useState('');
  const [arrivalAirport, setArrivalAirport] = useState(selectedEvent.eventlocation); // Autofill from event
  const [departureDate, setDepartureDate] = useState(eventDate);
  const [returnDate, setReturnDate] = useState(new Date(eventDate.getTime() + 86400000));
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [loading, setLoading] = useState(false);

  const searchOutboundFlights = async () => {
    if (!departureAirport || !arrivalAirport) {
      alert('Please enter both departure and arrival airports.');
      return;
    }

    setLoading(true);

    const outboundValues = {
      departureAirport,
      arrivalAirport,
      departureDate: format(departureDate, 'yyyy-MM-dd'),
      direction: "Outbound",
      apis: ["googleFlights"]
    };

    console.log("🚀 Fetching outbound flights with values:", outboundValues);

    const outboundApiResults = await fetchFlightsAPI(outboundValues);
    setLoading(false);

    let outboundFlights = outboundApiResults.results.find(result => result.api === "googleFlights")?.data || [];

    if (outboundFlights.length > 0) {
      navigation.navigate('OutboundFlights', {
        outboundFlights,
        departureAirport,
        arrivalAirport,
        departureDate: format(departureDate, 'yyyy-MM-dd'),
        returnDate: format(returnDate, 'yyyy-MM-dd'), // Fix: Pass correct return date
      });
    } else {
      alert('No outbound flights found.');
    }
  };

  return (
    <View style={styles.container}>
      {/* Event Information */}
      <NoImageInfoContainer event={selectedEvent} />

      {/* ✅ Saved Accommodation Information */}
      {selectedAccommodation && (
        <View style={styles.accommodationContainer}>
          <Text style={styles.accomTitle}>📍 Your Saved Accommodation</Text>
          <Text style={styles.accomText}><Text style={styles.bold}>Name:</Text> {selectedAccommodation.name}</Text>
          <Text style={styles.accomText}><Text style={styles.bold}>Location:</Text> {selectedAccommodation.location}</Text>
          <Text style={styles.accomText}><Text style={styles.bold}>Check-In:</Text> {format(new Date(selectedAccommodation.checkIn), 'dd-MMM-yyyy')}</Text>
          <Text style={styles.accomText}><Text style={styles.bold}>Check-Out:</Text> {format(new Date(selectedAccommodation.checkOut), 'dd-MMM-yyyy')}</Text>
        </View>
      )}

      {/* Departure Airport Input */}
      <FormInput
        value={departureAirport}
        onChangeText={(value) => setDepartureAirport(value)}
        title="Departure Airport"
        placeholder="Enter airport or location (JFK/New York)"
      />

      {/* Arrival Airport Input (Autofilled but editable) */}
      <FormInput
        value={arrivalAirport}
        onChangeText={(value) => setArrivalAirport(value)}
        title="Arrival Airport"
        placeholder="Enter airport or location (Gatwick/London)"
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
      <SearchButton text="Search Flights" onPress={searchOutboundFlights} />

      {/* Loading Indicator */}
      {loading && <Text style={styles.loadingText}>Loading flights...</Text>}
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
