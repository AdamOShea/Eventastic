import React, { useEffect, useState } from 'react';
import { View, Text, Alert, FlatList, SafeAreaView } from 'react-native';
import FormContainer from './FormContainer';
import FormInput from './FormInput';
import FilterMenu from './FilterMenu';
import FormSubmitButton from './FormSubmitButton';
import { fetchEvents } from '../methods/fetchEvents';
import SearchResultCard from './SearchResultCard';
import SearchPageHeader from './SearchPageHeader';
import { detectAPIs } from '../methods/detectAPIs';

export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState({ keyword: '', apis: [] });
  const [events, setEvents] = useState([]);
  const [selectedAPIs, setSelectedAPIs] = useState([]);
  const [apiOptions, setApiOptions] = useState([]);
  const { keyword } = searchQuery;

  useEffect(() => {
    const fetchAPIs = async () => {
      const apis = await detectAPIs();
      console.log('APIs fetched in SearchPage:', apis); 

      if (Array.isArray(apis) && apis.length) {
        setApiOptions(apis); 
        setSelectedAPIs(apis); 
        setSearchQuery((prev) => ({ ...prev, apis })); // 
      } else {
        console.warn('No APIs received or detected.');
      }
    };

    fetchAPIs();
  }, []);

  const submitForm = async () => {
    try {
      const response = await fetchEvents({ ...searchQuery, apis: selectedAPIs });
  
      if (response?.events?.length > 0) {
        setEvents(response.events); // 
      } else {
        setEvents([]); // 
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
    <View style={{ flex: 1, paddingTop: 50 }}>
      <SearchPageHeader heading="Find an Event" />
      <FormContainer>
        <FormInput
          value={keyword}
          onChangeText={(value) => handleOnChangeText(value, 'keyword')}
          placeholder="Search for something here..."
        />
        <FormSubmitButton onPress={submitForm} title="Search" />
      </FormContainer>

      
      <FilterMenu
        apiOptions={apiOptions}
        selectedAPIs={selectedAPIs}
        onSelectionChange={(selected) => {
          setSelectedAPIs(selected);
          setSearchQuery((prev) => ({ ...prev, apis: selected })); // Keep searchQuery updated
        }}
      />

      <SafeAreaView style={{ flex: 1 }}>
        <FlatList
          data={events}
          keyExtractor={(item) => item.eventid.toString()}
          renderItem={({ item }) => <SearchResultCard item={item} />}
          ListEmptyComponent={
            <Text style={{ textAlign: 'center', marginTop: 20 }}>
              Search for events, and they'll appear here.
            </Text>
          }
          ListFooterComponent={<View style={{ height: 250 }} />}
        />
      </SafeAreaView>
    </View>
  );
}
