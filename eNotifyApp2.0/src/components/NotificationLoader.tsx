import {Dimensions, StyleSheet, View} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import {FlatList} from 'react-native-gesture-handler';

import {format} from 'date-fns';
import {useGlobalContext} from '../context/GlobalProvider';
import {NotificationType} from '../constants/Types/indexTypes';

import NotifiactionBlock from './NotificationBlock';
import NoNotification from './NoNotification';
import {fetchNotifications} from '../hooks/getNotifications';
import Colors from '../constants/Color';

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
      await fetchNotifications(
        user?.Role as string,
        user?.Role === 'Student' ? (user?.Class as string) : userClass,
        user?.Name as string,
        setNotifications,
      );
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
              style={[
                styles.flatList,
                {marginBottom: user?.Role === 'Student' ? 85 : 160},
              ]}
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
              keyExtractor={notification => notification.NotificationId}
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
    shadowColor: Colors.Light.black,
    shadowOffset: {width: 2, height: 5},
    shadowRadius: 1,
    display: 'flex',
  },
  flatList: {
    width: screenWidth,
  },
});
