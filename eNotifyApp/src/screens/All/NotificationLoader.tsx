import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Dimensions,
  TouchableOpacity,
  useColorScheme,
  PermissionsAndroid,
  Image,
} from 'react-native';
import React, {useEffect, useState, useRef, useMemo, useCallback} from 'react';
import {format} from 'date-fns';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Colors from '../../constants/Color';
import firestore from '@react-native-firebase/firestore';
import {NotificationType} from '../../constants/Types/indexTypes';
import LinearGradient from 'react-native-linear-gradient';
import ClassSelection from '../Professor/ClassSelection';
import Ionicons from 'react-native-vector-icons/Ionicons';
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetScrollView,
} from '@gorhom/bottom-sheet';
import {TextInput} from 'react-native-gesture-handler';
import {Dropdown} from 'react-native-element-dropdown';
import DocumentPicker, {
  DocumentPickerResponse,
} from 'react-native-document-picker';
import storage from '@react-native-firebase/storage';
import axios from 'axios';
import {useTranslation} from 'react-i18next';

export default function NotificationLoader({navigation, prof, razredi}: any) {
  const [notifications, setNotifications] = useState<NotificationType[]>([]);
  const [studentClass, setClass] = useState('');
  const [userId, setUserId] = useState('');
  const [professor, setProfessor] = useState('');
  const [profClass, setProfClass] = useState('');
  const subscriptions = ['Prvi', 'Drugi', 'Treci', 'Cetvrti'];

  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ['90%'], []);

  const [TitleValue, setTitleValue] = useState('');
  const [textValue, setTextValue] = useState('');

  const [selectedClass, setSelectedClass] = useState('');
  const [isFocus, setIsFocus] = useState(false);
  const [naziv, setNaziv] = useState('');
  const [selectedFile, setSelectedFile] =
    useState<DocumentPickerResponse | null>(null);

  const isDarkMode = useColorScheme() === 'light';
  const {t, i18n} = useTranslation();

  const getRazredAndId = async () => {
    const name = prof ? await AsyncStorage.getItem('Name') : 'notProf';
    const value = await AsyncStorage.getItem('UserId');
    const raz = await AsyncStorage.getItem('Class');
    if (value !== null && name !== null && raz !== null) {
      setUserId(value);
      setProfessor(name);
      setClass(raz);
      prof ? setProfClass(raz) : null;
    }
  };

  const getData = () => {
    if (!prof) {
      console.log(studentClass);
      firestore()
        .collection('Notifications')
        .where(
          firestore.Filter('Class', 'array-contains-any', [
            studentClass,
            subscriptions[parseInt(studentClass.slice(0, 1)[0]) - 1],
            'Svi',
          ]),
        )
        .onSnapshot(snapshot => {
          const data: NotificationType[] = snapshot.docs.map(doc => ({
            id: doc.id,
            ...(doc.data() as NotificationType),
          }));
          setNotifications(
            data.sort((a, b) => Number(b.Date) - Number(a.Date)),
          );
        });
    } else {
      firestore()
        .collection('Notifications')
        .where(firestore.Filter('Class', 'array-contains', profClass))
        .where('From', '==', professor)
        .onSnapshot(snapshot => {
          const data: NotificationType[] = snapshot.docs.map(doc => ({
            id: doc.id,
            ...(doc.data() as NotificationType), // Here, we assert that the document data conforms to the User interface
          }));
          setNotifications(
            data.sort((a, b) => Number(b.Date) - Number(a.Date)),
          );
        });
    }
  };

  useEffect(() => {
    if (studentClass == '' && userId == '') {
      getRazredAndId();
    }
    if (studentClass != '' && userId !== '' && professor !== '') {
      getData();
    }

    setSelectedClass(profClass); //sets dropdown to selected class
  }, [studentClass, userId, professor, profClass]);

  const getInitials = (name: string) => {
    const words = name.split(' ');
    let initials = '';
    for (const word of words) {
      const firstLetter = word.charAt(0).toUpperCase();
      if (firstLetter === 'L' || firstLetter === 'N' || firstLetter === 'D') {
        const secondLetter = word.charAt(1);
        if (secondLetter === 'j' || secondLetter === 'ž') {
          const twoLetterCombo = firstLetter + secondLetter;
          initials += twoLetterCombo;
        } else {
          initials += firstLetter;
        }
      } else {
        initials += firstLetter;
      }
    }
    return initials;
  };

  const filterClasses = useMemo(() => {
    console.log(razredi);
    if (razredi)
      return razredi.filter(obj => obj.ProfessorsList.includes(userId));
  }, [razredi]);

  let date: string;
  const renderObavestenje = ({
    item,
    index,
  }: {
    item: NotificationType;
    index: number;
  }) => {
    let dateNew: string;

    // const getProfilePicture = async () => {
    //   const querySnapshot = await firestore()
    //     .collection('Users')
    //     .where('Name', '==', item.From)
    //     .get();
    //   if (!querySnapshot.empty) {
    //     const imageUrl = await storage()
    //       .ref(querySnapshot.docs[0].data().profile_picture)
    //       .getDownloadURL();
    //     return imageUrl;
    //   }
    //   return '';
    // };

    const display = (
      <TouchableOpacity
        style={[
          styles.obavestenje,
          {
            backgroundColor: isDarkMode
              ? Colors.Light.componentBG
              : Colors.Dark.componentBG,
          },
        ]}
        activeOpacity={0.7}
        key={item.NotificationId}
        onPress={() => {
          navigation.navigate('Notification', {id: item.NotificationId});
        }}>
        <View
          style={
            userId && item.Seen.includes(userId)
              ? {display: 'none'}
              : [
                  styles.newObavestenje,
                  {
                    backgroundColor: isDarkMode
                      ? Colors.Light.accentGreen
                      : Colors.Dark.accentGreen,
                  },
                ]
          }></View>

        <View
          style={[
            styles.initialsContainer,
            {
              backgroundColor: isDarkMode
                ? Colors.Light.accent
                : Colors.Dark.accent,
            },
          ]}>
          <Text
            style={[
              styles.initialsText,
              {
                color: isDarkMode
                  ? Colors.Light.white
                  : Colors.Dark.textPrimary,
              },
            ]}>
            {getInitials(item.From)}
          </Text>
        </View>
        <View>
          <Text
            style={[
              styles.obavestenjeTitle,
              {
                color: isDarkMode
                  ? Colors.Light.textPrimary
                  : Colors.Dark.textPrimary,
              },
            ]}>
            {item.Title}
          </Text>

          <Text
            style={[
              styles.obavestenjeBody,
              {
                color: isDarkMode
                  ? Colors.Light.textPrimary
                  : Colors.Dark.textPrimary,
              },
            ]}
            numberOfLines={2}>
            {item.Text}
          </Text>
        </View>
      </TouchableOpacity>
    );

    index === 0 ? (date = '') : null;
    dateNew = format(item.Date.toDate(), 'dd.MM.yyyy.');

    if (dateNew === date) {
      return display;
    } else {
      date = dateNew;
      return (
        <View key={item.NotificationId}>
          <View style={styles.datum}>
            <Text
              style={[
                styles.datumText,
                {
                  color: isDarkMode
                    ? Colors.Light.textPrimary
                    : Colors.Dark.textPrimary,
                },
              ]}>
              {date}
            </Text>
          </View>
          {display}
        </View>
      );
    }
  };

  const handleOpenPress = () => {
    bottomSheetRef.current?.expand();
  };

  const renderBackdrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
      />
    ),
    [],
  );

  const generateID = (length: number) => {
    const charset =
      'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let ID = '';
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * charset.length);
      ID += charset[randomIndex];
    }
    return ID;
  };
  const AddNotifaciton = async () => {
    if (textValue !== '' && TitleValue !== '') {
      //console.log('textValue: '+textValue,'titleValue: '+TitleValue,'seletedClass: '+selectedClass,'selectedFile: '+selectedFile.name,'naziv: '+naziv)
      const name = (await AsyncStorage.getItem('Name')) as string;

      console.log('check1');
      if (selectedFile) {
        const reference = storage().ref(selectedFile?.name);

        console.log('check2');

        const pathToFile = `file://${decodeURIComponent(
          selectedFile.fileCopyUri,
        )}`;

        console.log('check3');
        console.log(pathToFile);
        await reference.putFile(pathToFile);
      }
      console.log('check4');

      console.log('check5');
      console.log(naziv);
      const data: NotificationType = {
        NotificationId: generateID(7),
        Title: TitleValue,
        Text: textValue,
        Class: [selectedClass],
        Type: 'T',
        Files: selectedFile ? selectedFile.name : '',
        Date: new Date(),
        Seen: '',
        From: name,
      };

      console.log('check6');

      const sendData = async () => {
        try {
          console.log('check7');
          const response = await axios.post(
            'http://localhost:9000/.netlify/functions/api/data',
            data,
          );
        } catch (error) {
          console.error('Error sending data:', error);
        }
      };

      sendData();

      console.log('check8');

      firestore().collection('Notifications').add(data);

      console.log('check9');

      setTextValue('');
      setTitleValue('');
      setSelectedClass('');
      setSelectedFile(null);

      bottomSheetRef.current?.close();
    }
  };

  const AddFile = async () => {
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
      });
      //const path = await normalizePath(file.uri)
    } catch (error) {
      if (DocumentPicker.isCancel(error)) {
        console.log('User cancelled file selection');
      } else {
        console.log('Error selecting file:', error);
      }
    }
  };

  const noNotifications = () => {
    return (
      <>
        <Ionicons
          name="notifications-off-outline"
          size={40}
          color={isDarkMode ? Colors.Dark.lightText : Colors.Light.lightText}
          style={styles.noNotificationsIcon}
        />
        <Text
          style={[
            styles.noNotificationsText,
            {
              color: isDarkMode
                ? Colors.Dark.lightText
                : Colors.Light.lightText,
            },
          ]}>
          No notifications
        </Text>
      </>
    );
  };

  return (
    <View style={styles.container}>
      {notifications && (
        <View
          style={[
            styles.list,
            {
              backgroundColor: isDarkMode
                ? Colors.Light.appBackground
                : Colors.Dark.appBackground,
            },
          ]}>
          {prof && (
            <ClassSelection
              razredi={razredi}
              setProfClass={(o: any) => setProfClass(o)}
              profClass={profClass}
            />
          )}
          <FlatList
            style={[styles.flatList]}
            data={notifications}
            renderItem={renderObavestenje}
            keyExtractor={obavestenje => obavestenje.NotificationId}
            initialNumToRender={7}
            showsVerticalScrollIndicator={false}
            updateCellsBatchingPeriod={50}
            ListEmptyComponent={noNotifications}
          />
          {prof && (
            <>
              <TouchableOpacity
                style={[
                  styles.add,
                  {
                    backgroundColor: isDarkMode
                      ? Colors.Light.accentGreen
                      : Colors.Dark.accentGreen,
                  },
                ]}
                activeOpacity={0.7}
                onPress={handleOpenPress}>
                <Ionicons
                  name={'add-outline'}
                  size={35}
                  color={Colors.Light.white}
                />
              </TouchableOpacity>

              <BottomSheet
                ref={bottomSheetRef}
                snapPoints={snapPoints}
                index={-1}
                backdropComponent={renderBackdrop}
                enablePanDownToClose={true}
                handleStyle={{
                  backgroundColor: isDarkMode
                    ? Colors.Light.appBackground
                    : Colors.Dark.appBackground,
                }}
                handleIndicatorStyle={{
                  backgroundColor: isDarkMode
                    ? Colors.Light.lightText
                    : Colors.Dark.lightText,
                }}>
                <BottomSheetScrollView
                  showsVerticalScrollIndicator={false}
                  style={[
                    {
                      backgroundColor: isDarkMode
                        ? Colors.Light.appBackground
                        : Colors.Dark.appBackground,
                    },
                    {paddingBottom: 30},
                  ]}>
                  <Text
                    style={[
                      styles.title,
                      {
                        color: isDarkMode
                          ? Colors.Light.textPrimary
                          : Colors.Dark.textPrimary,
                      },
                    ]}>
                    {t('add notification')}
                  </Text>

                  <View style={styles.inputContainer}>
                    <TextInput
                      placeholder={t('Notification title')}
                      placeholderTextColor={Colors.Light.lightText}
                      style={[
                        styles.input,
                        {
                          backgroundColor: isDarkMode
                            ? Colors.Light.componentBG
                            : Colors.Dark.componentBG,
                          color: isDarkMode
                            ? Colors.Light.textPrimary
                            : Colors.Dark.textPrimary,
                          borderColor: isDarkMode
                            ? Colors.Light.lightText
                            : Colors.Dark.lightText,
                        },
                      ]}
                      value={TitleValue}
                      onChangeText={e => setTitleValue(e)}
                    />
                    <TextInput
                      style={[
                        styles.input,
                        {
                          backgroundColor: isDarkMode
                            ? Colors.Light.componentBG
                            : Colors.Dark.componentBG,
                          color: isDarkMode
                            ? Colors.Light.textPrimary
                            : Colors.Dark.textPrimary,
                          borderColor: isDarkMode
                            ? Colors.Light.lightText
                            : Colors.Dark.lightText,
                        },
                        {textAlignVertical: 'top'},
                      ]}
                      placeholder={t('notification text')}
                      placeholderTextColor={Colors.Light.lightText}
                      numberOfLines={4}
                      value={textValue}
                      onChangeText={e => setTextValue(e)}
                      multiline={true}
                    />
                    <Dropdown
                      style={[
                        styles.dropdown,
                        {
                          backgroundColor: isDarkMode
                            ? Colors.Light.componentBG
                            : Colors.Dark.componentBG,
                        },
                      ]}
                      placeholderStyle={[
                        styles.placeholderStyle,
                        {
                          color: isDarkMode
                            ? Colors.Light.lightText
                            : Colors.Dark.lightText,
                        },
                      ]}
                      itemContainerStyle={{
                        backgroundColor: isDarkMode
                          ? Colors.Light.componentBG
                          : Colors.Dark.componentBG,
                      }}
                      selectedTextStyle={[
                        styles.selectedTextStyle,
                        {
                          color: isDarkMode
                            ? Colors.Light.lightText
                            : Colors.Dark.lightText,
                        },
                      ]}
                      containerStyle={{
                        backgroundColor: isDarkMode
                          ? Colors.Light.componentBG
                          : Colors.Dark.componentBG,
                      }}
                      inputSearchStyle={[
                        styles.inputSearchStyle,
                        {
                          color: isDarkMode
                            ? Colors.Light.lightText
                            : Colors.Dark.lightText,
                        },
                      ]}
                      itemTextStyle={{
                        color: isDarkMode
                          ? Colors.Light.textPrimary
                          : Colors.Dark.textPrimary,
                      }}
                      data={filterClasses}
                      search
                      placeholder={!isFocus ? t('choose grade') : '...'}
                      value={selectedClass}
                      onFocus={() => setIsFocus(true)}
                      onBlur={() => setIsFocus(false)}
                      onChange={item => {
                        setSelectedClass(item.Class);
                        setIsFocus(false);
                      }}
                      labelField={'Class'}
                      valueField={'Class'}
                      keyboardAvoiding={true}
                    />

                    <TouchableOpacity
                      style={[
                        styles.addFile,
                        {
                          borderColor: isDarkMode
                            ? Colors.Dark.lightText
                            : Colors.Light.lightText,
                        },
                      ]}
                      activeOpacity={0.7}
                      onPress={() => AddFile()}>
                      <Ionicons
                        name={
                          selectedFile == null
                            ? 'cloud-outline'
                            : 'document-text-outline'
                        }
                        size={50}
                        color={
                          isDarkMode
                            ? Colors.Dark.lightText
                            : Colors.Light.lightText
                        }
                      />
                      <Text
                        style={{
                          color: isDarkMode
                            ? Colors.Dark.lightText
                            : Colors.Light.lightText,
                        }}>
                        {selectedFile === null
                          ? t('add file')
                          : selectedFile.name}
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={[
                        styles.send,
                        {
                          backgroundColor: isDarkMode
                            ? Colors.Light.accent
                            : Colors.Dark.accent,
                        },
                      ]}
                      onPress={() => AddNotifaciton()}>
                      <Text style={[styles.sendText]}>{t('send')}</Text>
                    </TouchableOpacity>
                  </View>
                </BottomSheetScrollView>
              </BottomSheet>
            </>
          )}
        </View>
      )}
    </View>
  );
}

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

