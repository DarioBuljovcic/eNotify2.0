import {
  Button,
  StyleSheet,
  Text,
  TextInput,
  View,
  FlatList,
  Dimensions,
  TouchableOpacity,
  AppState,
  Platform,
} from 'react-native';
import React from 'react';
import {ProfessorProps, ProfessorTabProps} from '../../components/Types/indexTypes';
import AddNotifaciton from './AddNotfication';
import NotificationLoader from '../All/NotificationLoader';
import Colors from '../../components/Constants/Color';
import Ionicons from 'react-native-vector-icons/Ionicons';

const screenWidth = Dimensions.get('window').width;

const addNotification = ()=>{
  console.log('click');
}

export default function Professor({navigation}: ProfessorTabProps) {
  

  return (
    <View style={styles.container}>
      <NotificationLoader/>
      <TouchableOpacity style={styles.add} activeOpacity={0.9} onPress={addNotification}>
        <Ionicons name={'add-outline'} size={35} color={Colors.Light.white} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  add:{
    width:70,
    height:70,
    backgroundColor:Colors.Light.accentGreen,

    position:'absolute',
    bottom:10,
    right:10,

    borderRadius:50,

    justifyContent:'center',
    alignItems:'center',
  },
});
