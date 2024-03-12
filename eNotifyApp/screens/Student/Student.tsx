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
});
