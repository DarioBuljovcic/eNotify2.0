import React, {useState, useEffect} from 'react';
import {
  Text,
  View,
  StyleSheet,
  Button,
  Dimensions,
  FlatList,
  ScrollView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation} from '@react-navigation/native';
import Colors from '../../components/Constants/Color';
import firestore from '@react-native-firebase/firestore';

type Data = {
  [key: string]: string;
  Class: string;
  ponedeljak: string;
  utorak: string;
  sreda: string;
  cetvrtak: string;
  petak: string;
};
const screenWidth = Dimensions.get('window').width;
const App = () => {
  const [raspored, setRaspored] = useState<Data>();
  const [loading, setLoading] = useState(false);
  const [studentClass, getClass] = useState('');

  //uzmi razred korisnika
  const getRazred = async () => {
    try {
      const value = await AsyncStorage.getItem('Class');
      if (value !== null) {
        getClass(value);
        return value;
      }
    } catch (e) {
      // error reading value
    }
  };
  //uzmi raspored iz baze
  function getData() {
    const nabaviRazrede = async () => {
      const snapshot = await firestore()
        .collection('Classes')
        .where('Class', '==', studentClass)
        .get();
      console.log(snapshot.docs[0].data());
      setLoading(true);
      setRaspored(snapshot.docs[0].data() as Data);
    };
    nabaviRazrede();
  }

  //renderovanje rasporeda
  function renderRaspored(item: Data) {
    if (item) {
      let table: any = [];
      let tableItem: any = [];
      let row: Data = item;
      let maxLength = 0;
      const days = ['ponedeljak', 'utorak', 'sreda', 'cetvrtak', 'petak'];
      const dayDisplay = ['Ponedeljak', 'Utorak', 'Sreda', 'Četvrtak', 'Petak'];
      const vreme = [
        '07:30 - 08:15', // Prvi čas
        '08:20 - 09:05', // Drugi čas
        '09:20 - 10:05', // Treći čas
        '10:10 - 10:55', // Četvrti čas
        '11:05 - 11:50', // Peti čas
        '11:55 - 12:40', // Šesti čas
        '12:45 - 13:25', // Sedmi čas
        '13:30 - 14:15', // Prvi čas
        '14:20 - 15:05', // Drugi čas
        '15:20 - 16:05', // Treći čas
        '16:10 - 16:55', // Četvrti čas
        '17:05 - 17:50', // Peti čas
        '17:55 - 18:40', // Šesti čas
        '18:45 - 19:25', // Sedmi čas
      ];

      days.forEach((day, index) => {
        let count = 0;
        tableItem.push(
          <View style={styles.displayDay} key={day + count}>
            <Text style={styles.displayDayText}>{dayDisplay[index]}</Text>
          </View>,
        );
        row[day].split(':/:').forEach((element: string, index) => {
          count++;

          if (element === 'none') {
            tableItem.push(
              <View style={styles.prazanCas} key={day + count}></View>,
            );
          } else {
            tableItem.push(
              <View style={styles.cas} key={day + count}>
                <Text style={styles.casText} numberOfLines={1}>
                  {' '}
                  {element}
                </Text>
                <Text style={styles.time}>{vreme[index]}</Text>
              </View>,
            );
          }
          count > maxLength ? (maxLength = count) : null;
        });
        table.push(<View style={styles.day}>{tableItem}</View>);
        tableItem = [];
      });
      return <>{table}</>;
    }
    return false;
  }

  useEffect(() => {
    getRazred();
    if (!raspored) getData();
  }, [studentClass]);

  return (
    <>
      <ScrollView
        contentContainerStyle={styles.flatList}
        horizontal={true}
        contentOffset={{x: (new Date().getDay() - 1) * screenWidth, y: 0}}
        snapToOffsets={[
          0,
          screenWidth,
          2 * screenWidth,
          3 * screenWidth,
          4 * screenWidth,
          5 * screenWidth,
        ]}>
        {raspored && renderRaspored(raspored)}
      </ScrollView>
    </>
  );
};

export default App;
const overlaySize = 200;
const cellWidth = 250;
const cellHeight = 60;

const styles = StyleSheet.create({
  flatList: {
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  days: {
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  displayDay: {
    height: cellHeight - 20,
    width: cellWidth,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.Light.accentGreen,
    borderWidth: 0.5,
    padding: 5,
  },
  displayDayText: {
    fontSize: 20,
    color: 'white',
  },
  day: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: screenWidth,
    gap: 10,
  },
  cas: {
    height: cellHeight,
    width: cellWidth,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.Light.notificationBG,
    borderWidth: 0.5,
    padding: 5,
    gap: 10,
  },
  prazanCas: {
    height: cellHeight,
    width: cellWidth,
  },
  casText: {
    fontSize: 15,
    color: Colors.Light.textPrimary,
    textAlign: 'center',
    fontFamily: 'Mulish',
  },
  time: {
    textAlign: 'left',
    width: cellWidth - 10,
  },
});
