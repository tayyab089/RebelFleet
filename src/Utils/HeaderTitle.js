import React, {useEffect, useState} from "react";
import { StyleSheet, Image, View, Text, Dimensions } from "react-native";
import {Title} from 'react-native-paper'

const width = Dimensions.get('window').width

const HeaderTitle = (props) => {
    const [tobeUsedTitle, setTobeUsedTitle] = useState('Rebel Fleet')
    useEffect(()=>{
        console.log(props.title)
        if (props.title == null) {
        } else {setTobeUsedTitle(props.title)};
    }, [])
    
    return (
        <View style={styles.container}>
            <Title style={styles.title}>{tobeUsedTitle}</Title>
            <Image
            style={styles.image}
            source={require('../Assets/Logos/logo.png')}
            />
        </View>
    )
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    title: {
        color: 'white',
        fontSize: 25,
    },
    image: {
        width: 50,
        height: 50,
        marginRight: 20,
    }
})

export default HeaderTitle