import React from 'react';
import {StatusBar} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
// import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {DefaultTheme, Provider as PaperProvider, useTheme, IconButton} from 'react-native-paper';

import HeaderTitle from './src/Utils/HeaderTitle';

import Home from './src/Views/Home';
import Tabbed from './src/Navigators/Tabbed';

const Stack = createNativeStackNavigator();
// const Tab = createBottomTabNavigator();

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#f4511e',
    accent: '#f4511e',
    background: '#f6f6f6',
    textOnOrange: '#fff',
    tabbed : ['#fff','#f2f1f0'],
  },
};

const App = () => {
  const {colors} = useTheme();

  const defaultNavigationOptions = {
    headerStyle: {
        height: 100,
    }
  }

  return (
    <PaperProvider theme={theme}>
      <StatusBar barStyle="light-content" backgroundColor='#f4511e' />
      <NavigationContainer>
        <Stack.Navigator 
          screenOptions = {{
            headerStyle: {
              backgroundColor: '#f4511e',
            },
            headerTintColor: '#fff',
          //   headerRight: () => (
          //   <IconButton
          //     onPress={() => signOut()}
          //     icon="logout"
          //     color='white'
          //     size={20}
          //   />
          // ),
          }}>
          <Stack.Screen 
            name='Home' 
            component={Home} 
            options={{headerTitle: (props) => <HeaderTitle {...props} /> }}/>
          <Stack.Screen 
            name='Tabs' 
            component={Tabbed}
            options={({ route }) => ({ headerTitle: (props) => <HeaderTitle {...props} title={route.params.title}/> })} />
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
};

export default App;
