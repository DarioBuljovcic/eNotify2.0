import {StyleSheet, View, Dimensions} from 'react-native';
import React, {useEffect, useState, useRef} from 'react';
import {StudentProps, StudentTabProps} from '../../components/Types/indexTypes';
import Colors from '../../components/Constants/Color';
import NotificationLoader from '../All/NotificationLoader';
import SelectedNotifications from '../All/SelectedNotifications';

const screenWidth = Dimensions.get('window').width;

export default function Student({navigation}: StudentProps | StudentTabProps) {
  return (
    <View style={styles.container}>
      <SelectedNotifications />
      <NotificationLoader navigation={navigation} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
