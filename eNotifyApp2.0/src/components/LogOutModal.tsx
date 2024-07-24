import {
  Dimensions,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React, {useState} from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {useGlobalContext} from '../context/GlobalProvider';
import {useTranslation} from 'react-i18next';
import {User} from '../constants/Types/indexTypes';
import Colors from '../constants/Color';
import logOut from '../hooks/logOut';
import Animated, {FadeIn, FadeOut} from 'react-native-reanimated';

export default function LogOutModal({navigation}: any) {
  const {isDarkMode, setUser, setIsLoggedIn, user, storage} =
    useGlobalContext();
  const [visible, setVisible] = useState(true);
  const {t} = useTranslation();

  const onConfirm = () => {
    setVisible(false);
    logOut({navigation: navigation, User: user as User});
    setUser(undefined);
    setIsLoggedIn(false);
    storage.delete('UserID');
  };

  const onCancel = () => {
    setVisible(false);
    navigation.navigate('Tabs', {screens: 'Profile'});
  };
  return (
    <Modal
      animationType="none"
      presentationStyle="overFullScreen"
      transparent={true}>
      {visible && (
        <Animated.View
          style={styles.modalBackground}
          entering={FadeIn.duration(300)}
          exiting={FadeOut.duration(300)}>
          <View
            style={[
              styles.logOutModal,
              ,
              {
                backgroundColor: isDarkMode.componentBG,
              },
            ]}>
            <Ionicons
              name={'warning-outline'}
              size={32}
              color={isDarkMode.textPrimary}
              style={{}}
            />
            <Text
              style={[
                styles.logOutTitle,
                {
                  color: isDarkMode.textPrimary,
                },
              ]}>
              {t('logout title')}
            </Text>
            <Text
              style={[
                styles.logOutText,
                {
                  color: isDarkMode.textPrimary,
                },
              ]}>
              {t('logout message')}
            </Text>
            <View style={styles.buttonContainer}>
              <Pressable
                style={[
                  styles.logOutAnswer,
                  {
                    borderColor: isDarkMode.warningRed,
                  },
                ]}
                onPress={onCancel}>
                <Text
                  style={{
                    color: isDarkMode.warningRed,
                  }}>
                  {t('decline')}
                </Text>
              </Pressable>
              <Pressable
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
                onPress={() => onConfirm()}>
                <Text
                  style={{
                    color: isDarkMode.white,
                  }}>
                  {t('confirm')}
                </Text>
              </Pressable>
            </View>
          </View>
        </Animated.View>
      )}
    </Modal>
  );
}

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

const styles = StyleSheet.create({
  modalBackground: {
    width: screenWidth,
    height: screenHeight,
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 10,
  },
  logOutModal: {
    padding: 20,
    paddingBottom: 40,
    alignSelf: 'center',
    width: screenWidth / 1.4,
    backgroundColor: Colors.Light.componentBG,
    borderRadius: 10,
    overflow: 'hidden',
    alignContent: 'center',
    justifyContent: 'flex-end',
    gap: 10,
  },
  logOutAnswer: {
    height: 50,
    borderRadius: 10,
    alignSelf: 'center',
    width: `45%`,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
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
