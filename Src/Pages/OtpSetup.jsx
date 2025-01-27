import React, { useEffect } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { OtpInput } from 'react-native-otp-entry';

const OtpSetup = ({ OnOtpSet, visible }) => {
  const handleOtpChange = (text) => {
    // If the OTP length is exactly 4, call OnOtpSet with the entered text
   
      OnOtpSet(text);
   
  };

  return (
    <View style={{ width: '95%', marginTop: 10 }}>
      <OtpInput
        numberOfDigits={4}
        focusColor="green"
        autoFocus={false}
        hideStick={false}
        blurOnFilled={true}
        disabled={false}
        type="numeric"
        secureTextEntry={visible}
        focusStickBlinkingDuration={500}
        onTextChange={handleOtpChange}  
        onFilled={handleOtpChange}   
        onTex
        textInputProps={{
          accessibilityLabel: 'One-Time Password',
        }}
        theme={{
          filledPinCodeContainerStyle: {
            borderRadius: 8,
            height: 60,
            width: 60,
            borderColor: 'green',
          },
          focusedPinCodeContainerStyle: {
            borderColor: 'red',
            borderRadius: 8,
            height: 60,
            width: 60,
          },
          pinCodeContainerStyle: {
            borderRadius: 8,
            height: 60,
            width: 60,
            borderColor: '#000',
          },
        }}
      />
    </View>
  );
};

export default OtpSetup;
