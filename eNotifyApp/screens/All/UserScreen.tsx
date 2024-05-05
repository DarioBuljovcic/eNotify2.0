import Colors from '../../components/Constants/Color';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Appearance,
  Animated,
  useColorScheme,
  Dimensions,
} from 'react-native';
import React, {useEffect, useRef, useState, useTransition} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Image, Text} from 'react-native-elements';
import LanguageText from '../Text';
import {UserScreenTabProps} from '../../components/Types/indexTypes';
import {LinearGradient} from 'react-native-linear-gradient';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useTranslation } from 'react-i18next';
import { color } from 'react-native-elements/dist/helpers';

const UserScreen = ({navigation}: UserScreenTabProps) => {
  const {t,i18n} = useTranslation();
  const isDarkMode = useColorScheme() === 'dark';
  const [role, setRole] = useState('');
  const [name, setName] = useState('');
  const [grade, setGrade] = useState('');
  const [language, setLanguage] = useState('');
  const [languageModal, setLanguageModal] = useState(false);
  const rotationValue = useRef(new Animated.Value(isDarkMode ? 0 : 1)).current;
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
  const changeMode = async () => {
    Appearance.setColorScheme(
      Appearance.getColorScheme() === 'dark' ? 'light' : 'dark',
    );
    AsyncStorage.setItem(
      'Mode',
      Appearance.getColorScheme() === 'dark' ? 'light' : 'dark',
    );
    const rotateAnimation = Animated.timing(rotationValue, {
      toValue: Appearance.getColorScheme() === 'dark' ? 1 : 0,
      duration: 800,
      useNativeDriver: true,
    });

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

  const changeLanguage = (prop:string) => {
    if(prop==='sr')
      i18n.changeLanguage('sr');
    else if(prop==='hu')
      i18n.changeLanguage('hu');
    else if(prop==='en')
      i18n.changeLanguage('en');

    setLanguageModal(false);
  }

  const renderLanguage = () => {
    if(i18n.language==='sr'){
      return(
        <Text
              style={[
                styles.optionTextLanguage,
                {
                  color: isDarkMode
                    ? Colors.Dark.textSecondary
                    : Colors.Light.textSecondary,
                },
              ]}>
              {t('serbian')}
            </Text>
      )
    }
    else if (i18n.language==='en'){
      return(
        <Text
              style={[
                styles.optionTextLanguage,
                { 
                  color: isDarkMode
                    ? Colors.Dark.textSecondary
                    : Colors.Light.textSecondary,
                },
              ]}>
              {t('english')}
            </Text>
      )
    }
    else if (i18n.language==='hu'){
      return(
        <Text
              style={[
                styles.optionTextLanguage,
                {
                  color: isDarkMode
                    ? Colors.Dark.textSecondary
                    : Colors.Light.textSecondary,
                },
              ]}>
              {t('hungarian')}
            </Text>
      )
    }

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
            colors={
              isDarkMode ? ['#355E89', '#031525'] : ['#2077F9', '#C6E2F5']
            }
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
            {role == 'Professor' ? t('proffesor') : t('student')}
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
              {t('about') }
            </Text>
          </TouchableOpacity>

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
            onPress={()=>setLanguageModal(true)}>
            <Text
              style={[
                styles.optionText,
                {
                  color: isDarkMode
                    ? Colors.Dark.textSecondary
                    : Colors.Light.textSecondary,
                },
              ]}>
              {t('language')}
            </Text>
            {renderLanguage()}
            <Ionicons 
              name={'language'}
              size={30}
              color={isDarkMode
                ? Colors.Dark.textSecondary
                : Colors.Light.textSecondary}/>
          </TouchableOpacity>
        </View>
      </View>
      {languageModal?
        <TouchableOpacity style={styles.modalBackground} onPress={()=>setLanguageModal(false)} activeOpacity={1}>
          <View style={styles.modal}>
            <TouchableOpacity style={[styles.languageOption,{borderBottomWidth:1},{backgroundColor:isDarkMode?Colors.Dark.textInputBackground:Colors.Light.textInputBackground},{borderColor:isDarkMode?Colors.Dark.lightText:Colors.Light.lightText}]} activeOpacity={1} onPress={()=>changeLanguage('sr')}>
              <Text style={[styles.languageOptionText,{color: i18n.language==='sr'?Colors.Light.hyperlinkText:isDarkMode?Colors.Dark.textPrimary:Colors.Light.textPrimary}]}>{t('serbian')}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.languageOption,{borderBottomWidth:1},{backgroundColor:isDarkMode?Colors.Dark.textInputBackground:Colors.Light.textInputBackground},{borderColor:isDarkMode?Colors.Dark.lightText:Colors.Light.lightText}]} activeOpacity={1} onPress={()=>changeLanguage('hu')}>
              <Text style={[styles.languageOptionText,{color: i18n.language==='hu'?Colors.Light.hyperlinkText:isDarkMode?Colors.Dark.textPrimary:Colors.Light.textPrimary}]}>{t('hungarian')}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.languageOption,{backgroundColor:isDarkMode?Colors.Dark.textInputBackground:Colors.Light.textInputBackground}]} activeOpacity={1} onPress={()=>changeLanguage('en')}>
              <Text style={[styles.languageOptionText,{color: i18n.language==='en'?Colors.Light.hyperlinkText:isDarkMode?Colors.Dark.textPrimary:Colors.Light.textPrimary}]}>{t('english')}</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
        :null
      }
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
    textTransform:'capitalize',
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
    textTransform:'capitalize'
  },
  optionTextLanguage: {
    fontSize: 12,
    fontFamily: 'Mulish-Light',
    textAlign:'right',
    marginRight:15,
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
  modalBackground:{
    position:'absolute',
    top:-120,
    width:Dimensions.get('screen').width,
    height:Dimensions.get('screen').height,
    justifyContent:'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modal:{
    alignSelf:'center',
    width:250,
    height:150,
    backgroundColor:Colors.Light.textInputBackground,
    borderRadius:20,
    overflow:'hidden',
  },
  languageOption:{
    height:150/3,
    justifyContent:'center'
  },
  languageOptionText:{
    marginLeft:10,
    fontSize:14,
    color:Colors.Light.textPrimary,
    fontFamily:'Mulish',
    textTransform:'capitalize',
  },
});

export default UserScreen;
