import React from 'react';
import {View, StyleSheet} from 'react-native';
import {Portal, Modal, Text, Button} from 'react-native-paper';

const RemarksModal = ({item, visible, hideModal, deleteItem}) => {
    // eslint-disable-next-line prettier/prettier
    const containerStyle = {backgroundColor: 'white', padding: 20, margin: 20, borderRadius: 10};
    const textStyle = {marginBottom: 0, marginTop: 0};

    let Title1 = 'MILAGE'
    let Title2 = 'MILAGE SLE'
    if (Object.keys(item).includes('FuelAmount')) {
      Title1 = 'FUEL AMOUNT'
      Title2 = 'FUEL PRICE'
    }

    let date = item.DateTime.slice(4,15)
    let time = item.DateTime.slice(16,24)
  
    return (
      <Portal>
        <Modal
          visible={visible}
          onDismiss={hideModal}
          contentContainerStyle={containerStyle}>
          <View style = {styles.item}>
            <Text style={{fontWeight: 'bold', width: 120  }}>DATE:</Text>
            <Text style={textStyle}>{date}</Text>
          </View>
          <View style = {styles.item}>
            <Text style={{fontWeight: 'bold', width: 120 }}>TIME</Text>
            <Text style={textStyle}>{time}</Text>
          </View>
          <View style = {styles.item}>
            <Text style={{fontWeight: 'bold', width: 120 }}>{Title1}:</Text>
            <Text style={textStyle}>{item.Milage}</Text>
          </View>
          <View style = {styles.item}>
          <Text style={{fontWeight: 'bold', width: 120 }}>{Title2}:</Text>
            <Text style={textStyle}>{item.MilageDiff}</Text>
          </View>
          <View style = {styles.item}></View>
          <Text style={textStyle}><Text style={{fontWeight: 'bold'}}>REMARKS:            </Text> {item.Remarks}</Text>
          <View style={{flexDirection: 'row', justifyContent: 'flex-end', marginTop: 50}}>
            <Button
              style={{marginRight: 10}}
              mode="contained"
              onPress={() => deleteItem(item.DateTime)}>
              Delete
            </Button>
            <Button
              mode="contained"
              onPress={() => {
                hideModal();
              }}>
              Okay
            </Button>
          </View>
        </Modal>
      </Portal>
    );
  };

  const styles = StyleSheet.create({
    item : {
      flexDirection: 'row'
    }

  })
  

export default RemarksModal;
