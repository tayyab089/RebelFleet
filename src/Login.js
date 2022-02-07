import React, {useState, useContext} from 'react';
import {View, StatusBar, StyleSheet, Image} from 'react-native';
import {TextInput, Button} from 'react-native-paper';
// import AuthContext from '../Utils/LoginContext';
import LoadingModal from '../Utils/LoadingModal';

const LoginView = ({navigation}) => {
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');

  // Loading Modal Variable Start
  const [loadingVisible, setLoadingVisible] = useState(false);
  const showLoadingModal = () => setLoadingVisible(true);
  const hideLoadingModal = () => setLoadingVisible(false);
  // Loading Modal Variable End

//   const {signIn} = useContext(AuthContext);

  const handleSignIn = data => {
    showLoadingModal();
    signIn(data);
    hideLoadingModal();
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#18A558" />
      <View>
        <Image
          style={styles.image}
          source={require('../assets/Logos/OpsLog_Logo_nbc.png')}
        />
      </View>
      <TextInput
        style={styles.inputs}
        theme={{colors: {primary: 'white', placeholder: '#fff', text: '#fff'}}}
        mode="flat"
        label="ID"
        onChangeText={id => setId(id)}
        value={id}
      />
      <TextInput
        style={styles.inputs}
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
        labelStyle={styles.loginButtonContent}
        dark={false}
        mode="contained"
        onPress={() => handleSignIn({id, password})}>
        Login
      </Button>
      <View>
        <Image
          style={styles.image}
          source={require('../assets/Logos/company_logo.png')}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#18A558',
  },
  inputs: {
    margin: 10,
    backgroundColor: '#18A558',
  },
  loginButton: {
    margin: 10,
    backgroundColor: '#fff',
    height: 50,
    justifyContent: 'center',
  },
  loginButtonContent: {
    color: '#18A558',
  },
  image: {
    alignSelf: 'center',
    marginTop: 10,
    height: 110,
    width: 250,
    resizeMode: 'contain',
  },
});

export default LoginView;