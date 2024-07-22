import firestore from '@react-native-firebase/firestore';

export default async function  loginUser  (password:string){
    let User = null;
    const query = await firestore()
    .collection('Users')
    .where('UserID', '==', password)
    .get().then((snapshot)=>{
        if(snapshot.docs[0])
           User = snapshot.docs[0].data();
    });
    return User;
}