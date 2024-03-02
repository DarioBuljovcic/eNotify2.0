import {View, Text, Alert} from 'react-native';
import React, {useEffect, useState} from 'react';
import firestore from '@react-native-firebase/firestore';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {Input} from 'react-native-elements';
import {RegistrationProps, User} from '../../components/Types/indexTypes';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {PermissionsAndroid} from 'react-native';

PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS);

const Registration = ({navigation}: RegistrationProps) => {
  const [value, setValue] = useState('');
  const saveUser = async (user: User) => {
    await AsyncStorage.setItem('Role', user.Role);
    await AsyncStorage.setItem('Class', user.Class);
    await AsyncStorage.setItem('Name', user.Name);
  };
  //Email and Password
  const Login = () => {
    const query = firestore().collection('Users').where('UserID', '==', value);
    query
      .get()
      .then(querySnapshot => {
        if (!querySnapshot.empty) {
          const user: User = querySnapshot.docs[0].data() as User;
          saveUser(user);
          Alert.alert('Uspesno ste se ulogovali');
          navigation.navigate('Student');
        } else {
          // Document does not exist
          Alert.alert('Nije dobar kod koji ste upisali');
        }
      })
      .catch(error => {
        console.error('Error getting document:', error);
      });
  };
  return (
    <View>
      <Input
        placeholder="Enter some text"
        onChangeText={text => setValue(text)}
        value={value}></Input>
      <TouchableOpacity onPress={() => Login()}>
        <Text>Click me</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Registration;
