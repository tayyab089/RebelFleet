import React, {useEffect, useState} from "react";
import { StyleSheet, Image, View } from "react-native";
import {Title} from 'react-native-paper'

const HeaderTitle = (props) => {
    const [tobeUsedTitle, setTobeUsedTitle] = useState('Rebel Fleet')
    useEffect(()=>{
        console.log(props.title)
        if (props.title == null) {
        } else {setTobeUsedTitle(props.title)};
    }, [])
    
    return (
        <View style={styles.container}>
            <Image
            style={styles.image}
            source={require('../Assets/Logos/logo.png')}
            />
            <Title style={styles.title}>{tobeUsedTitle}</Title>
        </View>
    )
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center'
    },
    title: {
        color: 'white',
        fontSize: 25,
    },
    image: {
        width: 50,
        height: 50,
    }
})

export default HeaderTitle