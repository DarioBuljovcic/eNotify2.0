import firestore from '@react-native-firebase/firestore';
import messaging from '@react-native-firebase/messaging';
import {User} from '../constants/Types/indexTypes';

export default async function loginUser(password: string) {
  let User: User | null = null;
  const subscriptions = ['Prvi', 'Drugi', 'Treci', 'Cetvrti'];
  const query = await firestore()
    .collection('Users')
    .where('UserID', '==', password)
    .get()
    .then(snapshot => {
      if (snapshot.docs[0]) User = snapshot.docs[0].data() as User;
      if (User !== null) {
        messaging().subscribeToTopic('Svi');

        if (User.Role !== 'Professor') {
          messaging().subscribeToTopic(
            subscriptions[parseInt(User.Class.slice(0, 1)[0]) - 1],
          );

          messaging().subscribeToTopic(User.Class);
          console.log(User.Class);
        }
      }
    });
  return User;
}
