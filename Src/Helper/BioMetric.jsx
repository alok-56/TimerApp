import ReactNativeBiometrics from 'react-native-biometrics';
import {Alert} from 'react-native';

const rnBiometrics = new ReactNativeBiometrics();

export const isBiometricSupported = async () => {
  try {
    const result = await rnBiometrics.isSensorAvailable();
    return result.available;
  } catch (error) {
    return false;
  }
};

export const authenticateUser = async (
  promptMessage = 'Confirm fingerprint or face scan',
) => {
  try {
    const biometricResult = await rnBiometrics.simplePrompt({
      promptMessage: promptMessage,
    });

    const {success} = biometricResult;

    if (success) {
      return {success: true, method: 'biometrics'};
    } else {
      return {success: false, method: 'none'};
    }
  } catch (error) {
    console.log('Biometric authentication failed:', error);
    return {success: false, method: 'none'};
  }
};
