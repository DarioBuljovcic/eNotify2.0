import {
  Dimensions,
  Keyboard,
  KeyboardAvoidingView,
  PermissionsAndroid,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  useColorScheme,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useGlobalContext} from '../../context/GlobalProvider';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useTranslation} from 'react-i18next';
import Colors from '../../constants/Color';

import loginUser from '../../hooks/loginUser';
import CustomAlertModal from '../../components/CustomAlertModal';
import {CommonActions} from '@react-navigation/native';
import DropdownLang from '../../components/DropdownLang';

PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS);
PermissionsAndroid.request(
  PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
);
PermissionsAndroid.request(
  PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
);

const SignIn = ({navigation}: {navigation: any}) => {
  const {t} = useTranslation();
  const [UserID, setUserID] = useState('');
  const {setUser, setIsLoggedIn, storage, isDarkMode, user} =
    useGlobalContext();

  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleShowAlert = () => {
    setModalVisible(true);
  };

  const handleCloseAlert = () => {
    setModalVisible(false);
  };

  const submit = async () => {
    if (!UserID) {
      setModalMessage('Molim vas popunite polje za šifru!');
      handleShowAlert();
      return;
    }
    setIsSubmitting(true);

    const user = await loginUser(UserID);
    if (user !== null) {
      storage.set('UserID', UserID);
      setUser(user);
      setIsLoggedIn(true);

      navigation.navigate('Tabs');
      navigation.dispatch(
        CommonActions.reset({
          index: 1,
          routes: [{name: 'Tabs'}],
        }),
      );
    } else {
      setModalMessage('Vaš email ili šifra nisu dobri!');
      handleShowAlert();
    }
    setIsSubmitting(false);
  };
  useEffect(() => {
    if (user !== undefined) {
      navigation.navigate('Tabs');
      navigation.dispatch(
        CommonActions.reset({
          index: 1,
          routes: [{name: 'Tabs'}],
        }),
      );
    }
  }, [user]);

  return (
    <SafeAreaView
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'white',
      }}>
      <CustomAlertModal
        visible={modalVisible}
        message={modalMessage}
        onClose={handleCloseAlert}
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={[
          styles.container,
          {justifyContent: 'center'},
          {backgroundColor: isDarkMode.appBackground},
        ]}>
        <View>
          <DropdownLang />
          <TextInput
            placeholder={t('identification code')}
            placeholderTextColor={isDarkMode.lightText}
            autoCapitalize="none"
            onChangeText={text => {
              setUserID(text);
            }}
            value={UserID}
            style={[
              styles.input,
              {
                backgroundColor: isDarkMode.textInputBackground,
              },
              {
                color: isDarkMode.textPrimary,
              },
            ]}
          />
        </View>

        <TouchableOpacity
          onPress={submit}
          activeOpacity={0.8}
          style={styles.confirmBtn}
          disabled={isSubmitting}>
          <Text
            style={[
              styles.confirmTxt,
              {
                color: isDarkMode.whiteText,
              },
            ]}>
            {t('register')}
          </Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default SignIn;

const styles = StyleSheet.create({
  container: {
    width: Dimensions.get('screen').width,
    flex: 1,
    gap: 20,
    alignContent: 'center',
    justifyContent: 'flex-end',
  },
  incorrectText: {
    color: Colors.Light.warningRed,

    width: '80%',

    alignSelf: 'center',
    textAlign: 'left',
    fontFamily: 'Mulish',
  },
  input: {
    fontSize: 17,
    fontFamily: 'Mulish',

    backgroundColor: Colors.Light.textInputBackground,
    color: Colors.Light.textPrimary,

    padding: 15,
    width: '80%',

    alignSelf: 'center',

    borderRadius: 10,

    borderWidth: 1,
    borderColor: Colors.Light.lightText,

    elevation: 13,
    shadowColor: Colors.Light.black,
    shadowOffset: {width: 2, height: 5},
    shadowRadius: 1,
  },
  confirmBtn: {
    backgroundColor: Colors.Light.accent,

    padding: 20,

    width: '50%',

    alignSelf: 'center',
    alignItems: 'center',

    borderRadius: 50,
  },
  confirmTxt: {
    fontSize: 17,
    alignSelf: 'center',
    fontFamily: 'Mulish',
  },
});
