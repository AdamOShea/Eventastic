import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Menu, MenuOptions, MenuOption, MenuTrigger } from 'react-native-popup-menu';
import { Checkbox } from 'react-native-paper'; // Make sure react-native-paper is installed

const FilterMenu = ({ apiOptions, selectedAPIs, onSelectionChange }) => {
  const [selected, setSelected] = useState(selectedAPIs || []);

  useEffect(() => {
    onSelectionChange(selected); // Send selected APIs back to parent on change
  }, [selected]);

  const toggleSelection = (api) => {
    setSelected((prevSelected) =>
      prevSelected.includes(api)
        ? prevSelected.filter((item) => item !== api)
        : [...prevSelected, api]
    );
  };

  return (
    <View style={styles.filterButtonContainer}>
      <Menu>
        <MenuTrigger customStyles={{ TriggerTouchableComponent: TouchableOpacity }}>
          <View style={styles.filterButton}>
            <Text style={styles.filterText}>Filters ({selected.length} selected)</Text>
          </View>
        </MenuTrigger>
        <MenuOptions>
          {apiOptions.map((api, index) => (
            <MenuOption key={index} onSelect={() => toggleSelection(api)}>
              <View style={styles.menuOptionContainer}>
                <Checkbox
                  status={selected.includes(api) ? 'checked' : 'unchecked'}
                  onPress={() => toggleSelection(api)}
                />
                <Text style={styles.menuOptionText}>{api}</Text>
              </View>
            </MenuOption>
          ))}
        </MenuOptions>
      </Menu>
    </View>
  );
};

const styles = {
  filterButtonContainer: {
    alignItems: 'flex-start',
    paddingLeft: 20,
    marginTop: 10,
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
  menuOptionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  menuOptionText: {
    fontSize: 16,
  },
};

export default FilterMenu;
