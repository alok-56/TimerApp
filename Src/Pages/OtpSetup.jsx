import React from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
import {OtpInput} from 'react-native-otp-entry';

const OtpSetup = ({OnOtpSet}) => {
  return (
    <View style={{width: '95%', marginTop: 10}}>
      <OtpInput
        numberOfDigits={4}
        focusColor="green"
        autoFocus={false}
        hideStick={true}
        blurOnFilled={true}
        disabled={false}
        type="numeric"
        secureTextEntry={false}
        focusStickBlinkingDuration={500}
        onFocus={() => console.log('Focused')}
        onBlur={() => console.log('Blurred')}
        onTextChange={text => console.log(text)}
        onFilled={text => OnOtpSet(text)}
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
