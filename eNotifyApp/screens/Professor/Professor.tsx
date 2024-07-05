import {StyleSheet, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import {
  ProfessorProps,
  ProfessorTabProps,
  Class,
} from '../../components/Types/indexTypes';
import NotificationLoader from '../All/NotificationLoader';
import firestore from '@react-native-firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Professor({
  navigation,
}: ProfessorTabProps | ProfessorProps) {
  const [razredi, setRazredi] = useState<Class[]>([]);
  const [naziv, setNaziv] = useState('');

  useEffect(() => {
    const getData = async () => {
      const data = await firestore().collection('Classes').get();
      const name = await AsyncStorage.getItem('Name');
      if (name) setNaziv(name);
      let classes: Class[] = [];
      data.docs.forEach(doc => {
        classes.push(doc.data());
      });
      setRazredi(classes);
    };
    if (razredi.length === 0) getData();
  });

  return (
    <View style={styles.container}>
      <NotificationLoader
        navigation={navigation}
        prof={true}
        razredi={razredi}
      />
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
