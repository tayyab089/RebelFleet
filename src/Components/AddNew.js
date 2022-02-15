import React from "react";
import {StyleSheet} from 'react-native';
import { IconButton, Surface, useTheme, Title } from "react-native-paper";

const AddNew = ({showCarModal}) => {
    const {colors} = useTheme();
    return (
        <Surface style= {styles.Surface}>
            <IconButton 
            icon="plus-circle-outline"
            color={colors.primary}
            size={20}
            onPress={() => showCarModal()} />
            <Title style = {{...styles.Text, color: colors.primary}}>ADD NEW</Title>
        </Surface>
    )
};

const styles = StyleSheet.create({
  Surface: {
    // flex: 1,
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'space-between',
    margin: 5,
    borderRadius: 5,
  },
  Text: {
    marginLeft: 10,
  },
})

export default AddNew;