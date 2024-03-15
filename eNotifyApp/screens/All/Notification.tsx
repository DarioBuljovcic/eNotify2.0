import {StyleSheet, Text, View} from 'react-native';
//import { LinearGradient } from 'expo-linear-gradient';
import {useNavigation} from '@react-navigation/native';
import Colors from '../../components/Constants/Color';
import {format} from 'date-fns';
import {NotificationType} from '../../components/Types/indexTypes';
import firestore from '@react-native-firebase/firestore';
import {useEffect, useState} from 'react';

export default function Obavestenje({route}: any) {
  const navigation = useNavigation();
  const [notification, setNotification] = useState<NotificationType>();

  useEffect(() => {
    const getNotification = async () => {
      console.log('This is done');
      const querySnapshot = await firestore()
        .collection('Notifications') // Replace 'yourCollection' with your collection name
        .where('NotificationId', '==', route.params.id)
        .get();
      const data = querySnapshot.docs[0].data() as NotificationType;
      setNotification(data);
    };
    if (!notification) getNotification();
  });

  navigation.setOptions({title: route.params.Tittle});

  return (
    <View style={styles.container}>
      {notification && (
        <>
          <View style={styles.infoContainer}>
            <Text style={styles.class}>{notification?.Class}</Text>
            <Text style={styles.date}>
              {format(notification.Date.toDate(), 'dd. MM. yyyy')}
            </Text>
          </View>
          <Text style={styles.body}>{notification.Text}</Text>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    width: '100%',
    height: '100%',
    opacity: 0.95,
    padding: 20,
  },
  body: {
    marginTop: 10,
    fontSize: 18,
    color: Colors.Light.textPrimary,
    marginHorizontal: 15,
  },
  infoContainer: {
    paddingHorizontal: 10,
    paddingVertical: 10,
    flexDirection: 'row',
    borderColor: Colors.Light.textSecondary,
    borderRadius: 0,
    borderBottomWidth: 1.5,
    marginHorizontal: 10,
  },
  date: {
    flex: 1,
    textAlign: 'right',
    color: Colors.Light.textPrimary,
  },
  class: {
    flex: 1,
    color: Colors.Light.textPrimary,
  },
});
