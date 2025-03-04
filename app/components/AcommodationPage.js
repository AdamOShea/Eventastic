import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, FlatList } from 'react-native';
import MapComponent from '../components/MapComponent';
import SearchButton from '../components/SearchButton';
import AccommodationCard from '../components/AccommodationCard'; // ✅ Import Card
import DatePicker from 'react-native-neat-date-picker';
import { format } from 'date-fns';

export default function AccommodationPage({ route, navigation }) {
  const { event } = route.params;

  const eventDate = new Date(event.date);
  const today = new Date();
  const tomorrow = new Date(today.getTime() + 86400000);

  const [checkInDate, setCheckInDate] = useState(eventDate);
  const [checkOutDate, setCheckOutDate] = useState(new Date(eventDate.getTime() + 86400000));
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [accommodations, setAccommodations] = useState([]);

  const scrollY = useRef(new Animated.Value(0)).current;

  const fetchAccommodations = () => {
    const dummyData = [
      { id: '1', name: 'Luxury Hotel', price: '€200', rating: '⭐️⭐️⭐️⭐️⭐️', details: 'A luxurious 5-star hotel with a spa and rooftop bar.' },
      { id: '2', name: 'Budget Inn', price: '€80', rating: '⭐️⭐️⭐️', details: 'A budget-friendly option with free breakfast.' },
      { id: '3', name: 'City Lodge', price: '€120', rating: '⭐️⭐️⭐️⭐️', details: 'A well-located lodge near city attractions.' },
      { id: '4', name: 'Luxury Hotel', price: '€200', rating: '⭐️⭐️⭐️⭐️⭐️', details: 'A luxurious 5-star hotel with a spa and rooftop bar.' },
      { id: '5', name: 'Budget Inn', price: '€80', rating: '⭐️⭐️⭐️', details: 'A budget-friendly option with free breakfast.' },
      { id: '6', name: 'City Lodge', price: '€120', rating: '⭐️⭐️⭐️⭐️', details: 'A well-located lodge near city attractions.' },
      { id: '7', name: 'Luxury Hotel', price: '€200', rating: '⭐️⭐️⭐️⭐️⭐️', details: 'A luxurious 5-star hotel with a spa and rooftop bar.' },
      { id: '8', name: 'Budget Inn', price: '€80', rating: '⭐️⭐️⭐️', details: 'A budget-friendly option with free breakfast.' },
      { id: '9', name: 'City Lodge', price: '€120', rating: '⭐️⭐️⭐️⭐️', details: 'A well-located lodge near city attractions.' },
    ];
    setAccommodations(dummyData);
  };

  return (
    <Animated.ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingBottom: 30 }}
      onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], { useNativeDriver: false })}
    >
      <Text style={styles.title}>Search Accommodation for:</Text>
      <Text style={styles.eventTitle}>{event.title}</Text>
      <Text>📍 Location: {event.eventlocation}, {event.venue}</Text>
      <Text>📅 Event Date: {format(eventDate, 'dd-MMM-yyyy')}</Text>

      <TouchableOpacity style={styles.dateButton} onPress={() => setShowDatePicker(true)}>
        <Text style={styles.buttonText}>
          {format(checkInDate, 'dd-MMM-yyyy')} → {format(checkOutDate, 'dd-MMM-yyyy')}
        </Text>
      </TouchableOpacity>

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

      <MapComponent eventLocation={event.venue + event.eventlocation} eventTitle={event.title} />

      <SearchButton onPress={fetchAccommodations} />

      {/* Pass `navigation` to each card */}
      <FlatList
        data={accommodations}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <AccommodationCard navigation={navigation} {...item} />
        )}
        scrollEnabled={false}
      />
    </Animated.ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 10, textAlign: 'center' },
  eventTitle: { fontSize: 18, marginVertical: 8, fontWeight: 'bold', textAlign: 'center' },
  dateButton: {
    width: '100%',
    backgroundColor: '#6785c7',
    paddingVertical: 12,
    borderRadius: 10,
    marginTop: 15,
    alignItems: 'center',
  },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold', textAlign: 'center' },
});
