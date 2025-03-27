import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking } from 'react-native';
import InfoContainer from '../components/InfoContainer';
import ExpandableDescription from '../components/ExpandableDescription';
import MapComponent from '../components/MapComponent';
import { useEvent } from '../components/EventContext'; //  Import Context
import AccommodationCard from '../components/AccommodationCard'; //  Import AccommodationCard
import FlightCard from '../components/FlightCard'; //  Import FlightCard component
import { saveTrip } from '../methods/saveTrip';
import { getEventId } from '../methods/getEventId';
import { saveAccomm } from '../methods/saveAccomm';
import {saveFlights} from '../methods/saveFlights';
import { useUser } from "../components/UserContext"; 

export default function EventDetailsPage({ navigation }) {
  const { selectedEvent, selectedAccommodation, selectedOutboundFlight, selectedReturnFlight } = useEvent(); //  Get event & accommodation from context

  useEffect(() => {
    if (!selectedEvent) {
      console.warn("No event selected. Redirecting to search page...");
      navigation.navigate("SearchPage"); //  Redirect if no event found
    }
  }, [selectedEvent]);

  const saveEvent = async () => {
    if (!selectedEvent) {
      console.warn("❌ No event selected.");
      return;
    }

    const eventResponse = await getEventId({eventLink: selectedEvent.eventLink});
    const event = eventResponse?.eventId || null; //  Extracts only the event ID

    const accommResponse = selectedAccommodation ? await saveAccomm(selectedAccommodation) : null;
    const accomm = accommResponse?.accommId || null; //  Extract accommodation ID safely

    const outboundFlightResponse = selectedOutboundFlight ? await saveFlights(selectedOutboundFlight) : null;
    const outboundflight = outboundFlightResponse?.flightId || null; //  Extract outbound flight ID safely

    const returnFlightResponse = selectedReturnFlight ? await saveFlights(selectedReturnFlight) : null;
    const returnflight = returnFlightResponse?.flightId || null; //  Extract return flight ID safely
  

    const { currentUser } = useUser(); //  Get current user
    // Create the payload
    const tripData = {
      userid: currentUser.userid,
      eventid: event,
      accommid: accomm || null, // Allow saving without accommodation
      outflightid: outboundflight || null,
      returnflightid: returnflight || null,
    };
  
    console.log("🚀 Saving Trip:", tripData);
  
    // Call saveTrip function
    const response = await saveTrip(tripData);
  
    if (response) {
      console.log(" Trip saved successfully:", response);
      alert("Trip saved successfully!");
      navigation.navigate("SearchPage"); //  Redirect after saving
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

          <TouchableOpacity
            style={styles.button}
            onPress={() => Linking.openURL(selectedEvent.eventLink)}
          >
            <Text style={styles.buttonText}>Event Website</Text>
          </TouchableOpacity>

          <MapComponent eventLocation={`${selectedEvent.eventVenue} ${selectedEvent.eventLocation}`} eventTitle={selectedEvent.eventTitle} />

          {/*  Display Saved Accommodation if Exists */}
          {selectedAccommodation && (
            <View style={styles.accommodationContainer}>
              <Text style={styles.sectionTitle}>Your Saved Accommodation</Text>
              <AccommodationCard navigation={navigation} {...selectedAccommodation} />
            </View>
          )}

          {/*  Display Selected Outbound Flight */}
          {selectedOutboundFlight && (
            <View style={styles.flightContainer}>
              <Text style={styles.sectionTitle}>✈️ Your Outbound Flight</Text>
              <FlightCard navigation={navigation} {...selectedOutboundFlight} />
            </View>
          )}

          {/*  Display Selected Return Flight */}
          {selectedReturnFlight && (
            <View style={styles.flightContainer}>
              <Text style={styles.sectionTitle}>✈️ Your Return Flight</Text>
              <FlightCard navigation={navigation} {...selectedReturnFlight} />
            </View>
          )}


          {/* 🚀 Action Buttons */}

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

          <TouchableOpacity onPress={saveEvent} style={styles.saveButton}>
            <Text style={styles.buttonText}>Save Trip</Text>
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
    marginTop:15,
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
  saveButton: {
    backgroundColor: '#4CAF50',
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
