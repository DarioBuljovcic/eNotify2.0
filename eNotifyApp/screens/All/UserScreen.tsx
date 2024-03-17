import firestore from '@react-native-firebase/firestore';
import Colors from '../../components/Constants/Color';
import {User} from '../../components/Types/indexTypes';
import {StyleSheet, View} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Student from '../Student/Student';
import React, {useEffect, useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Image, Text} from 'react-native-elements';
import {TouchableOpacity} from 'react-native-gesture-handler';
import LinearGradient from 'react-native-linear-gradient';

const UserScreen = () => {
  const [role, setRole] = useState('');
  const [name, setName] = useState('');
  const [grade, setGrade] = useState('');

  useEffect(() => {
    const saveUser = async () => {
      setRole((await AsyncStorage.getItem('Role')) as string);
      setName((await AsyncStorage.getItem('Name')) as string);
      setGrade((await AsyncStorage.getItem('Class')) as string);
    };
    saveUser();
  });

  //set image source
  let imgSource;

  if (role == 'Student') {
    imgSource = require('../../assets/images/graduation.png');
  } else if (role == 'Professor') {
    imgSource = require('../../assets/images/open-book.png');
  } else {
    imgSource = require('../../assets/images/graduation.png');
  }

  return (
    <View style={styles.container}>
      <View style={styles.containerSize}>
        <View style={styles.userInfo}>
          <View style={styles.imgBorder}>
            <Image source={imgSource} style={styles.userImage} />
          </View>

          <Text style={styles.nameText}>{name}</Text>
          <Text style={styles.roleText}>
            {role == 'Professor' ? 'Profesor' : 'Student'}
          </Text>

          <TouchableOpacity
            style={styles.option}
            activeOpacity={0.5}
            //onPress={()=>{} }
          >
            <Text style={styles.optionText}>O aplikaciji</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.option}
            activeOpacity={0.5}
            //onPress={()=>{} }
          >
            <Text style={styles.optionText}>Kontaktiraj programera</Text>
          </TouchableOpacity>

          
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.Light.appBackground,
    alignItems: 'center',
  },
  containerSize: {
    width: '80%',
    marginTop: 30,
  },
  userInfo: {
    alignItems: 'center',
  },
  imgBorder: {
    height: 220,
    width: 220,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 10,
    borderColor: Colors.Light.textPrimary,
    borderRadius: 150,
    padding: 5,
  },
  userImage: {
    height: 150,
    width: 150,
  },
  nameText: {
    marginTop: 15,
    color: Colors.Light.textPrimary,
    fontSize: 20,
    fontFamily: 'Mulish-Light',
  },
  roleText: {
    color: Colors.Light.lightText,
    fontSize: 13,
    marginBottom: 20,
    fontFamily: 'Mulish-Light',
  },
  option: {
    height: 70,
    width: '100%',

    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,

    backgroundColor: Colors.Light.textInputBackground,
    marginVertical: 10,
    borderRadius: 10,

    elevation: 3,
    shadowColor: Colors.Light.black,
    shadowOffset: {width: 2, height: 5},
    shadowRadius: 1,
  },
  optionText: {
    fontSize: 17,
    flex: 1,
    color: Colors.Light.textPrimary,
    fontFamily: 'Mulish-Light',
  },
});

export default UserScreen;
