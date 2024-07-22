import {View, Text, useColorScheme, StyleSheet, Image} from 'react-native';
import React from 'react';
import {TouchableOpacity} from 'react-native-gesture-handler';
import Colors from '../../constants/Color';
import {useTranslation} from 'react-i18next';
import {Dimensions} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {LanguageModalScreen} from '../../constants/Types/indexTypes';
import Ionicons from 'react-native-vector-icons/Ionicons';

export default function LanguageModal({navigation}: LanguageModalScreen) {
  const {t, i18n} = useTranslation();
  const isDarkMode = useColorScheme() === 'dark';

  const changeLanguage = async (prop: string) => {
    if (prop === 'sr') {
      i18n.changeLanguage('sr');
      AsyncStorage.setItem('Language', 'sr');
    } else if (prop === 'hu') {
      i18n.changeLanguage('hu');
      AsyncStorage.setItem('Language', 'hu');
    } else if (prop === 'en') {
      i18n.changeLanguage('en');
      AsyncStorage.setItem('Language', 'en');
    }
    navigation.navigate('NavigationScreen', {screen: 'UserScreen'});
  };

  return (
    <View style={styles.modalBackground}>
      <View
        style={[
          styles.modal,
          {
            backgroundColor: isDarkMode
              ? Colors.Dark.componentBG
              : Colors.Light.componentBG,
          },
        ]}>
        <TouchableOpacity
          style={[
            i18n.language === 'sr'
              ? styles.activeLanguageOption
              : styles.languageOption,
          ]}
          activeOpacity={1}
          onPress={() => changeLanguage('sr')}>
          <View style={styles.iconContainer}>
            <Image
              source={require('../../assets/images/serbia.png')}
              style={styles.langImg}
            />
            <Text
              style={[
                styles.languageOptionText,
                {
                  color:
                    i18n.language === 'sr'
                      ? Colors.Light.hyperlinkText
                      : isDarkMode
                      ? Colors.Dark.textPrimary
                      : Colors.Light.textPrimary,
                },
              ]}>
              {t('serbian')}
            </Text>
          </View>
          {i18n.language === 'sr' && (
            <Ionicons size={20} name={'checkmark'} color={'green'} />
          )}
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            i18n.language === 'hu'
              ? styles.activeLanguageOption
              : styles.languageOption,
          ]}
          activeOpacity={1}
          onPress={() => changeLanguage('hu')}>
          <View style={styles.iconContainer}>
            <Image
              source={require('../../assets/images/hungary.webp')}
              style={styles.langImg}
            />
            <Text
              style={[
                styles.languageOptionText,
                {
                  color:
                    i18n.language === 'hu'
                      ? Colors.Light.hyperlinkText
                      : isDarkMode
                      ? Colors.Dark.textPrimary
                      : Colors.Light.textPrimary,
                },
              ]}>
              {t('hungarian')}
            </Text>
          </View>
          {i18n.language === 'hu' && (
            <Ionicons size={20} name={'checkmark'} color={'green'} />
          )}
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            i18n.language === 'en'
              ? styles.activeLanguageOption
              : styles.languageOption,
          ]}
          activeOpacity={1}
          onPress={() => changeLanguage('en')}>
          <View style={styles.iconContainer}>
            <Image
              source={require('../../assets/images/england.png')}
              style={styles.langImg}
            />
            <Text
              style={[
                styles.languageOptionText,
                {
                  color:
                    i18n.language === 'en'
                      ? Colors.Light.hyperlinkText
                      : isDarkMode
                      ? Colors.Dark.textPrimary
                      : Colors.Light.textPrimary,
                },
              ]}>
              {t('english')}
            </Text>
          </View>
          {i18n.language === 'en' && (
            <Ionicons size={20} name={'checkmark'} color={'green'} />
          )}
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.cancleButton}
          onPress={() => {
            navigation.navigate('NavigationScreen', {screen: 'UserScreen'});
          }}
          activeOpacity={0.7}>
          <Text style={styles.cancleTxt}>Cancle</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  modal: {
    alignSelf: 'center',
    width: Dimensions.get('screen').width / 1.7,
    height: 240,
    backgroundColor: Colors.Light.componentBG,
    borderRadius: 10,
    overflow: 'hidden',
    paddingTop: 10,
    paddingHorizontal: 10,
  },
  modalBackground: {
    position: 'absolute',
    top: -120,
    width: Dimensions.get('screen').width,
    height: Dimensions.get('screen').height,
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 10,
  },
  languageOption: {
    height: 160 / 3,
    paddingStart: 10,
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
    paddingEnd: 10,
  },
  activeLanguageOption: {
    height: 160 / 3,
    paddingStart: 10,
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.Light.appBackground,
    borderRadius: 10,
    paddingEnd: 10,
  },
  langImg: {
    height: 40,
    width: 40,
    borderRadius: 40,
  },
  languageOptionText: {
    marginLeft: 10,
    fontSize: 14,
    color: Colors.Light.textPrimary,
    fontFamily: 'Mulish',
    textTransform: 'capitalize',
  },
  iconContainer: {flexDirection: 'row', alignItems: 'center'},
  cancleButton: {
    alignItems: 'center',
    borderWidth: 2,
    width: 100,
    alignSelf: 'center',
    borderColor: Colors.Light.warningRed,
    borderRadius: 10,
    padding: 10,
    marginTop: 10,
  },
  cancleTxt: {
    color: Colors.Light.warningRed,
    fontFamily: 'Mulish',
  },
});
