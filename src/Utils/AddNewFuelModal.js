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

  const [fuel, setFuel] = useState('');
  const [fuelCost, setFuelCost] = useState('');
  // const [image, setImage] = useState('https://media.istockphoto.com/photos/red-generic-sedan-car-isolated-on-white-background-3d-illustration-picture-id1189903200?k=20&m=1189903200&s=612x612&w=0&h=L2bus_XVwK5_yXI08X6RaprdFKF1U9YjpN_pVYPgS0o=')

  //Data Storage into the DB
  const dataStorage = () => {
    let currentdate = new Date();
    let car = carID;
    db.transaction(function (tx) {
      tx.executeSql(
        'INSERT INTO fuel (Car, DateTime, FuelAmount, FuelCost) VALUES (?,?,?,?)',
        [car, currentdate.toString(), fuel, fuelCost],
        (_tx, results) => {
          console.log('Results', results.rowsAffected);
          if (results.rowsAffected > 0) {
            Alert.alert('Data Inserted Successfully....');
            hideModal()
          } else {
            Alert.alert('Failed....');
          }
        },
      );
    });
  }


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
            <TextInput
                style = {styles.textStyle}
                label="fuel Amout"
                value={fuel}
                onChangeText={fuel => setFuel(fuel)}
                mode='outlined'
                dense='true'
                keyboardType="numeric"
            />
            <TextInput
                style = {styles.textStyle}
                label="fuel Cost"
                value={fuelCost}
                onChangeText={fuelCost => setFuelCost(fuelCost)}
                mode='outlined'
                dense='true'
                keyboardType="numeric"
            />
            <Button
                mode='contained'
                style={styles.button}
                onPress= {()=>dataStorage()}
            >
                 ADD 
            </Button>
        </Surface>
      </Modal>
    </Portal>
  );
};

const styles = StyleSheet.create({
  textStyle: {margin: 5},
  title: {margin: 5},
  button: {margin: 5},
  imageContainer: {
    justifyContent: 'center',
  }
});

export default AddfuelModal;