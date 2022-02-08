import React from 'react';
import {StyleSheet, View} from 'react-native';
import {ActivityIndicator, Colors, Modal, Portal, Text, useTheme} from 'react-native-paper';

const LoadingModal = ({visible, hideModal}) => {
  // const containerStyle = {backgroundColor: 'white', padding: 20, margin: 40, height: 200};
  const {colors} = useTheme();
  return (
    <Portal>
      <Modal
        visible={visible}
        onDismiss={hideModal}
        contentContainerStyle={styles.containerStyle}>
        <Text style={styles.textStyle}>Processing. . . .</Text>
        <ActivityIndicator animating={true} color={colors.primary} />
      </Modal>
    </Portal>
  );
};

const styles = StyleSheet.create({
  containerStyle: {
    backgroundColor: 'white',
    padding: 20,
    margin: 40,
    height: 200,
    flexDirection: 'column',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    borderRadius: 20,
  },
  textStyle: {
    fontSize: 18,
  },
});



export default LoadingModal;