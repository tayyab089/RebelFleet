import React, {useState, useEffect, useRef, useContext} from "react";
import {View, StyleSheet, ScrollView, Alert, Text} from 'react-native';
import { DataTable, IconButton, useTheme } from "react-native-paper";
import {openDatabase} from 'react-native-sqlite-storage';

import IDContext from "../Utils/IDContext";

import AddNew from "../Components/AddNew";
import AddMilageModal from "../Utils/AddNewMilageModal";
import promptUser from "../Utils/AsyncAlert";

const db = openDatabase({name: 'database.db', createFromLocation: 1});

const numberOfItemsPerPageList = [5, 8, 10]; // Items per page for the pagination

const MilagePage = ({route}) => {
  const {carID} = useContext(IDContext);
  const mounted = useRef(true)
  const [milageData, setMilageData] = useState([])
  const {colors} = useTheme();
  //Add Milage Modal Constants
  const [visible, setVisible] = useState(false);
  const showMilageModal = () => setVisible(true);
  const hideMilageModal = () => {
    retrieveData()
    setVisible(false)
  };

  //Variables for Pagination Start
  const [page, setPage] = useState(0);
  const [numberOfItemsPerPage, onItemsPerPageChange] = useState(
    numberOfItemsPerPageList[1],
  );
  const from = page * numberOfItemsPerPage;
  const to = Math.min((page + 1) * numberOfItemsPerPage, milageData.length);
  let list = [];

  useEffect(() => {
    setPage(0);
 }, [numberOfItemsPerPage]);
  //State Variables for Pagination End

  useEffect(() => {
      retrieveData();
  }, []);

  const retrieveData = () => {
    db.transaction(tx => {
      tx.executeSql('SELECT * FROM milage', [], (_tx, results) => {
        var temp = [];
        for (let i = 0; i < results.rows.length; ++i) {
          if (results.rows.item(i).Car === carID){
            temp.push(results.rows.item(i))}
            console.log(temp)
        }
        if (mounted.current) {
          setMilageData(temp);
        }
      });
    });
  };

  const deleteEntry = date => {
    promptUser('CAUTION', 'Are You Sure?').then(res => {
      if (res === 'Yes') {
        db.transaction(tx => {
          console.log(date)
          tx.executeSql(
            'DELETE FROM milage where DateTime=?',
            [date],
            (_tx, results) => {
              if (results.rows.length === 0) {
                Alert.alert('Data Deleted Successfully....');
                retrieveData();
              }
            },
          );
        });
      } else {
        return;
      }
    });
  };

  return (
      <View style = {styles.container}>
          <AddNew showModal={showMilageModal}/>
          <AddMilageModal 
            visible={visible} 
            hideModal={hideMilageModal}
            carID = {carID}
          />
          <DataTable style={{elevation: 2, width: '95%', alignSelf: 'center'}}>
          <DataTable.Header>
            <DataTable.Title style={{flex: 2}}>S.No</DataTable.Title>
            <DataTable.Title style={{flex: 3}}>DATE</DataTable.Title>
            <DataTable.Title style={{flex: 3}}>TIME</DataTable.Title>
            <DataTable.Title style={{flex: 3}}>MILAGE</DataTable.Title>
            <DataTable.Title style={{flex: 1}}></DataTable.Title>
          </DataTable.Header>
          <ScrollView>
            {milageData.map( (item, index) => {
              const date = item.DateTime.slice(4,15)
              const time = item.DateTime.slice(16,24)
              return (
                <DataTable.Row
                  key={item.DateTime}
                  onPress={() => {}}>
                  <DataTable.Cell style={{flex: 1}}>{index+1}</DataTable.Cell>
                  <DataTable.Cell style={{flex: 3}}>{date}</DataTable.Cell>
                  <DataTable.Cell style={{flex: 2}}>{time}</DataTable.Cell>
                  <DataTable.Cell style={{flex: 2}}>{item.Milage}</DataTable.Cell>
                  <DataTable.Cell style={{flex: 1}}>
                    <IconButton 
                      icon="delete-forever-outline"
                      color={colors.primary}
                      size={20}
                      onPress={() => {deleteEntry(item.DateTime)}} />
                  </DataTable.Cell>
                </DataTable.Row>
              );
            })}
            <DataTable.Pagination
              page={page}
              numberOfPages={Math.ceil(milageData.length / numberOfItemsPerPage)}
              onPageChange={page => setPage(page)}
              label={`${from + 1}-${to} of ${milageData.length}`}
              showFastPaginationControls
              numberOfItemsPerPageList={numberOfItemsPerPageList}
              numberOfItemsPerPage={numberOfItemsPerPage}
              onItemsPerPageChange={onItemsPerPageChange}
              selectPageDropdownLabel={'Rows per page'}
            />
          </ScrollView>
          </DataTable>
      </View>
  )
};

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    // justifyContent: 'center',
    // alignItems: 'center',
    margin: 5,
  }
})

export default MilagePage;