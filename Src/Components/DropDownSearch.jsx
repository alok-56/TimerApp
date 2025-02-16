import React, {useState} from 'react';
import {StyleSheet, View, Text} from 'react-native';
import {Dropdown} from 'react-native-element-dropdown';
import AntDesign from 'react-native-vector-icons/AntDesign';

const DropdownSearch = ({label, onSelect,option}) => {
  const [value, setValue] = useState(null);

  
  return (
    <View style={styles.container}>
      {label && (
        <Text style={styles.label}>{label}</Text>
      )}

      <View style={styles.dropdownContainer}>
        <Dropdown
          style={styles.dropdown}
          placeholderStyle={styles.placeholder}
          selectedTextStyle={styles.selectedTextStyle}
          data={option}
          maxHeight={200}
          labelField="label"
          valueField="value"
          placeholder="Select an option"
          value={value}
          onChange={item => {
            setValue(item.value);
            onSelect && onSelect(item.value);
          }}
          renderLeftIcon={() => (
            <AntDesign
              name="Safety"
              size={20}
              color="#552F62"
              style={styles.icon}
            />
          )}
        />
      </View>
    </View>
  );
};

export default DropdownSearch;

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    padding: 16,
    position: 'relative',
  },
  label: {
    position: 'absolute',
    left: 22,
    top: -10,
    fontSize: 14,
    backgroundColor: 'white',
    paddingHorizontal: 8,
    color: 'blue',
    zIndex: 999,
  },
  dropdownContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#552F62',
    borderWidth: 1,
    borderRadius: 8,
    height: 50,
    paddingHorizontal: 8,
    marginTop: -20,
    backgroundColor: 'white',
  },
  dropdown: {
    flex: 1,
    height: '100%',
    fontSize: 16,
    paddingVertical: 0,
    paddingRight: 32,
    backgroundColor: 'white',
  },
  icon: {
    marginRight: 5,
  },
  placeholder: {
    fontSize: 14,
    color: 'gray',
  },
  selectedTextStyle: {
    fontSize: 16,
    color: 'black',
  },
});