const styles = StyleSheet.create({
  container: {
    zIndex: 100,
  },
  list: {
    flex: 1,

    width: '100%',

    overflow: 'hidden',
    elevation: 2,
    shadowColor: Colors.Light.black,
    shadowOffset: {width: 2, height: 5},
    shadowRadius: 1,
    display: 'flex',
  },
  add: {
    width: 70,
    height: 70,

    position: 'absolute',
    bottom: 10,
    right: 10,

    borderRadius: 50,

    justifyContent: 'center',
    alignItems: 'center',
  },
  flatList: {
    width: screenWidth,
  },
  obavestenje: {
    alignItems: 'center',
    flexDirection: 'row',
    height: 90,
    width: '90%',
    marginTop: 5,
    marginBottom: 10,
    marginLeft: screenWidth * 0.05,
    padding: 10,

    borderRadius: 10,
    elevation: 3,
    shadowColor: Colors.Light.black,
    shadowOffset: {width: 2, height: 5},
    shadowRadius: 1,
  },
  initialsContainer: {
    aspectRatio: 1 / 1,
    height: '85%',

    borderRadius: 50,
    marginRight: 10,
    justifyContent: 'center',
  },
  initialsText: {
    textAlign: 'center',

    fontFamily: 'Mulish',
    fontSize: 30,
  },
  obavestenjeTitle: {
    fontSize: 20,

    fontFamily: 'Mulish',
    maxWidth: screenWidth / 1.5,
  },
  obavestenjeBody: {
    flexShrink: 1,

    fontFamily: 'Mulish',
    maxWidth: screenWidth / 1.5,
  },
  newObavestenje: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',

    width: 20,
    height: 20,
    borderRadius: 10,

    position: 'absolute',
    top: 10,
    right: 10,
  },
  newObavestenjeText: {
    color: 'white',
  },
  datum: {
    marginTop: 20,
    marginLeft: screenWidth * 0.06,
  },
  datumText: {
    fontSize: 13,
    marginTop: 0,
    fontFamily: 'Mulish-Light',
  },
  title: {
    fontFamily: 'Mulish',
    fontSize: 22,
    textAlign: 'center',
    marginBottom: 20,
  },
  inputContainer: {
    flex: 1,
    gap: 10,
  },
  dropdown: {
    fontSize: 17,
    fontFamily: 'Mulish',

    padding: 15,
    margin: 16,
    height: 50,
    width: '85%',

    alignSelf: 'center',

    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.Light.lightText,

    elevation: 13,
    shadowColor: Colors.Light.black,
    shadowOffset: {width: 2, height: 5},
    shadowRadius: 1,
  },

  placeholderStyle: {
    fontSize: 16,
  },
  selectedTextStyle: {
    fontSize: 17,
    fontFamily: 'Mulish',
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },

  send: {
    marginTop: 20,
    padding: 20,

    width: '80%',

    alignSelf: 'center',
    alignItems: 'center',

    marginBottom: 30,

    borderRadius: 30,
  },
  sendText: {
    color: Colors.Light.white,
    fontSize: 18,
    textAlign: 'center',
    fontFamily: 'Mulish',
  },
  input: {
    fontSize: 17,
    fontFamily: 'Mulish',

    padding: 15,
    width: '85%',

    alignSelf: 'center',

    borderRadius: 10,
    borderWidth: 1,

    elevation: 13,
    shadowColor: Colors.Light.black,
    shadowOffset: {width: 2, height: 5},
    shadowRadius: 1,

    overflow: 'scroll',
  },
  addFile: {
    height: 150,
    paddingHorizontal: 20,
    width: '85%',
    alignSelf: 'center',
    borderRadius: 15,
    borderWidth: 2,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
  },
  noNotificationsText: {
    alignSelf: 'center',
    fontFamily: 'Mulish',
    fontSize: 17,
  },
  noNotificationsIcon: {
    alignSelf: 'center',
    marginTop: 20,
  },
});
