import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Pressable,
  TextInput,
} from 'react-native';
import { Checkbox, RadioButton } from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useFilters } from '../components/FiltersContext';

const FILTER_DATE_OPTIONS = [
  { label: 'Any Date', value: 'any' },
  { label: 'Today', value: 'today' },
  { label: 'Tomorrow', value: 'tomorrow' },
  { label: 'This Week', value: 'week' },
  { label: 'This Weekend', value: 'weekend' },
];

export default function EventsFilters({ navigation }) {
  const { filters, setFilters } = useFilters();
  const { apiOptions, selectedAPIs } = filters;
  const [showDatePicker, setShowDatePicker] = useState(false);

  const toggleAPI = (api) => {
    const updated = selectedAPIs.includes(api)
      ? selectedAPIs.filter((a) => a !== api)
      : [...selectedAPIs, api];

    setFilters((prev) => ({ ...prev, selectedAPIs: updated }));
  };

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setFilters({ ...filters, selectedDateOption: 'custom', customDate: selectedDate });
    }
  };

  const handlePriceChange = (type, value) => {
    const sanitized = value.replace(/[^0-9]/g, '');
    const formatted = sanitized ? `€${sanitized}` : '';
    setFilters({
      ...filters,
      priceRange: { ...filters.priceRange, [type]: formatted },
    });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.sectionTitle}>Select Event Sources</Text>
      <View style={styles.box}>
        {apiOptions.map((api) => (
            <TouchableOpacity style={styles.optionRow} key={api} onPress={() => toggleAPI(api)}>
            <Text>{api}</Text>
            <Checkbox status={selectedAPIs.includes(api) ? 'checked' : 'unchecked'} />
            </TouchableOpacity>
            ))}
      </View>

      <Text style={styles.sectionTitle}>Date</Text>
      <View style={styles.box}>
      {FILTER_DATE_OPTIONS.map((opt) => (
        <TouchableOpacity
            key={opt.value}
            style={styles.optionRow}
            onPress={() => {
            const now = new Date();
            let date = new Date();

            if (opt.value === 'today') {
                // No change needed
            } else if (opt.value === 'tomorrow') {
                date.setDate(now.getDate() + 1);
            } else if (opt.value === 'week') {
                const day = now.getDay();
                const diff = day === 0 ? 1 : 1 - day; // Start from Monday
                date.setDate(now.getDate() + diff);
            } else if (opt.value === 'weekend') {
                const day = now.getDay();
                const daysUntilSaturday = (6 - day + 7) % 7;
                date.setDate(now.getDate() + daysUntilSaturday);
            }

            setFilters({
                ...filters,
                selectedDateOption: opt.value,
                customDate: opt.value === 'any' ? null : date,
            });
            }}
        >
            <Text style={styles.optionLabel}>{opt.label}</Text>
            <RadioButton
            value={opt.value}
            status={filters.selectedDateOption === opt.value ? 'checked' : 'unchecked'}
            onPress={() => {
                const now = new Date();
                let date = new Date();

                if (opt.value === 'today') {
                // No change needed
                } else if (opt.value === 'tomorrow') {
                date.setDate(now.getDate() + 1);
                } else if (opt.value === 'week') {
                const day = now.getDay();
                const diff = day === 0 ? 1 : 1 - day;
                date.setDate(now.getDate() + diff);
                } else if (opt.value === 'weekend') {
                const day = now.getDay();
                const daysUntilSaturday = (6 - day + 7) % 7;
                date.setDate(now.getDate() + daysUntilSaturday);
                }

                setFilters({
                ...filters,
                selectedDateOption: opt.value,
                customDate: opt.value === 'any' ? null : date,
                });
            }}
            />
        </TouchableOpacity>
        ))}


        <TouchableOpacity onPress={() => setShowDatePicker(true)}>
          <Text style={[styles.optionLabel, { color: '#6785c7', fontWeight: 'bold', marginTop: 10 }]}>Choose a specific date...</Text>
        </TouchableOpacity>

        {filters.selectedDateOption === 'custom' && (
          <Text style={styles.selectedDate}>Selected: {filters.customDate.toDateString()}</Text>
        )}

        {showDatePicker && (
          <DateTimePicker
            value={filters.customDate || new Date()}
            mode="date"
            display="default"
            onChange={handleDateChange}
          />
        )}
      </View>

      <Text style={styles.sectionTitle}>Price</Text>
      <View style={styles.box}>
        <Text style={styles.optionLabel}>Min Price</Text>
        <TextInput
          style={styles.input}
          value={filters.priceRange.min}
          placeholder="e.g. €10"
          keyboardType="numeric"
          onChangeText={(text) => handlePriceChange('min', text)}
        />
        <Text style={styles.optionLabel}>Max Price</Text>
        <TextInput
          style={styles.input}
          value={filters.priceRange.max}
          placeholder="e.g. €100"
          keyboardType="numeric"
          onChangeText={(text) => handlePriceChange('max', text)}
        />
      </View>

      <Pressable style={styles.submitButton} onPress={() => {
        console.log('Apply filters:', filters);
        navigation.goBack();
        }}>
        <Text style={styles.submitText}>Apply Filters</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 50,
    padding: 20,
    backgroundColor: '#fff',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  box: {
    backgroundColor: '#f2f2f2',
    borderRadius: 8,
    padding: 15,
    marginBottom: 20,
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  optionLabel: {
    fontSize: 16,
  },
  selectedDate: {
    marginTop: 10,
    fontStyle: 'italic',
  },
  input: {
    height: 40,
    backgroundColor: '#fff',
    borderRadius: 6,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  submitButton: {
    backgroundColor: '#6785c7',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  submitText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
