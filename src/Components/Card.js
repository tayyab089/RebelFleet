import React from "react";
import {StyleSheet} from 'react-native';
import { Card, Title, Paragraph } from "react-native-paper";

const CardComponent = ({Make, Model, Reg_No, Image, navigation}) => {
    return (
        <Card 
          mode='elevated' 
          elevation={10} 
          style = {styles.card}
          onPress={() => navigation.navigate('Tabs')}
          onLongPress={() => deleteCar()}>
            <Card.Content>
                <Card.Cover source={{ uri: Image }} />
                <Title>{Make + ' ' + Model}</Title>
                <Paragraph>{Reg_No}</Paragraph>
            </Card.Content>
        </Card>
    )
};

const styles = StyleSheet.create({
  card: {
    margin: 5,
    borderRadius: 5,
  }
})

export default CardComponent;