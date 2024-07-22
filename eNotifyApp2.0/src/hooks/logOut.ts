import {CommonActions} from '@react-navigation/native';
import messaging from '@react-native-firebase/messaging';
import { logOutProps } from '../constants/Types/indexTypes';

export default function logOut({navigation, User}: logOutProps) {
  navigation.navigate('Registration');
  navigation.dispatch(
    CommonActions.reset({
      index: 0,
      routes: [{name: 'Registration'}],
    }),
  );
  messaging().unsubscribeFromTopic('Svi');

  if (User.Role !== 'Professor') {
    messaging().unsubscribeFromTopic('Prvi');
    messaging().unsubscribeFromTopic('Drug');
    messaging().unsubscribeFromTopic('Treci');
    messaging().unsubscribeFromTopic('Cetvrti');
    messaging().unsubscribeFromTopic(User.Class);
  }
}
