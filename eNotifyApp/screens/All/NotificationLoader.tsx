import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Dimensions,
  TouchableOpacity,
  useColorScheme,
} from 'react-native';
import React, {useEffect, useState, useRef} from 'react';
import {format} from 'date-fns';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Colors from '../../components/Constants/Color';
import firestore from '@react-native-firebase/firestore';
import {NotificationType} from '../../components/Types/indexTypes';
import LinearGradient from 'react-native-linear-gradient';
import ClassSelection from '../Professor/ClassSelection';

const screenWidth = Dimensions.get('window').width;

export default function NotificationLoader({navigation, prof, razredi}: any) {
  const isDarkMode = useColorScheme() === 'light';

  const [notifications, setNotifications] = useState<NotificationType[]>([]);
  const [studentClass, setClass] = useState('');
  const [userId, setUserId] = useState('');
  const [professor, setProfessor] = useState('');
  const [profClass, setProfClass] = useState('');
  const subscriptions = ['Prvi', 'Drugi', 'Treci', 'Cetvrti'];

  const getRazredAndId = async () => {
    const name = prof ? await AsyncStorage.getItem('Name') : 'notProf';
    const value = await AsyncStorage.getItem('UserId');
    const raz = await AsyncStorage.getItem('Class');
    if (value !== null && name !== null && raz !== null) {
      setUserId(value);
      setProfessor(name);
      setClass(raz.slice(0, 4));
      prof ? setProfClass(raz.slice(0, 4)) : null;
    }
  };

  //uzimanje podataka iz baze
  // firestore.Filter.or(
  //   firestore.Filter('Class', 'array-contains', studentClass),
  //   firestore.Filter(
  //     'Class',
  //     'array-contains',
  //     subscriptions[parseInt(studentClass.slice(0, 1)[0]) - 1],
  //   ),
  //   firestore.Filter('Class', 'array-contains', 'Svi'),
  // ),
  const getData = () => {
    if (!prof) {
      console.log(studentClass);
      firestore()
        .collection('Notifications')
        .where(
          firestore.Filter('Class', 'array-contains-any', [
            studentClass,
            subscriptions[parseInt(studentClass.slice(0, 1)[0]) - 1],
            'Svi',
          ]),
        )
        .onSnapshot(snapshot => {
          const data: NotificationType[] = snapshot.docs.map(doc => ({
            id: doc.id,
            ...(doc.data() as NotificationType),
          }));
          setNotifications(
            data.sort((a, b) => Number(b.Date) - Number(a.Date)),
          );
        });
    } else {
      firestore()
        .collection('Notifications')
        .where(firestore.Filter('Class', 'array-contains', profClass))
        .where('From', '==', professor)
        .onSnapshot(snapshot => {
          const data: NotificationType[] = snapshot.docs.map(doc => ({
            id: doc.id,
            ...(doc.data() as NotificationType), // Here, we assert that the document data conforms to the User interface
          }));
          setNotifications(
            data.sort((a, b) => Number(b.Date) - Number(a.Date)),
          );
        });
    }
  };

  useEffect(() => {
    if (studentClass == '' && userId == '') {
      getRazredAndId();
    }
    if (studentClass != '' && userId !== '' && professor !== '') {
      getData();
    }
  }, [studentClass, userId, professor, profClass]);

  const getInitials = (name: string) => {
    const words = name.split(' ');
    let initials = '';
    for (const word of words) {
      const firstLetter = word.charAt(0).toUpperCase();
      if (firstLetter === 'L' || firstLetter === 'N' || firstLetter === 'D') {
        const secondLetter = word.charAt(1);
        if (secondLetter === 'j' || secondLetter === 'ž') {
          const twoLetterCombo = firstLetter + secondLetter;
          initials += twoLetterCombo;
        } else {
          initials += firstLetter;
        }
      } else {
        initials += firstLetter;
      }
    }
    return initials;
  };

  let date: string;
  const renderObavestenje = ({
    item,
    index,
  }: {
    item: NotificationType;
    index: number;
  }) => {
    let dateNew: string;
    const display = (
      <TouchableOpacity
        style={[
          styles.obavestenje,
          {
            backgroundColor: isDarkMode
              ? Colors.Light.notificationBG
              : Colors.Dark.notificationBG,
          },
        ]}
        activeOpacity={0.5}
        key={item.NotificationId}
        onPress={() => {
          navigation.navigate('Notification', {id: item.NotificationId});
        }}>
        <View
          style={
            userId && item.Seen.includes(userId)
              ? {display: 'none'}
              : [
                  styles.newObavestenje,
                  {
                    backgroundColor: isDarkMode
                      ? Colors.Light.accentGreen
                      : Colors.Dark.accentGreen,
                  },
                ]
          }></View>

        <LinearGradient
          start={{x: 1.3, y: 0}}
          end={{x: 0, y: 0}}
          colors={
            isDarkMode
              ? ['#C6E2F5', '#2077F9']
              : [Colors.Dark.accent, Colors.Dark.appBackground]
          }
          style={styles.initialsContainer}>
          <Text
            style={[
              styles.initialsText,
              {
                color: isDarkMode
                  ? Colors.Light.white
                  : Colors.Dark.textPrimary,
              },
            ]}>
            {getInitials(item.From)}
          </Text>
        </LinearGradient>
        <View>
          <Text
            style={[
              styles.obavestenjeTitle,
              {
                color: isDarkMode
                  ? Colors.Light.textPrimary
                  : Colors.Dark.textPrimary,
              },
            ]}>
            {item.Tittle}
          </Text>

          <Text
            style={[
              styles.obavestenjeBody,
              {
                color: isDarkMode
                  ? Colors.Light.textPrimary
                  : Colors.Dark.textPrimary,
              },
            ]}
            numberOfLines={2}>
            {item.Text}
          </Text>
        </View>
      </TouchableOpacity>
    );

    index === 0 ? (date = '') : null;
    dateNew = format(item.Date.toDate(), 'dd.MM.yyyy.');

    if (dateNew === date) {
      return display;
    } else {
      date = dateNew;
      return (
        <View key={item.NotificationId}>
          <View style={styles.datum}>
            <Text
              style={[
                styles.datumText,
                {
                  color: isDarkMode
                    ? Colors.Light.textPrimary
                    : Colors.Dark.textPrimary,
                },
              ]}>
              {date}
            </Text>
          </View>
          {display}
        </View>
      );
    }
  };

  return (
    <View style={styles.container}>
      {notifications && (
        <View
          style={[
            styles.list,
            {
              backgroundColor: isDarkMode
                ? Colors.Light.appBackground
                : Colors.Dark.appBackground,
            },
          ]}>
          {prof && (
            <ClassSelection
              razredi={razredi}
              setProfClass={(o: any) => setProfClass(o)}
              profClass={profClass}
            />
          )}
          <FlatList
            style={[styles.flatList]}
            data={notifications}
            renderItem={renderObavestenje}
            keyExtractor={obavestenje => obavestenje.NotificationId}
            initialNumToRender={7}
            showsVerticalScrollIndicator={false}
            updateCellsBatchingPeriod={50}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderWidth: 0,
    marginTop: -35,
    zIndex: 100,
  },
  list: {
    flex: 1,

    width: '100%',
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,

    overflow: 'hidden',
    elevation: 2,
    shadowColor: Colors.Light.black,
    shadowOffset: {width: 2, height: 5},
    shadowRadius: 1,
    display: 'flex',
  },
  background: {
    width: '100%',
    height: '100%',
    opacity: 0.95,
    alignItems: 'center',
  },
  flatList: {
    width: screenWidth,
  },
  obavestenje: {
    alignItems: 'center',
    flexDirection: 'row',
    height: 100,
    width: '90%',
    marginTop: 5,
    marginBottom: 10,
    marginLeft: screenWidth * 0.05,
    padding: 10,

    borderRadius: 10,
    elevation: 3,
    shadowColor: Colors.Light.black,
    shadowOffset: {width: 2, height: 5},
    shadowRadius: 1,
  },
  initialsContainer: {
    aspectRatio: 1 / 1,
    height: '85%',

    borderRadius: 50,
    marginRight: 10,
    justifyContent: 'center',
  },
  initialsText: {
    textAlign: 'center',

    fontFamily: 'Mulish',
    fontSize: 30,
  },
  obavestenjeTitle: {
    fontSize: 20,

    fontFamily: 'Mulish-Light',
    maxWidth: screenWidth / 1.5,
  },
  obavestenjeBody: {
    flexShrink: 1,

    fontFamily: 'Mulish-Light',
    maxWidth: screenWidth / 1.5,
  },
  newObavestenje: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',

    width: 20,
    height: 20,
    borderRadius: 10,

    position: 'absolute',
    top: -5,
    right: -5,
  },
  newObavestenjeText: {
    color: 'white',
  },
  datum: {
    marginTop: 20,
    marginLeft: screenWidth * 0.06,
  },
  datumText: {
    fontSize: 13,
    marginTop: 5,
    fontFamily: 'Mulish-Light',
  },
});
