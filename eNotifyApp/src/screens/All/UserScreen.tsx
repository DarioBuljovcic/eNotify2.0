import Colors from '../../constants/Color';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Appearance,
  Animated,
  useColorScheme,
  Dimensions,
  PermissionsAndroid,
  ScrollView,
  DevSettings,
  Switch,
} from 'react-native';
import React, {useEffect, useRef, useState, useTransition} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Image, Text} from 'react-native-elements';
import {UserScreenTabProps} from '../../constants/Types/indexTypes';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useTranslation} from 'react-i18next';
import storage from '@react-native-firebase/storage';
import firestore from '@react-native-firebase/firestore';
import DocumentPicker, {
  DocumentPickerResponse,
} from 'react-native-document-picker';
import messaging from '@react-native-firebase/messaging';
import {useFocusEffect} from '@react-navigation/native';
// import RNRestart from 'react-native-restart';

const UserScreen = ({navigation}: UserScreenTabProps) => {
  const {t, i18n} = useTranslation();
  const isDarkMode = useColorScheme() === 'dark';
  const [role, setRole] = useState('');
  const [name, setName] = useState('');
  const [grade, setGrade] = useState('');
  const [language, setLanguage] = useState('');
  const [languageModal, setLanguageModal] = useState(false);
  const [logoutModal, setLogoutModal] = useState(false);
  const rotationValue = useRef(new Animated.Value(isDarkMode ? 0 : 1)).current;
  const [imageSource, setImageSource] = useState('');
  const rotate = rotationValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });
  const [selectedFile, setSelectedFile] =
    useState<DocumentPickerResponse | null>(null);

  useFocusEffect(() => {
    const saveUser = async () => {
      setRole((await AsyncStorage.getItem('Role')) as string);
      setName((await AsyncStorage.getItem('Name')) as string);
      setGrade((await AsyncStorage.getItem('Class')) as string);
      setLanguage((await AsyncStorage.getItem('Language')) as string);
    };
    saveUser();
    console.log('effect');
    updateImage();
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
      duration: 500,
      useNativeDriver: true,
    });

    rotateAnimation.start();
  };

  const updateImage = async () => {
    const userID = await AsyncStorage.getItem('UserId');

    if (userID) {
      const querySnapshot = await firestore()
        .collection('Users')
        .where('UserID', '==', userID)
        .get();

      if (!querySnapshot.empty) {
        const imageUrl = await storage()
          .ref(querySnapshot.docs[0].data().profile_picture)
          .getDownloadURL();

        if (imageUrl) setImageSource(imageUrl);
      }
    }
  };

  const renderLanguage = () => {
    if (i18n.language === 'sr') {
      return (
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
      );
    } else if (i18n.language === 'en') {
      return (
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
      );
    } else if (i18n.language === 'hu') {
      return (
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
      );
    }
  };

  const uploadProfilePicture = async () => {
    try {
      await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        {
          title: 'External Storage Permission',
          message:
            'This app needs access to your external storage to read files.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      await DocumentPicker.pick({
        type: [DocumentPicker.types.allFiles],
        copyTo: 'documentDirectory',
      }).then(async file => {
        setSelectedFile(file[0]);
        const Picture = async () => {
          //uploading the image to storage
          if (selectedFile) {
            const reference = storage().ref(file[0].name);

            const pathToFile = `file://${decodeURIComponent(
              file[0].fileCopyUri,
            )}`;

            await reference.putFile(pathToFile);
          }

          if (file[0])
            await AsyncStorage.setItem('Profile_Picture', file[0]?.name);

          const userID = await AsyncStorage.getItem('UserId');
          //console.log(userID);
          if (userID) {
            const userSnapshot = await firestore()
              .collection('Users')
              .where('UserID', '==', userID)
              .get();

            console.log(userID);
            if (!userSnapshot.empty) {
              const userDoc = userSnapshot.docs[0];
              console.log(file[0]?.name);
              await firestore().collection('Users').doc(userDoc.id).update({
                profile_picture: file[0]?.name,
              });
              console.log('a');
              updateImage();
            }
          }
        };
        Picture();
      });
    } catch (error) {
      if (DocumentPicker.isCancel(error)) {
        console.log('User cancelled file selection');
      } else {
        console.log('Error selecting file:', error);
      }
    }
  };
  // const toggleSwitch = () => setIsEnabled(previousState => !previousState);

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
        <ScrollView
          contentContainerStyle={{alignItems: 'center'}}
          showsVerticalScrollIndicator={false}>
          <View
            style={[
              styles.accountInfoContainer,
              {
                backgroundColor: isDarkMode
                  ? Colors.Dark.componentBG
                  : Colors.Light.componentBG,
              },
            ]}>
            <View>
              <TouchableOpacity
                style={[
                  styles.add,
                  {
                    backgroundColor: isDarkMode
                      ? Colors.Dark.accentGreen
                      : Colors.Light.accentGreen,
                  },
                ]}
                activeOpacity={0.9}
                onPress={uploadProfilePicture}>
                <Ionicons
                  name={'add-outline'}
                  size={20}
                  color={Colors.Light.white}
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={uploadProfilePicture}
                activeOpacity={1}>
                <Image
                  source={
                    imageSource
                      ? {uri: imageSource}
                      : isDarkMode
                      ? require('../../assets/images/user-dark.png')
                      : require('../../assets/images/user-light.png')
                  }
                  style={styles.userImage}
                />
              </TouchableOpacity>
            </View>
            <View style={styles.userInfoContainer}>
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

              {role == 'Professor' ? (
                <></>
              ) : (
                <Text
                  style={[
                    styles.gradeText,
                    {
                      color: isDarkMode
                        ? Colors.Dark.lightText
                        : Colors.Light.lightText,
                    },
                  ]}>
                  {grade}
                </Text>
              )}
            </View>
          </View>

          <View
            style={[
              styles.optionsContainer,
              {
                backgroundColor: isDarkMode
                  ? Colors.Dark.componentBG
                  : Colors.Light.componentBG,
              },
            ]}>
            <TouchableOpacity
              style={[
                styles.option,
                {
                  borderColor: isDarkMode
                    ? Colors.Dark.lightText
                    : Colors.Light.textPrimary,
                },
              ]}
              activeOpacity={0.7}
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
                {t('about')}
              </Text>
              <Ionicons
                name={'arrow-forward-outline'}
                size={26}
                color={isDarkMode ? Colors.Dark.accent : Colors.Light.accent}
              />
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.option,
                {
                  borderColor: isDarkMode
                    ? Colors.Dark.lightText
                    : Colors.Light.textPrimary,
                },
              ]}
              activeOpacity={0.7}
              onPress={() => navigation.navigate('LanguageModal')}>
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
                name={'arrow-forward-outline'}
                size={26}
                color={isDarkMode ? Colors.Dark.accent : Colors.Light.accent}
              />
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.optionLast,
                {
                  borderColor: isDarkMode
                    ? Colors.Dark.lightText
                    : Colors.Light.textPrimary,
                },
              ]}
              activeOpacity={0.7}
              onPress={() => changeMode()}>
              <Text
                style={[
                  styles.optionText,
                  {
                    color: isDarkMode
                      ? Colors.Dark.textSecondary
                      : Colors.Light.textSecondary,
                  },
                ]}>
                {t('dark mode')}
              </Text>
              <Switch
                trackColor={{false: '#767577', true: '#81b0ff'}}
                thumbColor={isDarkMode ? '#f4f3f4' : '#f4f3f4'}
                ios_backgroundColor="#3e3e3e"
                onValueChange={() => changeMode()}
                value={isDarkMode}
                disabled={true}
              />
            </TouchableOpacity>

            <View
              style={{
                flex: 1,
                justifyContent: 'flex-end',
                alignItems: 'flex-end',
                padding: 10,
              }}>
              <Text
                style={[
                  styles.versonText,
                  {
                    color: isDarkMode
                      ? Colors.Dark.textPrimary
                      : Colors.Light.textPrimary,
                  },
                ]}>
                v0.19 build 78
              </Text>
            </View>

            <TouchableOpacity
              style={[
                styles.optionLast,

                {
                  borderTopWidth: 0.2,
                  borderColor: isDarkMode
                    ? Colors.Dark.lightText
                    : Colors.Light.textPrimary,
                },
                {},
              ]}
              activeOpacity={0.7}
              onPress={() => navigation.navigate('LogOutModal')}>
              <Text
                style={[
                  styles.optionText,
                  {
                    color: isDarkMode
                      ? Colors.Dark.textSecondary
                      : Colors.Light.textSecondary,
                  },
                ]}>
                {t('log out')}
              </Text>
              <Ionicons
                name={'log-out-outline'}
                size={26}
                color={
                  isDarkMode
                    ? Colors.Dark.textSecondary
                    : Colors.Light.textPrimary
                }
              />
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    zIndex: 10,
    alignItems: 'center',
  },
  containerSize: {
    width: '100%',
  },
  accountInfoContainer: {
    width: '85%',
    flexDirection: 'row',
    marginVertical: 20,
    padding: 10,

    borderRadius: 10,
    elevation: 4,
    shadowColor: Colors.Light.black,
  },
  userInfoContainer: {
    justifyContent: 'center',
    flex: 1,
    alignItems: 'center',
  },
  userImage: {
    height: 70,
    width: 70,
    borderRadius: 150,
  },
  nameText: {
    fontSize: 18,
    fontFamily: 'Mulish-Light',
  },
  gradeText: {
    fontSize: 16,
    fontFamily: 'Mulish-Light',
  },
  roleText: {
    fontSize: 12,
    fontFamily: 'Mulish-Light',
    textTransform: 'capitalize',
  },
  optionsContainer: {
    height: Dimensions.get('window').height - 260,
    width: '85%',
    padding: 10,
    backgroundColor: Colors.Light.componentBG,

    borderRadius: 10,
    elevation: 4,
    shadowColor: Colors.Light.black,
    marginBottom: 10,
  },
  option: {
    height: 65,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,

    borderBottomWidth: 0.2,
  },
  optionLast: {
    height: 65,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  optionText: {
    fontSize: 17,
    flex: 1,
    fontFamily: 'Mulish-Light',
    textTransform: 'capitalize',
  },
  optionTextLanguage: {
    fontSize: 12,
    fontFamily: 'Mulish-Light',
    textAlign: 'right',
    marginRight: 15,
  },
  modeChange: {
    width: 45,
    aspectRatio: 1 / 1,
    display: 'flex',
    justifyContent: 'center',
    borderRadius: 25,
    overflow: 'hidden',
  },
  modeRotate: {
    display: 'flex',
    gap: 20,
    flexDirection: 'row',

    transformOrigin: 'right',
  },
  add: {
    width: 20,
    height: 20,

    borderRadius: 50,

    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    right: 0,
    top: 0,
    zIndex: 10,
  },
  versonText: {fontFamily: 'Mulish-Light'},
});

export default UserScreen;
