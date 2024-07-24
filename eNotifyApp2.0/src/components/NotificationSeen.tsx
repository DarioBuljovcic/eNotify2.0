import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {useGlobalContext} from '../context/GlobalProvider';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {NotificationSeenProps} from '../constants/Types/indexTypes';

const NotificationSeen = ({
  navigation,
  notification,
}: NotificationSeenProps) => {
  const {isDarkMode} = useGlobalContext();
  return (
    <TouchableOpacity
      style={styles.seen}
      onPress={() =>
        navigation.navigate('NotificationViewrs', {
          Seen: notification.Seen,
          Class: notification.Class,
        })
      }>
      <Ionicons
        name={'eye-outline'}
        size={28}
        color={isDarkMode.textSecondary}></Ionicons>
    </TouchableOpacity>
  );
};

export default NotificationSeen;

const styles = StyleSheet.create({
  seen: {
    width: 30,
    height: 30,
    alignSelf: 'flex-end',
    marginTop: 10,
    marginRight: 20,
  },
});
