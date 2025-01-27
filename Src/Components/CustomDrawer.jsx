import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {useEffect, useState} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Dimensions,
  Image,
  PixelRatio,
} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Home from 'react-native-vector-icons/FontAwesome';

const {width} = Dimensions.get('window');
const scale = width / 375;

const normalize = size =>
  Math.round(PixelRatio.roundToNearestPixel(size * scale));

const CustomDrawer = props => {
  const {state, navigation} = props;
  const activeRoute = state.routeNames[state.index];
  const [email, setEmail] = useState('');

  useEffect(() => {
    GetLocaldata();
  }, []);

  const GetLocaldata = async () => {
    let email = await AsyncStorage.getItem('email');
    setEmail(email);
  };

  const HandleLogout = async () => {
    await AsyncStorage.removeItem("islogned");
    navigation.navigate('splash');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
        <View style={styles.profilePictureContainer}>
          <Image
            source={require('../Assests/Images/profilecir.png')}
            style={styles.profileImage}
          />
        </View>
        <Text style={styles.userName}>{email || 'Admin'}</Text>
      </View>

      <View style={styles.mainOptionsContainer}>
        {[
          {name: 'Home', route: 'dashboard', icon: 'home'},
          {name: 'History', route: 'history', icon: 'history'},
        ].map(item => (
          <TouchableOpacity
            key={item.route}
            style={[
              styles.button,
              activeRoute === item.route && styles.activeButton,
            ]}
            onPress={() => navigation.navigate(item.route)}>
            <View style={styles.menuItem}>
              {item.name === 'Home' ? (
                <Home
                  name={item.icon}
                  size={normalize(20)}
                  color={activeRoute === item.route ? '#552F62' : 'black'}
                />
              ) : item.name === 'History' ? (
                <Home
                  name={item.icon}
                  size={normalize(20)}
                  color={activeRoute === item.route ? '#552F62' : 'black'}
                />
              ) : (
                ''
              )}
              <Text
                style={[
                  styles.buttonText,
                  activeRoute === item.route && styles.activeButtonText,
                ]}>
                {item.name}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.logoutContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            HandleLogout();
          }}>
          <View style={styles.menuItem}>
            <AntDesign
              style={styles.icon}
              color={'#000'}
              name={'logout'}
              size={normalize(15)}
            />
            <Text style={styles.buttonText}>Logout</Text>
          </View>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={styles.closeDrawer}
        onPress={() => navigation.closeDrawer()}>
        <AntDesign
          style={styles.icon}
          color={'#552F62'}
          name={'closecircle'}
          size={normalize(20)}
        />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default CustomDrawer;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    flex: 1,
  },
  headerContainer: {
    width: '100%',
    backgroundColor: '#F3F1F4',
    paddingBottom: normalize(10),
    alignItems: 'center',
  },
  logoContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: normalize(10),
  },
  appTxt: {
    fontSize: normalize(16),
    color: '#7E69AE',
    fontWeight: 'bold',
  },
  retailTxt: {
    fontSize: normalize(16),
    color: '#552F62',
    fontWeight: 'bold',
  },
  mainOptionsContainer: {
    marginTop: normalize(15),
    paddingHorizontal: normalize(20),
  },
  button: {
    marginTop: normalize(10),
    borderRadius: 8,
  },
  activeButton: {
    backgroundColor: 'rgba(107, 187, 240, 0.5)',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingVertical: normalize(12),
    paddingHorizontal: normalize(15),
  },
  buttonText: {
    fontSize: normalize(14),
    color: 'black',
    fontWeight: '600',
    marginLeft: normalize(10),
  },
  activeButtonText: {
    color: '#552F62',
  },
  logoutContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    marginBottom: normalize(20),
    paddingHorizontal: normalize(20),
  },
  closeDrawer: {
    position: 'absolute',
    top: normalize(10),
    right: normalize(10),
  },
  profilePictureContainer: {
    width: normalize(64),
    height: normalize(64),
    borderRadius: normalize(32),
    borderWidth: 2,
    borderColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  profileImage: {
    width: normalize(60),
    height: normalize(60),
    borderRadius: normalize(30),
  },
  userName: {
    fontSize: normalize(14),
    fontWeight: '700',
    color: '#000',
    marginVertical: normalize(8),
  },
});
