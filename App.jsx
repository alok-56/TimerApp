import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import OnboardingStack from './Src/Navigation/OnboardingStack';

const App = () => {
  return (
    <NavigationContainer>
      <OnboardingStack></OnboardingStack>
    </NavigationContainer>
  );
};

export default App;
