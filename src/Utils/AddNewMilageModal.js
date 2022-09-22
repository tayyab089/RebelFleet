import React, {useState} from 'react';
import {StyleSheet, Dimensions, Alert, PermissionsAndroid, Image, View} from 'react-native';
import {Portal, Modal, TextInput, Title, Button, Surface} from 'react-native-paper';
import {openDatabase} from 'react-native-sqlite-storage';
// import {launchCamera, launchImageLibrary} from 'react-native-image-picker'

const width = Dimensions.get('window').width;
// const height = Dimensions.get('window').height;

const db = openDatabase({name: 'database.db', createFromLocation: 1});

const AddMilageModal = ({
  visible,
  hideModal,
  carID,
  latestMilage,
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
                    Kindly Input Current Milage:
            </Title>
            <TextInputs 
              carID = {carID}
              hideModal = {hideModal}
              latestMilage = {latestMilage}
            />
        </Surface>
      </Modal>
    </Portal>
  );
};

const TextInputs =({carID, hideModal, latestMilage}) => {
  const [milage, setMilage] = useState('');
  const [milageRemarks, setMilageRemarks] = useState('');

  //Data Storage into the DB
  const dataStorage = () => {
    if (milage == '') {
      Alert.alert('Please Input All Values')
      return;
    }
    let currentdate = new Date();
    let car = carID;
    console.log(latestMilage)
    let milageDiff = milage - latestMilage
    db.transaction(function (tx) {
      tx.executeSql(
        'INSERT INTO milage (Car, DateTime, Milage, Remarks, MilageDiff) VALUES (?,?,?,?,?)',
        [car, currentdate.toString(), milage, milageRemarks, milageDiff],
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
          label="Milage"
          value={milage}
          onChangeText={milage => setMilage(milage)}
          mode='outlined'
          dense='true'
          keyboardType="numeric"
      />
      <TextInput
          style = {styles.textStyle}
          label="Remarks"
          value={milageRemarks}
          onChangeText={milageRemarks => setMilageRemarks(milageRemarks)}
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

export default AddMilageModal;