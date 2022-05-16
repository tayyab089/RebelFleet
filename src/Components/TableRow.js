import React from "react";
import {StyleSheet, View, Text, Dimensions} from 'react-native';
import { useTheme, IconButton } from "react-native-paper";

const windowWidth = Dimensions.get('window').width-10;

const TableRow = ({item, index, deleteEntry}) => {
    const {colors} = useTheme();
    const date = item.DateTime.slice(4,15)
    const time = item.DateTime.slice(16,24)

    return (
        <View 
        style={{...styles.row, backgroundColor: colors.tabbed[index % colors.tabbed.length]}}>
          <Text style = {{width: windowWidth*0.1}}>{index+1}</Text>
          <Text style = {{width: windowWidth*0.25}}>{date}</Text>
          <Text style = {{width: windowWidth*0.25}}>{time}</Text>
          <Text style = {{width: windowWidth*0.2}}>{item.Milage}</Text>
          <IconButton 
            icon="delete-forever-outline"
            color={colors.primary}
            size={20}
            onPress={() => {deleteEntry(item.DateTime)}} />
        </View>
)};

const styles = StyleSheet.create({
    row: {
        flex: 1,
        flexDirection: 'row',
        marginBottom: 5,
        alignItems: 'center',
        paddingLeft: 20,
      },
})

export default TableRow;