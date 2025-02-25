import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Menu, MenuOptions, MenuOption, MenuTrigger } from 'react-native-popup-menu';
import { Checkbox } from 'react-native-paper';

const FilterMenu = ({ apiOptions, selectedAPIs, onSelectionChange }) => {
  const [selected, setSelected] = useState(selectedAPIs || []);

  useEffect(() => {
    setSelected(selectedAPIs); // Update internal state when props change
  }, [selectedAPIs]);

  const toggleSelection = (api) => {
    const updatedSelection = selected.includes(api)
      ? selected.filter((item) => item !== api)
      : [...selected, api];

    setSelected(updatedSelection);
    onSelectionChange(updatedSelection); // Notify parent of changes
  };

  return (
    <View style={{ alignItems: 'flex-start', paddingLeft: 20, marginTop: 10 }}>
      <Menu>
        <MenuTrigger customStyles={{ TriggerTouchableComponent: TouchableOpacity }}>
          <View style={{ backgroundColor: '#6785c7', paddingVertical: 12, paddingHorizontal: 20, borderRadius: 10 }}>
            <Text style={{ color: '#fff', fontSize: 16, fontWeight: 'bold' }}>
              Filters ({selected.length} selected)
            </Text>
          </View>
        </MenuTrigger>
        <MenuOptions
          customStyles={{
            optionsContainer: {
              padding: 10,
            },
          }}
          // ✅ Menu will not close when an option is selected
          renderOptionsContainer={({ children }) => <View>{children}</View>}
        >
          {apiOptions.map((api) => (
            <MenuOption key={api} onSelect={() => toggleSelection(api)} disableTouchable={true}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Checkbox
                  status={selected.includes(api) ? 'checked' : 'unchecked'}
                  onPress={() => toggleSelection(api)} // Prevent menu closing on press
                />
                <Text style={{ fontSize: 16 }}>{api}</Text>
              </View>
            </MenuOption>
          ))}
        </MenuOptions>
      </Menu>
    </View>
  );
};

export default FilterMenu;
