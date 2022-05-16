import React from "react";
import {StyleSheet, View, Text, Dimensions} from 'react-native';
import { useTheme } from "react-native-paper";

const windowWidth = Dimensions.get('window').width-10;

const TableHead = ({headings}) => {
    const {colors} = useTheme();
    return (
        <View style={{...styles.head}}>
          <Text style = {{width: windowWidth*0.1}}>{headings.first}</Text>
          <Text style = {{width: windowWidth*0.22, textAlign: 'center'}}>{headings.second}</Text>
          <Text style = {{width: windowWidth*0.2, textAlign: 'center'}}>{headings.third}</Text>
          <Text style = {{width: windowWidth*0.28, textAlign: 'center'}}>{headings.fourth}</Text>
        </View>
)};

const styles = StyleSheet.create({
    head: {
        // flex: 1,
        flexDirection: 'row',
        marginBottom: 5,
        marginTop: 10,
        alignItems: 'center',
        paddingLeft: 15,
        paddingTop: 10,
        paddingBottom: 10,
        // borderBottomWidth: 1,
        // borderBottomColor: '#000'
      },
})

export default TableHead;