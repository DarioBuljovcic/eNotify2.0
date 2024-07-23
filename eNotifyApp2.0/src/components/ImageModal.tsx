import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import Animated, {
  FadeInUp,
  FadeOutUp,
  FlipInYLeft,
} from 'react-native-reanimated';
import {useGlobalContext} from '../context/GlobalProvider';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {ImageModalProps} from '../constants/Types/indexTypes';

const ImageModal = ({message, shown, icon}: ImageModalProps) => {
  const {isDarkMode} = useGlobalContext();
  if (shown)
    return (
      <Animated.View
        entering={FadeInUp}
        exiting={FadeOutUp}
        style={[
          styles.message,
          {
            backgroundColor: isDarkMode.textInputBackground,
          },
        ]}>
        <Ionicons name={icon.name} size={24} color={icon.color}></Ionicons>
        <Text
          style={[
            styles.messageText,
            {
              color: isDarkMode.textSecondary,
            },
          ]}>
          {message}
        </Text>
      </Animated.View>
    );
  else return <></>;
};

export default ImageModal;

const styles = StyleSheet.create({
  message: {
    flex: 1,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 5,

    alignSelf: 'center',

    width: '90%',
    height: 50,
    position: 'absolute',
    top: '2%',

    zIndex: 120,
    borderWidth: 0.5,
    borderRadius: 10,
  },

  messageText: {
    fontSize: 18,
  },
});
