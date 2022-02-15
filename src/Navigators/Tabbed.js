import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Button } from 'react-native-paper';
import Ionicons from 'react-native-vector-icons/Ionicons';

import MilagePage from '../Views/Milage';
import FuelPage from '../Views/Fuel';

const Tab = createBottomTabNavigator();

const Tabbed = () => {
    return (
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
              <Tab.Screen name="Milage" component={MilagePage} />
              <Tab.Screen name="Fuel" component={FuelPage} />
            </Tab.Navigator>
    );
};

export default Tabbed;