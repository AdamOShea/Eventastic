import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import MapComponent from '../components/MapComponent';
import SearchButton from '../components/SearchButton';
import AccommodationCard from '../components/AccommodationCard';
import DatePicker from 'react-native-neat-date-picker';
import { format } from 'date-fns';
import NoImageInfoContainer from './NoImageInfoContainer';
import { fetchAccom } from '../methods/fetchAccom';
import { getGeolocation } from '../methods/getGeolocation';
import Constants from 'expo-constants';

export default function AccommodationPage({ route, navigation }) {
  const { event } = route.params;
  const GOOGLE_MAPS_API_KEY = Constants.expoConfig.extra.googleMapsApiKey;

  const eventDate = new Date(event.date);
  const today = new Date();
  const tomorrow = new Date(today.getTime() + 86400000);

  const [checkInDate, setCheckInDate] = useState(eventDate);
  const [checkOutDate, setCheckOutDate] = useState(new Date(eventDate.getTime() + 86400000));
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [accommodations, setAccommodations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [displayedAccommodations, setDisplayedAccommodations] = useState([]);
  const ITEMS_PER_LOAD = 5;

  useEffect(() => {
    if (accommodations.length > 0) {
      setDisplayedAccommodations(accommodations.slice(0, ITEMS_PER_LOAD));
      setHasMore(accommodations.length > ITEMS_PER_LOAD);
    }
  }, [accommodations]);

  const fetchAccommodations = async () => {
    setLoading(true);
    setAccommodations([]);

    let geoData = await getGeolocation(`${event.venue}, ${event.eventlocation}`);
    if (!geoData) {
        console.warn(`❌ Geolocation failed for "${event.venue}, ${event.eventlocation}". Trying "${event.eventlocation}"...`);
        geoData = await getGeolocation(event.eventlocation);
    }
    if (!geoData) {
        console.error("❌ Geolocation failed. Cannot proceed with accommodation search.");
        setLoading(false);
        return;
    }

    const values = {
        latitude: geoData.latitude,
        longitude: geoData.longitude,
        checkIn: format(checkInDate, 'yyyy-MM-dd'),
        checkOut: format(checkOutDate, 'yyyy-MM-dd'),
        apis: ["airbnb", "booking", "expedia"], // ✅ Request multiple APIs
    };

    console.log("🚀 Fetching accommodations with values:", values);

    const apiResults = await fetchAccom(values);

    if (apiResults?.results) {
        // ✅ Combine all API data into a single array
        const allAccommodations = apiResults.results
            .filter(api => api.status === 'fulfilled' && Array.isArray(api.data)) // ✅ Only keep successful API data
            .flatMap(api => api.data); // ✅ Merge all API results into a single list

        setAccommodations(allAccommodations);
        setDisplayedAccommodations(allAccommodations.slice(0, ITEMS_PER_LOAD));
        setHasMore(allAccommodations.length > ITEMS_PER_LOAD);
    } else {
        console.log("❌ No accommodations found.");
    }

    setLoading(false);
  };



  const loadMoreAccommodations = () => {
    if (!hasMore) return;

    const newIndex = displayedAccommodations.length;
    const nextAccommodations = accommodations.slice(newIndex, newIndex + ITEMS_PER_LOAD);

    setDisplayedAccommodations([...displayedAccommodations, ...nextAccommodations]);
    setHasMore(newIndex + ITEMS_PER_LOAD < accommodations.length);
  };

  return (
    <FlatList
      data={displayedAccommodations}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => <AccommodationCard navigation={navigation} {...item} />}
      onEndReached={loadMoreAccommodations}
      onEndReachedThreshold={0.5}
      ListHeaderComponent={
        <>
          {/* Event Information */}
          <NoImageInfoContainer event={event} />

          {/* Date Picker */}
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

          {/* Interactive Map */}
          <MapComponent eventVenue={event.venue} eventLocation={event.eventlocation} eventTitle={event.title} />

          {/* Search Button */}
          <SearchButton title='Search Accommodation' onPress={fetchAccommodations} />

          {/* Loading Indicator */}
          {loading && <Text style={styles.loadingText}>Loading accommodations...</Text>}
        </>
      }
      ListFooterComponent={hasMore ? <ActivityIndicator size="large" color="#6785c7" /> : null}
      windowSize={5}
      initialNumToRender={5}
      maxToRenderPerBatch={5}
      removeClippedSubviews={true}
      getItemLayout={(data, index) => ({
        length: 200,
        offset: 200 * index,
        index,
      })}
    />
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
});
