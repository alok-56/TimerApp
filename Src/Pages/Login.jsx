import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import OtpSetup from './OtpSetup';
import {authenticateUser, isBiometricSupported} from '../Helper/BioMetric';
import {LoginApi, TokenCreation} from '../Api/Service';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {showMessage} from 'react-native-flash-message';

const Login = ({navigation}) => {
  const [pinoption, setPinOption] = useState(false);
  const [email, setEmail] = useState('');
  const [pin, setPin] = useState('');
  const [islogin, setIslogin] = useState(false);
  const [isLoading, setIsloading] = useState(false);
  useEffect(() => {
    check();
  }, []);

  const check = async () => {
    let logedin = await AsyncStorage.getItem('islogned');
    const isSupported = await isBiometricSupported();
    if (logedin !== null) {
      setIslogin(true);
      if (isSupported) {
        let {success, method} = await authenticateUser();
        if (method === 'cancel') {
          setPinOption(true);
        }
        if (success) {
          navigation.navigate('dashboard');
        }
      } else {
        setPinOption(true);
      }
    } else {
      setIslogin(false);
      if (isSupported) {
        let {success, method} = await authenticateUser();
        if (success) {
        }
      } else {
        setPinOption(null);
      }
    }
  };

  const HandleLogin = async () => {
    setIsloading(true);
    if (islogin) {
      if (!pin) {
        showMessage({
          message: 'Pin is required',
          description: 'Please Enter Pin',
          type: 'danger',
        });
        setIsloading(false);
        return;
      }
      let logedpin = await AsyncStorage.getItem('pin');
      if (logedpin === pin) {
        showMessage({
          message: 'Login Success',
          description: null,
          type: 'success',
        });

        navigation.navigate('dashboard');
        setIsloading(false);
      } else {
        showMessage({
          message: 'Invalied Pin',
          description: 'Please Enter Vailed Pin To Access',
          type: 'danger',
        });
        setIsloading(false);
      }
    } else {
      if (!email) {
        showMessage({
          message: 'Email is required',
          description: 'Please Enter  Email',
          type: 'danger',
        });
        setIsloading(false);
        return;
      }
      let token = await TokenCreation();
      await AsyncStorage.setItem('token', token.access_token);
      if (token?.access_token) {
        await AsyncStorage.setItem('email',email)
        LoginApi(email).then(async res => {
          console.log(res)
          if (res.done && res?.totalSize > 0) {
            const isSupported = await isBiometricSupported();
            if (isSupported) {
              let {success, method} = await authenticateUser();
              if (success) {
                
                await AsyncStorage.setItem('pin', pin);
                await AsyncStorage.setItem('islogned', 'true');
                await AsyncStorage.setItem('id', res.records[0].Id);
                showMessage({
                  message: 'Login Success',
                  description: null,
                  type: 'success',
                });
                navigation.navigate('dashboard');
                setIsloading(false);
              }
            } else {
              setPinOption(true);
              if (pin) {
                await AsyncStorage.setItem('pin', pin);
                await AsyncStorage.setItem('islogned', 'true');
                await AsyncStorage.setItem('id', res.records[0].Id);
                showMessage({
                  message: 'Login Success',
                  description: null,
                  type: 'success',
                });
                navigation.navigate('dashboard');
                setIsloading(false);
              } else {
                showMessage({
                  message: 'Pin Required',
                  description: 'Enter Pin For Further Verification',
                  type: 'info',
                });
                setIsloading(false);
              }
            }
          } else {
            setIsloading(false);
            showMessage({
              message: 'Incorrect Email',
              description: 'Please Enter Vailed Email',
              type: 'danger',
            });
          }
        });
      }
    }
  };

  const OnOtpSet = data => {
    setPin(data);
  };

  return (
    <View style={{flex: 1}}>
      <View
        style={{
          width: '85%',
          alignSelf: 'center',
        }}>
        <Image
          style={{height: 80, width: 80, marginTop: 40}}
          source={require('../Assests/Icons/attendance.png')}></Image>
        <Text style={{fontSize: 30, marginTop: 30, fontWeight: '600'}}>
          Welcome Back
        </Text>
        <Text style={{fontSize: 30, fontWeight: '600'}}>
          to <Text style={{color: 'green'}}>BKS Attendee</Text>
        </Text>

        {!islogin ? (
          <>
            <Text style={{marginTop: 30, fontSize: 16}}>
              Enter Your Employee Email to access
            </Text>

            <TextInput
              onChangeText={text => setEmail(text)}
              style={{
                width: '95%',
                height: 45,
                borderWidth: 1,
                marginTop: 10,
                borderRadius: 8,
                paddingLeft: 10,
              }}
              placeholder="Enter Employee Email"></TextInput>
          </>
        ) : null}

        {pinoption ? (
          <>
            {islogin ? (
              <>
                <Text style={{marginTop: 10, fontSize: 16}}>
                  Enter Your Pin
                </Text>
              </>
            ) : (
              <Text style={{marginTop: 10, fontSize: 16}}>Setup Login Pin</Text>
            )}
            <OtpSetup OnOtpSet={OnOtpSet}></OtpSetup>
          </>
        ) : null}

        <TouchableOpacity
          onPress={() => HandleLogin()}
          style={{
            width: '95%',
            borderRadius: 8,
            height: 45,
            backgroundColor: 'green',
            marginTop: 20,
          }}
          disabled={isLoading}>
          <View
            style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            {isLoading ? (
              <ActivityIndicator size={22}></ActivityIndicator>
            ) : (
              <Text style={{fontSize: 18, color: '#fff', fontWeight: '700'}}>
                Login
              </Text>
            )}
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Login;
