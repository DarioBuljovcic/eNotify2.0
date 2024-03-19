import React, {useState, useEffect} from 'react';
import {Text, View, StyleSheet, Dimensions, ScrollView} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Colors from '../../components/Constants/Color';
import firestore from '@react-native-firebase/firestore';
import LinearGradient from 'react-native-linear-gradient';
import Professor from './../Professor/Professor';

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
        '07:30\n08:15', // Prvi čas
        '08:20\n09:05', // Drugi čas
        '09:20\n10:05', // Treći čas
        '10:10\n10:55', // Četvrti čas
        '11:05\n11:50', // Peti čas
        '11:55\n12:40', // Šesti čas
        '12:45\n13:25', // Sedmi čas
        '13:30\n14:15', // Prvi čas
        '14:20\n15:05', // Drugi čas
        '15:20\n16:05', // Treći čas
        '16:10\n16:55', // Četvrti čas
        '17:05\n17:50', // Peti čas
        '17:55\n18:40', // Šesti čas
        '18:45\n19:25', // Sedmi čas
      ];

      days.forEach((day, index) => {
        let count = 0;
        tableItem.push(
          <LinearGradient
            start={{x: 0.8, y: 0}}
            end={{x: 0, y: 0}}
            colors={[Colors.Light.accent, Colors.Light.accentGreen]}
            style={styles.displayDay}
            key={day + count}>
            <Text style={styles.displayDayText}>{dayDisplay[index]}</Text>
          </LinearGradient>,
        );
        row[day].split(':/:').forEach((element: string, index) => {
          count++;

          if (!element.includes('none')) {
            const [ClassName, Professor, Classroom] = element.split('|');
            tableItem.push(
              <View style={styles.casContainer} key={day + count}>
                <Text style={styles.time} key={vreme[index]}>
                  {vreme[index]}
                </Text>
                <View style={styles.cas} key={day + count}>
                  <Text style={styles.casUcionica}>{Classroom}</Text>
                  <Text style={styles.casText} numberOfLines={1}>
                    {ClassName}
                  </Text>
                  <Text style={styles.casProf}>{Professor}</Text>
                </View>
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
        contentOffset={{x: (new Date().getDay() - 1) * screenWidth, y: 0}}>
        {raspored && renderRaspored(raspored)}
      </ScrollView>
    </>
  );
};

export default App;
const overlaySize = 200;
const cellWidth = 320;
const cellHeight = 70;

const styles = StyleSheet.create({
  flatList: {
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'column',
    marginVertical: 5,
  },
  days: {
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  displayDay: {
    height: cellHeight - 20,
    width: screenWidth,
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
    paddingBottom: 10,
  },
  casContainer: {
    display: 'flex',
    flexDirection: 'row',
  },
  cas: {
    position: 'relative',
    height: cellHeight,
    width: cellWidth,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.Light.notificationBG,
    borderWidth: 0.5,
    padding: 5,
    borderRadius: 10,
    borderColor: 'black',
  },
  casUcionica: {
    position: 'absolute',
    top: 0,
    right: 5,
  },
  casText: {
    fontSize: 18,
    color: Colors.Light.textPrimary,
    textAlign: 'center',
    fontFamily: 'Mulish',
    maxWidth: cellWidth / 1.6,
  },
  casProf: {
    fontSize: 13,
  },
  time: {
    textAlign: 'left',
    padding: 10,
    height: cellHeight,
    textAlignVertical: 'center',
  },
});
