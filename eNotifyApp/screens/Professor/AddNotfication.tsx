import {
    StyleSheet,
    View,
  } from 'react-native';
  import React, {useEffect, useState, useRef} from 'react';
  import { ProfessorTabProps} from '../../components/Types/indexTypes';
import { Text } from 'react-native-elements';
import Colors from '../../components/Constants/Color';
  
  
  export default function AddNotifaciton() {
    return (
        <View style={styles.container}>
            <View style={styles.list}>
                
            </View>
        </View>
    );
  }
  
  const styles = StyleSheet.create({
    container: {
        backgroundColor: Colors.Light.accent,
        borderWidth: 0,
        marginTop: 0,
      },
      list: {
        flex: 1,
        alignItems: 'center',
        width: '80%',
        borderTopLeftRadius: 40,
        borderTopRightRadius: 40,
        marginTop: 10,
        backgroundColor: Colors.Light.appBackground,
        overflow: 'hidden',
        elevation: 2,
        shadowColor: Colors.Light.black,
        shadowOffset: {width: 2, height: 5},
        shadowRadius: 1,
      },
  });
  