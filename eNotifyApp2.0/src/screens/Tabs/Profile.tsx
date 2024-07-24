import {
  StyleSheet,
  View,
  TouchableOpacity,
  Appearance,
  Dimensions,
  ScrollView,
  Switch,
  Image,
  Text,
} from 'react-native';
import React, {useState} from 'react';
import {useFocusEffect} from '@react-navigation/native';
import Colors from '../../constants/Color';
import {useGlobalContext} from '../../context/GlobalProvider';
import Ionicons from 'react-native-vector-icons/Ionicons';
import DocumentPicker, {
  DocumentPickerResponse,
} from 'react-native-document-picker';
import storage from '@react-native-firebase/storage';
import {MMKV} from 'react-native-mmkv';
import {useTranslation} from 'react-i18next';
import {User} from '../../constants/Types/indexTypes';
import updateUserImg from '../../hooks/updateUserImg';

const storagePhone = new MMKV();

const Profile = ({navigation}: {navigation: any}) => {
  const {isDarkMode, user, setMode, setUser} = useGlobalContext();
  const [selectedFile, setSelectedFile] =
    useState<DocumentPickerResponse | null>(null);
  const [imageSource, setImageSource] = useState('');
  const {t} = useTranslation();
  useFocusEffect(() => {
    updateImage();
  });
  const uploadProfilePicture = async () => {
    try {
      await DocumentPicker.pick({
        type: [DocumentPicker.types.images],
        copyTo: 'documentDirectory',
      }).then(async file => {
        setSelectedFile(file[0]);
        const Picture = async () => {
          //uploading the image to storage
          if (selectedFile) {
            const reference = storage().ref(file[0].name as string);

            const pathToFile = `file://${decodeURIComponent(
              file?.[0].fileCopyUri as string,
            )}`;

            await reference.putFile(pathToFile);
          }
          if (file[0]) {
            const name = file[0]?.name as string;
            await storagePhone.set('Profile_Picture', name);
            await updateUserImg(user?.UserID as string, name);

            setUser(
              (prev: User | undefined) =>
                ({
                  ...prev,
                  profile_picture: name,
                } as User),
            );
            updateImage();
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
  const updateImage = async () => {
    const imageUrl = await storage()
      .ref(user?.profile_picture)
      .getDownloadURL();

    if (imageUrl) setImageSource(imageUrl);
  };
  const changeMode = async () => {
    console.log('asparugus');
    Appearance.setColorScheme(
      Appearance.getColorScheme() === 'dark' ? 'light' : 'dark',
    );
    setMode(
      Appearance.getColorScheme() === 'dark' ? Colors.Light : Colors.Dark,
    );
    storagePhone.set(
      'Mode',
      Appearance.getColorScheme() === 'dark' ? 'light' : 'dark',
    );
  };
  const logOutModal = () => {
    navigation.navigate('LogOutModal');
  };

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: isDarkMode.appBackground,
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
                backgroundColor: isDarkMode.componentBG,
              },
            ]}>
            <View>
              <TouchableOpacity
                style={[
                  styles.add,
                  {
                    backgroundColor: isDarkMode.accentGreen,
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
                      : isDarkMode === Colors.Dark
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
                    color: isDarkMode.textPrimary,
                  },
                ]}>
                {user?.Name}
              </Text>

              {user?.Role == 'Professor' ? (
                <></>
              ) : (
                <Text
                  style={[
                    styles.gradeText,
                    {
                      color: isDarkMode.lightText,
                    },
                  ]}>
                  {user?.Class}
                </Text>
              )}
            </View>
          </View>

          <View
            style={[
              styles.optionsContainer,
              {
                backgroundColor: isDarkMode.componentBG,
              },
            ]}>
            <TouchableOpacity
              style={[
                styles.option,
                {
                  borderColor: isDarkMode.textPrimary,
                },
              ]}
              activeOpacity={0.7}
              onPress={() => navigation.navigate('About')}>
              <Text
                style={[
                  styles.optionText,
                  {
                    color: isDarkMode.textSecondary,
                  },
                ]}>
                {t('about')}
              </Text>
              <Ionicons
                name={'arrow-forward-outline'}
                size={26}
                color={isDarkMode.accent}
              />
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.option,
                {
                  borderColor: isDarkMode.textPrimary,
                },
              ]}
              activeOpacity={0.7}
              onPress={() => navigation.navigate('LanguageModal')}>
              <Text
                style={[
                  styles.optionText,
                  {
                    color: isDarkMode.textSecondary,
                  },
                ]}>
                {t('language')}
              </Text>
              <Ionicons
                name={'arrow-forward-outline'}
                size={26}
                color={isDarkMode.accent}
              />
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.optionLast,
                {
                  borderColor: isDarkMode.textPrimary,
                },
              ]}
              activeOpacity={0.7}
              onPress={() => changeMode()}>
              <Text
                style={[
                  styles.optionText,
                  {
                    color: isDarkMode.textSecondary,
                  },
                ]}>
                {t('dark mode')}
              </Text>
              <Switch
                trackColor={{false: '#767577', true: '#81b0ff'}}
                thumbColor={'#f4f3f4'}
                ios_backgroundColor="#3e3e3e"
                onValueChange={() => changeMode()}
                value={isDarkMode === Colors.Dark}
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
                    color: isDarkMode.textPrimary,
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
                  borderColor: isDarkMode.textPrimary,
                },
                {},
              ]}
              activeOpacity={0.7}
              onPress={() => logOutModal()}>
              <Text
                style={[
                  styles.optionText,
                  {
                    color: isDarkMode.textSecondary,
                  },
                ]}>
                {t('log out')}
              </Text>
              <Ionicons
                name={'log-out-outline'}
                size={26}
                color={isDarkMode.textPrimary}
              />
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </View>
  );
};

export default Profile;

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
    backgroundColor: '#ffffff',

    borderRadius: 10,
    elevation: 4,
    shadowColor: Colors.Light.black,
    marginBottom: 10,
  },
  option: {
    height: 65,
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 0.2,
    justifyContent: 'space-between',
  },
  optionLast: {
    height: 65,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
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
    zIndex: 10,
  },
  modal: {
    alignSelf: 'center',
    width: 300,
    height: 150,
    backgroundColor: '#ffffff',
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
