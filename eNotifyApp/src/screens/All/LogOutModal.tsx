import {View, Text, useColorScheme, StyleSheet, Dimensions} from 'react-native';
import React from 'react';
import {TouchableOpacity} from 'react-native-gesture-handler';
import Colors from '../../constants/Color';
import {t} from 'i18next';
import messaging from '@react-native-firebase/messaging';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {LogOutModalScreen} from '../../constants/Types/indexTypes';
import Ionicons from 'react-native-vector-icons/Ionicons';

export default function LogOutModal({navigation}: LogOutModalScreen) {
  const isDarkMode = useColorScheme() === 'dark';

  const logOut = async () => {
    messaging().unsubscribeFromTopic('Svi');
    messaging().unsubscribeFromTopic('Prvi');
    messaging().unsubscribeFromTopic('Drugi');
    messaging().unsubscribeFromTopic('Treci');
    messaging().unsubscribeFromTopic('Cetvrit');

    const classTopic = await AsyncStorage.getItem('Class');
    if (classTopic) messaging().unsubscribeFromTopic(classTopic);

    AsyncStorage.removeItem('UserId');
    AsyncStorage.removeItem('Name');
    AsyncStorage.removeItem('Role');
    AsyncStorage.removeItem('Class');
    AsyncStorage.removeItem('Email');
    AsyncStorage.removeItem('Language');
    AsyncStorage.clear();

    navigation.push('Registration');
    //RNRestart.restart();
    //TODO: navigate to registratin
  };

  return (
    <View style={styles.modalBackground}>
      <View
        style={[
          styles.logOutModal,
          ,
          {
            backgroundColor: isDarkMode
              ? Colors.Dark.componentBG
              : Colors.Light.componentBG,
          },
        ]}>
        <Ionicons
          name={'warning-outline'}
          size={32}
          color={
            isDarkMode ? Colors.Dark.textPrimary : Colors.Light.textPrimary
          }
          style={{}}
        />
        <Text
          style={[
            styles.logOutTitle,
            {
              color: isDarkMode
                ? Colors.Dark.textPrimary
                : Colors.Light.textPrimary,
            },
          ]}>
          {t('logout title')}
        </Text>
        <Text
          style={[
            styles.logOutText,
            {
              color: isDarkMode
                ? Colors.Dark.textPrimary
                : Colors.Light.textPrimary,
            },
          ]}>
          {t('logout message')}
        </Text>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[
              styles.logOutAnswer,
              {
                borderColor: isDarkMode
                  ? Colors.Dark.warningRed
                  : Colors.Light.warningRed,
              },
            ]}
            activeOpacity={1}
            onPress={() =>
              navigation.navigate('NavigationScreen', {screen: 'UserScreen'})
            }>
            <Text
              style={{
                color: isDarkMode ? Colors.Dark.white : Colors.Light.warningRed,
              }}>
              {t('decline')}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.logOutAnswer,
              {
                backgroundColor: isDarkMode
                  ? Colors.Dark.warningRed
                  : Colors.Light.warningRed,
              },
              ,
              {
                borderColor: isDarkMode
                  ? Colors.Dark.warningRed
                  : Colors.Light.warningRed,
              },
            ]}
            activeOpacity={1}
            onPress={() => logOut()}>
            <Text
              style={{
                color: isDarkMode ? Colors.Dark.white : Colors.Light.white,
              }}>
              {t('confirm')}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
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
    zIndex: 10,
  },
  logOutModal: {
    padding: 20,
    paddingBottom: 40,
    alignSelf: 'center',
    width: Dimensions.get('screen').width / 1.4,
    height: 200,
    backgroundColor: Colors.Light.componentBG,
    borderRadius: 20,
    overflow: 'hidden',
    alignContent: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  logOutAnswer: {
    height: 50,
    borderRadius: 10,
    alignSelf: 'center',
    width: 130,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logOutTitle: {
    fontSize: 20,
    fontFamily: 'Mulish-Bold',
  },
  logOutText: {
    fontSize: 12,
    fontFamily: 'Mulish-Bold',
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 15,
    justifyContent: 'center',
  },
});
