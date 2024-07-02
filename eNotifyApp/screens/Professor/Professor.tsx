import {
  Button,
  StyleSheet,
  Text,
  TextInput,
  View,
  Dimensions,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Animated,
  Keyboard,
  useColorScheme,
  Appearance,
  Platform,
  PermissionsAndroid,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {
  ProfessorProps,
  ProfessorTabProps,
  NotificationType,
  Class,
} from '../../components/Types/indexTypes';
import NotificationLoader from '../All/NotificationLoader';
import Colors from '../../components/Constants/Color';
import Ionicons from 'react-native-vector-icons/Ionicons';
import firestore from '@react-native-firebase/firestore';
import {Dropdown} from 'react-native-element-dropdown';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ClassSelection from './ClassSelection';
import { Input } from 'react-native-elements';
import DocumentPicker, { DocumentPickerResponse } from 'react-native-document-picker';

import { utils } from '@react-native-firebase/app';
import storage from '@react-native-firebase/storage';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

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
function Modal({
  closeModal,
  translateY,
  razredi,
  naziv,
}: {
  closeModal: any;
  translateY: any;
  razredi: Class[];
  naziv: string;
}) {
  const isDarkMode = useColorScheme() === 'light';

  const [tittleValue, setTittleValue] = useState('');
  const [textValue, setTextValue] = useState('');

  const [selectedClass, setSelectedClass] = useState('');
  const [isFocus, setIsFocus] = useState(false);

  const AddNotifaciton = async() => {
    if (textValue !== '' && tittleValue !== '' && selectedFile?.name!==null && selectedFile?.fileCopyUri!==null) {
          const reference = storage().ref(selectedFile?.name);
          const pathToFile = `file://${decodeURIComponent(selectedFile.fileCopyUri)}`;
          console.log(pathToFile);
          await reference.putFile(pathToFile);
          const data: NotificationType = {
            NotificationId: generateID(7),
            Tittle: tittleValue,
            Text: textValue,
            Class: [selectedClass],
            Type: 'T',
            Files: selectedFile.name,
            Date: new Date(),
            Seen: '',
            From: naziv,
          };
          const sendData = async () => {
            try {
              const response = await axios.post(
                'http://localhost:9000/.netlify/functions/api/data',
                data,
              );
            } catch (error) {
              console.error('Error sending data:', error);
            }
          };
    
          sendData();
    
          firestore().collection('Notifications').add(data);
    
          setTextValue('');
          setTittleValue('');
          setSelectedClass('');
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

  const normalizePath = async({path}:any)=>{
    if(Platform.OS==='ios'||Platform.OS==='android'){
      const filePrefix = 'file://';
      if(path.startsWith(filePrefix)){
        path = path.substring(filePrefix.length);
        try{
          path=decodeURI(path);
        }catch(e){}
      }
    }
    return path;
  }

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <Animated.View
        style={[
          styles.modal,
          {
            backgroundColor: isDarkMode
              ? Colors.Light.appBackground
              : Colors.Dark.appBackground,
          },
          {transform: [{translateY}]},
        ]}>
        <TouchableOpacity
          style={styles.closeModal}
          activeOpacity={1}
          onPress={closeModal}>
          <Ionicons
            name="close-circle-outline"
            size={35}
            color={Colors.Light.accentGreen}></Ionicons>
        </TouchableOpacity>

        <Text
          style={[
            styles.title,
            {
              color: isDarkMode
                ? Colors.Light.textPrimary
                : Colors.Dark.textPrimary,
            },
          ]}>
          Dodaj obaveštenje
        </Text>

        <View style={styles.inputContainer}>
          <TextInput
            placeholder="Naslov obaveštenja"
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
            placeholder="Tekst obaveštenja"
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
            placeholder={!isFocus ? 'Izaberite razred...' : '...'}
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
              <Text style={{color:isDarkMode?Colors.Dark.lightText:Colors.Light.lightText}}>{selectedFile===null?'Dodaj file':selectedFile.name}</Text>
              
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
            <Text style={[styles.sendText]}>Pošalji</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </TouchableWithoutFeedback>
  );
}

export default function Professor({
  navigation,
}: ProfessorTabProps | ProfessorProps) {
  const isDarkMode = useColorScheme() === 'light';
  
  const translateY = useRef(new Animated.Value(800)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const [razredi, setRazredi] = useState<Class[]>([]);
  const [naziv, setNaziv] = useState('');
  const [visible, setVisible] = useState(false);

  const animateOpen = () => {
    Animated.parallel([
      Animated.timing(translateY, {
        toValue: 0, // Change this value to change how far the circle moves up
        duration: 300, // Adjust duration as needed
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 0.6, // Change this value to change how far the circle moves up
        duration: 300, // Adjust duration as needed
        useNativeDriver: true,
      }),
    ]).start();
  };
  const animateClose = () => {
    Animated.parallel([
      Animated.timing(translateY, {
        toValue: 800, // Change this value to change how far the circle moves up
        duration: 300, // Adjust duration as needed
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 0, // Change this value to change how far the circle moves up
        duration: 300, // Adjust duration as needed
        useNativeDriver: true,
      }),
    ]).start();
  };

  const openModal = () => {
    animateOpen();
    setVisible(true);
  };
  const closeModal = () => {
    animateClose();
    setVisible(false);
  };
  useEffect(() => {
    const getData = async () => {
      const data = await firestore().collection('Classes').get();
      const name = await AsyncStorage.getItem('Name');
      if (name) setNaziv(name);
      let classes: Class[] = [];
      data.docs.forEach(doc => {
        classes.push(doc.data());
      });
      setRazredi(classes);
    };
    if (razredi.length === 0) getData();
  });

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <>
        <Animated.View style={[styles.overlay, {opacity}]}></Animated.View>
        <View style={styles.container}>
          <NotificationLoader
            navigation={navigation}
            prof={true}
            razredi={razredi}
          />
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
            onPress={openModal}>
            <Ionicons
              name={'add-outline'}
              size={35}
              color={Colors.Light.white}
            />
          </TouchableOpacity>

          <Modal
            closeModal={closeModal}
            translateY={translateY}
            razredi={razredi}
            naziv={naziv}
          />
        </View>
      </>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  add: {
    width: 70,
    height: 70,

    position: 'absolute',
    bottom: 10,
    right: 10,
    zIndex: 110,

    borderRadius: 50,

    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    position: 'absolute',
    bottom: '-10%',
    zIndex: 120,

    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,

    width: '100%',
    height: '120%',

    paddingHorizontal: 5,
    paddingVertical: 60,
  },

  title: {
    fontFamily: 'Mulish',
    fontSize: 22,
    textAlign: 'center',
    marginBottom: 20,
  },

  closeModal: {
    position: 'absolute',
    right: 10,
    top: 10,

    width: 35,
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
    height:'27%',
    width:'85%',
    alignSelf: 'center',
    borderRadius:15,
    borderWidth:2,
    borderStyle:'dashed',
    alignItems:'center',
    justifyContent:'center'
  },
});
