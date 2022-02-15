import React, {useState} from "react";
import {View, Image, Text, StyleSheet, PermissionsAndroid, Alert} from 'react-native';
import { Button } from "react-native-paper";
import {launchCamera, launchImageLibrary} from 'react-native-image-picker'

const HomePage = () => {
    const [image, setImage] = useState();
    const [text, setText] = useState('Converted Text Will appear here');

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
              includeBase64: true
            }, onImageSelect)
          } else {
            Alert.alert("Camera permission denied");
          }
        } catch (err) {
          console.warn(err);
        }
      };
      requestCameraPermission()
    }

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
        
          //fetch options
          const options = {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(media.assets[0]),
          };

        
          //fetch command
          fetch('http://192.168.10.13:3000',options)
          .then(resp=>resp.json())
          .then(response=>{
            console.log(response)
            setText(response)
          })
        } else {Alert.alert('Picutre not selected')}
    };

    return (
        <View style = {styles.container}>
            <Button onPress={onTakePhoto}>Capture Image</Button>
            <Button onPress={onSelectImagePress}>Pick Image</Button>
            <Image source={{uri:image, height:150, width:150}} resizeMode ='contain'/>
            <Text>{text}</Text>
        </View>
    )
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  }
})

export default HomePage;