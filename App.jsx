import {NavigationContainer} from '@react-navigation/native';
import React from 'react';
import AppStack from './Src/Navigation/AppStack';
import FlashMessage from "react-native-flash-message";

const App = () => {
  return (
    <NavigationContainer>
      <AppStack></AppStack>
      <FlashMessage position="top" /> 
    </NavigationContainer>
  );
};

export default App;
