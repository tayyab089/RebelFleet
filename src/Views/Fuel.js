import React, {useState, useEffect, useRef, useContext} from "react";
import {View, StyleSheet, ScrollView, Alert, Text, Dimensions, PermissionsAndroid, FlatList, Pressable} from 'react-native';
import { DataTable, IconButton, useTheme, FAB } from "react-native-paper";
import {openDatabase} from 'react-native-sqlite-storage';

import IDContext from "../Utils/IDContext";
import TableHead from "../Components/TableHead";
import TableRow from "../Components/TableRow";
import RemarksModal from "../Utils/RemarksModal";

import AddNew from "../Components/AddNew";
import AddFuelModal from "../Utils/AddNewFuelModal";
import promptUser from "../Utils/AsyncAlert";

var RNFS = require('react-native-fs');
import XLSX from 'xlsx';

const db = openDatabase({name: 'database.db', createFromLocation: 1});

const windowWidth = Dimensions.get('window').width-10;

const numberOfItemsPerPageList = [5, 8, 10]; // Items per page for the pagination

const FuelPage = ({route}) => {
  const {carID} = useContext(IDContext);
  const mounted = useRef(true)
  const [FuelData, setFuelData] = useState([])
  const {colors} = useTheme();
  //Add Fuel Modal Constants
  const [visible, setVisible] = useState(false);
  const showFuelModal = () => setVisible(true);
  const hideFuelModal = () => {
    retrieveData()
    setVisible(false)
  };

  //Variables for Pagination Start
  const [page, setPage] = useState(0);
  const [numberOfItemsPerPage, onItemsPerPageChange] = useState(
    numberOfItemsPerPageList[1],
  );
  const from = page * numberOfItemsPerPage;
  const to = Math.min((page + 1) * numberOfItemsPerPage, FuelData.length);
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
      tx.executeSql('SELECT * FROM fuel', [], (_tx, results) => {
        var temp = [];
        console.log(results.rows.length);
        for (let i = 0; i < results.rows.length; ++i) {
          if (results.rows.item(i).Car === carID){
            temp.push(results.rows.item(i))}
          console.log(temp)
        }
        if (mounted.current) {
          setFuelData(temp.reverse());
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
            'DELETE FROM Fuel where DateTime=?',
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

  //Export Data to Excel Start ===========================================================
  const exportDataToExcel = () => {

    // Created Sample data
    let sample_data_to_export = FuelData;

    let wb = XLSX.utils.book_new();
    let ws = XLSX.utils.json_to_sheet(sample_data_to_export)    
    XLSX.utils.book_append_sheet(wb,ws,"Users")
    const wbout = XLSX.write(wb, {type:'binary', bookType:"xlsx"});
    const aDate = new Date();
    const cDate = aDate.toISOString().slice(0,10).replace(/-/g,"");

    // Write generated excel to Storage
    RNFS.writeFile(RNFS.DownloadDirectoryPath + `/FuelData-${carID}-${cDate}.xlsx`, wbout, 'ascii').then((r)=>{
      Alert.alert('FILE SUCCESSFULLY DOWNLOADED TO DOWNLOADS FOLDER');
    }).catch((e)=>{
      console.log('Error', e);
      Alert.alert('COULD NOT WRITE, SEEMS TO BE A STORAGE PERMISSION ISSUE');
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
    item['Milage'] = item ['FuelAmount']
    item['MilageDiff'] = item ['FuelCost']

    return (
      <Pressable onPress={() => showModal(item)}>
        <TableRow item = {item} index ={index} deleteEntry={deleteEntry}/>
      </Pressable>
  )};

  return (
      <View style = {styles.container}>
          <AddNew showModal={showFuelModal}/>
          <AddFuelModal 
            visible={visible} 
            hideModal={hideFuelModal}
            carID = {carID}
          />
          <RemarksModal
            hideModal={hideModal}
            visible={visibleRemarks}
            item={modalData.current}
            deleteItem={deleteEntry}
          />  
          <TableHead headings = {{first: 'S.NO', second: 'DATE', third: 'TIME', fourth: 'FUEL(L)'}}/>
          <FlatList
            data={FuelData}
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
            <DataTable.Title style={{flex: 2}}>Fuel(L)</DataTable.Title>
            <DataTable.Title style={{flex: 2}}>Price</DataTable.Title>
            <DataTable.Title style={{flex: 2}}></DataTable.Title>
          </DataTable.Header>
          <ScrollView>
            {FuelData.map( (item, index) => {
              const date = item.DateTime.slice(4,15)
              const time = item.DateTime.slice(16,24)
              return (
                <DataTable.Row
                  key={item.DateTime}
                  onPress={() => {}}>
                  <DataTable.Cell style={{flex: 1}}>{index+1}</DataTable.Cell>
                  <DataTable.Cell style={{flex: 4}}>{date}</DataTable.Cell>
                  <DataTable.Cell style={{flex: 3}}>{time}</DataTable.Cell>
                  <DataTable.Cell style={{flex: 2}}>{item.FuelAmount}</DataTable.Cell>
                  <DataTable.Cell style={{flex: 2}}>{item.FuelCost}</DataTable.Cell>
                  <DataTable.Cell style={{flex: 2}}>
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
              numberOfPages={Math.ceil(FuelData.length / numberOfItemsPerPage)}
              onPageChange={page => setPage(page)}
              label={`${from + 1}-${to} of ${FuelData.length}`}
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
    flex: 1,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    // width: windowWidth-25 
  },
})

export default FuelPage;