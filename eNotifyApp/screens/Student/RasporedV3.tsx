import React, {useState, useEffect, useRef} from 'react';
import {
  Text,
  View,
  StyleSheet,
  Dimensions,
  ScrollView,
  Appearance,
  useColorScheme,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
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
} & {
  [key: number]: string;
};
const screenWidth = Dimensions.get('window').width;

const App = () => {
  const isDarkMode = useColorScheme() === 'light';
  const [raspored, setRaspored] = useState<Data>();
  const [loading, setLoading] = useState(false);
  const [studentClass, getClass] = useState('');
  const [stopPosition, setStopPosition] = useState(0);
  const [snap, setSnap] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);
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

      days.forEach((day, index) => {
        let count = 0;
        tableItem.push(
          <View
            style={[
              styles.displayDay,
              {
                backgroundColor: isDarkMode
                  ? Colors.Light.accent
                  : Colors.Dark.accent,
              },
            ]}
            key={day + count}>
            <Text
              style={[
                styles.displayDayText,
                {
                  color: isDarkMode ? Colors.Light.white : Colors.Dark.white,
                },
              ]}>
              {dayDisplay[index]}
            </Text>
          </View>,
        );
        row[day].split(':/:').forEach((c: string, index) => {
          count++;
          const classes = c.split(',');
          if (classes.length === 1) {
            const element = classes[0];
            if (!classes.includes('none')) {
              const [ClassName, Professor, Classroom] = element.split('|');
              tableItem.push(
                <View style={styles.casContainer} key={day + count + index}>
                  <Text
                    style={[
                      styles.time,
                      {
                        color: isDarkMode
                          ? Colors.Light.textSecondary
                          : Colors.Dark.textSecondary,
                      },
                    ]}
                    key={vreme[index]}>
                    {vreme[index]}
                  </Text>
                  <View
                    style={[
                      styles.cas,
                      {
                        backgroundColor: isDarkMode
                          ? Colors.Light.notificationBG
                          : Colors.Dark.notificationBG,
                        borderColor: isDarkMode
                          ? Colors.Light.lightText
                          : Colors.Dark.lightText,
                      },
                    ]}>
                    <Text
                      style={[
                        styles.casUcionica,
                        {
                          color: isDarkMode
                            ? Colors.Light.textSecondary
                            : Colors.Dark.textSecondary,
                        },
                      ]}>
                      {Classroom}
                    </Text>
                    <Text
                      style={[
                        styles.casText,
                        {
                          color: isDarkMode
                            ? Colors.Light.textPrimary
                            : Colors.Dark.textPrimary,
                        },
                      ]}
                      numberOfLines={1}>
                      {ClassName}
                    </Text>
                    <Text
                      style={[
                        styles.casProf,
                        {
                          color: isDarkMode
                            ? Colors.Light.textSecondary
                            : Colors.Dark.textSecondary,
                        },
                      ]}>
                      {Professor}
                    </Text>
                  </View>
                </View>,
              );
            }
          } else {
            let tableItemSmall: any = [];
            classes.forEach((element: string, num) => {
              if (!element.includes('none')) {
                const [ClassName, Professor, Classroom] = element.split('|');
                tableItemSmall.push(
                  <View
                    style={styles.casContainerSmall}
                    key={day + (num + index + count)}>
                    <View
                      style={[
                        styles.casSmall,
                        {
                          backgroundColor: isDarkMode
                            ? Colors.Light.notificationBG
                            : Colors.Dark.notificationBG,
                          borderColor: isDarkMode
                            ? Colors.Light.lightText
                            : Colors.Dark.lightText,
                        },
                        {width: cellWidth / classes.length},
                      ]}>
                      <Text
                        style={[
                          styles.casUcionicaSmall,
                          {
                            color: isDarkMode
                              ? Colors.Light.textSecondary
                              : Colors.Dark.textSecondary,
                          },
                        ]}>
                        {Classroom}
                      </Text>

                      <Text
                        style={[
                          styles.casTextSmall,
                          {
                            color: isDarkMode
                              ? Colors.Light.textPrimary
                              : Colors.Dark.textPrimary,
                          },
                        ]}
                        numberOfLines={2}>
                        {ClassName}
                      </Text>

                      <Text
                        style={[
                          styles.casProfSmall,
                          {
                            color: isDarkMode
                              ? Colors.Light.textSecondary
                              : Colors.Dark.textSecondary,
                          },
                        ]}
                        numberOfLines={1}>
                        {Professor}
                      </Text>
                    </View>
                  </View>,
                );
              } else {
                tableItemSmall.push(
                  <View
                    style={styles.casContainerSmall}
                    key={day + (num + index)}>
                    <View
                      style={[
                        styles.casSmall,
                        {
                          backgroundColor: 'transparent',
                          borderColor: 'transparent',
                        },
                      ]}></View>
                  </View>,
                );
              }
            });
            tableItem.push(
              <View style={{display: 'flex', flexDirection: 'row'}}>
                <Text
                  style={[
                    styles.time,
                    {
                      color: isDarkMode
                        ? Colors.Light.textSecondary
                        : Colors.Dark.textSecondary,
                    },
                  ]}
                  key={vreme[index]}>
                  {vreme[index]}
                </Text>
                <View
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    width: cellWidth,
                  }}>
                  {tableItemSmall}
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
  useEffect(() => {
    if (raspored && !loading) {
      const n = new Date().getDay() - 1;
      let scrollHeight = 0;
      for (let i = 0; i < n; i++) {
        scrollHeight += raspored[days[i]]
          .split(':/:')
          .filter(day => day != 'none').length;
      }
      if (scrollViewRef.current) {
        setStopPosition(
          Math.max(
            scrollHeight * (cellHeight + 1.5) + (cellHeight - 20) * n,
            0,
          ),
        );
        scrollViewRef.current.scrollTo({
          y: scrollHeight * (cellHeight + 1.5) + (cellHeight - 20) * n,
          animated: true,
        });
      }
    }
  });

  return (
    <View style={{marginTop: -35, zIndex: 100}}>
      <View
        style={[
          styles.container,
          {
            backgroundColor: isDarkMode
              ? Colors.Light.appBackground
              : Colors.Dark.appBackground,
          },
        ]}>
        <ScrollView
          contentContainerStyle={styles.flatList}
          ref={scrollViewRef}
          snapToOffsets={[stopPosition]}
          snapToStart={false}
          snapToEnd={false}>
          {raspored && renderRaspored(raspored)}
        </ScrollView>
      </View>
    </View>
  );
};

export default App;
const overlaySize = 200;
const cellWidth = 320;
const cellHeight = 90;

const styles = StyleSheet.create({
  container: {
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    overflow: 'hidden',
  },
  flatList: {
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'column',
    paddingBottom: 30,
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
    padding: 5,
  },
  displayDayText: {
    fontSize: 25,

    fontFamily: 'Mulish',
  },
  day: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: screenWidth,
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
    borderWidth: 0.5,
  },
  casUcionica: {
    position: 'absolute',
    top: 0,
    right: 5,

    fontFamily: 'Mulish',
  },
  casText: {
    fontSize: 18,

    textAlign: 'center',
    fontFamily: 'Mulish-Light',
    maxWidth: cellWidth / 1.6,
  },
  casProf: {
    fontSize: 13,
    fontFamily: 'Mulish',
  },
  time: {
    textAlign: 'left',
    padding: 10,
    height: cellHeight,
    textAlignVertical: 'center',

    fontFamily: 'Mulish',
  },
  casContainerSmall: {
    display: 'flex',
    flexDirection: 'row',
  },
  casSmall: {
    position: 'relative',
    height: cellHeight,
    width: cellWidth / 3,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 0.5,
    padding: 5,
  },
  casUcionicaSmall: {
    fontSize: 11,
    position: 'absolute',
    top: 0,
    right: 5,

    fontFamily: 'Mulish',
  },

  casTextSmall: {
    fontSize: 14,

    textAlign: 'center',
    fontFamily: 'Mulish',
    maxWidth: cellWidth / 1.6,
    fontWeight: '600',
  },

  casProfSmall: {
    fontFamily: 'Mulish',
    fontSize: 10,
  },
});
