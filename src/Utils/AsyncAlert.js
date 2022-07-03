import {Alert} from 'react-native';

async function promptUser(title, message) {
  const selection = await new Promise(resolve => {
    const buttons = [
      //   {text: 'Cancel', onPress: () => resolve(null)},
      {text: 'No', onPress: () => resolve('No')},
      {text: 'Yes', onPress: () => resolve('Yes')},
    ];
    Alert.alert(title, message, buttons);
  });

  return selection;
}

export default promptUser;