import React from "react";
import {StyleSheet, Text, View, Image} from 'react-native';
import {Title, Surface, Divider, IconButton, useTheme } from "react-native-paper";

const ListComponent = (carData) => {
    console.log(carData)
    const {colors} = useTheme();
    return (
      <View style={styles.outerContainer}>
        <Surface style = {styles.itemContainer}>
          <Image source={{uri:carData.Image, height:50, width: 50}} style={styles.image}/>
          <View style = {styles.innerContainer}>
            <Title>{carData.Make + ' ' + carData.Model}</Title>
            <Text>{carData.Reg_No}</Text>
          </View>
          <IconButton 
            icon="delete-forever-outline"
            color={colors.primary}
            size={20}
            onPress={() => carData.deleteCar()} />
        </Surface>
        <Divider />
      </View>
    )
};

const styles = StyleSheet.create({
  outerContainer: {
    marginLeft: 5,
    marginRight: 5,
    marginTop: 1,
  },
  itemContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  innerContainer: {
    flex: 1,
    marginLeft: 10,
  },
  image:{
    // margin: 2,
  }
})

export default ListComponent;