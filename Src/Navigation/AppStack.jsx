import * as React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Splash from '../Pages/Splash';
import Login from '../Pages/Login';
import Dashboard from '../Pages/Dashboard';
import OtpSetup from '../Pages/OtpSetup';

const Stack = createNativeStackNavigator();

function AppStack() {
  return (
    <Stack.Navigator
      initialRouteName="splash"
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="splash" component={Splash} />
      <Stack.Screen name="login" component={Login} />
      <Stack.Screen name="otp" component={OtpSetup} />
      <Stack.Screen name="dashboard" component={Dashboard} />
    </Stack.Navigator>
  );
}

export default AppStack;
