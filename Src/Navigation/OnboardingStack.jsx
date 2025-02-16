import * as React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Bottomtab from './BottomTab';
import Splash from '../Pages/Onboarding/Splash';
import {Route} from '../Constant/Route';

const Stack = createNativeStackNavigator();

const OnboardingStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name={Route.SPLASH_SCREEN} component={Splash} />
      <Stack.Screen name={Route.BOTTOMTAB} component={Bottomtab} />
    </Stack.Navigator>
  );
};

export default OnboardingStack;
