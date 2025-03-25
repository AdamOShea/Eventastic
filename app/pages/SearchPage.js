import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  Alert,
  Animated,
  FlatList,
  TextInput,
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

export default function SearchPage({ navigation }) {
  const { filters, setFilters } = useFilters();
  const [searchQuery, setSearchQuery] = useState({ keyword: '', location: '', apis: [], date: ''  });
  const [events, setEvents] = useState([]);
  const [selectedAPIs, setSelectedAPIs] = useState([]);
  const [apiOptions, setApiOptions] = useState([]);
  const { keyword, location } = searchQuery;

  const scrollY = useRef(new Animated.Value(0)).current;
  const lastScrollY = useRef(0);
  const isSearchVisible = useRef(true);
  const translateY = useRef(new Animated.Value(0)).current;

  useEffect(() => {
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

    const fetchLocation = async () => {
      //const { status } = await Location.requestForegroundPermissionsAsync();
        const { coords } = await Location.getCurrentPositionAsync({});
        const address = await Location.reverseGeocodeAsync(coords);
        console.log("user location: ", address);
        if (address.length > 0) {
          const city = address[0].city || address[0].region;
          setSearchQuery((prev) => ({ ...prev, location: city }));
        }
      
    };

    fetchAPIs();
    fetchLocation();
  }, []);

  const submitForm = async () => {
    try {
      const response = await fetchEvents({ ...searchQuery, apis: selectedAPIs });

      if (response?.events?.length > 0) {
        setEvents(response.events);
      } else {
        setEvents([]);
        Alert.alert('No Events Found', 'Try searching for something else.');
      }
    } catch (err) {
      console.error('Error fetching events:', err);
      Alert.alert('Error', 'Failed to fetch events.');
    }
  };

  const handleOnChangeText = (value, fieldName) => {
    setSearchQuery({ ...searchQuery, [fieldName]: value });
  };

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
          paddingTop: 25
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
          <SearchPageInput
            icon
            iconName="location-outline"
            value={location}
            onChangeText={(value) => handleOnChangeText(value, 'location')}
            placeholder="Location"
            returnKeyType="search"
          />

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
