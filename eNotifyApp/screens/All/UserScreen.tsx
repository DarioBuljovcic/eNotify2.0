import Colors from '../../components/Constants/Color';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Appearance,
  Animated,
  useColorScheme,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Image, Text} from 'react-native-elements';
import LanguageText from '../Text';
import {UserScreenTabProps} from '../../components/Types/indexTypes';
import {LinearGradient} from 'react-native-linear-gradient';
import Ionicons from 'react-native-vector-icons/Ionicons';

const UserScreen = ({navigation}: UserScreenTabProps) => {
  const isDarkMode = useColorScheme() === 'dark';
  const [role, setRole] = useState('');
  const [name, setName] = useState('');
  const [grade, setGrade] = useState('');
  const [language, setLanguage] = useState('');
  const rotationValue = useRef(new Animated.Value(0)).current;
  const rotate = rotationValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });

  useEffect(() => {
    const saveUser = async () => {
      setRole((await AsyncStorage.getItem('Role')) as string);
      setName((await AsyncStorage.getItem('Name')) as string);
      setGrade((await AsyncStorage.getItem('Class')) as string);
      setLanguage((await AsyncStorage.getItem('Language')) as string);
    };
    saveUser();
  });
  const changeMode = () => {
    const rotateAnimation = Animated.timing(rotationValue, {
      toValue: Appearance.getColorScheme() === 'dark' ? 1 : 0,
      duration: 300,
      useNativeDriver: true,
    });
    Appearance.setColorScheme(
      Appearance.getColorScheme() === 'dark' ? 'light' : 'dark',
    );
    rotateAnimation.start();
  };

  let imgSource;
  if (role == 'Student') {
    imgSource = require('../../assets/images/graduation.png');
  } else if (role == 'Professor') {
    imgSource = require('../../assets/images/open-book.png');
  } else {
    imgSource = require('../../assets/images/graduation.png');
  }

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: isDarkMode
            ? Colors.Dark.appBackground
            : Colors.Light.appBackground,
        },
      ]}>
      <View style={styles.containerSize}>
        <TouchableOpacity
          style={[
            styles.modeChange,
            {
              borderColor: isDarkMode
                ? Colors.Dark.accentGreen
                : Colors.Light.accentGreen,
            },
          ]}
          onPress={() => changeMode()}>
          <Animated.View style={[styles.modeRotate, {transform: [{rotate}]}]}>
            <Ionicons
              name={'moon-outline'}
              size={35}
              color={Colors.Dark.accentGreen}
            />
            <Ionicons
              name={'sunny-outline'}
              size={35}
              color={Colors.Light.accentGreen}
            />
          </Animated.View>
        </TouchableOpacity>
        <View style={styles.userInfo}>
          <LinearGradient
            start={{x: 0.1, y: 0}}
            end={{x: 1, y: -0.8}}
            colors={isDarkMode ? ['#355E89', '#031525'] : ['blue', 'white']}
            style={styles.imgBorder}>
            <Image source={imgSource} style={styles.userImage} />
          </LinearGradient>

          <Text
            style={[
              styles.nameText,
              {
                color: isDarkMode
                  ? Colors.Dark.textPrimary
                  : Colors.Light.textPrimary,
              },
            ]}>
            {name}
          </Text>
          <Text
            style={[
              styles.gradeText,
              {
                color: isDarkMode
                  ? Colors.Dark.lightText
                  : Colors.Light.lightText,
              },
            ]}>
            {role == 'Professor' ? '' : grade}
          </Text>
          <Text
            style={[
              styles.roleText,
              {
                color: isDarkMode
                  ? Colors.Dark.textSecondary
                  : Colors.Light.textSecondary,
              },
            ]}>
            {role == 'Professor' ? 'Profesor' : 'Student'}
          </Text>

          <TouchableOpacity
            style={[
              styles.option,
              {
                backgroundColor: isDarkMode
                  ? Colors.Dark.notificationBG
                  : Colors.Light.notificationBG,
              },
            ]}
            activeOpacity={0.5}
            onPress={() => navigation.navigate('About')}>
            <Text
              style={[
                styles.optionText,
                {
                  color: isDarkMode
                    ? Colors.Dark.textSecondary
                    : Colors.Light.textSecondary,
                },
              ]}>
              O aplikaciji
            </Text>
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
    fontSize: 25,
    fontFamily: 'Mulish-Light',
  },
  gradeText: {
    fontSize: 16,
    fontFamily: 'Mulish-Light',
  },
  roleText: {
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
    fontFamily: 'Mulish-Light',
  },
  modeChange: {
    width: 45,
    aspectRatio: 1 / 1,
    display: 'flex',
    justifyContent: 'center',
    paddingLeft: 2,
    borderRadius: 25,
    overflow: 'hidden',
    borderWidth: 3,
    position: 'absolute',
    top: -20,
    right: -20,
  },
  modeRotate: {
    display: 'flex',
    gap: 4.5,
    flexDirection: 'row',

    transformOrigin: 'right',
  },
});

export default UserScreen;
