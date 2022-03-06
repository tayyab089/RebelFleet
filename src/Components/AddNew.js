import React from "react";
import {StyleSheet, View} from 'react-native';
import { IconButton, Surface, useTheme, Title } from "react-native-paper";

const AddNew = ({showModal}) => {
    const {colors} = useTheme();
    return (
        <View style= {{...styles.Surface, backgroundColor: colors.primary}}>
            <IconButton 
            icon="plus-circle-outline"
            color={colors.textOnOrange}
            size={20}
            style= {{marginRight: 13}}
            onPress={() => showModal()} />
            <Title style = {{...styles.Text, color: colors.textOnOrange}}>ADD NEW</Title>
        </View>
    )
};

const styles = StyleSheet.create({
  Surface: {
    // flex: 1,
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'space-between',
    // margin: 5,
    // borderRadius: 5,
  },
  Text: {
    marginLeft: 10,
  },
})

export default AddNew;