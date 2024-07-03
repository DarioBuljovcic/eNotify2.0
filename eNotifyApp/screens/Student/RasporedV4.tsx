import {Animated, Dimensions, Image, StyleSheet, Text, View, useColorScheme } from 'react-native';
import React from 'react';
import Colors from '../../components/Constants/Color';
import { PinchGestureHandler } from 'react-native-gesture-handler';
import { scanFile } from 'react-native-fs';
import ZoomableImage from '../All/zoom';


export default function RasporedV4() {

    const isDarkMode = useColorScheme() === 'light';
  return (
    <View style={{marginTop: -35, zIndex: 100}}>
        <View style={[styles.container,{
            backgroundColor: isDarkMode
              ? Colors.Light.appBackground
              : Colors.Dark.appBackground,
          }]}>
            <ZoomableImage source={require('../../assets/images/table.png')}/>
            
        </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    overflow: 'hidden',
    height:Dimensions.get('window').height/1.2,
  },
  image:{
    height:'70%',
  },
});