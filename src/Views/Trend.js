import React, {useState, useEffect, useRef, useContext} from "react";
import {ScrollView, StyleSheet, Dimensions, View, TouchableOpacity} from 'react-native';
import { useTheme, Surface, Title} from "react-native-paper";

import {openDatabase} from 'react-native-sqlite-storage';
import { LineChart } from "react-native-chart-kit";

import IDContext from "../Utils/IDContext";

const db = openDatabase({name: 'database.db', createFromLocation: 1});

const windowWidth = Dimensions.get('window').width;
const margin = 10;

const TrendPage = ({route}) => {
  const {colors} = useTheme();
  const {carID} = useContext(IDContext);
  const mounted = useRef(true)
  const [isLineChart1Data, setIsLineChart1Data] = useState(true)
  const [isLineChart2Data, setIsLineChart2Data] = useState(true)

  //Database Functions start
  function retrieveDataMilage () {
    return new Promise (resolve => {
    db.transaction(tx => {
      tx.executeSql('SELECT * FROM milage', [], (_tx, results) => {
        var temp = [];
        for (let i = 0; i < results.rows.length; ++i) {
          if (results.rows.item(i).Car === carID){
            temp.push(results.rows.item(i))}
        }
        if (mounted.current) {
          resolve(temp)
        }
      });
    });
  })
  };

  function retrieveDataFuel () {
    return new Promise (resolve => {
    db.transaction(tx => {
      tx.executeSql('SELECT * FROM fuel', [], (_tx, results) => {
        var temp = [];
        for (let i = 0; i < results.rows.length; ++i) {
          if (results.rows.item(i).Car === carID){
            temp.push(results.rows.item(i))}
        }
        if (mounted.current) {
          resolve(temp)
        }
      });
    });
  })
  };

  async function fetchDataMilage() {
    const returnedData = await retrieveDataMilage()
    if (returnedData.length != 0){
    const data = returnedData.map(item => item.MilageDiff)
    const labels = returnedData.map(item => new Date(item.DateTime).toISOString().split('T')[0])
    const filteredData = {
      labels: labels,
      datasets: [
        {
          data: data
        }
      ]
    }
    setdataLineChart1(filteredData)
   } else {setIsLineChart1Data(false)}
  };
  async function fetchDataFuel() {
    const returnedData = await retrieveDataFuel()
    if (returnedData.length != 0){
    const data = returnedData.map(item => item.FuelAmount)
    const labels = returnedData.map(item => new Date(item.DateTime).toISOString().split('T')[0])
    const filteredData = {
      labels: labels,
      datasets: [
        {
          data: data
        }
      ]
    }
    setdataLineChart2(filteredData)
    } else {setIsLineChart2Data(false)}
  };

  useEffect(() => {
    fetchDataMilage()
    fetchDataFuel()
  }, []);

  // Line Chart Data and configuration Start-----------------//
  const [dataLineChart1, setdataLineChart1] = useState({
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        data: [
          Math.random() * 100,
          Math.random() * 100,
          Math.random() * 100,
          Math.random() * 100,
          Math.random() * 100,
          Math.random() * 100,
        ],
      },
    ],
  });

  const [dataLineChart2, setdataLineChart2] = useState({
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        data: [
          Math.random() * 100,
          Math.random() * 100,
          Math.random() * 100,
          Math.random() * 100,
          Math.random() * 100,
          Math.random() * 100,
        ],
      },
    ],
  });

  const lineChartConfig = {
    backgroundColor: '#ffffff',
    backgroundGradientFrom: '#ffffff',
    backgroundGradientTo: '#ffffff',
    decimalPlaces: 0, // optional, defaults to 2dp
    color: (opacity = 1) => `rgba(244, 81, 30, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(244, 81, 30, ${opacity})`,
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: '6',
      strokeWidth: '2',
      stroke: '#f4511e',
    },
  };
  // Line Chart Data and configuration End-----------------//
  

  return (
    <ScrollView style={{...styles.container, backgroundColor: colors.primary}}>
      <TouchableOpacity
        onPress={fetchDataMilage}
      >
        <Surface style={styles.heading}><Title style = {{color: colors.primary}}>Milage Data</Title></Surface>
      </TouchableOpacity>
      {isLineChart1Data ? 
      <LineChart
        data={dataLineChart1}
        width={Dimensions.get('window').width - margin * 2} // from react-native
        height={350}
        yAxisLabel=""
        yAxisSuffix=""
        yAxisInterval={1} // optional, defaults to 1
        verticalLabelRotation={45}
        chartConfig={lineChartConfig}
        bezier
        style={styles.chart}
      /> : <Surface style={styles.noData}><Title style = {{color: colors.primary}}>No Milage Data</Title></Surface>
      }
      <TouchableOpacity
        onPress={fetchDataFuel}
      >
        <Surface style={styles.heading}><Title style = {{color: colors.primary}}>Fuel Data</Title></Surface>
      </TouchableOpacity>
      {isLineChart2Data ? 
      <LineChart
        data={dataLineChart2}
        width={Dimensions.get('window').width - margin* 2} // from react-native
        height={350}
        yAxisLabel=""
        yAxisSuffix=""
        yAxisInterval={1} // optional, defaults to 1
        verticalLabelRotation={45}
        chartConfig={lineChartConfig}
        bezier
        style={styles.chart}
      />: <Surface style={styles.noData}><Title style = {{color: colors.primary}}>No Fuel Data</Title></Surface>
      }
      <View style={styles.filler}></View>
    </ScrollView>
  )
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  heading: {
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 5,
    marginTop: 5,
    borderRadius: 10,
  },
  chart: {
    borderRadius: 10,
    marginTop: 5,
  }, 
  filler: {
    height: 50,
  },
  noData: {
    height: 350,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 5,
    marginTop: 5,
    borderRadius: 10,
  }
})

export default TrendPage;