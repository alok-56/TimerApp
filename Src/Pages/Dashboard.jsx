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
import {request, PERMISSIONS, RESULTS, check} from 'react-native-permissions';
import {
  AttendanceCreation,
  AttendanceUpdate,
  ShiftDetails,
} from '../Api/Service';
import {IpUrl} from '../Api/Constants';
import LinearGradient from 'react-native-linear-gradient';
import {showMessage} from 'react-native-flash-message';
import BottomModal from '../Components/BottomModal';
import CustomDrawer from '../Components/CustomDrawer';
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

  const handleCheckIn = async () => {
    setIsvisible(false);
    setIsloading(true);
    const newStartTime = Date.now();
    const currentDate = new Date();
    const formattedDate = currentDate.toISOString().split('T')[0];

    const formattedTimeIn = new Date(newStartTime)
      .toISOString()
      .split('T')[1]
      .split('.')[0];

    getDeviceInfo();
    await requestLocationPermission();
    getLocation();

    let id = await AsyncStorage.getItem('id');
    let shiftId = await ShiftDetails(id);

    setIsloading(false);
    const attendanceData = {
      Shift__c: shiftId.records[0].Id,
      Contact__c: id,
      Logged_Date__c: formattedDate,
      Login_Location__Latitude__s: location?.latitude,
      Login_Location__Longitude__s: location?.longitude,
      Time_In__c: formattedTimeIn,
    };

    try {
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
      
      setIsvisible(false);
      setIsloading(false);
    }
  };

  const handleCheckOut = async () => {
    setIsvisible(false);
    setIsloading(true);
    const currentDate = new Date();
    const formattedTimeout = new Date(currentDate)
      .toISOString()
      .split('T')[1]
      .split('.')[0];

    getDeviceInfo();
    await requestLocationPermission();
    getLocation();
    let id = await AsyncStorage.getItem('id');
    let check = await AsyncStorage.getItem('checkid');
    let shiftId = await ShiftDetails(id);
    const attendanceData = {
      Shift__c: shiftId.records[0].Id,
      Contact__c: id,
      Time_out__c: formattedTimeout,
    };
    try {
      const result = await AttendanceUpdate(attendanceData, check);
      console.log(result);
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
          description: 'successfully Checked Out',
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

  const getLocation = () => {
    Geolocation.getCurrentPosition(
      position => {
        const {latitude, longitude} = position.coords;
        setLocation({latitude, longitude});
      },
      error => {
        setIsvisible(false);
        setIsloading(false);
        console.error('Error getting location:', error);
        setLocation(null);
      },
      {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
    );
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
        console.log('Location permission granted');
      } else if (permissionStatus === RESULTS.DENIED) {
        console.log('Location permission denied');
      } else if (permissionStatus === RESULTS.BLOCKED) {
        console.log('Location permission blocked');
      }
    } catch (error) {
      setIsvisible(false);
      setIsloading(false);
      console.error('Error requesting location permission:', error);
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
