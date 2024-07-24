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
  SafeAreaView,
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
import {User} from '../../constants/Types/indexTypes';
import updateUserImg from '../../hooks/updateUserImg';
import DeviceInfo from 'react-native-device-info';
import translations from '../../constants/i18n/translations/translation';
import {TranslatedText} from '../../hooks/getTranslation.tsx';

const storagePhone = new MMKV();

const Profile = ({navigation}: {navigation: any}) => {
  const {isDarkMode, user, setMode, setUser} = useGlobalContext();
  const [selectedFile, setSelectedFile] =
    useState<DocumentPickerResponse | null>(null);
  const [imageSource, setImageSource] = useState('');
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
    <SafeAreaView
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
                    backgroundColor: isDarkMode.accent,
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
              <TranslatedText
                value={translations.about}
                style={[
                  styles.optionText,
                  {
                    color: isDarkMode.textSecondary,
                  },
                ]}
              />
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
              <TranslatedText
                value={translations.language}
                style={[
                  styles.optionText,
                  {
                    color: isDarkMode.textSecondary,
                  },
                ]}
              />
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
              <TranslatedText
                value={translations.darkMode}
                style={[
                  styles.optionText,
                  {
                    color: isDarkMode.textSecondary,
                  },
                ]}
              />
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
                {'v' +
                  DeviceInfo.getVersion() +
                  ' build ' +
                  DeviceInfo.getBuildNumber()}
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
              <TranslatedText
                value={translations.logOut}
                style={[
                  styles.optionText,
                  {
                    color: isDarkMode.textSecondary,
                  },
                ]}
              />
              <Ionicons
                name={'log-out-outline'}
                size={26}
                color={isDarkMode.textPrimary}
              />
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default Profile;

const screenHeight = Dimensions.get('window').height;

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
    height: screenHeight - 260,
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
  versonText: {
    fontFamily: 'Mulish-Light',
  },
});
