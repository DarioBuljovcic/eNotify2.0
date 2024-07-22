import {View, Text, StyleSheet} from 'react-native';
import React from 'react';
import {TabIconProps} from '../constants/Types/indexTypes';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useGlobalContext} from '../context/GlobalProvider';
import Colors from '../constants/Color';

const TabIcon = ({icon, focused, color, size}: TabIconProps) => {
  const {isDarkMode} = useGlobalContext();
  const iconFocused = focused ? icon : `${icon}-outline`;
  const style = focused
    ? [
        styles.tabButton,
        {
          backgroundColor: isDarkMode.appBackground,
        },
      ]
    : styles.tabButton;
  return (
    <View style={style}>
      <Ionicons name={iconFocused} size={size} color={color} />
    </View>
  );
};

export default TabIcon;

const styles = StyleSheet.create({
  tabButton: {
    width: 45,
    aspectRatio: 1,
    zIndex: 100,
    alignContent: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    borderRadius: 30,
    top: -10,
    left: -10,
  },
});
