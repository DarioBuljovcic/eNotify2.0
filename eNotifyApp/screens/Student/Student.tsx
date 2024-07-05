import {StyleSheet, View, Dimensions} from 'react-native';
import React from 'react';
import {StudentProps, StudentTabProps} from '../../components/Types/indexTypes';
import NotificationLoader from '../All/NotificationLoader';

export default function Student({navigation}: StudentProps | StudentTabProps) {
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
