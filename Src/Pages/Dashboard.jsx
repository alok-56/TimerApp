import React, {useState, useEffect} from 'react';
import {
  Image,
  Text,
  TouchableOpacity,
  View,
  Platform,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Geolocation from 'react-native-geolocation-service';
import DeviceInfo from 'react-native-device-info';
import {request, PERMISSIONS, RESULTS} from 'react-native-permissions';
import {
  AttendanceCreation,
  AttendanceUpdate,
  ShiftDetails,
  TokenCreation,
} from '../Api/Service';
import {IpUrl} from '../Api/Constants';
import LinearGradient from 'react-native-linear-gradient';
import {showMessage} from 'react-native-flash-message';
import BottomModal from '../Components/BottomModal';
import {useNavigation} from '@react-navigation/native';

const Dashboard = ({navigation}) => {
  const [startTime, setStartTime] = useState(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [timerActive, setTimerActive] = useState(false);
  const [deviceInfo, setDeviceInfo] = useState(null);
  const [location, setLocation] = useState(null);
  const [isVisible, setIsvisible] = useState(false);
  const [isloading, setIsloading] = useState(false);

  const {openDrawer, closeDrawer, toggleDrawer} = useNavigation();

  useEffect(() => {
    const loadStartTime = async () => {
      const storedStartTime = await AsyncStorage.getItem('startTime');
      if (storedStartTime) {
        setStartTime(parseInt(storedStartTime, 10));
        setTimerActive(true);
      }
    };
    loadStartTime();

    let interval;
    if (timerActive && startTime) {
      interval = setInterval(() => {
        const currentTime = Date.now();
        setElapsedTime(currentTime - startTime);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timerActive, startTime]);

  useEffect(() => {
    handleTakepermission();
  }, []);

  const handleTakepermission = async () => {
    await requestLocationPermission();
    await getLocation();
  };

  const handleCheckIn = async () => {
    setIsvisible(false);
    setIsloading(true);

    // formatting time 
    const newStartTime = Date.now();
    const currentDate = new Date();
    const australiaTime = new Intl.DateTimeFormat('en-AU', {
      timeZone: 'Australia/Sydney',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    }).format(currentDate);
    const [formattedDate, formattedTimeIn] = australiaTime.split(', ');
    const dateParts = formattedDate.split('/');
    const formattedDateString = `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`;
    const [hours, minutes, seconds] = formattedTimeIn.split(':');
    const formattedTimeString = `${hours}:${minutes}:${seconds}.000Z`;

    try {

      // collection location
      await requestLocationPermission();
      await getLocation();
      if (!location) {
        showMessage({
          message: 'Error',
          description: 'Unable to fetch location. Try again',
          type: 'danger',
        });
        setIsloading(false);
        return;
      }

      let id = await AsyncStorage.getItem('id');
      let shiftId = await ShiftDetails(id);

      // Token generation
      let token = await TokenCreation();
      await AsyncStorage.setItem('token', token.access_token);

      // api call
      const attendanceData = {
        Shift__c: shiftId.records[0].Id,
        Contact__c: id,
        Logged_Date__c: formattedDateString,
        Login_Location__Latitude__s: location?.latitude,
        Login_Location__Longitude__s: location?.longitude,

        Time_In__c: formattedTimeString,
      };
      const result = await AttendanceCreation(attendanceData);
      if (result.success) {
        setStartTime(newStartTime);
        setElapsedTime(0);
        await AsyncStorage.setItem('startTime', newStartTime.toString());
        await AsyncStorage.setItem('checkid', result.id);
        setTimerActive(true);
        showMessage({
          message: 'Success',
          description: 'Attendance created successfully',
          type: 'success',
        });
      } else {
        showMessage({
          message: 'Error',
          description: result[0]?.message,
          type: 'danger',
        });
      }
    } catch (error) {
      console.error('Error during check-in:', error);
      showMessage({
        message: 'Error',
        description: 'An unexpected error occurred.',
        type: 'danger',
      });
    } finally {
      setIsloading(false);
    }
  };

  const handleCheckOut = async () => {
    setIsvisible(false);
    setIsloading(true);

    // formating time and date
    const currentDate = new Date();
    const australiaTime = new Intl.DateTimeFormat('en-AU', {
      timeZone: 'Australia/Sydney',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    }).format(currentDate);
    const [formattedDate, formattedTimeIn] = australiaTime.split(', ');
    const dateParts = formattedDate.split('/');
    const formattedDateString = `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`;
    const [hours, minutes, seconds] = formattedTimeIn.split(':');
    const formattedTimeString = `${hours}:${minutes}:${seconds}.000Z`;

    // collecting ids
    let id = await AsyncStorage.getItem('id');
    let check = await AsyncStorage.getItem('checkid');
    let shiftId = await ShiftDetails(id);

    // Token Generation
    let token = await TokenCreation();
      await AsyncStorage.setItem('token', token.access_token);

      // api call
    const attendanceData = {
      Shift__c: shiftId.records[0].Id,
      Contact__c: id,
      Time_out__c: formattedTimeString,
    };
    try {
      const result = await AttendanceUpdate(attendanceData, check);
      if (result.success) {
        setTimerActive(true);
        setStartTime(null);
        setElapsedTime(0);
        setTimerActive(false);
        await AsyncStorage.removeItem('startTime');
        setDeviceInfo(null);
        setLocation(null);
        showMessage({
          message: 'Success',
          description: 'Successfully Checked Out',
          type: 'success',
        });
        setIsloading(false);
      } else {
        showMessage({
          message: 'Error',
          description: result[0]?.message,
          type: 'danger',
        });
        setIsvisible(false);
        setIsloading(false);
      }
    } catch (error) {
      console.error('Error creating attendance:', error);
      setIsvisible(false);
      setIsloading(false);
    }
  };

  const formatTime = timeInMillis => {
    const seconds = Math.floor(timeInMillis / 1000) % 60;
    const minutes = Math.floor(timeInMillis / (1000 * 60)) % 60;
    const hours = Math.floor(timeInMillis / (1000 * 60 * 60)) % 24;

    return `${hours.toString().padStart(2, '0')}:${minutes
      .toString()
      .padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const getDeviceInfo = async () => {
    try {
      const deviceId = await DeviceInfo.getUniqueId();
      const response = await fetch(IpUrl);
      const data = await response.json();

      setDeviceInfo({
        deviceId,
        ipAddress: data.ip,
      });
    } catch (error) {
      setIsvisible(false);
      setIsloading(false);
      console.error('Error getting device info:', error);
    }
  };

  const getLocation = async () => {
    return new Promise((resolve, reject) => {
      Geolocation.getCurrentPosition(
        position => {
          const {latitude, longitude} = position.coords;
          if (latitude && longitude) {
            setLocation({latitude, longitude});
            resolve({latitude, longitude});
          } else {
            reject('Location not available');
          }
        },
        error => {
          console.error('Error getting location:', error);
          setLocation(null);
          reject('Failed to get location');
        },
        {enableHighAccuracy: true, timeout: 20000, maximumAge: 10000},
      );
    });
  };

  const requestLocationPermission = async () => {
    try {
      let permissionStatus;
      if (Platform.OS === 'ios') {
        permissionStatus = await request(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);
      } else if (Platform.OS === 'android') {
        permissionStatus = await request(
          PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
        );
      }

      if (permissionStatus === RESULTS.GRANTED) {
        console.log('Permission Granted');
      } else {
        showMessage({
          message: 'Permission Denied',
          description: 'Location permission is required to proceed.',
          type: 'danger',
        });
        setIsvisible(false);
        setIsloading(false);
      }
    } catch (error) {
      console.error('Error requesting location permission:', error);
      setIsvisible(false);
      setIsloading(false);
    }
  };

  return (
    <LinearGradient
      colors={['#4c669f', '#3b5998', '#192f5d']}
      style={{flex: 1}}>
      <View style={styles.container}>
        <TouchableOpacity onPress={openDrawer} style={styles.menuButton}>
          <View
            style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <Text style={styles.menuText}>☰</Text>
          </View>
        </TouchableOpacity>

        <View
          style={{
            width: '90%',
            alignSelf: 'center',
            backgroundColor: '#fff',
            elevation: 1,
            height: 200,
            borderRadius: 8,
          }}>
          <View
            style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <Text
              style={{textAlign: 'center', fontSize: 16, fontWeight: '500'}}>
              Attendance Self Service
            </Text>
            <Text
              style={{
                textAlign: 'center',
                marginTop: 5,
                fontSize: 25,
                fontWeight: '600',
              }}>
              {timerActive
                ? formatTime(elapsedTime)
                : startTime
                ? formatTime(elapsedTime)
                : '00:00:00'}
            </Text>
            <View
              style={{
                flexDirection: 'row',
                width: '100%',
                justifyContent: 'center',
                marginTop: 25,
              }}>
              <TouchableOpacity
                onPress={() => setIsvisible(true)}
                style={{
                  width: 100,
                  height: 30,
                  backgroundColor: timerActive ? 'gray' : 'green',
                  borderRadius: 5,
                }}
                disabled={timerActive}>
                <View
                  style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  {isloading && !timerActive ? (
                    <ActivityIndicator
                      color={'#000'}
                      size={20}></ActivityIndicator>
                  ) : (
                    <Text
                      style={{
                        textAlign: 'center',
                        color: '#fff',
                        fontWeight: '600',
                      }}>
                      Check in
                    </Text>
                  )}
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setIsvisible(true)}
                style={{
                  width: 100,
                  marginLeft: 20,
                  height: 30,
                  backgroundColor: !timerActive ? 'gray' : 'red',
                  borderRadius: 5,
                }}
                disabled={!timerActive}>
                <View
                  style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  {isloading && timerActive ? (
                    <ActivityIndicator
                      color={'#000'}
                      size={20}></ActivityIndicator>
                  ) : (
                    <Text
                      style={{
                        textAlign: 'center',
                        color: '#fff',
                        fontWeight: '600',
                      }}>
                      Check Out
                    </Text>
                  )}
                </View>
              </TouchableOpacity>
            </View>
          </View>

          <Image
            style={{
              position: 'absolute',
              height: 50,
              width: 50,
              top: -20,
              alignSelf: 'center',
            }}
            source={require('../Assests/Icons/check.png')}
          />
        </View>
      </View>
      <BottomModal
        isVisible={isVisible}
        onConfirm={timerActive ? handleCheckOut : handleCheckIn}
        onClose={() => setIsvisible(false)}></BottomModal>
    </LinearGradient>
  );
};

export default Dashboard;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuButton: {
    height: 50,
    width: 50,
    position: 'absolute',
    top: 20,
    left: 18,
    backgroundColor: '#fff',
    borderRadius: 25,
    zIndex: 2,
  },
  menuText: {
    fontSize: 24,
    color: '#333',
    textAlign: 'center',
  },
});
