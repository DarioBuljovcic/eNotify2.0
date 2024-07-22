import storage  from '@react-native-firebase/storage';
import { NotificationType, sendNotificationProps } from '../constants/Types/indexTypes';
import  firestore from '@react-native-firebase/firestore';
import axios from 'axios';


const generateID = (length: number) => {
    const charset =
      'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let ID = '';
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * charset.length);
      ID += charset[randomIndex];
    }
    return ID;
  };


const sendNotification = async ({TextValue,TitleValue,selectedFile,selectedClass,Name}:sendNotificationProps) => {

    if (TextValue !== '' && TitleValue !== '') {
      if (selectedFile) {
        const reference = storage().ref(selectedFile?.name as string);

        const pathToFile = `file://${decodeURIComponent(
          selectedFile.fileCopyUri as string,
        )}`;

        await reference.putFile(pathToFile);
      }

      const data: NotificationType = {
        NotificationId: generateID(7),
        Title: TitleValue,
        Text: TextValue,
        Class: [selectedClass],
        Type: 'T',
        Files: selectedFile ? selectedFile.name as string : '',
        Date: new Date(),
        Seen: '',
        From: Name,
      };

      const sendData = async () => {
        try {
          const response = await axios.post(
            'http://enotifyserver2.netlify.app/.netlify/functions/api/data',
            data,
          );
        } catch (error) {
          console.error('Error sending data:', error);
        }
      };

      sendData();

      firestore().collection('Notifications').add(data);

      
    }
  };

  export default sendNotification;