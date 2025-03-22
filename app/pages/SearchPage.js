import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  Alert,
  Animated,
  FlatList,
  TextInput,
} from 'react-native';
import FormContainer from '../components/FormContainer';
import FormInput from '../components/FormInput';
import FilterMenu from '../components/FilterMenu';
import FormSubmitButton from '../components/FormSubmitButton';
import { fetchEvents } from '../methods/fetchEvents';
import SearchResultCard from '../components/SearchResultCard';
import SearchPageHeader from '../components/SearchPageHeader';
import { detectAPIs } from '../methods/detectAPIs';


export default function SearchPage({ navigation }) {
  
  const [searchQuery, setSearchQuery] = useState({ keyword: '', apis: [] });
  const [events, setEvents] = useState([]);
  const [selectedAPIs, setSelectedAPIs] = useState([]);
  const [apiOptions, setApiOptions] = useState([]);
  const { keyword } = searchQuery;

  // 🔄 Scroll animation
  const scrollY = useRef(new Animated.Value(0)).current;
  const lastScrollY = useRef(0);
  const isSearchVisible = useRef(true);

  // 🎥 Animated values for hiding & showing the search bar
  const translateY = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const fetchAPIs = async () => {
      const apis = await detectAPIs();
      if (Array.isArray(apis) && apis.length) {
        setApiOptions(apis);
        setSelectedAPIs(apis);
        setSearchQuery((prev) => ({ ...prev, apis }));
      }
    };
    fetchAPIs();
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

  // 🔄 Handle Scroll Event
  const handleScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
    {
      useNativeDriver: false,
      listener: (event) => {
        const currentScrollY = event.nativeEvent.contentOffset.y;

        // If user scrolls DOWN by 50px and search bar is visible, hide it
        if (currentScrollY > lastScrollY.current + 50 && isSearchVisible.current) {
          isSearchVisible.current = false;
          Animated.timing(translateY, {
            toValue: -300, // Move the search bar up
            duration: 300,
            useNativeDriver: false,
          }).start();
        }

        // If user scrolls UP by 50px and search bar is hidden, show it
        if (currentScrollY < lastScrollY.current - 50 && !isSearchVisible.current) {
          isSearchVisible.current = true;
          Animated.timing(translateY, {
            toValue: 0, // Bring the search bar back down
            duration: 300,
            useNativeDriver: false,
          }).start();
        }

        lastScrollY.current = currentScrollY; // Update last scroll position
      },
    }
  );

  return (
    <View style={{ flex: 1 }}>
      {/* 🔍 Animated Search Bar */}
      <Animated.View
        style={{
          transform: [{ translateY }],
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          backgroundColor: 'white',
          zIndex: 10,
        }}
      >
        <SearchPageHeader heading="Find an Event" />

        <FormContainer>
          <FormInput
            value={keyword}
            onChangeText={(value) => handleOnChangeText(value, 'keyword')}
            placeholder="Search for something here..."
            returnKeyType="search"
            onSubmitEditing={submitForm} // Triggers search when "Done" is pressed
          />
          <FormSubmitButton onPress={submitForm} title="Search" />
        </FormContainer>

        <FilterMenu
          apiOptions={apiOptions}
          selectedAPIs={selectedAPIs}
          onSelectionChange={(selected) => {
            setSelectedAPIs(selected);
            setSearchQuery((prev) => ({ ...prev, apis: selected }));
          }}
        />
      </Animated.View>

      {/* 📜 Scrollable Events List */}
      <Animated.FlatList
        contentContainerStyle={{ paddingTop: 300, paddingBottom: 30 }} // Leaves space for hidden header
        data={events}
        keyExtractor={(item) => item.eventId.toString()}
        renderItem={({ item }) => <SearchResultCard item={item} navigation={navigation}/>}
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
