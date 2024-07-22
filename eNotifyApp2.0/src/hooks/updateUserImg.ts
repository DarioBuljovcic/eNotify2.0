import firestore from '@react-native-firebase/firestore';
export default async function updateUserImg(userID: string, name: string) {
  console.log('aaaaaaaa');
  const userSnapshot = await firestore()
    .collection('Users')
    .where('UserID', '==', userID)
    .get();
  console.log(name);
  if (!userSnapshot.empty) {
    const userDoc = userSnapshot.docs[0];
    await firestore().collection('Users').doc(userDoc.id).update({
      profile_picture: name,
    });
  }
}
