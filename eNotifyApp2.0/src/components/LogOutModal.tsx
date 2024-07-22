import {Dimensions, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {useGlobalContext} from '../context/GlobalProvider';
import {useTranslation} from 'react-i18next';
import {LogOutModalProps} from '../constants/Types/indexTypes';
import Colors from '../constants/Color';

export default function LogOutModal({onConfirm, onCancle}: LogOutModalProps) {
  const {isDarkMode} = useGlobalContext();
  const {t, i18n} = useTranslation();
  return (
    <TouchableOpacity onPress={onCancle} activeOpacity={1}>
      <View
        style={[
          styles.logOutModal,
          ,
          {
            backgroundColor: isDarkMode.componentBG,
          },
        ]}>
        <Ionicons
          name={'log-out-outline'}
          size={140}
          color={isDarkMode.textPrimary}
          style={{alignSelf: 'center'}}
        />
        <Text
          style={[
            styles.logOutText,
            {
              color: isDarkMode.textPrimary,
            },
          ]}>
          {t('logout message')}
        </Text>

        <TouchableOpacity
          style={[
            styles.logOutAnswer,
            {
              borderColor: isDarkMode.warningRed,
            },
          ]}
          activeOpacity={1}
          onPress={onCancle}>
          <Text
            style={{
              color: isDarkMode.warningRed,
            }}>
            {t('decline logout')}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.logOutAnswer,
            {
              backgroundColor: isDarkMode.warningRed,
            },
            ,
            {
              borderColor: isDarkMode.warningRed,
            },
          ]}
          activeOpacity={1}
          onPress={onConfirm}>
          <Text
            style={{
              color: isDarkMode.white,
            }}>
            {t('confirm logout')}
          </Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  modalBackground: {
    position: 'absolute',
    top: -120,
    width: Dimensions.get('screen').width,
    height: Dimensions.get('screen').height,
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 100,
  },
  modal: {
    alignSelf: 'center',
    width: 300,
    height: 150,
    backgroundColor: Colors.Light.componentBG,
    borderRadius: 20,
    overflow: 'hidden',
  },

  logOutModal: {
    padding: 20,
    paddingBottom: 40,
    alignSelf: 'center',
    width: 320,
    height: 350,
    backgroundColor: Colors.Light.componentBG,
    borderRadius: 20,
    overflow: 'hidden',
    alignContent: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  logOutAnswer: {
    height: 40,
    borderRadius: 10,
    alignSelf: 'center',
    width: '80%',
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logOutText: {
    alignSelf: 'center',
    fontSize: 30,
    fontFamily: 'Mulish-Bold',
    marginBottom: 10,
  },
});
