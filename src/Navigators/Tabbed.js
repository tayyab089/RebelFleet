import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';

import IDContext from '../Utils/IDContext';

import MilagePage from '../Views/Milage';
import FuelPage from '../Views/Fuel';

const Tab = createBottomTabNavigator();

const Tabbed = ({route}) => {
  const idcontext = {carID : route.params.ID}

    return (
      <IDContext.Provider value={idcontext}>
        <Tab.Navigator 
            screenOptions={({ route }) => ({
              tabBarIcon: ({ focused, color, size }) => {
                let iconName;

                if (route.name === 'Milage') {
                  iconName = focused ? 'speedometer' : 'speedometer-outline';
                } else if (route.name === 'Fuel') {
                  iconName = focused ? 'beaker' : 'beaker-outline';
                }
                return <Ionicons name={iconName} size={size} color={color} />;
              },
              tabBarActiveTintColor: '#f4511e',
              tabBarInactiveTintColor: 'gray',
              headerStyle: {backgroundColor: '#f4511e'},
              headerTintColor: '#fff',
            })}>
              <Tab.Screen 
                name="Milage" 
                component={MilagePage}
                options={{headerShown: false}}
                 />
              <Tab.Screen 
                name="Fuel" 
                component={FuelPage}
                options={{headerShown: false}}
                 />
            </Tab.Navigator>
            </IDContext.Provider>
    );
};

export default Tabbed;