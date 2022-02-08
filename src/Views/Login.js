import React, {useState, useContext} from 'react';
import {View, StatusBar, StyleSheet, Image} from 'react-native';
import {TextInput, Button, useTheme} from 'react-native-paper';
import {AuthContext} from '../Utils/AuthLogic';
import LoadingModal from '../Utils/LoadingModal';

const LoginView = ({navigation}) => {
  const {colors} = useTheme();
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');

  // Loading Modal Variable Start
  const [loadingVisible, setLoadingVisible] = useState(false);
  const showLoadingModal = () => setLoadingVisible(true);
  const hideLoadingModal = () => setLoadingVisible(false);
  // Loading Modal Variable End

  const {signIn} = useContext(AuthContext);

  const handleSignIn = data => {
    showLoadingModal();
    signIn(data);
    console.log('I Ran')
    // hideLoadingModal();-----------------------issue to be resolved later
  };

  return (
    <View style={{...styles.container, backgroundColor: colors.primary}}>
      <StatusBar barStyle="light-content" backgroundColor={colors.primary} />
      <View>
        <Image
          style={styles.image}
          source={require('../Assets/Logos/logo.png')}
        />
      </View>
      <TextInput
        style={{...styles.inputs, backgroundColor: colors.primary}}
        theme={{colors: {primary: 'white', placeholder: '#fff', text: '#fff'}}}
        mode="flat"
        label="ID"
        onChangeText={id => setId(id)}
        value={id}
      />
      <TextInput
        style={{...styles.inputs, backgroundColor: colors.primary}}
        mode="flat"
        label="Password"
        theme={{colors: {primary: 'white', placeholder: '#fff', text: '#fff'}}}
        secureTextEntry={true}
        onChangeText={password => setPassword(password)}
        value={password}
      />
      <LoadingModal visible={loadingVisible} hideModal={hideLoadingModal} />
      <Button
        style={styles.loginButton}
        labelStyle={{color: colors.primary}}
        dark={false}
        mode="contained"
        onPress={() => handleSignIn({id, password})}>
        Login
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  inputs: {
    margin: 10,
  },
  loginButton: {
    margin: 10,
    backgroundColor: '#fff',
    height: 50,
    justifyContent: 'center',
  },
  image: {
    alignSelf: 'center',
    marginTop: -50,
    height: 250,
    width: 600,
    resizeMode: 'contain',
  },
});

export default LoginView;