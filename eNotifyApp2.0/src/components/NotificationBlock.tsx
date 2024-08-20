import {Dimensions, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {
  NotificationType,
  OneNotificationProps,
} from '../constants/Types/indexTypes';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {useGlobalContext} from '../context/GlobalProvider';
import {format} from 'date-fns';
import Colors from '../constants/Color';

const NotifiactionBlock = ({
  item,
  index,
  navigation,
  date,
}: OneNotificationProps) => {
  let dateNew: string;
  const {isDarkMode, user} = useGlobalContext();
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

  const display = (
    <TouchableOpacity
      style={[
        styles.notification,
        {
          backgroundColor: isDarkMode.componentBG,
        },
      ]}
      activeOpacity={0.7}
      key={item.NotificationId}
      onPress={() => {
        navigation.navigate('Notification', {id: item.NotificationId});
      }}>
      <View
        style={
          user?.UserID && item.Seen.includes(user?.UserID)
            ? {display: 'none'}
            : [
                styles.newNotification,
                {
                  backgroundColor: isDarkMode.accent,
                },
              ]
        }></View>

      <View
        style={[
          styles.initialsContainer,
          {
            backgroundColor: isDarkMode.accent,
          },
        ]}>
        <Text
          style={[
            styles.initialsText,
            {
              color: isDarkMode.textPrimary,
            },
          ]}>
          {getInitials(item.From)}
        </Text>
      </View>
      <View>
        <Text
          style={[
            styles.notificationTitle,
            {
              color: isDarkMode.textPrimary,
            },
          ]}>
          {item.Title}
        </Text>

        <Text
          style={[
            styles.notificationBody,
            {
              color: isDarkMode.textPrimary,
            },
          ]}
          numberOfLines={2}>
          {item.Text}
        </Text>
      </View>
    </TouchableOpacity>
  );
  dateNew = format(item.Date.toDate(), 'dd.MM.yyyy.');
  if (dateNew === date && index !== 0) {
    return display;
  } else {
    return (
      <View key={item.NotificationId}>
        <View style={styles.datum}>
          <Text
            style={[
              styles.datumText,
              {
                color: isDarkMode.textPrimary,
              },
            ]}>
            {dateNew}
          </Text>
        </View>
        {display}
      </View>
    );
  }
};

export default NotifiactionBlock;

const screenWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({
  notification: {
    alignItems: 'center',
    flexDirection: 'row',
    height: 90,
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
  notificationTitle: {
    fontSize: 20,
    flexShrink: 1,
    fontFamily: 'Mulish',
    maxWidth: screenWidth / 1.5,
  },
  notificationBody: {
    flexShrink: 1,
    fontFamily: 'Mulish',
    maxWidth: screenWidth / 1.5,
  },
  newNotification: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: 20,
    height: 20,
    borderRadius: 10,
    position: 'absolute',
    top: 10,
    right: 10,
  },
  datum: {
    marginTop: 20,
    marginLeft: screenWidth * 0.06,
  },
  datumText: {
    fontSize: 13,
    marginTop: 0,
    fontFamily: 'Mulish-Light',
  },
});
