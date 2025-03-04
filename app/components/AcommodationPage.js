import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  FlatList,
  ScrollView,
} from 'react-native';
import MapComponent from '../components/MapComponent';
import SearchButton from '../components/SearchButton';
import DatePicker from 'react-native-neat-date-picker';
import { format } from 'date-fns';

export default function AccommodationPage({ route }) {
  const { event } = route.params;

  // 📅 Initialize dates
  const eventDate = new Date(event.date);
  const today = new Date();
  const tomorrow = new Date(today.getTime() + 86400000);

  const [checkInDate, setCheckInDate] = useState(eventDate);
  const [checkOutDate, setCheckOutDate] = useState(new Date(eventDate.getTime() + 86400000));
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [accommodations, setAccommodations] = useState([]); // List of results

  const scrollY = useRef(new Animated.Value(0)).current; // Animation ref

  // 🏨 Dummy Accommodation Data (Replace with API Call)
  const fetchAccommodations = () => {
    const dummyData = [
      { id: '1', name: 'Luxury Hotel', price: '€200', rating: '⭐️⭐️⭐️⭐️⭐️' },
      { id: '2', name: 'Budget Inn', price: '€80', rating: '⭐️⭐️⭐️' },
      { id: '3', name: 'City Lodge', price: '€120', rating: '⭐️⭐️⭐️⭐️' },
      { id: '4', name: 'Luxury Hotel', price: '€200', rating: '⭐️⭐️⭐️⭐️⭐️' },
      { id: '5', name: 'Budget Inn', price: '€80', rating: '⭐️⭐️⭐️' },
      { id: '6', name: 'City Lodge', price: '€120', rating: '⭐️⭐️⭐️⭐️' },
      { id: '7', name: 'Luxury Hotel', price: '€200', rating: '⭐️⭐️⭐️⭐️⭐️' },
      { id: '8', name: 'Budget Inn', price: '€80', rating: '⭐️⭐️⭐️' },
      { id: '9', name: 'City Lodge', price: '€120', rating: '⭐️⭐️⭐️⭐️' },
    ];
    setAccommodations(dummyData);
  };

  return (
    <Animated.ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingBottom: 30 }}
      onScroll={Animated.event(
        [{ nativeEvent: { contentOffset: { y: scrollY } } }],
        { useNativeDriver: false }
      )}
    >
      <Text style={styles.title}>Search Accommodation for:</Text>
      <Text style={styles.eventTitle}>{event.title}</Text>
      <Text>📍 Location: {event.eventlocation}, {event.venue}</Text>
      <Text>📅 Event Date: {format(eventDate, 'dd-MMM-yyyy')}</Text>

      {/* 🗓 Date Picker Button */}
      <TouchableOpacity style={styles.dateButton} onPress={() => setShowDatePicker(true)}>
        <Text style={styles.buttonText}>
          {format(checkInDate, 'dd-MMM-yyyy')} → {format(checkOutDate, 'dd-MMM-yyyy')}
        </Text>
      </TouchableOpacity>

      {/* 📅 Date Picker Component */}
      <DatePicker
        isVisible={showDatePicker}
        mode="range"
        minDate={tomorrow}
        startDate={checkInDate}
        endDate={checkOutDate}
        onConfirm={(range) => {
          setCheckInDate(new Date(range.startDate));
          setCheckOutDate(new Date(range.endDate));
          setShowDatePicker(false);
        }}
        onCancel={() => setShowDatePicker(false)}
      />

      {/* 🌍 Map Component */}
      <MapComponent eventLocation={event.venue + event.eventlocation} eventTitle={event.title} />

      {/* 🏨 Search Accommodation Button */}
      <SearchButton onPress={fetchAccommodations} />

      {/* 🏨 Accommodation List (Moves Page Up as List Expands) */}
      <FlatList
        data={accommodations}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.accommodationCard}>
            <Text style={styles.accommodationTitle}>{item.name}</Text>
            <Text>{item.price}</Text>
            <Text>{item.rating}</Text>
          </View>
        )}
        scrollEnabled={false} // Prevent internal scrolling
      />
    </Animated.ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 10, textAlign: 'center' },
  eventTitle: { fontSize: 18, marginVertical: 8, fontWeight: 'bold', textAlign: 'center' },

  // 📅 Date Button
  dateButton: {
    width: '100%',
    backgroundColor: '#6785c7',
    paddingVertical: 12,
    borderRadius: 10,
    marginTop: 15,
    alignItems: 'center',
  },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold', textAlign: 'center' },

  // 🏨 Accommodation Card
  accommodationCard: {
    backgroundColor: '#f8f8f8',
    padding: 15,
    borderRadius: 10,
    marginTop: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    alignItems: 'center',
  },
  accommodationTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});
