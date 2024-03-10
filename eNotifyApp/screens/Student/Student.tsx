import {
  Button,
  StyleSheet,
  Text,
  TextInput,
  View,
  FlatList,
  Dimensions,
  TouchableOpacity,
  AppState,
  Platform,
} from 'react-native';
import React, {useEffect, useState, useRef} from 'react';
import {StudentProps,StudentTabProps} from '../../components/Types/indexTypes';
import Colors from '../../components/Constants/Color';
import NotificationLoader from '../All/NotificationLoader';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';


const screenWidth = Dimensions.get('window').width;

export default function Student({navigation}: StudentProps|StudentTabProps) {
  return (
    <View style={styles.container}>
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
