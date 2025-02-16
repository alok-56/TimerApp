import React from 'react';
import {StyleSheet, Text, View} from 'react-native';

const Headers = ({heading,children}) => {
  return (
    <View style={styles.headpart}>
      <View style={styles.innerContainer}>
        <View style={styles.row}>
          <Text style={styles.text}>{heading}</Text>
          {children}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  headpart: {
    width: '100%',
    height: 60,
    backgroundColor: '#fff',
    elevation: 2,
    justifyContent: 'center',
  },
  innerContainer: {
    width: '90%',
    alignSelf: 'center',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  text:{
    fontSize:20,
    color:"rgb(103, 64, 242)",
    fontWeight:"600",
    letterSpacing:0,
    fontStyle:"normal",
    fontFamily: 'Montserrat',
  }
});

export default Headers;
