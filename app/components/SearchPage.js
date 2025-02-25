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
  const [searchQuery, setSearchQuery] = useState({ keyword: '' });
  const [events, setEvents] = useState([]); // State to store event search results
  const [selectedAPIs, setSelectedAPIs] = useState([]);
  const [apiOptions, setApiOptions] = useState([]);
  const { keyword } = searchQuery;

  useEffect(() => {
    const fetchAPIs = async () => {
      const apis = await detectAPIs();
      setApiOptions(apis);
    };

    fetchAPIs();
  }, []);

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
    <View style={{flex: 1, paddingTop:50}}>
      <SearchPageHeader heading="Find an Event"/>
      <FormContainer>
        <FormInput
          value={keyword}
          onChangeText={(value) => handleOnChangeText(value, 'keyword')}
          placeholder="Search for something here..."
        />
        <FormSubmitButton onPress={submitForm} title="Search" />
      </FormContainer>

      {/* Filter Menu Component */}
      <FilterMenu
        apiOptions={apiOptions}
        selectedAPIs={selectedAPIs}
        onSelectionChange={(selected) => setSelectedAPIs(selected)}
      />

      <SafeAreaView stlye={{height:'90%'}}>
        <FlatList
          data={events} // Use updated events from state
          keyExtractor={(item) => item.eventid.toString()} // Ensure id is a string
          renderItem={({ item }) => <SearchResultCard item={item} />}
          initialNumToRender={20}
          maxToRenderPerBatch={20}
          windowSize={10}
          ListEmptyComponent={<Text style={{ textAlign: 'center', marginTop: 20 }}>Search for events, and they'll appear here.</Text>}
          ListFooterComponent={<View style={{ height:250}} />}
        />
      </SafeAreaView>
    </View>
  );
}

const styles = {
  filterButtonContainer: {
    alignItems: 'flex-start', // Align to the left
    paddingLeft: 20, // Adjust left padding
    
  },
  filterButton: {
    backgroundColor: '#6785c7',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    
  },
  filterText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
};