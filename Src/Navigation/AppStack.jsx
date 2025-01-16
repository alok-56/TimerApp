import * as React from 'react';

import {createDrawerNavigator} from '@react-navigation/drawer';

import Splash from '../Pages/Splash';
import Login from '../Pages/Login';
import Dashboard from '../Pages/Dashboard';
import OtpSetup from '../Pages/OtpSetup';
import CustomDrawer from '../Components/CustomDrawer';
import History from '../Pages/History';
const Drawer = createDrawerNavigator();


function AppStack() {
  return (
    <Drawer.Navigator
      screenOptions={{
        drawerStyle: {
          width: 300,
        },
      }}
      initialRouteName="splash"
      drawerContent={props => <CustomDrawer {...props}></CustomDrawer>}>
      <Drawer.Screen
        options={{headerShown: false}}
        name="splash"
        component={Splash}
      />
      <Drawer.Screen
        options={{headerShown: false}}
        name="login"
        component={Login}
      />
      <Drawer.Screen
        options={{headerShown: false}}
        name="otp"
        component={OtpSetup}
      />
      <Drawer.Screen
        options={{headerShown: false}}
        name="dashboard"
        component={Dashboard}
      />
       <Drawer.Screen
        options={{headerShown: false}}
        name="history"
        component={History}
      />
    </Drawer.Navigator>
  );
}

export default AppStack;
