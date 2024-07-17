import {
  View,
  Text,
  StyleSheet,
  useColorScheme,
  Animated,
  Dimensions,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import firestore from '@react-native-firebase/firestore';
import {TextInput, TouchableOpacity} from 'react-native-gesture-handler';
import {
  RegistrationProps,
  User,
  Navigation,
} from '../../constants/Types/indexTypes';
import AsyncStorage from '@react-native-async-storage/async-storage';
import messaging from '@react-native-firebase/messaging';
import {PermissionsAndroid} from 'react-native';
import Colors from '../../constants/Color';
import LinearGradient from 'react-native-linear-gradient';
import {StackNavigationProp} from '@react-navigation/stack';
import {Circle} from 'react-native-svg';
import Loading from './Loading';
import {useTranslation} from 'react-i18next';
import {Dropdown} from 'react-native-element-dropdown';
import Ionicons from 'react-native-vector-icons/Ionicons';

PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS);
PermissionsAndroid.request(
  PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
);
PermissionsAndroid.request(
  PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
);

const RegistrationScreen = ({
  navigation,
}: {
  navigation: StackNavigationProp<Navigation, 'Registration', undefined>;
}) => {
  const isDarkMode = useColorScheme() === 'dark';
  const {t, i18n} = useTranslation();

  const [isCorrect, setIsCorrect] = useState(true);
  const [value, setValue] = useState('');
  const subscriptions = ['Prvi', 'Drugi', 'Treci', 'Cetvrti'];
  const [lang, setLang] = useState('');

  const saveUser = async (user: User) => {
    AsyncStorage.setItem('Role', user.Role);
    AsyncStorage.setItem('Class', user.Class);
    AsyncStorage.setItem('Name', user.Name);
    AsyncStorage.setItem('UserId', user.UserID);
    AsyncStorage.setItem('Email', user.Email);

    messaging().subscribeToTopic('Svi');

    if (user.Role !== 'Professor') {
      messaging().subscribeToTopic(
        subscriptions[parseInt(user.Class.slice(0, 1)[0]) - 1],
      );

      messaging().subscribeToTopic(user.Class);
      console.log(user.Class);
    }

    firestore()
      .collection('Users')
      .where('UserID', '==', user.UserID)
      .get()
      .then(querySnapshot => {
        querySnapshot.forEach(doc => {
          // Update the document
          firestore().collection('Users').doc(doc.id).update({
            LogOut: false,
          });
        });
      });
  };

  const Login = () => {
    const query = firestore().collection('Users').where('UserID', '==', value);

    query
      .get()
      .then(querySnapshot => {
        if (!querySnapshot.empty) {
          const saveAll = async () => {
            setIsCorrect(true);
            const user: User = querySnapshot.docs[0].data() as User;
            await saveUser(user);
            navigation.navigate('NavigationScreen');
          };
          saveAll();
        } else {
          setIsCorrect(false);
        }
      })
      .catch(error => {
        console.error('Error getting document:', error);
      });
  };

  const data = [
    {label: t('serbian'), value: 'sr'},
    {label: t('hungarian'), value: 'hu'},
    {label: t('english'), value: 'en'},
  ];

  const changeLanguage = async (prop: string) => {
    console.log(prop);
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
  };

  return (
    <>
      <View style={styles.container}>
        <Dropdown
          style={[
            {
              margin: 16,
              height: 50,
              borderBottomColor: 'gray',
              borderBottomWidth: 0.5,
              width: 200,
              alignSelf: 'center',
              padding: 20,
              borderRadius: 10,
            },
            {
              backgroundColor: isDarkMode
                ? Colors.Dark.appBackground
                : Colors.Light.appBackground,
            },
          ]}
          itemTextStyle={[
            {textTransform: 'capitalize'},
            {color: Colors.Light.lightText},
          ]}
          placeholder={t('choose language')}
          placeholderStyle={{textTransform: 'capitalize'}}
          onChange={item => {
            changeLanguage(item.value);
            setLang(item.value);
          }}
          itemContainerStyle={{
            backgroundColor: isDarkMode
              ? Colors.Dark.textInputBackground
              : Colors.Light.textInputBackground,
          }}
          labelField={'label'}
          valueField={'value'}
          value={lang}
          data={data}
          selectedTextStyle={{textTransform: 'capitalize', marginLeft: 10}}
          renderLeftIcon={() => (
            <Ionicons
              name="language"
              size={25}
              color={
                isDarkMode ? Colors.Dark.lightText : Colors.Light.lightText
              }
            />
          )}
        />

        <View>
          <Text style={styles.incorrectText}>
            {isCorrect ? '' : t('incorrect code')}
          </Text>
          <TextInput
            placeholder={t('identification code')}
            placeholderTextColor={
              isDarkMode ? Colors.Dark.lightText : Colors.Light.lightText
            }
            autoCapitalize="none"
            onChangeText={text => {
              setValue(text);
              setIsCorrect(true);
            }}
            value={value}
            style={[
              styles.input,
              {
                backgroundColor: isDarkMode
                  ? Colors.Dark.textInputBackground
                  : Colors.Light.textInputBackground,
              },
              {
                color: isDarkMode
                  ? Colors.Dark.textPrimary
                  : Colors.Light.textPrimary,
              },
              {
                borderColor: isCorrect
                  ? isDarkMode
                    ? Colors.Dark.lightText
                    : Colors.Light.lightText
                  : Colors.Light.warningRed,
              },
            ]}
          />
        </View>

        <TouchableOpacity onPress={() => Login()} activeOpacity={0.8}>
          <LinearGradient
            start={{x: 1.3, y: 0}}
            end={{x: 0, y: 0}}
            colors={
              isDarkMode
                ? [Colors.Dark.accent, Colors.Dark.accent]
                : ['#C6E2F5', '#2077F9']
            }
            style={[
              styles.confirmBtn,
              {
                backgroundColor: isDarkMode
                  ? Colors.Dark.accent
                  : Colors.Light.accent,
              },
            ]}>
            <Text
              style={[
                styles.confirmTxt,
                {
                  color: isDarkMode
                    ? Colors.Dark.lightText
                    : Colors.Light.whiteText,
                },
              ]}>
              {t('register')}
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>

      <View
        style={[
          isDarkMode
            ? {backgroundColor: Colors.Dark.appBackground}
            : {backgroundColor: Colors.Light.appBackground},
          {width: '100%', height: '100%', zIndex: 0},
        ]}></View>
    </>
  );
};

