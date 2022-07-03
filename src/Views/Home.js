import React, {useState, useRef, useEffect} from "react";
import {ScrollView, StyleSheet, FlatList, View, Animated} from 'react-native';

import CardComponent from "../Components/Card";
import ListComponent from "../Components/ListComponent";
import AddNew from "../Components/AddNew";
import AddCarModal from "../Utils/AddNewCarModal";
import promptUser from "../Utils/AsyncAlert";

import {openDatabase} from 'react-native-sqlite-storage';
import { SafeAreaView } from "react-native-safe-area-context";

//import { useHeaderHeight } from '@react-navigation/elements';

const db = openDatabase({name: 'database.db', createFromLocation: 1});


const HomePage = ({navigation}) => {
    const mounted = useRef(true);
    const [carData, setCarData] = useState([
      {ID: 1, Make: 'Toyota', Model: 'Corolla 2017', Reg_No:'BJT1951'},
      {ID: 2, Make: 'Toyota', Model: 'Corolla 2017', Reg_No:'BJT1951'}
    ])

    //Add Card Modal Constants
    const [visible, setVisible] = useState(false);
    const showCarModal = () => setVisible(true);
    const hideCarModal = () => {
      retrieveData()
      setVisible(false)
    };

    useEffect(() => {
      navigation.addListener('focus', () => {
        retrieveData();
      });
    }, []);

    const retrieveData = () => {
      db.transaction(tx => {
        tx.executeSql('SELECT * FROM cars', [], (_tx, results) => {
          var temp = [];
          console.log(results.rows.length);
          for (let i = 0; i < results.rows.length; ++i) {
            temp.push(results.rows.item(i));
            console.log(temp)
          }
          if (mounted.current) {
            setCarData(temp);
          }
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

    const renderItem = ({item, index}) => (
      <CardComponent 
        ID = {item.ID}
        Make = {item.Make} 
        Model={item.Model} 
        Reg_No={item.Reg_No}
        Image={item.Image} 
        navigation = {navigation}
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
          <Animated.FlatList
            data={carData}
            renderItem={renderItem}
            keyExtractor={(_item, index) => _item.ID}
            // onScroll= {handleScroll}
            contentContainerStyle={{ paddingBottom: 200 }}
          />
        </View>
      </SafeAreaView>
    )
};

const styles = StyleSheet.create({
  container: {
    margin: 5,
  }
})

export default HomePage;