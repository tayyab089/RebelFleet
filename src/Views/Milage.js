import React, {useState, useEffect, useRef, useContext} from "react";
import {View, StyleSheet, ScrollView, Alert, Text, Pressable, Dimensions, FlatList, PermissionsAndroid, ToastAndroid} from 'react-native';
import { DataTable, IconButton, useTheme, FAB } from "react-native-paper";
import {openDatabase} from 'react-native-sqlite-storage';

import TableRow from "../Components/TableRow";
import TableHead from "../Components/TableHead";

import IDContext from "../Utils/IDContext";

import AddNew from "../Components/AddNew";
import AddMilageModal from "../Utils/AddNewMilageModal";
import promptUser from "../Utils/AsyncAlert";
import RemarksModal from "../Utils/RemarksModal";

var RNFS = require('react-native-fs');
import XLSX from 'xlsx';

const db = openDatabase({name: 'database.db', createFromLocation: 1});

const windowWidth = Dimensions.get('window').width-10;

const MilagePage = ({route}) => {
  const {carID} = useContext(IDContext);
  const mounted = useRef(true)
  const [milageData, setMilageData] = useState([])
  const [latestMilage, setLatestMilage] = useState(0)
  const {colors} = useTheme();
  
  //Add Milage Modal Constants
  const [visible, setVisible] = useState(false);
  const showMilageModal = () => {
    if (milageData.length != 0) {setLatestMilage(milageData[0].Milage)}
    setVisible(true);}
  const hideMilageModal = () => {
    retrieveData()
    setVisible(false)
  };
  
  useEffect(() => {
      retrieveData();
  }, []);

  //Database Functions start
  const retrieveData = () => {
    db.transaction(tx => {
      tx.executeSql('SELECT * FROM milage', [], (_tx, results) => {
        var temp = [];
        for (let i = 0; i < results.rows.length; ++i) {
          if (results.rows.item(i).Car === carID){
            temp.push(results.rows.item(i))}
        }
        if (mounted.current) {
          setMilageData(temp.reverse());
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
                hideModal()
              }
            },
          );
        });
      } else {
        return;
      }
    });
  };
  //Database Functions End
  
  //Export Data to Excel Start ===========================================================
  const exportDataToExcel = () => {

    // Created Sample data
    let sample_data_to_export = milageData;

    let wb = XLSX.utils.book_new();
    let ws = XLSX.utils.json_to_sheet(sample_data_to_export)    
    XLSX.utils.book_append_sheet(wb,ws,"Users")
    const wbout = XLSX.write(wb, {type:'binary', bookType:"xlsx"});

    // Write generated excel to Storage
    RNFS.writeFile(RNFS.DownloadDirectoryPath + '/RebelFleetData.xlsx', wbout, 'ascii').then((r)=>{
     console.log('Success');
    }).catch((e)=>{
      console.log('Error', e);
    });

  }

  const handleClick = async () => {

    try{
      // Check for Permission (check if permission is already given or not)
      let isPermitedExternalStorage = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE);

      if(!isPermitedExternalStorage){

        // Ask for permission
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          {
            title: "Storage permission needed",
            buttonNeutral: "Ask Me Later",
            buttonNegative: "Cancel",
            buttonPositive: "OK"
          }
        );

        
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          // Permission Granted (calling our exportDataToExcel function)
          exportDataToExcel();
          console.log("Permission granted");
        } else {
          // Permission denied
          console.log("Permission denied");
        }
      }else{
         // Already have Permission (calling our exportDataToExcel function)
         exportDataToExcel();
      }
    }catch(e){
      console.log('Error while checking permission');
      console.log(e);
      return
    }
    
  };
  //Export Data to Excel END ===========================================================

  // Remarks Modal Variables Start
  const [visibleRemarks, setVisibleRemarks] = useState(false);
  const modalData = useRef({DateTime: 'Placeholder', Milage: 'Placeholder', Remarks: 'Placeholder', MilageDiff: 'Placeholder'});
  const showModal = currentItem => {
    modalData.current = currentItem;
    setVisibleRemarks(true);
  };
  const hideModal = () => setVisibleRemarks(false);
  // Remarks Modal Variables End

  //Component for Flatlist
  const renderItem = ({item, index}) => {
    const date = item.DateTime.slice(4,15)
    const time = item.DateTime.slice(16,24)
    // console.log(milageData)

    return (
      <Pressable onPress={() => showModal(item)}>
        <TableRow item = {item} index ={index} deleteEntry={deleteEntry}/>
      </Pressable>
  )};

  return (
      <View style = {styles.container}>
          <AddNew showModal={showMilageModal}/>
          <AddMilageModal 
            visible={visible} 
            hideModal={hideMilageModal}
            carID = {carID}
            latestMilage = {latestMilage}
          />
          <RemarksModal
            hideModal={hideModal}
            visible={visibleRemarks}
            item={modalData.current}
            deleteItem={deleteEntry}
          />
          <TableHead headings = {{first: 'S.NO', second: 'DATE', third: 'TIME', fourth: 'MILAGE'}}/>
          <FlatList
            data={milageData}
            renderItem={renderItem}
            keyExtractor={(_item, index) => index.toString()}
            ListFooterComponent={<View style={{height: 100}}/>}
          />
          <FAB
            style={styles.fab}
            small
            icon="download"
            label="Download To Excel"
            onPress={() => handleClick()}
          />
          {/* <DataTable style={{elevation: 2, width: '95%', alignSelf: 'center'}}>
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
                <View 
                  style={styles.row}
                  key={item.DateTime}
                  onPress={() => {}}>
                  <Text>{index+1}</Text>
                  <Text>{date}</Text>
                  <Text>{time}</Text>
                  <Text>{item.Milage}</Text>
                </View>
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
          </DataTable> */}
      </View>
  )
};

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    // justifyContent: 'center',
    // alignItems: 'center',
    margin: 5,
    flex: 1
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    // width: windowWidth-25 
  },
})

export default MilagePage;