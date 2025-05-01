// Screen component showing comprehensive event details, including accommodation, flights, expandable description, and map. Allows saving trip data.
import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking } from 'react-native';
import InfoContainer from '../components/InfoContainer';
import ExpandableDescription from '../components/ExpandableDescription';
import MapComponent from '../components/MapComponent';
import { useEvent,  } from '../components/EventContext';
import AccommodationCard from '../components/AccommodationCard';
import FlightCard from '../components/FlightCard';
import { saveTrip } from '../methods/saveTrip';
import { getEventId } from '../methods/getEventId';
import { saveAccomm } from '../methods/saveAccomm';
import { saveFlights } from '../methods/saveFlights';
import { useUser } from "../components/UserContext";
import { CommonActions } from '@react-navigation/native';

export default function EventDetailsPage({ navigation }) {
  const { selectedEvent, selectedAccommodation, selectedOutboundFlight, selectedReturnFlight, clearEventDetails } = useEvent();
  const { currentUser } = useUser();

  useEffect(() => {
    if (!selectedEvent) {
      console.warn("No event selected. Redirecting to search page...");
      navigation.navigate("SearchPage");
    }
  }, [selectedEvent, navigation]);

  // Saves the complete trip (event, accommodation, flights) to the user's account, clearing context and navigating after successful save.
  const saveEvent = async () => {
    if (!selectedEvent) {
      console.warn(" No event selected.");
      return;
    }

    const eventResponse = await getEventId({ eventLink: selectedEvent.eventLink });
    const event = eventResponse?.eventId || null;

    const accommResponse = selectedAccommodation ? await saveAccomm(selectedAccommodation) : null;
    const accomm = accommResponse?.accommId || null;

    const outboundFlightResponse = selectedOutboundFlight ? await saveFlights(selectedOutboundFlight) : null;
    const outboundflight = outboundFlightResponse?.flightId || null;

    const returnFlightResponse = selectedReturnFlight ? await saveFlights(selectedReturnFlight) : null;
    const returnflight = returnFlightResponse?.flightId || null;

    const tripData = {
      userid: currentUser.userid,
      eventid: event,
      accommid: accomm || null,
      outflightid: outboundflight || null,
      returnflightid: returnflight || null,
    };

    console.log("🚀 Saving Trip:", tripData);

    const response = await saveTrip(tripData);

    if (response) {
      alert("Trip saved successfully!");
      clearEventDetails();
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: 'SearchPage' }],
        })
      );
    } else {
      alert("Error saving trip. Please try again.");
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {selectedEvent ? (
        <>
          <InfoContainer event={selectedEvent} />
          <ExpandableDescription event={selectedEvent} />

          <TouchableOpacity style={styles.websiteButton} onPress={() => Linking.openURL(selectedEvent.eventLink)}>
            <Text style={styles.websiteButtonText}>Visit Event Website</Text>
          </TouchableOpacity>

          <View style={styles.mapWrapper}>
            <MapComponent eventLocation={`${selectedEvent.eventVenue} ${selectedEvent.eventLocation}`} eventTitle={selectedEvent.eventTitle} />
          </View>

          {selectedAccommodation && (
            <View style={styles.cardWrapper}>
              <Text style={styles.sectionTitle}>Your Accommodation</Text>
              <AccommodationCard navigation={navigation} {...selectedAccommodation} />
            </View>
          )}

          {selectedOutboundFlight && (
            <View style={styles.cardWrapper}>
              <Text style={styles.sectionTitle}>Outbound Flight</Text>
              <FlightCard navigation={navigation} {...selectedOutboundFlight} />
            </View>
          )}

          {selectedReturnFlight && (
            <View style={styles.cardWrapper}>
              <Text style={styles.sectionTitle}>Return Flight</Text>
              <FlightCard navigation={navigation} {...selectedReturnFlight} />
            </View>
          )}

          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.secondaryButton} onPress={() => navigation.navigate('Accommodation')}>
              <Text style={styles.secondaryButtonText}>+ Accommodation</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.secondaryButton} onPress={() => navigation.navigate('Flights')}>
              <Text style={styles.secondaryButtonText}>+ Flights</Text>
            </TouchableOpacity>
          </View>

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
    backgroundColor: '#f9f9f9',
  },
  mapWrapper: {
    marginTop: 15,
    marginBottom: 20,
    borderRadius: 10,
    overflow: 'hidden',
  },
  cardWrapper: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
    textAlign: 'center',
    color: '#444',
  },
  websiteButton: {
    marginTop: 10,
    marginBottom: 15,
    backgroundColor: '#444',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  websiteButtonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: 'bold',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
    marginTop: 10,
  },
  secondaryButton: {
    flex: 1,
    backgroundColor: '#6785c7',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 15,
  },
  saveButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  errorText: {
    fontSize: 16,
    color: 'red',
    textAlign: 'center',
    marginTop: 20,
  },
});