const LoadingScreen = (
  navigation: StackNavigationProp<Navigation, 'Registration', undefined>,
) => {
  const [naziv, setNaziv] = useState('wait');
  const checkStat = async () => {
    const userId = await AsyncStorage.getItem('UserId');
    await firestore()
      .collection('Users')
      .where('UserID', '==', userId)
      .get()
      .then(snapshot => {
        if (!snapshot.empty) {
          const user: User = snapshot.docs[0].data() as User;
          if (user.LogOut === true) {
            const deleteUser = async () => {
              await AsyncStorage.removeItem('Role');
              await AsyncStorage.removeItem('Class');
              await AsyncStorage.removeItem('Name');
              await AsyncStorage.removeItem('UserId');
            };
            deleteUser();
          }
        }
      });
  };

  const uzmiNaziv = async () => {
    const value = await AsyncStorage.getItem('Name');
    if (value !== null) setNaziv('yes');
    else setNaziv('no');
  };
  const getRazred = async () => {
    const razred = await AsyncStorage.getItem('Class');

    if (razred !== null) {
      navigation.navigate('NavigationScreen');
      return false;
    } else {
      return true;
    }
  };
  const check = async () => {
    await checkStat();
    await uzmiNaziv();
  };
  check();
  if (naziv === 'yes') getRazred();
  else if (naziv === 'no') return true;
  else return false;
};

const Registration = ({navigation}: RegistrationProps) => {
  const animationValue = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(animationValue, {
          toValue: 1200,
          duration: 6000,
          useNativeDriver: true,
        }),
        Animated.timing(animationValue, {
          toValue: 0,
          duration: 6000,
          useNativeDriver: true,
        }),
      ]),
    ).start();
  });
  if (LoadingScreen(navigation) === true) {
    return <RegistrationScreen navigation={navigation} />;
  } else {
    return <Loading />;
  }
};

const styles = StyleSheet.create({
  container: {
    top: -100,
    position: 'absolute',
    width: '100%',
    height: '100%',
    zIndex: 100,
    flex: 1,
    gap: 20,
    alignContent: 'center',
    justifyContent: 'center',
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

    color: Colors.Light.whiteText,
    fontFamily: 'Mulish',
  },
});

export default Registration;
