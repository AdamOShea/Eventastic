import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  FlatList,
  SafeAreaView, // ✅ Import SafeAreaView
} from 'react-native';
import MapComponent from '../components/MapComponent';
import SearchButton from '../components/SearchButton';
import AccommodationCard from '../components/AccommodationCard';
import DatePicker from 'react-native-neat-date-picker';
import { format } from 'date-fns';
import NoImageInfoContainer from './NoImageInfoContainer';

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
    ];
    setAccommodations(dummyData);
  };

  return (
    
      <Animated.ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], { useNativeDriver: false })}
      >
        {/* Event Information Section */}
        <NoImageInfoContainer event={event}></NoImageInfoContainer>

        {/* Date Picker Button */}
        <TouchableOpacity style={styles.dateButton} onPress={() => setShowDatePicker(true)}>
          <Text style={styles.buttonText}>
            {format(checkInDate, 'dd-MMM-yyyy')} → {format(checkOutDate, 'dd-MMM-yyyy')}
          </Text>
        </TouchableOpacity>

        {/* Date Picker Modal */}
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

        {/* Interactive Map */}
        <MapComponent eventLocation={event.venue + event.eventlocation} eventTitle={event.title} />

        {/* Search Button */}
        <SearchButton onPress={fetchAccommodations} />

        {/* Accommodation List */}
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
   // ✅ Background color to avoid transparency issues
  container: {
    flex: 1,
    paddingTop: 50,
    paddingHorizontal: 15,
  },
  contentContainer: {
    paddingBottom: 30,
  },
  infoContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 15,
    marginTop: 10, // ✅ Adds space below status bar
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#2c3e50',
  },
  subText: {
    fontSize: 16,
    color: '#34495e',
    marginTop: 5,
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
});
