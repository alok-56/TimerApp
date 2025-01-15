import AsyncStorage from '@react-native-async-storage/async-storage';
import {useFocusEffect} from '@react-navigation/native';
import React, {useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Easing,
  Image,
} from 'react-native';
import {LinearGradient} from 'react-native-linear-gradient';

const CustomDrawer = ({isDrawerVisible, onClose, Handlelogout}) => {
  const drawerWidth = 250;
  const drawerAnim = new Animated.Value(-drawerWidth);

  useEffect(() => {
    if (isDrawerVisible) {
      console.log('Drawer Animation Value:', drawerAnim);
      Animated.timing(drawerAnim, {
        toValue: 0,
        duration: 300,
        easing: Easing.ease,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(drawerAnim, {
        toValue: -drawerWidth,
        duration: 300,
        easing: Easing.ease,
        useNativeDriver: true,
      }).start();
    }
  }, [isDrawerVisible]);

  return (
    <Animated.View
      style={[styles.drawerContainer, {transform: [{translateX: drawerAnim}]}]}>
      <LinearGradient colors={['#fff', '#fff']} style={styles.drawerBackground}>
        <TouchableOpacity style={styles.overlay} />

        <View style={styles.drawerContent}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <View
              style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
              <Text style={styles.closeButtonText}>X</Text>
            </View>
          </TouchableOpacity>

          <View
            style={{
              height: 100,
              width: 100,
              backgroundColor: '#fff',
              borderRadius: 50,
              alignSelf: 'center',
              marginTop: 30,
            }}>
            <Image
              style={{
                height: 100,
                width: 100,
                backgroundColor: '#fff',
                borderRadius: 50,
                alignSelf: 'center',
              }}
              source={require('../Assests/Images/profilecir.png')}></Image>
          </View>
          <Text
            style={{
              textAlign: 'center',
              fontSize: 18,
              fontWeight: '700',
              marginTop: 5,
            }}>
            Admin
          </Text>
        </View>
        <TouchableOpacity
          style={{
            position: 'absolute',
            bottom: '10%',
            flexDirection: 'row',
            alignSelf: 'center',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#4c669f',
            padding: 10,
            borderRadius: 8,
          }}
          onPress={Handlelogout}>
          <Image
            style={{height: 30, width: 30, tintColor: '#fff'}}
            source={require('../Assests/Icons/logout.png')}></Image>
          <View>
            <Text
              style={{
                fontSize: 18,
                fontWeight: '600',
                marginLeft: 5,
                color: '#fff',
              }}>
              Logout
            </Text>
          </View>
        </TouchableOpacity>
      </LinearGradient>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  drawerContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    width: 250,
    zIndex: 1,
    elevation: 20,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 0,
  },
  drawerBackground: {
    flex: 1,
    borderRadius: 5,
    width: '100%',
  },
  drawerContent: {
    height: 170,
    width: '100%',
    backgroundColor: '#efeded',
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    height: 30,
    width: 30,
    backgroundColor: '#000',
    borderRadius: 15,
    zIndex: 2,
  },
  closeButtonText: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  drawerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 40,
  },
  drawerItem: {
    marginBottom: 20,
  },
  drawerItemText: {
    fontSize: 18,
    color: '#fff',
  },
});

export default CustomDrawer;
