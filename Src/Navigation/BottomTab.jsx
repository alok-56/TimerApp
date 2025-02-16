import React, {useState, useEffect} from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import HomeIcon from 'react-native-vector-icons/Ionicons';
import TimerIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import {Route} from '../Constant/Route';
import History from '../Pages/Home/History';
import Timer from '../Pages/Home/Timer';

const Tab = createBottomTabNavigator();

const Bottomtab = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarLabelStyle: {
          marginBottom: 5,
          fontWeight: '500',
        },
        tabBarActiveTintColor: '#rgb(103, 64, 242)',
        tabBarInactiveTintColor: '#090A0C',
        headerShown: false,
      }}>
      <Tab.Screen
        options={{
          tabBarIcon: ({focused}) => {
            return (
              <HomeIcon
                name="stopwatch"
                size={24}
                color={focused ? 'rgb(103, 64, 242)' : '#000'}></HomeIcon>
            );
          },
          tabBarLabel: 'Timer',
        }}
        name={Route.TIMER_SCREEN}
        component={Timer}
      />
      <Tab.Screen
        options={{
          tabBarIcon: ({focused}) => {
            return (
              <TimerIcon
                name="history"
                size={24}
                color={focused ? 'rgb(103, 64, 242)' : '#000'}></TimerIcon>
            );
          },
          tabBarLabel: 'history',
        }}
        name={Route.HISTORY_SCREEN}
        component={History}
      />
    </Tab.Navigator>
  );
};

export default Bottomtab;
