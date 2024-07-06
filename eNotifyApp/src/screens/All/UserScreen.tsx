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
} from 'react-native';
import React, {useEffect, useRef, useState, useTransition} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Image, Text} from 'react-native-elements';
import {UserScreenTabProps} from '../../constants/Types/indexTypes';
import {LinearGradient} from 'react-native-linear-gradient';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useTranslation} from 'react-i18next';
import storage from '@react-native-firebase/storage';
import firestore from '@react-native-firebase/firestore';
import DocumentPicker, {
  DocumentPickerResponse,
} from 'react-native-document-picker';
import {updateDoc} from 'firebase/firestore';

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
  updateImage();

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

    setLanguageModal(false);
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

  const logOutModal = () => {
    setLogoutModal(true);
  };
  const logOutCancle = () => {
    setLogoutModal(false);
  };

  const logOut = () => {
    setLogoutModal(false);
    AsyncStorage.removeItem('UserID');
    AsyncStorage.removeItem('Name');
    AsyncStorage.removeItem('Role');
    AsyncStorage.removeItem('Class');
    AsyncStorage.removeItem('Email');
    AsyncStorage.removeItem('Language');

    navigation.navigate('Registration');
    //TODO: navigate to registratin
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
        <View style={styles.userInfo}>
          <LinearGradient
            start={{x: 0.1, y: 0}}
            end={{x: 1, y: -0.8}}
            colors={
              isDarkMode ? ['#355E89', '#031525'] : ['#2077F9', '#C6E2F5']
            }
            style={styles.imgBorder}>
            <TouchableOpacity
              style={[
                styles.add,
                {
                  backgroundColor: isDarkMode
                    ? Colors.Light.accentGreen
                    : Colors.Dark.accentGreen,
                },
              ]}
              activeOpacity={0.9}
              onPress={uploadProfilePicture}>
              <Ionicons
                name={'add-outline'}
                size={35}
                color={Colors.Light.white}
              />
            </TouchableOpacity>
            <Image source={{uri: imageSource}} style={styles.userImage} />
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
              {t('about')}
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
            onPress={() => setLanguageModal(true)}>
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
              color={
                isDarkMode
                  ? Colors.Dark.textSecondary
                  : Colors.Light.textSecondary
              }
            />
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
              <Animated.View
                style={[styles.modeRotate, {transform: [{rotate}]}]}>
                <Ionicons
                  name={'moon-outline'}
                  size={35}
                  color={Colors.Dark.textSecondary}
                />
                <Ionicons
                  name={'sunny-outline'}
                  size={35}
                  color={Colors.Light.textSecondary}
                />
              </Animated.View>
            </TouchableOpacity>
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
            onPress={() => logOutModal()}>
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
          </TouchableOpacity>
        </View>
      </View>
      {languageModal ? (
        <TouchableOpacity
          style={styles.modalBackground}
          onPress={() => setLanguageModal(false)}
          activeOpacity={1}>
          <View style={styles.modal}>
            <TouchableOpacity
              style={[
                styles.languageOption,
                {borderBottomWidth: 1},
                {
                  backgroundColor: isDarkMode
                    ? Colors.Dark.textInputBackground
                    : Colors.Light.textInputBackground,
                },
                {
                  borderColor: isDarkMode
                    ? Colors.Dark.lightText
                    : Colors.Light.lightText,
                },
              ]}
              activeOpacity={1}
              onPress={() => changeLanguage('sr')}>
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
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.languageOption,
                {borderBottomWidth: 1},
                {
                  backgroundColor: isDarkMode
                    ? Colors.Dark.textInputBackground
                    : Colors.Light.textInputBackground,
                },
                {
                  borderColor: isDarkMode
                    ? Colors.Dark.lightText
                    : Colors.Light.lightText,
                },
              ]}
              activeOpacity={1}
              onPress={() => changeLanguage('hu')}>
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
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.languageOption,
                {
                  backgroundColor: isDarkMode
                    ? Colors.Dark.textInputBackground
                    : Colors.Light.textInputBackground,
                },
              ]}
              activeOpacity={1}
              onPress={() => changeLanguage('en')}>
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
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      ) : null}
      {logoutModal ? (
        <TouchableOpacity
          style={styles.modalBackground}
          onPress={() => setLogoutModal(false)}
          activeOpacity={1}>
          <View
            style={[
              styles.logOutModal,
              ,
              {
                backgroundColor: isDarkMode
                  ? Colors.Dark.textInputBackground
                  : Colors.Light.textInputBackground,
              },
            ]}>
            <Ionicons
              name={'log-out-outline'}
              size={140}
              color={
                isDarkMode ? Colors.Dark.textPrimary : Colors.Light.textPrimary
              }
              style={{alignSelf: 'center'}}
            />
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
              onPress={() => logOutCancle()}>
              <Text
                style={{
                  color: isDarkMode
                    ? Colors.Dark.white
                    : Colors.Light.warningRed,
                }}>
                {t('decline logout')}
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
                {t('confirm logout')}
              </Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      ) : null}
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
    position: 'relative',
  },
  userImage: {
    height: 150,
    width: 150,
    borderRadius: 150,
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
    textTransform: 'capitalize',
  },
  option: {
    height: 65,
    width: '100%',

    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,

    marginVertical: 5,
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
  modalBackground: {
    position: 'absolute',
    top: -120,
    width: Dimensions.get('screen').width,
    height: Dimensions.get('screen').height,
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modal: {
    alignSelf: 'center',
    width: 300,
    height: 150,
    backgroundColor: Colors.Light.textInputBackground,
    borderRadius: 20,
    overflow: 'hidden',
  },
  languageOption: {
    height: 150 / 3,
    justifyContent: 'center',
  },
  languageOptionText: {
    marginLeft: 10,
    fontSize: 14,
    color: Colors.Light.textPrimary,
    fontFamily: 'Mulish',
    textTransform: 'capitalize',
  },
  logOutModal: {
    padding: 20,
    paddingBottom: 40,
    alignSelf: 'center',
    width: 320,
    height: 350,
    backgroundColor: Colors.Light.textInputBackground,
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
  add: {
    width: 40,
    height: 40,

    borderRadius: 50,

    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    right: 0,
    top: 0,
    zIndex: 10,
  },
});

export default UserScreen;