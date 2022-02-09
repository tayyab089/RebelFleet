import React, {useState} from "react";
import {View, Image} from 'react-native';
import { Button } from "react-native-paper";
import {launchCamera, launchImageLibrary} from 'react-native-image-picker'

const HomePage = () => {
    const [image, setImage] = useState();
    const onTakePhoto = () => launchCamera({mediaType:'photo'}, onImageSelect)
    const onSelectImagePress = () => launchImageLibrary({mediaType: 'photo', includeBase64: true}, onImageSelect)

    const onImageSelect = async (media) => {
      if(!media.didCancel){
        console.log(media.didCancel)
        setImage(media.assets.uri);
      } else {console.log('failed')}
    };

    return (
        <View>
            <Button onPress={onTakePhoto}>Capture Image</Button>
            <Button onPress={onSelectImagePress}>Pick Image</Button>
            <Image source={{uri:image}} resizeMode ='contain'/>
        </View>
    )
}

export default HomePage;