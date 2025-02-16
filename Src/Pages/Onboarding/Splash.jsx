import {useNavigation} from '@react-navigation/native';
import React, {useEffect} from 'react';
import {View, Text, StyleSheet, Image} from 'react-native';
import {Route} from '../../Constant/Route';

const Splash = () => {
  const navigation = useNavigation();
  useEffect(() => {
    setTimeout(() => {
      navigation.navigate(Route.BOTTOMTAB);
    }, 2000);
  }, []);
  return (
    <View style={styles.container}>
      <Image
        style={styles.img}
        source={require('../../Assets/logo.jpg')}></Image>
      <Text style={styles.brand}>ShopWatch Timer</Text>
    </View>
  );
};

export default Splash;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  img: {
    height: 150,
    width: 200,
  },
  brand: {
    fontSize: 28,
    fontWeight: '600',
    color: '#000',
    letterSpacing: 1,
  },
});
