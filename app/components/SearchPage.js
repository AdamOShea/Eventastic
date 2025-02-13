import React, { useState } from 'react';
import { View, Text, Alert, FlatList, SafeAreaView } from 'react-native';
import FormContainer from './FormContainer';
import FormInput from './FormInput';
import LoginHeader from './LoginHeader';
import FormSubmitButton from './FormSubmitButton';
import { fetchEvents } from '../methods/fetchEvents';
import SearchResultCard from './SearchResultCard';

export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState({ keyword: '' });
  const [events, setEvents] = useState([]); // State to store event search results

  const { keyword } = searchQuery;

  const submitForm = async () => {
    try {
      const response = await fetchEvents(searchQuery);
      
      if (response && response.events.length > 0) {
        setEvents(response.events); // Update FlatList with new results
      } else {
        setEvents([]); // Clear list if no results
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

  return (
    <>
      <LoginHeader />
      <FormContainer>
        <FormInput
          value={keyword}
          onChangeText={(value) => handleOnChangeText(value, 'keyword')}
          placeholder="Search for something here..."
        />
        <FormSubmitButton onPress={submitForm} title="Search" />
      </FormContainer>

      <SafeAreaView>
        <FlatList
          data={events} // Use updated events from state
          keyExtractor={(item) => item.eventid.toString()} // Ensure id is a string
          renderItem={({ item }) => <SearchResultCard item={item} />}
          ListEmptyComponent={<Text style={{ textAlign: 'center', marginTop: 20 }}>No events found.</Text>}
        />
      </SafeAreaView>
    </>
  );
}
