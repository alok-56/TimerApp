import {Linking, Alert} from 'react-native';
import DeviceInfo from 'react-native-device-info';
import checkVersion from 'react-native-store-version';

export const checkAndNavigateToPlayStore = async packageName => {
  try {
    const currentVersion = await DeviceInfo.getVersion();

    const check = await checkVersion({
      version: currentVersion,
      androidStoreURL: `https://play.google.com/store/apps/details?id=${packageName}`,
      country: 'jp',
    });

    if (check.result === 'new' && check.remote) {
      if (compareVersions(currentVersion, String(check.remote))) {
        navigateToPlayStore(packageName);
      }
    }
  } catch (error) {
    console.error('Error checking for update:', error);
  }
};

const compareVersions = (current, latest) => {
  if (!current || !latest) {
    console.error('Invalid version input:', current, latest);
    return false;
  }

  const currentStr = String(current);
  const latestStr = String(latest);

  const [currentMajor, currentMinor, currentPatch] = currentStr
    .split('.')
    .map(Number);
  const [latestMajor, latestMinor, latestPatch] = latestStr
    .split('.')
    .map(Number);

  if (currentMajor < latestMajor) return true;
  if (currentMajor === latestMajor && currentMinor < latestMinor) return true;
  if (
    currentMajor === latestMajor &&
    currentMinor === latestMinor &&
    currentPatch < latestPatch
  )
    return true;

  return false;
};

const navigateToPlayStore = packageName => {
  const playStoreUrl = `https://play.google.com/store/apps/details?id=${packageName}`;

  Alert.alert(
    'Update Available',
    'A new version of the app is available. Please update to continue using the app.',
    [{text: 'Update', onPress: () => Linking.openURL(playStoreUrl)}],
    {cancelable: false},
  );
};
