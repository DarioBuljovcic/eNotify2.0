// firestoreHelpers.ts
import firestore from '@react-native-firebase/firestore';
import {NotificationType} from '../constants/Types/indexTypes';

export const fetchNotifications = async (
  role: string,
  userClass: string,
  userId: string,
  setNotifications: (o: NotificationType[]) => void,
) => {
  const subscriptions = ['Prvi', 'Drugi', 'Treci', 'Cetvrti'];
  let snapshot;

  if (role === 'Student') {
    snapshot = await firestore()
      .collection('Notifications')
      .where('Class', 'array-contains-any', [
        userClass,
        subscriptions[parseInt(userClass.slice(0, 1)) - 1],
        'Svi',
      ])
      .onSnapshot(snapshot => {
        const data = sortNotificationsByDate(
          snapshot.docs.map(doc => ({
            id: doc.id,
            ...(doc.data() as NotificationType),
          })),
        );
        setNotifications(data);
      });
  } else {
    snapshot = await firestore()
      .collection('Notifications')
      .where('Class', 'array-contains', userClass)
      .where('From', '==', userId)
      .onSnapshot(snapshot => {
        const data = sortNotificationsByDate(
          snapshot.docs.map(doc => ({
            id: doc.id,
            ...(doc.data() as NotificationType),
          })),
        );
        setNotifications(data);
      });
  }
};

const sortNotificationsByDate = (
  notifications: NotificationType[],
): NotificationType[] => {
  return notifications.sort((a, b) => Number(b.Date) - Number(a.Date));
};
