import React, {useState} from 'react';
import {StyleSheet, Dimensions, Alert, PermissionsAndroid, Image, View} from 'react-native';
import {Portal, Modal, TextInput, Title, Button, Surface} from 'react-native-paper';
import {openDatabase} from 'react-native-sqlite-storage';
// import {launchCamera, launchImageLibrary} from 'react-native-image-picker'

const width = Dimensions.get('window').width;
// const height = Dimensions.get('window').height;

const db = openDatabase({name: 'database.db', createFromLocation: 1});

const AddfuelModal = ({
  visible,
  hideModal,
  carID,
}) => {
  const containerStyle = {backgroundColor: 'white', padding: 10, paddingTop: 20,  margin: 20, borderRadius: 10};

  return (
    <Portal>
      <Modal
        visible={visible}
        onDismiss={hideModal}
        contentContainerStyle={containerStyle}>
        <Surface>
            <Title
                style={styles.title}
            >
                    How much Fuel did you refil:
            </Title>
            <TextInputs 
              carID = {carID}
              hideModal = {hideModal}
            />            
        </Surface>
      </Modal>
    </Portal>
  );
};

const TextInputs = ({carID, hideModal}) => {
  const [fuel, setFuel] = useState('');
  const [fuelCost, setFuelCost] = useState('');
  const [Remarks, setRemarks] = useState('');

  //Data Storage into the DB
  const dataStorage = () => {
    if (fuel == '' || fuelCost == '') {
      Alert.alert('Please Input All Values')
      return;
    }
    let currentdate = new Date();
    let car = carID;
    db.transaction(function (tx) {
      tx.executeSql(
        'INSERT INTO fuel (Car, DateTime, FuelAmount, FuelCost, Remarks) VALUES (?,?,?,?,?)',
        [car, currentdate.toString(), fuel, fuelCost, Remarks],
        (_tx, results) => {
          console.log('Results', results.rowsAffected);
          if (results.rowsAffected > 0) {
            // Alert.alert('Data Inserted Successfully....');
            hideModal()
          } else {
            Alert.alert('Failed....');
          }
        },
      );
    });
  }

  return (
    <>
      <TextInput
          style = {styles.textStyle}
          label="Fuel Amout"
          value={fuel}
          onChangeText={fuel => setFuel(fuel)}
          mode='outlined'
          dense='true'
          keyboardType="numeric"
      />
      <TextInput
          style = {styles.textStyle}
          label="Fuel Cost"
          value={fuelCost}
          onChangeText={fuelCost => setFuelCost(fuelCost)}
          mode='outlined'
          dense='true'
          keyboardType="numeric"
      />
      <TextInput
          style = {styles.textStyle}
          label="Remarks"
          value={Remarks}
          onChangeText={Remarks => setRemarks(Remarks)}
          mode='outlined'
          multiline={true}
      />
      <Button
          mode='contained'
          style={styles.button}
          onPress= {()=>dataStorage()}
      >
            ADD 
      </Button>
    </>
  )
}

const styles = StyleSheet.create({
  textStyle: {margin: 5},
  title: {margin: 5},
  button: {margin: 5},
  imageContainer: {
    justifyContent: 'center',
  }
});

export default AddfuelModal;