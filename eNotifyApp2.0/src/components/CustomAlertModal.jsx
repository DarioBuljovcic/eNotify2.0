import React, {useState} from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  useColorScheme,
} from 'react-native';
import Colors from '../constants/Color';

const CustomAlertModal = ({visible, message, onClose}) => {
  const isDarkMode = useColorScheme() === 'dark';
  const styleMode = {
    modalView: {
      backgroundColor: isDarkMode
        ? Colors.Dark.appBackground
        : Colors.Light.appBackground,
    },
    message: {
      color: isDarkMode ? Colors.Dark.textPrimary : Colors.Light.textPrimary,
    },
    button: {
      backgroundColor: isDarkMode ? Colors.Dark.accent : Colors.Light.accent,
    },
    buttonText: {
      color: isDarkMode ? Colors.Dark.whiteText : Colors.Light.whiteText,
    },
  };
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}>
      <View style={styles.container}>
        <View style={[styles.modalView, styleMode.modalView]}>
          <Text style={[styles.message, styleMode.message]}>{message}</Text>
          <TouchableOpacity
            style={[styles.button, styleMode.button]}
            onPress={onClose}>
            <Text style={[styles.buttonText, styleMode.buttonText]}>OK</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    elevation: 5,
  },
  message: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: 'center',
    color: 'white',
  },
  button: {
    backgroundColor: '#c40cf3',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
});

export default CustomAlertModal;
