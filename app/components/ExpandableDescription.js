import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

export default function ExpandableDescription({ event }) {
  const [showDescription, setShowDescription] = useState(false);

  return (
    <View style={styles.container}>
      <Text style={styles.detail}>
        <Text style={styles.label}>Event Type:</Text> {event.eventtype || 'N/A'}
      </Text>

      {showDescription ? (
        <>
          <Text style={styles.detail}>
            <Text style={styles.label}>Description:</Text> {event.description || 'No description available'}
          </Text>
          <TouchableOpacity onPress={() => setShowDescription(false)} style={styles.readMoreButton}>
            <Text style={styles.readMoreText}>Read Less ▲</Text>
          </TouchableOpacity>
        </>
      ) : (
        <TouchableOpacity onPress={() => setShowDescription(true)} style={styles.readMoreButton}>
          <Text style={styles.readMoreText}>Read More ▼</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    backgroundColor: '#ffffff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
  },
  detail: {
    fontSize: 16,
    marginBottom: 8,
    width: '100%',
  },
  label: {
    fontWeight: 'bold',
  },
  readMoreButton: {
    alignItems: 'center',
    marginTop: 10,
  },
  readMoreText: {
    fontSize: 14,
    color: '#6785c7',
    fontWeight: 'bold',
  },
});
