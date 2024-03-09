import {View, Text, Alert, StyleSheet} from 'react-native';
import React, {useEffect, useState} from 'react';
import firestore from '@react-native-firebase/firestore';
import {TextInput, TouchableOpacity} from 'react-native-gesture-handler';
import {Input} from 'react-native-elements';
import {RegistrationProps, User} from '../../components/Types/indexTypes';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {PermissionsAndroid} from 'react-native';
import Colors from '../../components/Constants/Color';

PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS);

const Registration = ({navigation}: RegistrationProps) => {
  const [isCorrect,setIsCorrect] = useState(true);
  const [value, setValue] = useState('');
  const saveUser = async (user: User) => {
    await AsyncStorage.setItem('Role', user.Role);
    await AsyncStorage.setItem('Class', user.Class);
    await AsyncStorage.setItem('Name', user.Name);
  };
  //Email and Password
  const Login = () => {
    const query = firestore().collection('Users').where('UserID', '==', value);
    query
      .get()
      .then(querySnapshot => {
        if (!querySnapshot.empty) {
          setIsCorrect(true);
          const user: User = querySnapshot.docs[0].data() as User;
          saveUser(user);
          navigation.navigate('NavigationScreen');
        } else {
          setIsCorrect(false);
        }
      })
      .catch(error => {
        console.error('Error getting document:', error);
      });
  };
  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.incorrectText}>{isCorrect?'':'Niste uneli dobar kod'}</Text>
        <TextInput
          placeholder="Unesite vas identifikacioni kod"
          placeholderTextColor={Colors.Light.lightText}
          onChangeText={text => {setValue(text); setIsCorrect(true)}}
          value={value}
          style={[styles.input, {borderColor:isCorrect?Colors.Light.lightText:'red'}]}/>
      </View>
      
      <TouchableOpacity onPress={() => Login()} style={styles.confirmBtn} activeOpacity={0.8}>
        <Text style={styles.confirmTxt}>Registruj se</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container:{
    backgroundColor:Colors.Light.appBackground,

    flex:1,
    gap:20,
    alignContent:'center',
    
    paddingTop:'50%',
  },
  incorrectText:{
    color:'red',

    width:'80%',

    alignSelf:'center',
    textAlign:'left',
  },
  input:{
    fontSize:17,

    backgroundColor:Colors.Light.textInputBackground,
    color:Colors.Light.textPrimary,

    padding:15,
    width:'80%',

    alignSelf:'center',

    borderRadius:10,

    borderWidth:1,
    borderColor:Colors.Light.lightText,

    elevation: 13,
    shadowColor: Colors.Light.black,
    shadowOffset: {width: 2, height: 5},
    shadowRadius: 1,
  },
  confirmBtn:{
    backgroundColor:Colors.Light.accent,

    padding:20,

    width:'50%',

    alignSelf:'center',
    alignItems:'center',

    borderRadius:50,
  },
  confirmTxt:{
    fontSize:17,

    color:Colors.Light.whiteText
  },
});

export default Registration;
