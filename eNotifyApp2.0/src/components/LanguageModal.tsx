import {View, Text, StyleSheet, Image} from 'react-native';
import React, {useTransition} from 'react';
import {TouchableOpacity} from 'react-native-gesture-handler';
import Colors from '../constants/Color';

import {Dimensions} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useGlobalContext} from '../context/GlobalProvider';
import translations from '../constants/i18n/translations/translation';
import {
  TranslatedText,
  translateTextOutOfComponent,
} from '../hooks/getTranslation.tsx';
import {useTranslation} from 'react-i18next';

export default function LanguageModal({navigation}: any) {
  const {i18n} = useTranslation();

  const {isDarkMode, storage} = useGlobalContext();

  const changeLanguage = async (prop: string) => {
    i18n.changeLanguage(prop);
    storage.set('Language', prop);
    navigation.navigate('Profile');
  };

  return (
    <View style={styles.modalBackground}>
      <View
        style={[
          styles.modal,
          {
            backgroundColor: isDarkMode.componentBG,
          },
        ]}>
        <TouchableOpacity
          style={[
            i18n.language === 'sr'
              ? styles.activeLanguageOption
              : styles.languageOption,
            {
              backgroundColor:
                i18n.language === 'sr'
                  ? isDarkMode.appBackground
                  : 'transparent',
            },
          ]}
          activeOpacity={1}
          onPress={() => changeLanguage('sr')}>
          <View style={styles.iconContainer}>
            <Image
              source={require('../assets/images/serbia.png')}
              style={styles.langImg}
            />
            <Text
              style={[
                styles.languageOptionText,
                {
                  color:
                    i18n.language === 'sr'
                      ? Colors.Light.hyperlinkText
                      : isDarkMode.textPrimary,
                },
              ]}>
              {translateTextOutOfComponent(translations.serbian)}
            </Text>
          </View>
          {i18n.language === 'sr' && (
            <Ionicons size={20} name={'checkmark'} color={Colors.Light.green} />
          )}
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            i18n.language === 'hu'
              ? styles.activeLanguageOption
              : styles.languageOption,
            {
              backgroundColor:
                i18n.language === 'hu'
                  ? isDarkMode.appBackground
                  : 'transparent',
            },
          ]}
          activeOpacity={1}
          onPress={() => changeLanguage('hu')}>
          <View style={styles.iconContainer}>
            <Image
              source={require('../assets/images/hungary.webp')}
              style={styles.langImg}
            />
            <Text
              style={[
                styles.languageOptionText,
                {
                  color:
                    i18n.language === 'hu'
                      ? Colors.Light.hyperlinkText
                      : isDarkMode.textPrimary,
                },
              ]}>
              {translateTextOutOfComponent(translations.hungarian)}
            </Text>
          </View>
          {i18n.language === 'hu' && (
            <Ionicons size={20} name={'checkmark'} color={Colors.Light.green} />
          )}
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            i18n.language === 'en'
              ? styles.activeLanguageOption
              : styles.languageOption,
            {
              backgroundColor:
                i18n.language === 'en'
                  ? isDarkMode.appBackground
                  : 'transparent',
            },
          ]}
          activeOpacity={1}
          onPress={() => changeLanguage('en')}>
          <View style={styles.iconContainer}>
            <Image
              source={require('../assets/images/england.png')}
              style={styles.langImg}
            />
            <Text
              style={[
                styles.languageOptionText,
                {
                  color:
                    i18n.language === 'en'
                      ? Colors.Light.hyperlinkText
                      : isDarkMode.textPrimary,
                },
              ]}>
              {translateTextOutOfComponent(translations.english)}
            </Text>
          </View>
          {i18n.language === 'en' && (
            <Ionicons size={20} name={'checkmark'} color={Colors.Light.green} />
          )}
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.cancelButton}
          onPress={() => {
            navigation.navigate('Profile');
          }}
          activeOpacity={0.7}>
          <TranslatedText
            style={styles.cancelTxt}
            value={translations.decline}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const screenHeight = Dimensions.get('screen').height;
const screenWidth = Dimensions.get('screen').width;

const styles = StyleSheet.create({
  modal: {
    alignSelf: 'center',
    width: screenWidth / 1.7,
    height: 240,
    backgroundColor: Colors.Light.componentBG,
    borderRadius: 10,
    overflow: 'hidden',
    paddingTop: 10,
    paddingHorizontal: 10,
  },
  modalBackground: {
    width: screenWidth,
    height: screenHeight,
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
  cancelButton: {
    alignItems: 'center',
    borderWidth: 2,
    width: 100,
    alignSelf: 'center',
    borderColor: Colors.Light.warningRed,
    borderRadius: 10,
    padding: 10,
    marginTop: 10,
  },
  cancelTxt: {
    color: Colors.Light.warningRed,
    fontFamily: 'Mulish',
  },
});
