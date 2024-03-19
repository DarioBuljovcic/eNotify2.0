import React, {useEffect, useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Alert, View} from 'react-native';
import {Text} from 'react-native-elements';
import {LoadingProps} from '../../components/Types/indexTypes';

export default function Loading({navigation}: LoadingProps) {
  return (
    <View>
      <Text>Loading</Text>
    </View>
  );
}
