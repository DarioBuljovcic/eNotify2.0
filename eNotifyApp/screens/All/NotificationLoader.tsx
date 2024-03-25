import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import React, {useEffect, useState, useRef} from 'react';
import {format} from 'date-fns';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Colors from '../../components/Constants/Color';
import firestore from '@react-native-firebase/firestore';
import {NotificationType} from '../../components/Types/indexTypes';

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

  let date: string;
  const renderObavestenje = ({item}: {item: NotificationType}) => {
    let dateNew: string;

    dateNew = format(item.Date.toDate(), 'dd.MM.yyyy.');
    if (dateNew === date) {
      return (
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
            }>
            <Text style={styles.newObavestenjeText}>Novo</Text>
          </View>
          <Text style={styles.obavestenjeTitle}>{item.Tittle}</Text>
          <Text style={styles.obavestenjeBody}>{item.Text}</Text>
        </TouchableOpacity>
      );
    } else {
      date = dateNew;

      return (
        <View key={item.NotificationId}>
          <View style={styles.datum}>
            <Text style={styles.datumText}>{date}</Text>
          </View>
          <TouchableOpacity
            style={styles.obavestenje}
            activeOpacity={0.5}
            onPress={() => {
              navigation.navigate('Notification', {id: item.NotificationId});
            }}>
            <View
              style={
                userId && item.Seen.includes(userId)
                  ? {display: 'none'}
                  : styles.newObavestenje
              }>
              <Text style={styles.newObavestenjeText}>Novo</Text>
            </View>
            <Text style={styles.obavestenjeTitle}>{item.Tittle}</Text>
            <Text style={styles.obavestenjeBody}>{item.Text}</Text>
          </TouchableOpacity>
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
    backgroundColor: Colors.Light.accent,
    borderWidth: 0,
    marginTop: 0,
  },
  list: {
    flex: 1,
    alignItems: 'center',
    width: '80%',
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    marginTop: 10,
    backgroundColor: Colors.Light.appBackground,
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
    height: 100,
    width: '90%',
    marginTop: 5,
    marginBottom: 10,
    marginLeft: screenWidth * 0.05,
    padding: 10,
    backgroundColor: Colors.Light.notificationBG,
    borderRadius: 10,
    elevation: 3,
    shadowColor: Colors.Light.black,
    shadowOffset: {width: 2, height: 5},
    shadowRadius: 1,
  },
  obavestenjeTitle: {
    fontSize: 20,
    color: Colors.Light.textPrimary,
    fontFamily: 'Mulish-Light',
  },
  obavestenjeBody: {
    flexShrink: 1,
    color: Colors.Light.textSecondary,
    fontFamily: 'Mulish-Light',
  },
  newObavestenje: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',

    width: 40,
    height: 20,
    borderRadius: 10,

    position: 'absolute',
    top: 5,
    right: 5,

    backgroundColor: 'red',
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
