import Colors from '../../components/Constants/Color';
import {StyleSheet, View, TouchableOpacity, Appearance} from 'react-native';
import React, {useEffect, useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Image, Text} from 'react-native-elements';
import LanguageText from '../Text';
import {UserScreenTabProps} from '../../components/Types/indexTypes';
import {LinearGradient} from 'react-native-linear-gradient';

const UserScreen = ({navigation}: UserScreenTabProps) => {
  const [role, setRole] = useState('');
  const [name, setName] = useState('');
  const [grade, setGrade] = useState('');
  const [language, setLanguage] = useState('');

  useEffect(() => {
    const saveUser = async () => {
      setRole((await AsyncStorage.getItem('Role')) as string);
      setName((await AsyncStorage.getItem('Name')) as string);
      setGrade((await AsyncStorage.getItem('Class')) as string);
      setLanguage((await AsyncStorage.getItem('Language')) as string);
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
          <LinearGradient
            start={{x: 0.1, y: 0}}
            end={{x: 1, y: -0.8}}
            colors={['#355E89', '#031525']}
            style={styles.imgBorder}>
            <Image source={imgSource} style={styles.userImage} />
          </LinearGradient>

          <Text style={styles.nameText}>{name}</Text>
          <Text style={styles.gradeText}>
            {role == 'Professor' ? '' : grade}
          </Text>
          <Text style={styles.roleText}>
            {role == 'Professor' ? 'Profesor' : 'Student'}
          </Text>

          <TouchableOpacity
            style={styles.option}
            activeOpacity={0.5}
            onPress={() => navigation.navigate('About')}>
            <Text style={styles.optionText}>O aplikaciji</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor:
      Appearance.getColorScheme() === 'light'
        ? Colors.Light.appBackground
        : Colors.Dark.appBackground,
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    marginTop: -35,
    zIndex: 10,
  },
  containerSize: {
    width: '80%',
    marginTop: 30,
  },
  userInfo: {
    alignItems: 'center',
  },
  imgBorder: {
    height: 150,
    width: 150,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 150,
    padding: 5,
  },
  userImage: {
    height: 100,
    width: 100,
  },
  nameText: {
    marginTop: 15,
    color:
      Appearance.getColorScheme() === 'light'
        ? Colors.Light.textPrimary
        : Colors.Dark.textPrimary,
    fontSize: 25,
    fontFamily: 'Mulish-Light',
  },
  gradeText: {
    color:
      Appearance.getColorScheme() === 'light'
        ? Colors.Light.lightText
        : Colors.Dark.lightText,
    fontSize: 16,
    fontFamily: 'Mulish-Light',
  },
  roleText: {
    color:
      Appearance.getColorScheme() === 'light'
        ? Colors.Light.lightText
        : Colors.Dark.lightText,
    fontSize: 16,
    marginBottom: 30,
    fontFamily: 'Mulish-Light',
  },

  option: {
    height: 70,
    width: '100%',

    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,

    backgroundColor:
      Appearance.getColorScheme() === 'light'
        ? Colors.Light.textInputBackground
        : Colors.Dark.textInputBackground,
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
    color:
      Appearance.getColorScheme() === 'light'
        ? Colors.Light.textPrimary
        : Colors.Dark.textPrimary,
    fontFamily: 'Mulish-Light',
  },
});

export default UserScreen;
