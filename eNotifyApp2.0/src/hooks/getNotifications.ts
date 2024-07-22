import firestore from '@react-native-firebase/firestore';
import { getNotificationProps, NotificationType } from '../constants/Types/indexTypes';

export default async function getData({ role, userClass, userId }: getNotificationProps): Promise<NotificationType[]> {
  const subscriptions = ['Prvi', 'Drugi', 'Treci', 'Cetvrti'];
  let notifications: NotificationType[] = [];

  try {
    if (role === 'Student') {
      const snapshot = await firestore()
        .collection('Notifications')
        .where('Class', 'array-contains-any', [
          userClass,
          subscriptions[parseInt(userClass.slice(0, 1)) - 1],
          'Svi',
        ])
        .get();
        
      const data: NotificationType[] = snapshot.docs.map(doc => ({
        id: doc.id,
        ...(doc.data() as NotificationType),
      }));
      
      notifications = data.sort((a, b) => Number(b.Date) - Number(a.Date));
    } else {
      const snapshot = await firestore()
        .collection('Notifications')
        .where('Class', 'array-contains', userClass)
        .where('From', '==', userId)
        .get();
      const data: NotificationType[] = snapshot.docs.map(doc => ({
        id: doc.id,
        ...(doc.data() as NotificationType),
      }));
      
      notifications = data.sort((a, b) => Number(b.Date) - Number(a.Date));
    }
  } catch (error) {
    console.error('Error fetching notifications:', error);
  }

  return notifications;
}
