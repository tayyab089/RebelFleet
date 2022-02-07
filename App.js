import React from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {DefaultTheme, Provider as PaperProvider} from 'react-native-paper';
// import Ionicons from 'react-native-vector-icons/Ionicons';


import HomePage from './src/Views/Home'
import SettingsPage from './src/Views/Settings'

const Tab = createBottomTabNavigator();

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#18A558',
    accent: '#03dac4',
    background: '#f6f6f6',
  },
};

const App = () => {

  return (
    <PaperProvider theme={theme}>
      <NavigationContainer>
        <Tab.Navigator 
        // screenOptions={({ route }) => ({
        //   tabBarIcon: ({ focused, color, size }) => {
        //     let iconName;

        //     if (route.name === 'Home') {
        //       iconName = focused
        //         ? 'ios-information-circle'
        //         : 'ios-information-circle-outline';
        //     } else if (route.name === 'Settings') {
        //       iconName = focused ? 'settings' : 'settings-outline';
        //     }

        //     // You can return any component that you like here!
        //     return <Ionicons name={iconName} size={size} color={color} />;
        //   },
        //   tabBarActiveTintColor: 'tomato',
        //   tabBarInactiveTintColor: 'gray',
        // })}>
        >
          <Tab.Screen name="Home" component={HomePage} />
          <Tab.Screen name="Settings" component={SettingsPage} />
        </Tab.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
};

export default App;
