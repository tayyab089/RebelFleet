import React from 'react';
import {StatusBar} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {DefaultTheme, Provider as PaperProvider, useTheme, Button} from 'react-native-paper';
import Ionicons from 'react-native-vector-icons/Ionicons';

import {UserContext, AuthContext} from './src/Utils/AuthLogic';
import * as Keychain from 'react-native-keychain';
import {Alert} from 'react-native';


import HomePage from './src/Views/Home'
import SettingsPage from './src/Views/Settings'
import LoginView from './src/Views/Login';
import SplashScreen from './src/Views/Splash';

const Stack = createNativeStackNavigator();
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





  //----------------Token Chekiing and Authentication Logic------------------------------------------//
  //State and Dispatch function
  const [state, dispatch] = React.useReducer(
    (prevState, action) => {
      switch (action.type) {
        case 'RESTORE_TOKEN':
          return {
            ...prevState,
            userToken: action.token,
            isLoading: false,
          };
        case 'SIGN_IN':
          return {
            ...prevState,
            isSignout: false,
            userToken: action.token,
          };
        case 'SIGN_OUT':
          return {
            ...prevState,
            isSignout: true,
            userToken: null,
          };
      }
    },
    {
      isLoading: true,
      isSignout: false,
      userToken: null,
    },
  );

  // Ceating Context Variables
  const authContext = React.useMemo(
    () => ({
      signIn: async (data, hideLoadingModal) => {
        console.log(data);
        const options = {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        };
        fetch('https://hidden-stream-06963.herokuapp.com/login', options)
          .then(resp => resp.json())
          .then(response => {
            if (response.username === data.id) {
              Keychain.setGenericPassword(
                JSON.stringify(response),
                JSON.stringify(response.token),
              ).then((resp, err) => {
                if (err) {
                  console.log(err);
                } else {
                  console.log(response);
                  //dispatch({type: 'SIGN_IN', token: 'dummy-auth-token'});
                  dispatch({type: 'SIGN_IN', token: response});
                }
              });
            } else {
              Alert.alert(response.toString());
            }
          })
          .catch(err => console.log(err));
      },
      signOut: async () => {
        await Keychain.resetGenericPassword();
        dispatch({type: 'SIGN_OUT'});
      },
      signUp: async data => {
        const options = {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        };
        fetch('https://hidden-stream-06963.herokuapp.com/register', options)
          .then(resp => resp.json())
          .then(response => {
            Alert.alert(response);
            console.log(response);
          })
          .catch(err => console.log(err));
      },
      userToken: state.userToken,
    }),
    [],
  );
  const userContext = {userToken: state.userToken};
  React.useEffect(() => {
    const bootstrapAsync = async () => {
      let userToken;

      try {
        const userData = await Keychain.getGenericPassword();
        userToken = JSON.parse(userData.username);
      } catch (e) {
        console.log('failed');
      }
      console.log('I RANN TOO')
      dispatch({type: 'RESTORE_TOKEN', token: userToken});
    };

    bootstrapAsync();
  }, []);

  //Jugar Function as I cannot access cntext signout function here for some reason---to be addressed later
  const signOut = async () => {
    await Keychain.resetGenericPassword();
    dispatch({type: 'SIGN_OUT'});
  }
  //----------------Token Chekiing and Authentication Logic Complete---------------------------------//







  return (
    <AuthContext.Provider value={authContext}>
      <UserContext.Provider value={userContext}>
        <PaperProvider theme={theme}>
          <StatusBar barStyle="light-content" backgroundColor='#f4511e' />
          <NavigationContainer>
            {state.isLoading ? 
            (<SplashScreen/>) : state.userToken == null ? 
            (<LoginView/>) : 
            (<Tab.Navigator 
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
              headerRight: () => (
                <Button
                  onPress={() => signOut()}
                  icon="logout" 
                  mode="text"
                  theme={{colors: {primary: 'white', placeholder: '#fff', text: '#fff'}}}
                />
              ),
            })}>
              <Tab.Screen name="Home" component={HomePage} />
              <Tab.Screen name="Settings" component={SettingsPage} />
            </Tab.Navigator>)}
          </NavigationContainer>
        </PaperProvider>
      </UserContext.Provider>
    </AuthContext.Provider>
  );
};

export default App;
