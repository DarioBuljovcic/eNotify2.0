
import  firestore  from '@react-native-firebase/firestore';
import { Class } from "../constants/Types/indexTypes";

  const getProfessorClasses = async (userId:string) => {
    const data = await firestore().collection('Classes').get();

    let classes: Class[] = [];
    data.docs.forEach(doc => {
      classes.push(doc.data() as Class);
    });
    return classes.filter(obj => obj.ProfessorsList.includes(userId))
  };
  export default getProfessorClasses