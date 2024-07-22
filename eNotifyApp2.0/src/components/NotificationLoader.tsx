import {Dimensions, StyleSheet, View} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import {FlatList} from 'react-native-gesture-handler';

import {format} from 'date-fns';
import {useGlobalContext} from '../context/GlobalProvider';
import {NotificationType} from '../constants/Types/indexTypes';
import getData from '../hooks/getNotifications';
import NotifiactionBlock from './NotificationBlock';
import NoNotification from './NoNotification';

const NotificationLoader = ({navigation, userClass}: any) => {
  const {isDarkMode, user} = useGlobalContext();
  const [notifications, setNotifications] = useState<NotificationType[]>();

  const getLastDate = (index: number) => {
    if (notifications)
      return notifications[index - 1]
        ? (format(
            notifications?.[index - 1].Date.toDate(),
            'dd.MM.yyyy.',
          ) as string)
        : (format(
            notifications?.[index].Date.toDate(),
            'dd.MM.yyyy.',
          ) as string);
  };

  useEffect(() => {
    const getNotifications = async () => {
      const notifi = await getData({
        role: user?.Role as string,
        userClass:
          user?.Role === 'Student' ? (user?.Class as string) : userClass,
        userId: user?.Name as string,
      });

      setNotifications(notifi);
    };
    getNotifications();
  }, [userClass]);
  return (
    <View>
      {notifications && (
        <>
          <View
            style={[
              styles.list,
              {
                backgroundColor: isDarkMode.appBackground,
              },
            ]}>
            <FlatList
              style={[styles.flatList]}
              data={notifications}
              renderItem={({item, index}) => {
                return (
                  <NotifiactionBlock
                    index={index}
                    item={item}
                    navigation={navigation}
                    date={getLastDate(index) as string}
                  />
                );
              }}
              keyExtractor={obavestenje => obavestenje.NotificationId}
              initialNumToRender={7}
              showsVerticalScrollIndicator={false}
              updateCellsBatchingPeriod={50}
              ListEmptyComponent={NoNotification}
            />
          </View>
        </>
      )}
    </View>
  );
};

export default NotificationLoader;

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;
const styles = StyleSheet.create({
  list: {
    width: screenWidth,
    height: screenHeight,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: 'black',
    shadowOffset: {width: 2, height: 5},
    shadowRadius: 1,
    display: 'flex',
    paddingBottom: 80,
  },
  flatList: {
    width: screenWidth,
    marginBottom: 90,
  },
});
