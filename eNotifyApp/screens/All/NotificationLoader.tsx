import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Dimensions,
  TouchableOpacity,
  useColorScheme,
  Platform,
  PermissionsAndroid,
} from 'react-native';
import React, {useEffect, useState, useRef, useMemo, useCallback} from 'react';
import {format} from 'date-fns';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Colors from '../../components/Constants/Color';
import firestore from '@react-native-firebase/firestore';
import {NotificationType} from '../../components/Types/indexTypes';
import LinearGradient from 'react-native-linear-gradient';
import ClassSelection from '../Professor/ClassSelection';
import Ionicons from 'react-native-vector-icons/Ionicons';
import BottomSheet, { BottomSheetBackdrop, BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { TextInput } from 'react-native-gesture-handler';
import {Dropdown} from 'react-native-element-dropdown';
import DocumentPicker, { DocumentPickerResponse } from 'react-native-document-picker';
import storage from '@react-native-firebase/storage';
import axios from 'axios';
import { useTranslation } from 'react-i18next';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

export default function NotificationLoader({navigation, prof, razredi}: any) {
  const isDarkMode = useColorScheme() === 'light';

  const [notifications, setNotifications] = useState<NotificationType[]>([]);
  const [studentClass, setClass] = useState('');
  const [userId, setUserId] = useState('');
  const [professor, setProfessor] = useState('');
  const [profClass, setProfClass] = useState('');
  const subscriptions = ['Prvi', 'Drugi', 'Treci', 'Cetvrti'];

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

  //uzimanje podataka iz baze
  // firestore.Filter.or(
  //   firestore.Filter('Class', 'array-contains', studentClass),
  //   firestore.Filter(
  //     'Class',
  //     'array-contains',
  //     subscriptions[parseInt(studentClass.slice(0, 1)[0]) - 1],
  //   ),
  //   firestore.Filter('Class', 'array-contains', 'Svi'),
  // ),
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

  let date: string;
  const renderObavestenje = ({
    item,
    index,
  }: {
    item: NotificationType;
    index: number;
  }) => {
    let dateNew: string;
    const display = (
      <TouchableOpacity
        style={[
          styles.obavestenje,
          {
            backgroundColor: isDarkMode
              ? Colors.Light.notificationBG
              : Colors.Dark.notificationBG,
          },
        ]}
        activeOpacity={0.5}
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

        <LinearGradient
          start={{x: 1.3, y: 0}}
          end={{x: 0, y: 0}}
          colors={
            isDarkMode
              ? ['#C6E2F5', '#2077F9']
              : [Colors.Dark.accent, Colors.Dark.appBackground]
          }
          style={styles.initialsContainer}>
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
        </LinearGradient>
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
            {item.Tittle}
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

  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(()=>['90%'],[])
  const handleOpenPress = ()=>{
    bottomSheetRef.current?.expand();
  }
  const renderBackdrop = useCallback(
		(props:any) => (
			<BottomSheetBackdrop
				{...props}
				disappearsOnIndex={-1}
				appearsOnIndex={0}
			/>
		),
		[]
	);

  const [tittleValue, setTittleValue] = useState('');
  const [textValue, setTextValue] = useState('');

  const [selectedClass, setSelectedClass] = useState('');
  const [isFocus, setIsFocus] = useState(false);
  const [naziv, setNaziv] = useState('');

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

  const AddNotifaciton = async() => {
    if (textValue !== '' && tittleValue !== '' ) {
        //console.log('textValue: '+textValue,'titleValue: '+tittleValue,'seletedClass: '+selectedClass,'selectedFile: '+selectedFile.name,'naziv: '+naziv)

        console.log('check1')
        if(selectedFile){
          const reference = storage().ref(selectedFile?.name);

          console.log('check2')
          
          const pathToFile = `file://${decodeURIComponent(selectedFile.fileCopyUri)}`;

          console.log('check3')
          console.log(pathToFile);
            await reference.putFile(pathToFile);
        }
            console.log('check4')
          const getName = async()=>{
            const name = await AsyncStorage.getItem('Name');
            if (name) setNaziv(name);
          }
          getName();

          console.log('check5')
          


          const data: NotificationType = {
            NotificationId: generateID(7),
            Tittle: tittleValue,
            Text: textValue,
            Class: [selectedClass],
            Type: 'T',
            Files: selectedFile?selectedFile.name:'',
            Date: new Date(),
            Seen: '',
            From: naziv,
          };

          console.log('check6')

          const sendData = async () => {
            try {
              console.log('check7')
              const response = await axios.post(
                'http://localhost:9000/.netlify/functions/api/data',
                data,
              );
            } catch (error) {
              console.error('Error sending data:', error);
            }
          };
    
          sendData();

          console.log('check8')
    
          firestore().collection('Notifications').add(data);
    
          console.log('check9')

          setTextValue('');
          setTittleValue('');
          setSelectedClass('');
          setSelectedFile(null);
    }
  };
  const [selectedFile, setSelectedFile] = useState<DocumentPickerResponse | null>(null);
  const AddFile = async()=> {
    try {
      await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        {
          title: 'External Storage Permission',
          message: 'This app needs access to your external storage to read files.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      await DocumentPicker.pick({
        type: [DocumentPicker.types.allFiles],
        copyTo: 'documentDirectory',
      }).then(async (file)=>{
        setSelectedFile(file[0]);
      })
      //const path = await normalizePath(file.uri)

      
     
    } catch (error) {
      if (DocumentPicker.isCancel(error)) {
        console.log('User cancelled file selection');
      } else {
        console.log('Error selecting file:', error);
      }
    }
  }

  const noNotifications = ()=>{
    return(
      <>
        <Ionicons
          name='notifications-off-outline'
          size={40}
          color={isDarkMode?Colors.Dark.lightText:Colors.Light.lightText}
          style={styles.noNotificationsIcon}
          />
        <Text style={[styles.noNotificationsText,{color:isDarkMode?Colors.Dark.lightText:Colors.Light.lightText}]}>No notifications</Text>
      </>
    )
  }

  const {t,i18n} = useTranslation();

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
            activeOpacity={0.9}
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
            enablePanDownToClose={true}>
            <BottomSheetScrollView style={styles.contentContainer}>

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
                        ? Colors.Light.textInputBackground
                        : Colors.Dark.textInputBackground,
                      color: isDarkMode
                        ? Colors.Light.textPrimary
                        : Colors.Dark.textPrimary,
                      borderColor: isDarkMode
                        ? Colors.Light.lightText
                        : Colors.Dark.lightText,
                    },
                  ]}
                  value={tittleValue}
                  onChangeText={e => setTittleValue(e)}
                />
                <TextInput
                  style={[
                    styles.input,
                    {
                      backgroundColor: isDarkMode
                        ? Colors.Light.textInputBackground
                        : Colors.Dark.textInputBackground,
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
                />
                <Dropdown
                  style={[
                    styles.dropdown,
                    {
                      backgroundColor: isDarkMode
                        ? Colors.Light.textInputBackground
                        : Colors.Dark.textInputBackground,
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
                      ? Colors.Light.notificationBG
                      : Colors.Dark.notificationBG,
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
                      ? Colors.Light.notificationBG
                      : Colors.Dark.notificationBG,
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
                  data={razredi}
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
                  style={[styles.addFile,{borderColor: isDarkMode? Colors.Dark.lightText:Colors.Light.lightText}]}
                  activeOpacity={0.5}
                  onPress={()=> AddFile()}
                >
                  <Ionicons 
                    name={selectedFile==null?'cloud-outline':'document-text-outline'}
                    size={50} 
                    color={isDarkMode?Colors.Dark.lightText:Colors.Light.lightText}
                    />
                    <Text style={{color:isDarkMode?Colors.Dark.lightText:Colors.Light.lightText}}>{selectedFile===null?t('add file'):selectedFile.name}</Text>
                    
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

const styles = StyleSheet.create({
  container: {
    marginTop: -35,
    zIndex: 100,
  },
  list: {
    flex: 1,

    width: '100%',
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,

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
  background: {
    width: '100%',
    height: '100%',
    opacity: 0.95,
    alignItems: 'center',
  },
  flatList: {
    width: screenWidth,
  },
  obavestenje: {
    alignItems: 'center',
    flexDirection: 'row',
    height: 100,
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

    fontFamily: 'Mulish-Light',
    maxWidth: screenWidth / 1.5,
  },
  obavestenjeBody: {
    flexShrink: 1,

    fontFamily: 'Mulish-Light',
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
    top: -5,
    right: -5,
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
    marginTop: 5,
    fontFamily: 'Mulish-Light',
  },
  contentContainer: {
    
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
  overlay: {
    flex: 1,
    position: 'absolute',
    top: -200,

    height: screenHeight,
    width: screenWidth,
    zIndex: 115,
    backgroundColor: '#333333',
    opacity: 0.6,
    pointerEvents: 'none',
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
  },
  addFile:{
    height:150,
    paddingHorizontal:20,
    width:'85%',
    alignSelf: 'center',
    borderRadius:15,
    borderWidth:2,
    borderStyle:'dashed',
    alignItems:'center',
    justifyContent:'center'
  },
  noNotificationsText:{
    alignSelf:'center',
    fontFamily:'Mulish',
    fontSize:17,
  },
  noNotificationsIcon:{
    alignSelf:'center',
    marginTop:20,
  }
});
