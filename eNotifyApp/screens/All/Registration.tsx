import {View, Text, Alert, StyleSheet} from 'react-native';
import React, {useEffect, useState} from 'react';
import firestore from '@react-native-firebase/firestore';
import {TextInput, TouchableOpacity} from 'react-native-gesture-handler';
import {
  RegistrationProps,
  User,
  Navigation,
} from '../../components/Types/indexTypes';
import AsyncStorage from '@react-native-async-storage/async-storage';
import messaging from '@react-native-firebase/messaging';
import {PermissionsAndroid} from 'react-native';
import Colors from '../../components/Constants/Color';
import LinearGradient from 'react-native-linear-gradient';
import {StackNavigationProp} from '@react-navigation/stack';

PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS);

const RegistrationScreen = ({
  navigation,
}: {
  navigation: StackNavigationProp<Navigation, 'Registration', undefined>;
}) => {
  const [isCorrect, setIsCorrect] = useState(true);
  const [value, setValue] = useState('');
  const subscriptions = ['Prvi', 'Drugi', 'Treci', 'Cetvrti'];

  const saveUser = async (user: User) => {
    await AsyncStorage.setItem('Role', user.Role);
    await AsyncStorage.setItem('Class', user.Class);
    await AsyncStorage.setItem('Name', user.Name);
    await AsyncStorage.setItem('UserId', value);
    await messaging().subscribeToTopic('Svi');
    await messaging().subscribeToTopic(
      subscriptions[parseInt(user.Class.slice(0, 1)[0]) - 1],
    );
    await messaging().subscribeToTopic(user.Class);
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
        <Text style={styles.incorrectText}>
          {isCorrect ? '' : 'Niste uneli dobar kod'}
        </Text>
        <TextInput
          placeholder="Unesite vas identifikacioni kod"
          placeholderTextColor={Colors.Light.lightText}
          autoCapitalize="none"
          onChangeText={text => {
            setValue(text);
            setIsCorrect(true);
          }}
          value={value}
          style={[
            styles.input,
            {borderColor: isCorrect ? Colors.Light.lightText : 'red'},
          ]}
        />
      </View>
      <TouchableOpacity onPress={() => Login()} activeOpacity={0.8}>
        <LinearGradient
          start={{x: 0.8, y: 0}}
          end={{x: 0, y: 0}}
          colors={[Colors.Light.accent, Colors.Light.accentGreen]}
          style={styles.confirmBtn}>
          <Text style={styles.confirmTxt}>Registruj se</Text>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
};

const LoadingScreen = (
  navigation: StackNavigationProp<Navigation, 'Registration', undefined>,
) => {
  const [naziv, setNaziv] = useState(false);
  const uzmiNaziv = async () => {
    const value = await AsyncStorage.getItem('Name');
    if (value !== null) setNaziv(true);
  };
  const getRazred = async () => {
    const razred = await AsyncStorage.getItem('Class');

    if (razred !== null) {
      navigation.navigate('NavigationScreen');
    } else {
      return true;
    }
  };
  uzmiNaziv();
  return naziv === true ? getRazred() : true;
};
const checkStat = async () => {
  const userId = await AsyncStorage.getItem('UserId');
  firestore()
    .collection('Users')
    .where('UserID', '==', userId)
    .get()
    .then(snapShoot => {
      if (!snapShoot.empty) {
        const user: User = snapShoot.docs[0].data() as User;
        if (user.LogOut === true) {
          const deleteUser = async () => {
            await AsyncStorage.removeItem('Role');
            await AsyncStorage.removeItem('Class');
            await AsyncStorage.removeItem('Name');
            await AsyncStorage.removeItem('UserId');
          };
          deleteUser();
        }
      }
    });
};
const Registration = ({navigation}: RegistrationProps) => {
  checkStat();
  if (LoadingScreen(navigation)) {
    return <RegistrationScreen navigation={navigation} />;
  }
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.Light.appBackground,

    flex: 1,
    gap: 20,
    alignContent: 'center',
    justifyContent: 'center',
  },
  incorrectText: {
    color: 'red',

    width: '80%',

    alignSelf: 'center',
    textAlign: 'left',
    fontFamily: 'Mulish',
  },
  input: {
    fontSize: 17,
    fontFamily: 'Mulish',

    backgroundColor: Colors.Light.textInputBackground,
    color: Colors.Light.textPrimary,

    padding: 15,
    width: '80%',

    alignSelf: 'center',

    borderRadius: 10,

    borderWidth: 1,
    borderColor: Colors.Light.lightText,

    elevation: 13,
    shadowColor: Colors.Light.black,
    shadowOffset: {width: 2, height: 5},
    shadowRadius: 1,
  },
  confirmBtn: {
    backgroundColor: Colors.Light.accent,

    padding: 20,

    width: '50%',

    alignSelf: 'center',
    alignItems: 'center',

    borderRadius: 50,
  },
  confirmTxt: {
    fontSize: 17,

    color: Colors.Light.whiteText,
    fontFamily: 'Mulish',
  },
});

export default Registration;
