import React from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {DefaultTheme, Provider as PaperProvider, useTheme} from 'react-native-paper';
import Ionicons from 'react-native-vector-icons/Ionicons';


import HomePage from './src/Views/Home'
import SettingsPage from './src/Views/Settings'

const Tab = createBottomTabNavigator();

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#f4511e',
    accent: '#03dac4',
    background: '#f6f6f6',
  },
};

const App = () => {
  const {colors} = useTheme();
  return (
    <PaperProvider theme={theme}>
      <StatusBar barStyle="light-content" backgroundColor='#f4511e' />
      <NavigationContainer>
        <Tab.Navigator 
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            if (route.name === 'Home') {
              iconName = focused ? 'home' : 'home-outline';
            } else if (route.name === 'Settings') {
              iconName = focused ? 'settings' : 'settings-outline';
            }
            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: '#f4511e',
          tabBarInactiveTintColor: 'gray',
          headerStyle: {backgroundColor: '#f4511e'},
          headerTintColor: '#fff',
        })}>
          <Tab.Screen name="Home" component={HomePage} />
          <Tab.Screen name="Settings" component={SettingsPage} />
        </Tab.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
};

export default App;
