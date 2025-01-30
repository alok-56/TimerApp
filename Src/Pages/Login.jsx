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
import {
  LoginApi,
  TokenCreation,
  UpdatePinApi,
  VerifyPinApi,
} from '../Api/Service';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {showMessage} from 'react-native-flash-message';

const Login = ({navigation}) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [pin, setPin] = useState('');
  const [islogin, setIslogin] = useState(false);
  const [passwordvisible, setPasswordVisible] = useState(true);
  const [loginpin, setLoginPin] = useState(false);
  const [reset, setReset] = useState(false);
  const [pinexisit, setPinexisit] = useState(false);

  useEffect(() => {
    Checkuser();
  }, []);

  const Checkuser = async () => {
    let logedin = await AsyncStorage.getItem('islogned');
    let logedpin = await AsyncStorage.getItem('pin');
    if (logedpin) {
      setPinexisit(true);
    } else {
      setPinexisit(false);
    }
    if (logedin !== null) {
      setIslogin(true);
    } else {
      setIslogin(false);
    }
  };

  const HandleLogin = async () => {
    setLoading(true);
    if (!email) {
      showMessage({
        message: 'Validation Error',
        description: 'Email is required',
        type: 'danger',
      });
      setLoading(false);
      return;
    }

    let token = await TokenCreation();
    await AsyncStorage.setItem('token', token?.access_token);
    if (token?.access_token) {
      let res = await LoginApi(email);
      if (res?.records?.length > 0) {
        if (pinexisit) {
          setLoginPin(true);
          HandleVerify();
        } else {
          if (!pin || pin.length !== 4) {
            setLoginPin(true);
            showMessage({
              message: 'Pin Setup',
              description: 'Enter Pin For Further Verification',
              type: 'info',
            });
            setLoading(false);
            return;
          } else {
            let res1 = await UpdatePinApi(res.records[0].Id, {
              Mpin__c: pin,
            });
            if (res1.ok) {
              await AsyncStorage.setItem('pin', pin);
              await AsyncStorage.setItem('islogned', 'true');
              await AsyncStorage.setItem('id', res.records[0].Id);
              await AsyncStorage.setItem('email', email);
              showMessage({
                message: 'Login Success',
                description: null,
                type: 'success',
              });
              navigation.navigate('dashboard');
              setLoading(false);
            } else {
              res1 = await res1.json();
              showMessage({
                message: res1[0]?.message,
                description: null,
                type: 'danger',
              });
            }
          }
        }

        setLoading(false);
      } else {
        showMessage({
          message: 'Error',
          description: 'Incorrect Email',
          type: 'danger',
        });
        setLoading(false);
      }
    }
  };

  const HandleVerify = async () => {
    if (!pin) {
      showMessage({
        message: 'Pin is required',
        description: 'Please Enter Pin',
        type: 'info',
      });
      setLoading(false);
      return;
    }
    setLoading(true);
    let token = await TokenCreation();
    await AsyncStorage.setItem('token', token?.access_token);
    let email = await AsyncStorage.getItem('email');
    let res = await VerifyPinApi(email, pin);
    // let logedpin = await AsyncStorage.getItem('pin');
    if (res?.records?.length > 0) {
      showMessage({
        message: 'Login Success',
        description: null,
        type: 'success',
      });
      navigation.navigate('dashboard');
      setLoading(false);
    } else {
      showMessage({
        message: 'Invalied Pin',
        description: 'Please Enter Vailed Pin To Access',
        type: 'danger',
      });
      setLoading(false);
    }
  };

  const HandleResetPin = async () => {
    setEmail('');
    setPin('');
    setLoginPin(false);
    setPinexisit(false);
    setReset(true);
  };

  const OtpSet = value => {
    setPin(value);
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
        <Text
          style={{
            fontSize: 30,
            marginTop: 30,
            fontWeight: '600',
            color: '#000',
          }}>
          Welcome Back
        </Text>
        <Text style={{fontSize: 30, fontWeight: '600', color: '#000'}}>
          to <Text style={{color: 'green'}}>BKS Attendee</Text>
        </Text>
        {reset ? (
          <>
            <Text style={{marginTop: 30, fontSize: 16, color: '#000'}}>
              Enter Your Employee Email to Reset Pin
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
                color: '#000',
              }}
              value={email}
              placeholder="Enter Employee Email"
              placeholderTextColor="#000"></TextInput>

            {loginpin ? (
              <>
                <View style={{flexDirection: 'row', width: '40%'}}>
                  <Text style={{marginTop: 10, fontSize: 16, color: '#000'}}>
                    Enter New Pin
                  </Text>

                  {passwordvisible ? (
                    <TouchableOpacity
                      onPress={() => setPasswordVisible(!passwordvisible)}
                      style={{marginTop: 10, marginLeft: 10}}>
                      <Image
                        style={{height: 20, width: 20}}
                        source={require('../Assests/Icons/hide.png')}></Image>
                    </TouchableOpacity>
                  ) : (
                    <TouchableOpacity
                      onPress={() => setPasswordVisible(!passwordvisible)}
                      style={{marginTop: 10, marginLeft: 10}}>
                      <Image
                        style={{height: 20, width: 20}}
                        source={require('../Assests/Icons/visible.png')}></Image>
                    </TouchableOpacity>
                  )}
                </View>

                <OtpSetup
                  OnOtpSet={OtpSet}
                  visible={passwordvisible}></OtpSetup>
              </>
            ) : null}

            {/* <TouchableOpacity
              onPress={HandleLogin}
              disabled={loading}
              style={{
                width: '95%',
                borderRadius: 8,
                height: 45,
                backgroundColor: 'green',
                marginTop: 20,
              }}>
              <View
                style={{
                  flex: 1,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                {loading ? (
                  <ActivityIndicator size={22} color="#fff"></ActivityIndicator>
                ) : (
                  <Text
                    style={{
                      fontSize: 18,
                      color: '#fff',
                      fontWeight: '700',
                    }}>
                    Reset
                  </Text>
                )}
              </View>
            </TouchableOpacity> */}
          </>
        ) : (
          <>
            {islogin ? (
              <>
                <View style={{flexDirection: 'row', width: '40%'}}>
                  <Text style={{marginTop: 10, fontSize: 16, color: '#000'}}>
                    Enter Your Pin
                  </Text>
                  {passwordvisible ? (
                    <TouchableOpacity
                      onPress={() => setPasswordVisible(!passwordvisible)}
                      style={{marginTop: 10, marginLeft: 10}}>
                      <Image
                        style={{height: 20, width: 20}}
                        source={require('../Assests/Icons/hide.png')}></Image>
                    </TouchableOpacity>
                  ) : (
                    <TouchableOpacity
                      onPress={() => setPasswordVisible(!passwordvisible)}
                      style={{marginTop: 10, marginLeft: 10}}>
                      <Image
                        style={{height: 20, width: 20}}
                        source={require('../Assests/Icons/visible.png')}></Image>
                    </TouchableOpacity>
                  )}
                </View>

                <OtpSetup
                  OnOtpSet={OtpSet}
                  visible={passwordvisible}></OtpSetup>
                {/* <View
                  style={{
                    width: '100%',
                    flexDirection: 'row',
                    justifyContent: 'flex-end',
                  }}>
                  <TouchableOpacity
                    onPress={HandleResetPin}
                    style={{marginTop: 12, width: 100}}>
                    <Text
                      style={{
                        fontWeight: '600',
                        letterSpacing: 1,
                        fontSize: 16,
                        color: 'red',
                      }}>
                      Reset Pin
                    </Text>
                  </TouchableOpacity>
                </View> */}

                <TouchableOpacity
                  onPress={HandleVerify}
                  disabled={loading}
                  style={{
                    width: '95%',
                    borderRadius: 8,
                    height: 45,
                    backgroundColor: 'green',
                    marginTop: 20,
                  }}>
                  <View
                    style={{
                      flex: 1,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    {loading ? (
                      <ActivityIndicator
                        size={22}
                        color="#fff"></ActivityIndicator>
                    ) : (
                      <Text
                        style={{
                          fontSize: 18,
                          color: '#fff',
                          fontWeight: '700',
                        }}>
                        Verify
                      </Text>
                    )}
                  </View>
                </TouchableOpacity>
              </>
            ) : (
              <>
                <Text style={{marginTop: 30, fontSize: 16, color: '#000'}}>
                  Enter Your Employee Email to access
                </Text>

                <TextInput
                  onChangeText={text => setEmail(text)}
                  value={email}
                  style={{
                    width: '95%',
                    height: 45,
                    borderWidth: 1,
                    marginTop: 10,
                    borderRadius: 8,
                    paddingLeft: 10,
                    color: '#000',
                  }}
                  placeholder="Enter Employee Email"
                  placeholderTextColor="#000"></TextInput>

                {loginpin ? (
                  <>
                    <View style={{flexDirection: 'row', width: '40%'}}>
                      {pinexisit ? (
                        <Text
                          style={{marginTop: 10, fontSize: 16, color: '#000'}}>
                          Enter Your Pin
                        </Text>
                      ) : (
                        <Text
                          style={{marginTop: 10, fontSize: 16, color: '#000'}}>
                          Set Your Pin
                        </Text>
                      )}

                      {passwordvisible ? (
                        <TouchableOpacity
                          onPress={() => setPasswordVisible(!passwordvisible)}
                          style={{marginTop: 10, marginLeft: 10}}>
                          <Image
                            style={{height: 20, width: 20}}
                            source={require('../Assests/Icons/hide.png')}></Image>
                        </TouchableOpacity>
                      ) : (
                        <TouchableOpacity
                          onPress={() => setPasswordVisible(!passwordvisible)}
                          style={{marginTop: 10, marginLeft: 10}}>
                          <Image
                            style={{height: 20, width: 20}}
                            source={require('../Assests/Icons/visible.png')}></Image>
                        </TouchableOpacity>
                      )}
                    </View>

                    <OtpSetup
                      OnOtpSet={OtpSet}
                      visible={passwordvisible}></OtpSetup>

                    {/* <View
                      style={{
                        width: '100%',
                        flexDirection: 'row',
                        justifyContent: 'flex-end',
                      }}>
                      <TouchableOpacity
                        onPress={HandleResetPin}
                        style={{marginTop: 12, width: 100}}>
                        <Text
                          style={{
                            fontWeight: '600',
                            letterSpacing: 1,
                            fontSize: 16,
                            color: 'red',
                          }}>
                          Reset Pin
                        </Text>
                      </TouchableOpacity>
                    </View> */}
                  </>
                ) : null}

                <TouchableOpacity
                  onPress={HandleLogin}
                  style={{
                    width: '95%',
                    borderRadius: 8,
                    height: 45,
                    backgroundColor: 'green',
                    marginTop: 20,
                  }}
                  disabled={loading}>
                  <View
                    style={{
                      flex: 1,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    {loading ? (
                      <ActivityIndicator
                        size={22}
                        color="#fff"></ActivityIndicator>
                    ) : (
                      <Text
                        style={{
                          fontSize: 18,
                          color: '#fff',
                          fontWeight: '700',
                        }}>
                        Login
                      </Text>
                    )}
                  </View>
                </TouchableOpacity>
              </>
            )}
          </>
        )}
      </View>
    </View>
  );
};

export default Login;
