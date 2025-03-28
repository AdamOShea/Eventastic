// A popup menu component allowing selection and toggling of filter options, using checkboxes.

import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Menu, MenuOptions, MenuOption, MenuTrigger } from 'react-native-popup-menu';
import { Checkbox } from 'react-native-paper';

const FilterMenu = ({ apiOptions, selectedAPIs, onSelectionChange }) => {
  const [selected, setSelected] = useState(selectedAPIs || []);

  useEffect(() => {
    setSelected(selectedAPIs); 
  }, [selectedAPIs]);

  console.log('FilterMenu apiOptions:', apiOptions); 

  // Updates the selected APIs state and notifies parent component about the changes.
  const toggleSelection = (api) => {
    const updatedSelection = selected.includes(api)
      ? selected.filter((item) => item !== api)
      : [...selected, api];

    setSelected(updatedSelection);
    onSelectionChange(updatedSelection); 
  };

  return (
    <View style={{ alignItems: 'flex-start', paddingLeft: 20, marginTop: 10, marginBottom: 10, }}>
      <Menu>
        <MenuTrigger customStyles={{ TriggerTouchableComponent: TouchableOpacity }}>
          <View style={{ backgroundColor: '#6785c7', paddingVertical: 12, paddingHorizontal: 20, borderRadius: 10 }}>
            <Text style={{ color: '#fff', fontSize: 16, fontWeight: 'bold' }}>
              Filters ({selected.length} selected)
            </Text>
          </View>
        </MenuTrigger>
        <MenuOptions>
          {apiOptions.length > 0 ? (
            apiOptions.map((api) => (
              <MenuOption key={api} onSelect={() => toggleSelection(api)} disableTouchable={true}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Checkbox
                    status={selected.includes(api) ? 'checked' : 'unchecked'}
                    onPress={() => toggleSelection(api)}
                  />
                  <Text style={{ fontSize: 16 }}>{api}</Text>
                </View>
              </MenuOption>
            ))
          ) : (
            <Text style={{ padding: 10 }}>No APIs available.</Text> 
          )}
        </MenuOptions>
      </Menu>
    </View>
  );
};

export default FilterMenu;
