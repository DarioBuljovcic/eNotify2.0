import firestore from '@react-native-firebase/firestore';
import {User} from '../constants/Types/indexTypes';

export default async function getUsers(Class) {
  const stud = await firestore()
    .collection('Users')
    .where('Class', '==', Class)
    .where('Role', '==', 'Student')
    .get();
  let data: User[] = [];
  stud.docs.forEach(s => {
    data.push(s.data() as User);
  });

  return [...data].sort((a, b) =>
    a.Name.split(' ')[1].localeCompare(b.Name.split(' ')[1]),
  );
}
