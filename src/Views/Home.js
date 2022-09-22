import React, {useState, useRef, useEffect} from "react";
import {ScrollView, StyleSheet, FlatList, View, Animated, Text, Dimensions} from 'react-native';

import CardComponent from "../Components/Card";
import ListComponent from "../Components/ListComponent";
import AddNew from "../Components/AddNew";
import AddCarModal from "../Utils/AddNewCarModal";
import promptUser from "../Utils/AsyncAlert";

import {openDatabase} from 'react-native-sqlite-storage';
import { SafeAreaView } from "react-native-safe-area-context";

//import { useHeaderHeight } from '@react-navigation/elements';

const db = openDatabase({name: 'database.db', createFromLocation: 1});

const windowHeight = Dimensions.get('window').height

const HomePage = ({navigation}) => {
    const mounted = useRef(true);
    const [changer, setChanger] = useState(false)
    const [carData, setCarData] = useState([
      {ID: 1, Make: 'Toyota', Model: 'Corolla 2017', Reg_No:'BJT1951', sMilage: 1234},
      {ID: 2, Make: 'Toyota', Model: 'Corolla 2017', Reg_No:'BJT1951', sMilage: 1234}, 
    ])

    //Add Card Modal Constants
    const [visible, setVisible] = useState(false);
    const showCarModal = () => setVisible(true);
    const hideCarModal = () => {
      fetchData()
      setVisible(false)
    };

    async function fetchData() {
      const returnedData = await retrieveData()
      if(returnedData.length != 0){
        setCarData(returnedData)
        setChanger(false)
      } else {
        setChanger(true)
      }
    }

    useEffect(() => {
        fetchData()
    }, []);

    const retrieveData = () => {
      return new Promise (resolve =>{
        db.transaction(tx => {
          tx.executeSql('SELECT * FROM cars', [], (_tx, results) => {
            var temp = [];
            for (let i = 0; i < results.rows.length; ++i) {
              temp.push(results.rows.item(i));
            }
            if (mounted.current) {
              resolve(temp);
            }
          });
        });
      });
    };

    const deleteCar = ID => {
      promptUser('CAUTION', 'Are You Sure?').then(res => {
        if (res === 'Yes') {
          db.transaction(tx => {
            console.log(ID)
            tx.executeSql(
              'DELETE FROM cars where ID=?',
              [ID],
              (_tx, results) => {
                if (results.rows.length === 0) {
                  //retrieveData();
                }
              },
            );
          });
          db.transaction(tx => {
            console.log(ID)
            tx.executeSql(
              'DELETE FROM milage where Car=?',
              [ID],
              (_tx, results) => {
                if (results.rows.length === 0) {
                  //retrieveData();
                }
              },
            );
          });
          db.transaction(tx => {
            console.log(ID)
            tx.executeSql(
              'DELETE FROM fuel where Car=?',
              [ID],
              (_tx, results) => {
                if (results.rows.length === 0) {
                  fetchData();
                }
              },
            );
          });
        } else {
          return;
        }
      });
    };

    const renderItem = ({item, index}) => (
      <CardComponent 
        ID = {item.ID}
        Make = {item.Make} 
        Model={item.Model} 
        Reg_No={item.Reg_No}
        Image={item.Image} 
        navigation = {navigation}
        sMilage = {item.SMilage}
        deleteCar={() => deleteCar(item.ID)} />
    );
    //Header Animationn
    // const scrollY = useRef(new Animated.Value(0));
    // const handleScroll = Animated.event(
    //   [
    //     {
    //       nativeEvent: {
    //         contentOffset: {y: scrollY.current},
    //       },
    //     },
    //   ],
    //   {
    //     useNativeDriver: true,
    //   },
    // );
    // const headerHeight = 100
    // const scrollYClamped = Animated.diffClamp(scrollY.current, 0, headerHeight);
    // const translateY = scrollYClamped.interpolate({
    //   inputRange: [0, headerHeight],
    //   outputRange: [0, -(headerHeight / 2)],
    //   });
    //  const translateYNumber = useRef();
    //  translateY.addListener(({value}) => {
    //    translateYNumber.current = value;
    //  });

    return (
      <SafeAreaView>
        {/* <Animated.View style={[styles.header, {transform: [{translateY}]}]}>
          <View style={{backgroundColor: 'blue', height: headerHeight/2}}></View>
        </Animated.View> */}
        <View style = {styles.container}>
          <AddNew showModal={showCarModal} />
          <AddCarModal 
            visible={visible} 
            hideCarModal={hideCarModal}
            />
          {changer ? 
          <View style = {styles.initialTextContainer}>
            <Text style = {styles.initialText}> Please Add New Car By Clicking on the  '+' button</Text>
          </View>:
          <Animated.FlatList
            data={carData}
            renderItem={renderItem}
            keyExtractor={(_item, index) => _item.ID}
            // onScroll= {handleScroll}
            contentContainerStyle={{ paddingBottom: 200 }}
          />
         }
        </View>
      </SafeAreaView>
    )
};

const styles = StyleSheet.create({
  container: {
    margin: 5,
  },
  initialTextContainer: {
    height: windowHeight - 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  initialText: {
    fontSize: 20,
    margin: 5,
    textAlign: 'center'
  }
})

export default HomePage;