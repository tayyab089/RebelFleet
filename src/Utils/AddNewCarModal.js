import React, {useState} from 'react';
import {StyleSheet, Dimensions, Alert, PermissionsAndroid, Image, View} from 'react-native';
import {Portal, Modal, TextInput, Title, Button, Surface} from 'react-native-paper';
import {openDatabase} from 'react-native-sqlite-storage';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker'

const width = Dimensions.get('window').width;
// const height = Dimensions.get('window').height;

const db = openDatabase({name: 'database.db', createFromLocation: 1});

const AddCarModal = ({
  visible,
  hideCarModal,
}) => {
  const containerStyle = {backgroundColor: 'white', padding: 10, paddingTop: 20,  margin: 20, borderRadius: 10};

 
  return (
    <Portal>
      <Modal
        visible={visible}
        onDismiss={hideCarModal}
        contentContainerStyle={containerStyle}>
        <Surface>
            <Title
                style={styles.title}
            >
                    Kindly Provide the Following:
            </Title>
            <TextInputs
              hideCarModal= {hideCarModal}
            />
        </Surface>
      </Modal>
    </Portal>
  );
};

const TextInputs = ({hideCarModal}) => {

  const [make, setMake] = useState('');
  const [model, setModel] = useState('');
  const [Reg_No, setReg_No] = useState('');
  const [sMilage, setSMilage] = useState('');
  const [image, setImage] = useState('https://media.istockphoto.com/photos/red-generic-sedan-car-isolated-on-white-background-3d-illustration-picture-id1189903200?k=20&m=1189903200&s=612x612&w=0&h=L2bus_XVwK5_yXI08X6RaprdFKF1U9YjpN_pVYPgS0o=')

  //Data Storage into the DB
  const dataStorage = () => {
    if (make == '' || model == ''|| Reg_No == '') {
      Alert.alert('Please Input All Values')
      return;
    }
    db.transaction(function (tx) {
      tx.executeSql(
        'INSERT INTO cars (Make, Model, Reg_No, Image, SMilage) VALUES (?,?,?,?,?)',
        [make, model, Reg_No, image, sMilage],
        (_tx, results) => {
          console.log('I Ran');
          console.log('Results', results.rowsAffected);
          if (results.rowsAffected > 0) {
            // Alert.alert('Data Inserted Successfully....');
            setMake('')
            setModel('')
            setReg_No('')
            setSMilage('')
            hideCarModal()
          } else {
            Alert.alert('Failed....');
          }
        },
      );
    });
  }

  //On Photo From Camera Handler
  const onTakePhoto = () => {
    const requestCameraPermission = async () => {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CAMERA,
          {
            title: "Camera Permission",
            message:
              "RebelFleet needs access to your camera ",
            buttonNeutral: "Ask Me Later",
            buttonNegative: "Cancel",
            buttonPositive: "OK"
          }
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          launchCamera({
            mediaType:'photo', 
            // quality: 1, 
            // maxWidth:800, 
            // maxHeight:600,
            saveToPhotos: true 
          }, onImageSelect)
        } else {
          Alert.alert("Camera permission denied");
        }
      } catch (err) {
        console.warn(err);
      }
    };
    requestCameraPermission()
  };

   //Photo from Storage Handler
   const onSelectImagePress = () => {
    const requestStoragePermission = async () => {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
          {
            title: "Storage Permission",
            message:
              "RebelFleet needs access your storage ",
            buttonNeutral: "Ask Me Later",
            buttonNegative: "Cancel",
            buttonPositive: "OK"
          }
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          launchImageLibrary({
            mediaType: 'photo',
            quality: 1, 
            // maxWidth:1600, 
            // maxHeight:1000, 
            includeBase64: true
          }, onImageSelect)
        } else {
          Alert.alert("Camera permission denied");
        }
      } catch (err) {
        console.warn(err);
      }
    };
    requestStoragePermission()
  }

  //Callback after image loaded
  const onImageSelect = async (media) => {
    if (!media.didCancel){
      setImage(media.assets[0].uri);
      console.log(media.assets[0].fileSize)
    } else {Alert.alert('Picutre not selected')}
  };
  
  return (
    <>
      <TextInput
          style = {styles.textStyle}
          label="Make"
          value={make}
          onChangeText={make => setMake(make)}
          mode='outlined'
          dense='true'
      />
      <TextInput
          style = {styles.textStyle}
          label="Model"
          value={model}
          onChangeText={model => setModel(model)}
          mode='outlined'
          dense='true'
      />
      <TextInput
          style = {styles.textStyle}
          label="Registration No."
          value={Reg_No}
          onChangeText={Reg_No => setReg_No(Reg_No)}
          mode='outlined'
          dense='true'
      />
      <TextInput
          style = {styles.textStyle}
          label="Milage"
          value={sMilage}
          onChangeText={sMilage => setSMilage(sMilage)}
          mode='outlined'
          dense='true'
          keyboardType="numeric"
      />
      <Button onPress={onTakePhoto}>Capture Image</Button>
      <Button onPress={onSelectImagePress}>Pick Image</Button>
      <View style = {styles.imageContainer}>
        <Image source={{uri:image, height:150, width: width-60}} resizeMode ='contain'/>
      </View>
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

export default AddCarModal;