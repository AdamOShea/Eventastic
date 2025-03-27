import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Switch, ActivityIndicator } from 'react-native';

import DatePicker from 'react-native-neat-date-picker';
import { format } from 'date-fns';
import NoImageInfoContainer from '../components/NoImageInfoContainer';
import { fetchFlightsAPI } from '../methods/fetchFlights';
import { useEvent } from '../components/EventContext';

export default function FlightsPage({ navigation }) {
  const { selectedEvent, selectedAccommodation } = useEvent();

  if (!selectedEvent) {
    console.warn("No event selected. Redirecting to search page...");
    navigation.navigate("SearchPage");
    return null;
  }

  const eventDate = new Date(selectedEvent.eventDate);
  const today = new Date();
  const tomorrow = new Date(today.getTime() + 86400000);

  const [departureAirport, setDepartureAirport] = useState('');
  const [arrivalAirport, setArrivalAirport] = useState(selectedEvent.eventLocation);
  const safeCheckIn = selectedAccommodation?.accommCheckIn && !isNaN(new Date(selectedAccommodation.accommCheckIn)) 
  ? new Date(selectedAccommodation.accommCheckIn) 
  : eventDate;

const safeCheckOut = selectedAccommodation?.accommCheckOut && !isNaN(new Date(selectedAccommodation.accommCheckOut)) 
  ? new Date(selectedAccommodation.accommCheckOut) 
  : new Date(eventDate.getTime() + 86400000);

  const [departureDate, setDepartureDate] = useState(safeCheckIn);
  const [returnDate, setReturnDate] = useState(safeCheckOut);

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [loading, setLoading] = useState(false);
  const [directOnly, setDirectOnly] = useState(false);

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
      apis: ["googleFlights"],
      direct: directOnly
    };

    console.log(directOnly);

    const outboundApiResults = await fetchFlightsAPI(outboundValues);
    setLoading(false);

    let outboundFlights = outboundApiResults.results.find(result => result.api === "googleFlights")?.data || [];

    if (outboundFlights.length > 0) {
      navigation.navigate('OutboundFlights', {
        outboundFlights,
        departureAirport,
        arrivalAirport,
        departureDate: format(departureDate, 'yyyy-MM-dd'),
        returnDate: format(returnDate, 'yyyy-MM-dd'),
        direct: directOnly
      });
    } else {
      alert('No outbound flights found.');
    }
  };

  return (
    <View style={styles.container}>
      <NoImageInfoContainer event={selectedEvent} />

      {selectedAccommodation && (
        <View style={styles.accommodationContainer}>
          <Text style={styles.accomTitle}>Your Saved Accommodation</Text>
          <Text style={styles.accomText}><Text style={styles.bold}>Name:</Text> {selectedAccommodation.accommName}</Text>
          <Text style={styles.accomText}><Text style={styles.bold}>Check-In:</Text> {format(new Date(selectedAccommodation.accommCheckIn), 'dd-MMM-yyyy')}</Text>
          <Text style={styles.accomText}><Text style={styles.bold}>Check-Out:</Text> {format(new Date(selectedAccommodation.accommCheckOut), 'dd-MMM-yyyy')}</Text>
        </View>
      )}

      <View style={styles.inputsContainer}>
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Departure Airport</Text>
          <TextInput
            style={styles.textInput}
            value={departureAirport}
            onChangeText={setDepartureAirport}
            placeholder="Enter airport or location (JFK/New York)"
            placeholderTextColor="#999"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Arrival Airport</Text>
          <TextInput
            style={styles.textInput}
            value={arrivalAirport}
            onChangeText={setArrivalAirport}
            placeholder="Enter airport or location (Gatwick/London)"
            placeholderTextColor="#999"
          />
        </View>

        <View style={styles.rowContainer}>
          <View style={{ flex: 1 }}>
            <Text style={styles.dateLabel}>Dates</Text>
            <TouchableOpacity style={styles.smallDateButton} onPress={() => setShowDatePicker(true)}>
              <Text style={styles.smallButtonText}>
                {format(departureDate, 'dd-MMM')} → {format(returnDate, 'dd-MMM')}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.switchContainer}>
            <Switch
              value={directOnly}
              onValueChange={setDirectOnly}
              trackColor={{ false: '#ccc', true: '#6785c7' }}
              thumbColor={directOnly ? '#fff' : '#f4f3f4'}
            />
            <Text style={styles.switchLabel}>Direct only</Text>
          </View>
        </View>

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

        <TouchableOpacity style={styles.searchButton} onPress={searchOutboundFlights}>
          <Text style={styles.searchButtonText}>Search Flights</Text>
        </TouchableOpacity>

        {loading && (
          <View style={styles.spinnerContainer}>
            <ActivityIndicator size="large" color="#6785c7" />
            <Text style={styles.loadingText}>Searching for flights...</Text>
          </View>
        )}

      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
    paddingHorizontal: 15,
  },
  spinnerContainer: {
    marginTop: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  accommodationContainer: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 1,
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
  inputsContainer: {
    backgroundColor: 'white',
    borderRadius: 10,
    paddingBottom: 20,
    paddingTop: 10,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 1,
  },
  inputGroup: {
    marginBottom: 15,
  },
  inputLabel: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
    marginLeft: 15,
    marginBottom: 5,
  },
  dateLabel: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
    marginBottom: 5,
  },
  textInput: {
    backgroundColor: '#fff',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 8,
    borderColor: '#ccc',
    borderWidth: 1,
    fontSize: 15,
    marginHorizontal: 15,
  },
  rowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 10,
    marginHorizontal: 15,
    gap: 12,
  },
  smallDateButton: {
    backgroundColor: '#fff',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 6,
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginTop: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  smallButtonText: {
    color: '#333',
    fontSize: 14,
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingTop: 30
  },
  switchLabel: {
    fontSize: 15,
    color: '#333',
    fontWeight: '500',
  },
  searchButton: {
    backgroundColor: '#6785c7',
    marginHorizontal: 15,
    marginTop: 20,
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  searchButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  loadingText: {
    textAlign: 'center',
    marginTop: 10,
    fontSize: 15,
    color: '#666',
  },
});
