// Customizable input field component with optional icon, primarily used for entering search criteria.

import React from 'react';
import { View, Text, StyleSheet, TextInput } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const SearchPageInput = React.forwardRef(({ icon, iconName, placeholder, title, ...props }, ref) => {
  return (
    <View style={styles.container}>
      {title && <Text style={styles.label}>{title}</Text>}
      <View style={styles.inputContainer}>
        {icon && (
          <Icon name={iconName} size={20} color="#888" style={styles.icon} />
        )}
        <TextInput
          {...props}
          ref={ref}
          placeholder={placeholder}
          style={styles.input}
          placeholderTextColor="#aaa"
        />
      </View>
    </View>
  );
});

export default SearchPageInput;

const styles = StyleSheet.create({
  container: {
    marginBottom: 10,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    height: 55,
  },
  icon: {
    marginRight: 8,
  },
  label: {
    fontWeight: 'bold',
    marginBottom: 6,
  },
  input: {
    flex: 1,
    fontSize: 16,
  },
});
