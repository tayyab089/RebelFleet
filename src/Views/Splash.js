import React from 'react';
import {View} from 'react-native';
import {ActivityIndicator, Colors, useTheme} from 'react-native-paper';

function SplashScreen() {
  const {colors} = useTheme()
  return (
    <View style={{flex: 1, alignContent: 'center',justifyContent: 'center',alignSelf: 'center', backgroundColor: colors.primary, width: '100%'}}>
      <ActivityIndicator animating={true} color={Colors.white} />
    </View>
  );
}

export default SplashScreen;