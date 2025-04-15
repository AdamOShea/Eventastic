// Main event search screen that includes input fields for keyword and location, location autofill, filtering, sorting, and animated visibility controls based on scroll behavior.
import React, { useEffect, useState, useRef } from 'react';
import { BlurView } from 'expo-blur';
import {
  View,
  Text,
  Alert,
  Animated,
  ActivityIndicator,
  TouchableOpacity
} from 'react-native';
import * as Location from 'expo-location';
import FormContainer from '../components/FormContainer';
import SearchPageInput from '../components/SearchPageInput';
import FormSubmitButton from '../components/FormSubmitButton';
import { fetchEvents } from '../methods/fetchEvents';
import SearchResultCard from '../components/SearchResultCard';
import SearchPageHeader from '../components/SearchPageHeader';
import { detectAPIs } from '../methods/detectAPIs';
import { useFilters } from '../components/FiltersContext';
import { useFocusEffect } from '@react-navigation/native';

export default function SearchPage({ navigation }) {
  const { filters, setFilters } = useFilters();
  const [searchQuery, setSearchQuery] = useState({ keyword: '', location: '', apis: [], date: '' });
  const [events, setEvents] = useState([]);
  const [manualLocationMode, setManualLocationMode] = useState(false);
  const [loadingLocation, setLoadingLocation] = useState(true); 
  const [loadingEvents, setLoadingEvents] = useState(false);
  const hasAutoSearched = useRef(false);


  const { keyword, location } = searchQuery;

  const scrollY = useRef(new Animated.Value(0)).current;
  const lastScrollY = useRef(0);
  const isSearchVisible = useRef(true);
  const translateY = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Retrieves available APIs and initial user location for automatic event search setup.
    const fetchAPIs = async () => {
      const apis = await detectAPIs();
      if (Array.isArray(apis) && apis.length) {
        setFilters((prev) => ({
          ...prev,
          apiOptions: apis,
          selectedAPIs: apis,
        }));
        setSelectedAPIs(apis);
        setSearchQuery((prev) => ({ ...prev, apis }));
      }
    };

    fetchAPIs();
    fetchLocation();
  }, []);

  // Checks if location data is available and valid.
  const isLocationValid = searchQuery.location.trim().length > 0;

  // Triggers filtered events retrieval based on updated filters and location validity.
  useFocusEffect(
    React.useCallback(() => {
      if (!hasAutoSearched.current && !loadingEvents && isLocationValid && !loadingLocation) {
        hasAutoSearched.current = true;
        // Only update date from filters, not location
        setSearchQuery((prev) => ({
          ...prev,
          date: filters.customDate ? new Date(filters.customDate).toISOString() : '',
        }));
  
        getFilteredEvents();
      }
    }, [
      isLocationValid,
      loadingLocation,
      loadingEvents,
      filters.sortBy,
      filters.selectedAPIs,
      filters.selectedDateOption,
      filters.priceRange,
      filters.customDate,
    ])
  );
  
  // Fetches events based on current search query and filters, applies sorting and updates event state.
  const getFilteredEvents = async () => {
    setLoadingEvents(true);
    try {
      const response = await fetchEvents({ ...searchQuery, apis: filters.selectedAPIs, date: filters.customDate || null });


      if (response?.events?.length > 0) {
        let sortedEvents = [...response.events];

        if (filters.sortBy === 'price') {
          sortedEvents.sort((a, b) => {
            const toNumber = (val) => {
              if (!val) return Infinity;
              const parsed = parseFloat(String(val).replace(/[^0-9.]/g, ''));
              return isNaN(parsed) ? Infinity : parsed;
            };

            return toNumber(a.eventPrice) - toNumber(b.eventPrice);
          });
        } else if (filters.sortBy === 'date') {
          sortedEvents.sort((a, b) => new Date(a.startTime) - new Date(b.startTime));
        }

        setEvents(sortedEvents);
      } else {
        setEvents([]);
        Alert.alert('No Events Found', 'Try searching for something else.');
      }
    } catch (err) {
      console.error('Error fetching events:', err);
      Alert.alert('Error', 'Failed to fetch events.');
    } finally {
      setLoadingEvents(false);
    }
  };

  // Retrieves the user's current location and updates search location field accordingly.
  const fetchLocation = async () => {
    try {
      setLoadingLocation(true);
      const { coords } = await Location.getCurrentPositionAsync({});
      const address = await Location.reverseGeocodeAsync(coords);

      if (address.length > 0) {
        let city = address[0].region || address[0].city || '';
        if (/county/i.test(city)) {
          city = city.replace(/county\s*/i, '').trim();
        }

        setSearchQuery((prev) => ({ ...prev, location: city }));
      }
    } catch (error) {
      console.error('Error fetching location:', error);
      Alert.alert('Location Error', 'Could not retrieve location.');
    } finally {
      setLoadingLocation(false);
    }
  };

  // Initiates event search upon form submission.
  const submitForm = () => {
    getFilteredEvents();
  };

  // Updates search query state based on user input, also toggles manual location mode.
  const handleOnChangeText = (value, fieldName) => {
    setSearchQuery({ ...searchQuery, [fieldName]: value });

    if (fieldName === 'location' && value === '') {
      setManualLocationMode(false);
    }
  };

  // Animates search bar visibility based on scroll direction.
  const handleScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
    {
      useNativeDriver: false,
      listener: (event) => {
        const currentScrollY = event.nativeEvent.contentOffset.y;
        if (currentScrollY > lastScrollY.current + 50 && isSearchVisible.current) {
          isSearchVisible.current = false;
          Animated.timing(translateY, {
            toValue: -325,
            duration: 300,
            useNativeDriver: false,
          }).start();
        }
        if (currentScrollY < lastScrollY.current - 50 && !isSearchVisible.current) {
          isSearchVisible.current = true;
          Animated.timing(translateY, {
            toValue: 0,
            duration: 300,
            useNativeDriver: false,
          }).start();
        }
        lastScrollY.current = currentScrollY;
      },
    }
  );

  return (
    <View style={{ flex: 1 }}>
      <Animated.View
        style={{
          transform: [{ translateY }],
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          backgroundColor: 'white',
          zIndex: 10,
          paddingTop: 25,
        }}
      >
        <SearchPageHeader heading="Find an Event" />

        <FormContainer>
          <SearchPageInput
            icon
            iconName="search"
            value={keyword}
            onChangeText={(value) => handleOnChangeText(value, 'keyword')}
            placeholder="Search for something here..."
            returnKeyType="search"
            onSubmitEditing={submitForm}
          />
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <View style={{ flex: 1 }}>
              <SearchPageInput
                icon
                iconName="location-outline"
                value={location}
                onChangeText={(value) => handleOnChangeText(value, 'location')}
                placeholder="Location"
                returnKeyType="search"
              />
            </View>

            <TouchableOpacity
              onPress={fetchLocation}
              style={{
                marginLeft: 10,
                backgroundColor: '#6785c7',
                paddingVertical: 10,
                paddingHorizontal: 12,
                borderRadius: 8,
                flexDirection: 'row',
                alignItems: 'center',
              }}
            >
              {loadingLocation ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 12 }}>
                  Use My Location
                </Text>
              )}
            </TouchableOpacity>
          </View>

          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 5 }}>
            <TouchableOpacity
              style={{ backgroundColor: '#6785c7', padding: 12, borderRadius: 8 }}
              onPress={() => navigation.navigate('EventsFilters')}
            >
              <Text style={{ color: '#fff', fontWeight: 'bold' }}>Filters</Text>
            </TouchableOpacity>

            <View style={{ flex: 1, marginLeft: 10 }}>
              <FormSubmitButton onPress={submitForm} title="Search" />
            </View>
          </View>
        </FormContainer>
      </Animated.View>

      {loadingLocation && (
        <BlurView
          intensity={60}
          tint="light"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            bottom: 0,
            right: 0,
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 100,
          }}
        >
          <ActivityIndicator size="large" color="#6785c7" />
          <Text style={{ marginTop: 10, fontSize: 16, fontWeight: '500' }}>Getting your location...</Text>
        </BlurView>
      )}

      {loadingEvents && (
        <BlurView
          intensity={60}
          tint="light"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            bottom: 0,
            right: 0,
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 100,
          }}
        >
          <ActivityIndicator size="large" color="#6785c7" />
          <Text style={{ marginTop: 10, fontSize: 16, fontWeight: '500' }}>Finding great events...</Text>
        </BlurView>
      )}

      <Animated.FlatList
        contentContainerStyle={{ paddingTop: 325, paddingBottom: 30 }}
        data={events}
        keyExtractor={(item) => item.eventId.toString()}
        renderItem={({ item }) => <SearchResultCard item={item} navigation={navigation} />}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        ListEmptyComponent={
          <Text style={{ textAlign: 'center', marginTop: 20 }}>
            Search for events, and they'll appear here.
          </Text>
        }
      />
    </View>
  );
}
