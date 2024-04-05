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
import {Timestamp} from 'firebase/firestore';
import {Dropdown} from 'react-native-element-dropdown';

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

  const [tittleValue, setTittleValue] = useState('');
  const [textValue, setTextValue] = useState('');

  const [selectedClass, setSelectedClass] = useState('');
  const [isFocus, setIsFocus] = useState(false);

  const AddNotifaciton = () => {
    if (textValue !== '' && tittleValue !== '') {
      console.log(textValue);
      const data: NotificationType = {
        NotificationId: generateID(7),
        Tittle: tittleValue,
        Text: textValue,
        Class: selectedClass,
        Type: 'T',
        Files: '',
        Date: new Date(),
        Seen: '',
      };
      firestore().collection('Notifications').add(data);
      setTextValue('');
      setTittleValue('');
      setSelectedClass('');
    }
  };
  useEffect(() => {
    const getData = async () => {
      const data = await firestore().collection('Classes').get();
      let classes: Class[] = [];
      data.docs.forEach(doc => {
        classes.push(doc.data());
        console.log(doc.data());
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
            color={Colors.Light.accent}></Ionicons>
        </TouchableOpacity>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Obaveštenje"
            value={tittleValue}
            onChangeText={e => setTittleValue(e)}
          />
          <TextInput
            style={[styles.input, {textAlignVertical: 'top'}]}
            placeholder="Tekst obaveštenja"
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
  const translateY = useRef(new Animated.Value(600)).current;
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
        toValue: 600, // Change this value to change how far the circle moves up
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

    borderRadius: 50,

    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    position: 'absolute',
    bottom: 0,
    zIndex: 100,

    backgroundColor: 'white',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,

    width: '100%',
    height: '90%',

    paddingHorizontal: 5,
    paddingVertical: 60,
  },
  closeModal: {
    position: 'absolute',
    right: 5,
    top: 5,

    width: 35,
  },
  inputContainer: {
    flex: 1,
    gap: 10,
  },
  input: {
    borderColor: 'black',
    borderWidth: 1,
    borderRadius: 5,
    fontSize: 15,
  },
  overlay: {
    flex: 1,
    position: 'absolute',
    top: -100,

    height: screenHeight,
    width: screenWidth,
    zIndex: 10,
    backgroundColor: '#333333',
    opacity: 0.6,
    pointerEvents: 'none',
  },
  dropdown: {
    margin: 16,
    height: 50,
    borderColor: 'gray',
    borderWidth: 0.5,
    borderRadius: 8,
    paddingHorizontal: 8,
  },
  placeholderStyle: {
    fontSize: 16,
  },
  selectedTextStyle: {
    fontSize: 16,
    color: 'black',
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
  send: {
    backgroundColor: Colors.Light.accent,
    padding: 5,
    borderRadius: 5,
  },
  sendText: {
    color: Colors.Light.white,
    fontSize: 18,
    textAlign: 'center',
  },
});
