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
import Colors from '../../constants/Color';
import firestore from '@react-native-firebase/firestore';
import LinearGradient from 'react-native-linear-gradient';

type Data = {
  [key: string]: string;
  Class: string;
  ponedeljak: string;
  utorak: string;
  sreda: string;
  cetvrtak: string;
  petak: string;
};

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

      days.forEach(day => {
        let count = 0;
        row[day].split(':/:').forEach((element: string) => {
          count++;
          if (element === 'none') {
            tableItem.push(
              <View style={styles.prazanCas} key={day + count}></View>,
            );
          } else {
            tableItem.push(
              <View style={styles.cas} key={day + count}>
                <Text style={styles.casText} numberOfLines={3}>
                  {' '}
                  {element}
                </Text>
              </View>,
            );
          }
          count > maxLength ? (maxLength = count) : null;
        });

        table.push(
          <View style={styles.day} key={day}>
            {tableItem}
          </View>,
        );
        tableItem = [];
      });
      let times = [];
      let time = 7.3;
      for (let i = 0; i < maxLength; i++) {
        (time % 1) * 100 > 60 || (time % 1) * 100 == 0 ? (time += 0.4) : null;

        const formattedTime1 = `${Math.floor(time)
          .toString()
          .padStart(2, '0')}:${((time % 1) * 100).toFixed(0).padStart(2, '0')}`;

        time += 0.45;
        i === 6 ? (time -= 0.05) : null;
        (time % 1) * 100 > 60 || (time % 1) * 100 == 0 ? (time += 0.4) : null;

        const formattedTime2 = `${Math.floor(time)
          .toString()
          .padStart(2, '0')}:${((time % 1) * 100).toFixed(0).padStart(2, '0')}`;

        times[i] = (
          <View style={styles.vreme}>
            <Text style={styles.vremeText}>
              {formattedTime1} - {formattedTime2}
            </Text>
          </View>
        );

        if (i === 1 || i === 8) time += 0.15;
        else if (i === 3 || i === 10) time += 0.1;
        else time += 0.05;
      }
      return (
        <>
          <View style={styles.vremena}>{times}</View>
          {table}
        </>
      );
    }
    return false;
  }

  useEffect(() => {
    getRazred();
    if (!raspored) getData();
  }, [studentClass]);

  return (
    <>
      <View>
        <LinearGradient
          start={{x: 0.8, y: 0}}
          end={{x: 0, y: 0}}
          colors={[Colors.Light.accent, Colors.Light.accentGreen]}
          style={styles.days}>
          <View style={styles.displayDay}>
            <Text style={styles.displayDayText}>{studentClass}</Text>
          </View>
          <View style={styles.displayDay}>
            <Text style={styles.displayDayText}>Ponedeljak</Text>
          </View>
          <View style={styles.displayDay}>
            <Text style={styles.displayDayText}>Utorak</Text>
          </View>
          <View style={styles.displayDay}>
            <Text style={styles.displayDayText}>Sreda</Text>
          </View>
          <View style={styles.displayDay}>
            <Text style={styles.displayDayText}>Četvrtak</Text>
          </View>
          <View style={styles.displayDay}>
            <Text style={styles.displayDayText}>Petak</Text>
          </View>
        </LinearGradient>
      </View>
      <ScrollView contentContainerStyle={styles.flatList}>
        {raspored && renderRaspored(raspored)}
      </ScrollView>
    </>
  );
};
const screenWidth = Dimensions.get('window').width;

export default App;
const overlaySize = 200;
const cellWidth = screenWidth / 6;
const cellHight = 80;

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
    height: cellHight,
    width: cellWidth,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 5,
  },
  displayDayText: {
    fontSize: 11,
    color: Colors.Light.whiteText,
  },
  day: {
    display: 'flex',
    flexDirection: 'column',
  },
  cas: {
    height: cellHight,
    width: cellWidth,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.Light.componentBG,
    borderWidth: 0.5,
    borderColor: Colors.Light.lightText,
    padding: 5,
  },
  prazanCas: {
    height: cellHight,
    width: cellWidth,
  },
  casText: {
    fontSize: 11,
    color: Colors.Light.textPrimary,
    textAlign: 'center',
    fontFamily: 'Mulish',
  },
  vremena: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    backgroundColor: Colors.Light.accentGreen,
  },
  vreme: {
    width: cellWidth,
    height: cellHight,
    textAlign: 'center',

    padding: 5,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'center',
    borderWidth: 0.5,
    borderColor: 'white',
  },
  vremeText: {
    fontSize: 12,
    color: Colors.Light.whiteText,
    fontFamily: 'Mulish',
  },
});
