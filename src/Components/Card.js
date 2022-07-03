import React from "react";
import {StyleSheet, View} from 'react-native';
import { Card, Title, Paragraph, IconButton, useTheme } from "react-native-paper";

const CardComponent = ({ID, Make, Model, Reg_No, Image, deleteCar, navigation}) => {
  const {colors} = useTheme()

  return (
      <Card 
        mode='elevated' 
        elevation={10} 
        style = {styles.card}
        onPress={() => navigation.navigate('Tabs', {
            ID : ID,
            title: Model
        })}
        onLongPress={() => deleteCar()}>
          <Card.Content>
              <Card.Cover source={{ uri: Image }} />
              <View style={styles.container}>
                <View>
                  <Title>{Make + ' ' + Model}</Title>
                  <Paragraph>{Reg_No}</Paragraph>
                </View>
                <IconButton 
                  icon="delete-forever-outline"
                  color={colors.primary}
                  size={20}
                  onPress={() => deleteCar()} 
                />
              </View>
          </Card.Content>
      </Card>
  )
};

const styles = StyleSheet.create({
  card: {
    margin: 5,
    borderRadius: 5,
  },
  container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  }
})

export default CardComponent;