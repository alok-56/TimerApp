import React, {useEffect} from 'react';
import {View, Text, Image} from 'react-native';

const Splash = ({navigation}) => {
  useEffect(() => {
    setTimeout(() => {
      navigation.reset({
        index: 0,
        routes: [{name: 'login'}],
      });
    }, 4000);
  }, [navigation]);
  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <Image
        style={{height: 100, width: 100}}
        source={require('../Assests/Icons/check.png')}></Image>
      <Text style={{fontSize: 20, marginTop: 10, fontWeight: '600',color:"#000"}}>
        BKS ATTENDANCE APP
      </Text>
    </View>
  );
};

export default Splash;
