import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Dimensions,
  TouchableOpacity,
  Appearance,
} from 'react-native';
import React, {useEffect, useState, useRef} from 'react';
import {format} from 'date-fns';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Colors from '../../components/Constants/Color';
import firestore from '@react-native-firebase/firestore';
import {NotificationType} from '../../components/Types/indexTypes';
import LinearGradient from 'react-native-linear-gradient';

const screenWidth = Dimensions.get('window').width;

export default function NotificationLoader({navigation}: any) {
  const [notifications, setNotifications] = useState<NotificationType[]>([]);
  const [loading, setLoading] = useState(false);
  const [studentClass, setClass] = useState('');
  const [userId, setUserId] = useState('');
  const subscriptions = ['Prvi', 'Drugi', 'Treci', 'Cetvrti'];

  const getId = async () => {
    const value = await AsyncStorage.getItem('UserId');
    if (value !== null) {
      setUserId(value);
    }
  };

  const getRazred = async () => {
    try {
      const value = await AsyncStorage.getItem('Class');
      if (value !== null) {
        setClass(value.slice(0, 4));
        return value;
      }
    } catch (e) {
      console.log(e);
    }
  };
  //uzimanje podataka iz baze
  const getData = () => {
    firestore()
      .collection('Notifications')
      .where('Class', 'in', [
        studentClass,
        subscriptions[parseInt(studentClass.slice(0, 1)[0]) - 1],
        'Svi',
      ])
      .onSnapshot(snapshot => {
        const data: NotificationType[] = snapshot.docs.map(doc => ({
          id: doc.id,
          ...(doc.data() as NotificationType), // Here, we assert that the document data conforms to the User interface
        }));
        setNotifications(data);
      });
  };

  useEffect(() => {
    if (loading) date = '';
  }, [notifications]);

  useEffect(() => {
    if (studentClass == '' && userId == '') {
      getRazred();
      getId();
    }
    if (studentClass != '' && userId !== '') {
      date = '';
      getData();
      setLoading(true);
    }
  }, [studentClass, userId]);

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
  const renderObavestenje = ({item}: {item: NotificationType}) => {
    let dateNew: string;

    const display = (
      <TouchableOpacity
        style={styles.obavestenje}
        activeOpacity={0.5}
        key={item.NotificationId}
        onPress={() => {
          navigation.navigate('Notification', {id: item.NotificationId});
        }}>
        <View
          style={
            userId && item.Seen.includes(userId)
              ? {display: 'none'}
              : styles.newObavestenje
          }></View>
        <LinearGradient
          start={{x: 1.3, y: 0}}
          end={{x: 0, y: 0}}
          colors={['#C6E2F5', '#2077F9']}
          style={styles.initialsContainer}>
          <Text style={styles.initialsText}>{getInitials(item.From)}</Text>
        </LinearGradient>
        <View>
          <Text style={styles.obavestenjeTitle}>{item.Tittle}</Text>
          <Text style={styles.obavestenjeBody} numberOfLines={2}>
            {item.Text}
          </Text>
        </View>
      </TouchableOpacity>
    );

    dateNew = format(item.Date.toDate(), 'dd.MM.yyyy.');
    if (dateNew === date) {
      return display;
    } else {
      date = dateNew;

      return (
        <View key={item.NotificationId}>
          <View style={styles.datum}>
            <Text style={styles.datumText}>{date}</Text>
          </View>
          {display}
        </View>
      );
    }
  };

  return (
    <View style={styles.container}>
      {loading && (
        <View style={styles.list}>
          <FlatList
            style={styles.flatList}
            data={notifications.sort((a, b) => Number(b.Date) - Number(a.Date))}
            renderItem={renderObavestenje}
            keyExtractor={obavestenje => obavestenje.NotificationId}
            showsVerticalScrollIndicator={false}
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
    alignItems: 'center',
    width: '100%',
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    backgroundColor:
      Appearance.getColorScheme() == 'light'
        ? Colors.Light.appBackground
        : Colors.Dark.appBackground,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: Colors.Light.black,
    shadowOffset: {width: 2, height: 5},
    shadowRadius: 1,
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
    backgroundColor:
      Appearance.getColorScheme() == 'light'
        ? Colors.Light.notificationBG
        : Colors.Dark.notificationBG,
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
    color:
      Appearance.getColorScheme() == 'light'
        ? Colors.Light.textPrimary
        : Colors.Dark.textPrimary,
    fontFamily: 'Mulish',
    fontSize: 30,
  },
  obavestenjeTitle: {
    fontSize: 20,
    color:
      Appearance.getColorScheme() == 'light'
        ? Colors.Light.textPrimary
        : Colors.Dark.textPrimary,
    fontFamily: 'Mulish-Light',
    maxWidth: screenWidth / 1.5,
  },
  obavestenjeBody: {
    flexShrink: 1,
    color:
      Appearance.getColorScheme() == 'light'
        ? Colors.Light.textPrimary
        : Colors.Dark.textPrimary,
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

    backgroundColor: Colors.Light.accentGreen,
  },
  newObavestenjeText: {
    color: 'white',
  },
  datum: {
    marginTop: 20,
    marginLeft: screenWidth * 0.06,
  },
  datumText: {
    color: Colors.Light.textPrimary,
    fontSize: 13,
    marginTop: 5,
    opacity: 0.6,
    fontFamily: 'Mulish-Light',
  },
});
