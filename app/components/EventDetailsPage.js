import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import InfoContainer from './InfoContainer';
import ExpandableDescription from './ExpandableDescription';
import MapComponent from './MapComponent';
import { useEvent } from './EventContext'; // ✅ Import Context
import AccommodationCard from './AccommodationCard'; // ✅ Import AccommodationCard
import FlightCard from './FlightCard'; // ✅ Import FlightCard component
import { saveTrip } from '../methods/saveTrip';
import { getEventId } from '../methods/getEventId';
import { saveAccomm } from '../methods/saveAccomm';
import {saveFlights} from '../methods/saveFlights';


export default function EventDetailsPage({ navigation }) {
  const { selectedEvent, selectedAccommodation, selectedOutboundFlight, selectedReturnFlight } = useEvent(); // ✅ Get event & accommodation from context

  useEffect(() => {
    if (!selectedEvent) {
      console.warn("No event selected. Redirecting to search page...");
      navigation.navigate("SearchPage"); // ✅ Redirect if no event found
    }
  }, [selectedEvent]);

  const saveEvent = async () => {
    if (!selectedEvent) {
      console.warn("❌ No event selected.");
      return;
    }

    const eventResponse = await getEventId({eventlink: selectedEvent.eventlink});
    const event = eventResponse?.eventid || null; // ✅ Extracts only the event ID

    const accommResponse = selectedAccommodation ? await saveAccomm(selectedAccommodation) : null;
    const accomm = accommResponse?.accommid || null; // ✅ Extract accommodation ID safely

    const outboundFlightResponse = selectedOutboundFlight ? await saveFlights(selectedOutboundFlight) : null;
    const outboundflight = outboundFlightResponse?.flightid || null; // ✅ Extract outbound flight ID safely

    const returnFlightResponse = selectedReturnFlight ? await saveFlights(selectedReturnFlight) : null;
    const returnflight = returnFlightResponse?.flightid || null; // ✅ Extract return flight ID safely
  
    // Create the payload
    const tripData = {
      userid: '4100febd-1cb8-45ed-91e8-ca242ac97e6f',
      eventid: event,
      accommid: accomm || null, // Allow saving without accommodation
      outflightid: outboundflight || null,
      returnflightid: returnflight || null,
    };
  
    console.log("🚀 Saving Trip:", tripData);
  
    // Call saveTrip function
    const response = await saveTrip(tripData);
  
    if (response) {
      console.log("✅ Trip saved successfully:", response);
      alert("Trip saved successfully!");
      navigation.navigate("SearchPage"); // ✅ Redirect after saving
    } else {
      console.error("❌ Failed to save trip.");
      alert("Error saving trip. Please try again.");
    }
  };
  

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {selectedEvent ? (
        <>
          <InfoContainer event={selectedEvent} />
          <ExpandableDescription event={selectedEvent} />
          <MapComponent eventLocation={`${selectedEvent.venue} ${selectedEvent.eventlocation}`} eventTitle={selectedEvent.title} />

          {/* ✅ Display Saved Accommodation if Exists */}
          {selectedAccommodation && (
            <View style={styles.accommodationContainer}>
              <Text style={styles.sectionTitle}>Your Saved Accommodation</Text>
              <AccommodationCard navigation={navigation} {...selectedAccommodation} />
            </View>
          )}

          {/* ✅ Display Selected Outbound Flight */}
          {selectedOutboundFlight && (
            <View style={styles.flightContainer}>
              <Text style={styles.sectionTitle}>✈️ Your Outbound Flight</Text>
              <FlightCard navigation={navigation} {...selectedOutboundFlight} />
            </View>
          )}

          {/* ✅ Display Selected Return Flight */}
          {selectedReturnFlight && (
            <View style={styles.flightContainer}>
              <Text style={styles.sectionTitle}>✈️ Your Return Flight</Text>
              <FlightCard navigation={navigation} {...selectedReturnFlight} />
            </View>
          )}


          {/* 🚀 Action Buttons */}
          <TouchableOpacity onPress={saveEvent} style={styles.button}>
            <Text style={styles.buttonText}>Save Event</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate('Accommodation')}
          >
            <Text style={styles.buttonText}>Search Accommodation</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate('Flights')}
          >
            <Text style={styles.buttonText}>Search Flights</Text>
          </TouchableOpacity>
        </>
      ) : (
        <Text style={styles.errorText}>Loading event details...</Text>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 50,
    padding: 20,
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  accommodationContainer: {
    width: '100%',
    marginTop: 30,
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  flightContainer: {
    width: '100%',
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#6785c7',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginTop: 15,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: { 
    color: '#fff', 
    fontSize: 16, 
    fontWeight: 'bold' 
  },
  errorText: {
    fontSize: 16,
    color: 'red',
    textAlign: 'center',
    marginTop: 20,
  },
});
