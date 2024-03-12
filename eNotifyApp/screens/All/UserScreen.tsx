import firestore from '@react-native-firebase/firestore';
import Colors from '../../components/Constants/Color';
import { SettingsProps, User } from '../../components/Types/indexTypes';
import { StyleSheet, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Student from '../Student/Student';
import Settings from './Settings';
import React, { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Image, Text } from 'react-native-elements';
import { TouchableOpacity } from 'react-native-gesture-handler';

const UserScreen=()=>{
    const [role,setRole] = useState('');
    const [name,setName] = useState('');
    const [grade,setGrade] = useState('');

    useEffect(()=>{
        const saveUser = async () => {
            setRole(await AsyncStorage.getItem('Role') as string)
            setName(await AsyncStorage.getItem('Name') as string)
            setGrade(await AsyncStorage.getItem('Class') as string)
        };
        saveUser();
    });

    return(
        <View style={styles.container}>
            <View style={styles.containerSize}>
            
                <View style={styles.userInfo}>
                    <Image
                        source={require('../../images/user.png')}
                        style={styles.userImage}
                    />
                    <Text style={styles.lineText}>{name}</Text>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex:1,
        backgroundColor:Colors.Light.appBackground,
        alignItems:'center',
    },
    containerSize:{
        width: '80%',
        marginTop:30,
    },
    userInfo:{
        alignItems:'center',
    },
    userImage:{
        height:150,
        width:150,
    },
    lineText: {
      marginTop: 15,
      color: Colors.Light.textPrimary,
      fontSize:17,
    },
  });
  

export default UserScreen;