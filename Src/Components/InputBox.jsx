import React, {useState, useEffect} from 'react';
import {StyleSheet, Text, TextInput, View} from 'react-native';

const InputBox = ({label, value, placeholder, onChangeText,type}) => {
  return (
    <View style={styles.container}>
      {label && (
        <Text
          style={[
            styles.label,
            {
              top: -10,
              fontSize: 14,
            },
          ]}>
          {label}
        </Text>
      )}

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.textInput}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor="gray"
          keyboardType={type}
        />
      </View>
    </View>
  );
};

export default InputBox;

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    padding: 16,
    position: 'relative',
  },
  label: {
    position: 'absolute',
    left: 22,

    zIndex: 999,
    backgroundColor: 'white',
    paddingHorizontal: 8,
    color: 'blue',
    transition: 'all 0.2s ease',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#552F62',
    borderWidth: 1,
    borderRadius: 8,
    height: 50,
    paddingHorizontal: 8,
    marginTop: -20,
  },
  textInput: {
    flex: 1,
    height: '100%',
    fontSize: 16,
    paddingVertical: 0,
    paddingRight: 32,
  },
});
