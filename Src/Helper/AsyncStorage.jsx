import AsyncStorage from '@react-native-async-storage/async-storage';

export const GetAsyncData = async key => {
  let data = await AsyncStorage.getItem(key);
  if (data !== null) {
    return data;
  } else {
    return null;
  }
};
