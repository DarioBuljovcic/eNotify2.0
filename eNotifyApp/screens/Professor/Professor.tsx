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

function Modal({closeModal, translateY}: any) {
  const [razredi, setRazredi] = useState<Class[]>([]);
  const [naziv, setNaziv] = useState('');

  const [tittleValue, setTittleValue] = useState('');
  const [textValue, setTextValue] = useState('');

  const [selectedClass, setSelectedClass] = useState('');
  const [isFocus, setIsFocus] = useState(false);

  const AddNotifaciton = () => {
    if (textValue !== '' && tittleValue !== '') {
      const data: NotificationType = {
        NotificationId: generateID(7),
        Tittle: tittleValue,
        Text: textValue,
        Class: selectedClass,
        Type: 'T',
        Files: '',
        Date: new Date(),
        Seen: '',
        From: naziv,
      };
      const sendData = async () => {
        try {
          const response = await axios.post(
            'https://enotifyserver2.netlify.app/.netlify/functions/api/data',
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
      <Animated.View style={[styles.modal, {transform: [{translateY}]}]}>
        <TouchableOpacity
          style={styles.closeModal}
          activeOpacity={1}
          onPress={closeModal}>
          <Ionicons
            name="close-circle-outline"
            size={35}
            color={Colors.Light.accentGreen}></Ionicons>
        </TouchableOpacity>

        <Text style={styles.title}>Dodaj obaveštenje</Text>

        <View style={styles.inputContainer}>
          <TextInput
            placeholder="Naslov obaveštenja"
            placeholderTextColor={Colors.Light.lightText}
            style={styles.input}
            value={tittleValue}
            onChangeText={e => setTittleValue(e)}
          />
          <TextInput
            style={[styles.input, {textAlignVertical: 'top'}]}
            placeholder="Tekst obaveštenja"
            placeholderTextColor={Colors.Light.lightText}
            numberOfLines={4}
            value={textValue}
            onChangeText={e => setTextValue(e)}
          />
          <Dropdown
            style={styles.dropdown}
            placeholderStyle={styles.placeholderStyle}
            selectedTextStyle={styles.selectedTextStyle}
            inputSearchStyle={styles.inputSearchStyle}
            data={razredi}
            search
            placeholder={!isFocus ? 'Select an item' : '...'}
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
            itemTextStyle={styles.itemTextStyle}
          />
          <TouchableOpacity
            style={styles.send}
            onPress={() => AddNotifaciton()}>
            <Text style={styles.sendText}>Pošalji</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </TouchableWithoutFeedback>
  );
}

export default function Professor({
  navigation,
}: ProfessorTabProps | ProfessorProps) {
  const [visible, setVisible] = useState(false);
  const translateY = useRef(new Animated.Value(800)).current;
  const opacity = useRef(new Animated.Value(0)).current;

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

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <>
        <Animated.View style={[styles.overlay, {opacity}]}></Animated.View>
        <View style={styles.container}>
          <NotificationLoader navigation={navigation} />
          <TouchableOpacity
            style={styles.add}
            activeOpacity={0.9}
            onPress={openModal}>
            <Ionicons
              name={'add-outline'}
              size={35}
              color={Colors.Light.white}
            />
          </TouchableOpacity>

          <Modal closeModal={closeModal} translateY={translateY} />
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
    backgroundColor: Colors.Light.accentGreen,

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
    bottom: 0,
    zIndex: 120,

    backgroundColor: 'white',
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
    color: Colors.Light.textPrimary,
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

    backgroundColor: Colors.Light.textInputBackground,
    color: Colors.Light.textPrimary,

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
    color: Colors.Light.lightText,
  },
  selectedTextStyle: {
    fontSize: 17,
    fontFamily: 'Mulish',
    color: Colors.Light.textPrimary,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
    color: Colors.Light.lightText,
  },
  itemTextStyle: {
    color: Colors.Light.textPrimary,
  },
  send: {
    backgroundColor: Colors.Light.accent,

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

    backgroundColor: Colors.Light.textInputBackground,
    color: Colors.Light.textPrimary,

    padding: 15,
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
});
