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
import React, {useRef, useState} from 'react';
import {
  ProfessorProps,
  ProfessorTabProps,
} from '../../components/Types/indexTypes';
import AddNotifaciton from './AddNotfication';
import NotificationLoader from '../All/NotificationLoader';
import Colors from '../../components/Constants/Color';
import Ionicons from 'react-native-vector-icons/Ionicons';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

function Modal({closeModal, translateY}: any) {
  return (
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

      <Text style={styles.title}>Dodaj obavestenje</Text>

      <View style={styles.inputContainer}>

      <TextInput
          placeholder="Naslov obavestenja"
          placeholderTextColor={Colors.Light.lightText}
          autoCapitalize="none"
          style={[
            styles.input,
          ]}
        />
        <TextInput
          style={[styles.input, {textAlignVertical: 'top'}]}
          placeholder="Tekst obaveštenja"
          numberOfLines={4}
          placeholderTextColor={Colors.Light.lightText}
        />
        <TouchableOpacity
          style={styles.send}
          onPress={() => console.log('SEND')}>
          <Text style={styles.sendText}>Pošalji</Text>
        </TouchableOpacity>
      </View>
    </Animated.View>
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
          <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
            <Modal closeModal={closeModal} translateY={translateY} />
          </TouchableWithoutFeedback>
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
  title:{
    fontFamily:'Mulish',
    fontSize:22,
    textAlign:'center',
    marginBottom:20,
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
    top: -100,

    height: screenHeight,
    width: screenWidth,
    zIndex: 10,
    backgroundColor: '#333333',
    opacity: 0.6,
    pointerEvents: 'none',
  },
  send: {
    backgroundColor: Colors.Light.accent,

    marginTop:20,
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
    fontFamily:'Mulish',
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
