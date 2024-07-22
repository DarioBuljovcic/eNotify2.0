import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useGlobalContext} from '../context/GlobalProvider';

const NoNotification = () => {
  const {isDarkMode} = useGlobalContext();
  return (
    <>
      <Ionicons
        name="notifications-off-outline"
        size={40}
        color={isDarkMode.lightText}
        style={styles.noNotificationsIcon}
      />
      <Text
        style={[
          styles.noNotificationsText,
          {
            color: isDarkMode.lightText,
          },
        ]}>
        No notifications
      </Text>
    </>
  );
};

export default NoNotification;

const styles = StyleSheet.create({
  noNotificationsText: {
    alignSelf: 'center',
    fontFamily: 'Mulish',
    fontSize: 17,
  },
  noNotificationsIcon: {
    alignSelf: 'center',
    marginTop: 20,
  },
});
