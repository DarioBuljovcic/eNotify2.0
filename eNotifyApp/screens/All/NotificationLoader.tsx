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
import {
  Notification,
  NotificationLoaderProps,
  StudentProps,
} from '../../components/Types/indexTypes';

const screenWidth = Dimensions.get('window').width;

export default function NotificationLoader({navigation}: any) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);
  const [studentClass, setClass] = useState('');

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
  const getData = async () => {
    const snapshot = await firestore()
      .collection('Notifications')
      //.where('Class', '==', '4ITS')
      .orderBy('Date')
      .get();
    const data: Notification[] = snapshot.docs.map(doc => ({
      id: doc.id,
      ...(doc.data() as Notification), // Here, we assert that the document data conforms to the User interface
    }));
    setNotifications(data);
  };
  useEffect(() => {
    getRazred();
    if (studentClass != '') {
      getData();
      setLoading(true);
    }
  }, [studentClass]);

  let date: string;
  const renderObavestenje = ({item}: {item: Notification}) => {
    let dateNew: string;
    dateNew = format(item.Date.toDate(), 'MM. do. yyyy.');
    if (dateNew === date) {
      return (
        <TouchableOpacity
          style={styles.obavestenje}
          activeOpacity={0.8}
          key={item.Text}
          onPress={() => {
            navigation.navigate('Notification', item);
          }}>
          <Text style={styles.obavestenjeTitle}>{item.Tittle}</Text>
          <Text style={styles.obavestenjeBody}>{item.Text}</Text>
        </TouchableOpacity>
      );
    } else {
      date = dateNew;
      
      return (
        <View key={item.Text}>
          <View style={styles.datum}>
            <Text style={styles.datumText}>{date}</Text>
          </View>
          <TouchableOpacity
            style={styles.obavestenje}
            activeOpacity={0.8}
            onPress={() => {
              navigation.navigate('Notification', item);
            }}>
            <Text style={styles.obavestenjeTitle}>{item.Tittle}</Text>
            <Text style={styles.obavestenjeBody}>{item.Text}</Text>
          </TouchableOpacity>
        </View>
      );
    }
  };

  return (
    <View>
      {loading && (
        <View style={styles.list}>
          <FlatList
            style={styles.flatList}
            data={notifications}
            renderItem={renderObavestenje}
            keyExtractor={obavestenje => obavestenje.Text}
            showsVerticalScrollIndicator={false}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  list: {
    flex: 1,
    alignItems: 'center',
    width: '80%',
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
    marginVertical: 10,
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
  },
  obavestenjeBody: {
    flexShrink: 1,
    color: Colors.Light.textSecondary,
  },
  datum: {
    marginTop: 30,
    marginLeft: screenWidth * 0.06,
  },
  datumText: {
    color: Colors.Light.textSecondary,
    fontSize: 14,
  },
});
