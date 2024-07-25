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
  Image,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useGlobalContext} from '../../context/GlobalProvider';
import {SafeAreaView} from 'react-native-safe-area-context';
import Colors from '../../constants/Color';
import loginUser from '../../hooks/loginUser';
import {CommonActions} from '@react-navigation/native';
import DropdownLang from '../../components/DropdownLang';
import translations from '../../constants/i18n/translations/translation';
import {
  TranslatedText,
  translateText,
  translateTextOutOfComponent,
} from '../../hooks/getTranslation.tsx';

PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS);
PermissionsAndroid.request(
  PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
);
PermissionsAndroid.request(
  PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
);

const SignIn = ({navigation}: {navigation: any}) => {
  const [UserID, setUserID] = useState('');
  const {setUser, setIsLoggedIn, storage, isDarkMode, user, isLoading} =
    useGlobalContext();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCorrect, setIsCorrect] = useState(true);

  const submit = async () => {
    if (!UserID) {
      return;
    }
    setIsSubmitting(true);

    const user = await loginUser(UserID);
    if (user !== null) {
      storage.set('UserID', UserID);
      setUser(user);
      setIsLoggedIn(true);
      setIsCorrect(true);
      navigation.navigate('Tabs');
      navigation.dispatch(
        CommonActions.reset({
          index: 1,
          routes: [{name: 'Tabs'}],
        }),
      );
    } else {
      setIsCorrect(false);
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

  if (!isLoading)
    return (
      <SafeAreaView
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={[
            styles.container,
            {justifyContent: 'center'},
            {backgroundColor: isDarkMode.appBackground},
          ]}>
          <View>
            <DropdownLang />
            <TranslatedText
              value={isCorrect ? '' : translations.incorrectCode}
              style={styles.incorrectText}
            />
            <TextInput
              placeholder={translateText(translations.identificationCode)}
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
                {
                  borderColor: isCorrect
                    ? isDarkMode.lightText
                    : isDarkMode.warningRed,
                },
              ]}
            />
          </View>

          <TouchableOpacity
            onPress={submit}
            activeOpacity={0.8}
            style={styles.confirmBtn}
            disabled={isSubmitting}>
            <TranslatedText
              value={translations.register}
              style={[
                styles.confirmTxt,
                {
                  color: isDarkMode.whiteText,
                },
              ]}
            />
          </TouchableOpacity>
        </KeyboardAvoidingView>
      </SafeAreaView>
    );
  else
    return (
      <View style={{flex: 1}}>
        <Image
          source={
            isDarkMode
              ? require('../../assets/images/LogoDark.png')
              : require('../../assets/images/LogoLight.png')
          }
          style={{
            width: 700,
            aspectRatio: 1 / 1,
            alignSelf: 'center',
            marginTop: '35%',
          }}
        />
      </View>
    );
};

export default SignIn;

const screenWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({
  container: {
    width: screenWidth,
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
