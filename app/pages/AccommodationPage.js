import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Modal,
  TouchableWithoutFeedback,
} from 'react-native';
import MapComponent from '../components/MapComponent';
import AccommodationCard from '../components/AccommodationCard';
import DatePicker from 'react-native-neat-date-picker';
import { format } from 'date-fns';
import NoImageInfoContainer from '../components/NoImageInfoContainer';
import { fetchAccom } from '../methods/fetchAccom';
import { getGeolocation } from '../methods/getGeolocation';
import { useEvent } from '../components/EventContext';
import SearchPageHeader from '../components/SearchPageHeader';

export default function AccommodationPage({ navigation }) {
  const { selectedEvent } = useEvent();

  if (!selectedEvent) {
    navigation.navigate("SearchPage");
    return null;
  }

  const eventDate = new Date(selectedEvent.eventDate);
  const [checkInDate, setCheckInDate] = useState(eventDate);
  const [checkOutDate, setCheckOutDate] = useState(new Date(eventDate.getTime() + 86400000));
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [accommodations, setAccommodations] = useState([]);
  const [displayedAccommodations, setDisplayedAccommodations] = useState([]);
  const [loading, setLoading] = useState(false);

  const [sortOption, setSortOption] = useState('rating_desc');
  const [showSortModal, setShowSortModal] = useState(false);

  const sortOptions = [
    { label: 'Rating (High to Low)', value: 'rating_desc' },
    { label: 'Price (Low to High)', value: 'price_asc' },
    { label: 'Price (High to Low)', value: 'price_desc' },
  ];

  const parseNumber = (value) => {
    if (!value) return 0;
    return parseFloat(String(value).replace(/[^0-9.]/g, '')) || 0;
  };
  
  const applySorting = (data) => {
    let sorted = [...data];
    if (sortOption === 'price_asc') {
      sorted.sort((a, b) => parseNumber(a.accommPrice) - parseNumber(b.accommPrice));
    } else if (sortOption === 'price_desc') {
      sorted.sort((a, b) => parseNumber(b.accommPrice) - parseNumber(a.accommPrice));
    } else if (sortOption === 'rating_desc') {
      sorted.sort((a, b) => parseNumber(b.accommRating) - parseNumber(a.accommRating));
    }
    setDisplayedAccommodations(sorted);
  };
  

  const fetchAccommodations = async () => {
    setLoading(true);
    setAccommodations([]);

    let geoData = await getGeolocation(`${selectedEvent.eventVenue}, ${selectedEvent.eventLocation}`) || await getGeolocation(selectedEvent.eventLocation);

    if (!geoData) {
      setLoading(false);
      return;
    }

    const values = {
      latitude: geoData.latitude,
      longitude: geoData.longitude,
      checkIn: format(checkInDate, 'yyyy-MM-dd'),
      checkOut: format(checkOutDate, 'yyyy-MM-dd'),
      apis: ["airbnb"]
    };

    const apiResults = await fetchAccom(values);
    if (apiResults?.results) {
      const allAccommodations = apiResults.results
        .filter(api => api.status === 'fulfilled' && Array.isArray(api.data))
        .flatMap(api => api.data);
      setAccommodations(allAccommodations);
      applySorting(allAccommodations);
    }

    setLoading(false);
  };

  useEffect(() => {
    if (accommodations.length) applySorting(accommodations);
  }, [sortOption]);

  return (
    
    <View style={styles.pageContainer}>

      <FlatList
        ListHeaderComponent={
          <View style={styles.headerContainer}>
            <NoImageInfoContainer event={selectedEvent} />

            <View style={styles.cardWhite}>
              <MapComponent
                eventVenue={selectedEvent.eventVenue}
                eventLocation={selectedEvent.eventLocation}
                eventTitle={selectedEvent.eventTitle}
              />

              <View style={styles.controlsRow}>
                <TouchableOpacity style={styles.dateButton} onPress={() => setShowDatePicker(true)}>
                  <Text style={styles.dateButtonText}>
                    {format(checkInDate, 'dd-MMM')} → {format(checkOutDate, 'dd-MMM')}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.searchButton} onPress={fetchAccommodations}>
                  <Text style={styles.searchButtonText}>Search</Text>
                </TouchableOpacity>
              </View>

              <TouchableOpacity style={styles.sortButton} onPress={() => setShowSortModal(true)}>
                <Text style={styles.sortButtonText}>Sort: {sortOptions.find(opt => opt.value === sortOption)?.label}</Text>
              </TouchableOpacity>
            </View>

            <DatePicker
              isVisible={showDatePicker}
              mode="range"
              minDate={new Date()}
              startDate={checkInDate}
              endDate={checkOutDate}
              onConfirm={(range) => {
                setCheckInDate(new Date(range.startDate));
                setCheckOutDate(new Date(range.endDate));
                setShowDatePicker(false);
              }}
              onCancel={() => setShowDatePicker(false)}
            />

            {loading && <ActivityIndicator size="large" color="#6785c7" style={{ marginTop: 20 }} />}
          </View>
        }
        data={displayedAccommodations}
        keyExtractor={(item, index) => item.id?.toString() || index.toString()}
        renderItem={({ item }) => <AccommodationCard navigation={navigation} {...item} />}
        contentContainerStyle={{ paddingBottom: 100 }}
      />

      {/* Sort Modal */}
      <Modal
        visible={showSortModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowSortModal(false)}
      >
        <TouchableWithoutFeedback onPress={() => setShowSortModal(false)}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Sort By</Text>
              {sortOptions.map((option) => (
                <TouchableOpacity
                  key={option.value}
                  style={[
                    styles.modalOption,
                    sortOption === option.value && styles.selectedOption
                  ]}
                  onPress={() => {
                    setSortOption(option.value);
                    setShowSortModal(false);
                  }}
                >
                  <Text style={styles.modalOptionText}>{option.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  pageContainer: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 15,
    paddingTop: 50,
  },
  headerContainer: {

  },
  cardWhite: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
    
  },
  controlsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  dateButton: {
    flex: 1,
    backgroundColor: '#fff',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dateButtonText: {
    fontSize: 14,
    color: '#333',
  },
  searchButton: {
    backgroundColor: '#6785c7',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  sortButton: {
    marginTop: 10,
    padding: 10,
    borderRadius: 8,
    backgroundColor: '#eee',
    alignItems: 'center',
  },
  sortButtonText: {
    color: '#333',
    fontSize: 14,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 14,
    width: '100%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
    textAlign: 'center',
  },
  modalOption: {
    paddingVertical: 10,
    borderBottomColor: '#eee',
    borderBottomWidth: 1,
  },
  modalOptionText: {
    fontSize: 16,
    textAlign: 'center',
  },
  selectedOption: {
    backgroundColor: '#dce6ff',
  },
});
