import firestore from '@react-native-firebase/firestore';
export default async function getImage(userID: string) {
  const querySnapshot = await firestore()
    .collection('Users')
    .where('UserID', '==', userID)
    .get();
  return querySnapshot;
}
