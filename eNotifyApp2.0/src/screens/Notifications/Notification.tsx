import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import Colors from '../../constants/Color';
import {format} from 'date-fns';
import {NotificationType, Images} from '../../constants/Types/indexTypes';
import firestore from '@react-native-firebase/firestore';
import {useEffect, useState, useRef} from 'react';
import storage from '@react-native-firebase/storage';
import {useGlobalContext} from '../../context/GlobalProvider';
import NotificationSeen from '../../components/NotificationSeen';

import SmallImage from '../../components/SmallImage';

export default function Notification({route}: any) {
  const {isDarkMode, user} = useGlobalContext();
  const navigation: any = useNavigation();
  const [notification, setNotification] = useState<NotificationType>();

  const [images, setImages] = useState<Images[]>([]);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const getNotification = async () => {
      const querySnapshot = await firestore()
        .collection('Notifications')
        .where('NotificationId', '==', route.params.id)
        .get();

      const data = querySnapshot.docs[0].data() as NotificationType;

      if (user?.UserID && !data.Seen.includes(user?.UserID)) {
        querySnapshot.docs[0].ref.update({
          Seen: [user?.UserID, ...data.Seen.split(',')].join(','),
        });
      }

      setNotification(data);

      //Getting images

      let imgs: string[] = data.Files.split(',');
      let imgUrls: Images[] = [];
      for (let i = 0; i < imgs.length; i++) {
        try {
          const url = await storage()
            .ref(imgs[i].trimEnd().trimStart())
            .getDownloadURL();

          imgUrls.push({
            imageName: imgs[i].trimEnd().trimStart(),
            imageUrl: url.trimEnd().trimStart(),
          });
        } catch (error) {}
      }

      setImages(imgUrls);
    };

    getNotification();
  }, [route.params.id]);

  const [shownImage, setShownImage] = useState<Images>({
    imageUrl: '',
    imageName: '',
  });
  const handleOpen = (image: Images) => {
    setShownImage(image);
    setShown(true);
    console.log(image);
    navigation.navigate('OpenImageModal', {
      shownImage: image,
      shown: shown,
      navigation: navigation,
    });
  };
  const renderImages = () => {
    return (
      <View style={styles.imageContainer}>
        {images.map((image, index) => (
          <SmallImage
            image={image}
            index={index}
            handleOpen={() => handleOpen(image)}
          />
        ))}
      </View>
    );
  };

  const renderClass = () => {
    let studentClass;
    switch (notification?.Class) {
      case 'Svi':
        studentClass = 'Opšto';
        break;
      case 'Prvi':
        studentClass = 'Prvi razredi';
        break;
      case 'Drugi':
        studentClass = 'Drugi razredi';
        break;
      case 'Treci':
        studentClass = 'Treći razredi';
        break;
      case 'Cetvrti':
        studentClass = 'Četvrti razredi';
        break;
      default:
        studentClass = notification?.Class;
        break;
    }
    return (
      <Text
        style={[
          styles.class,
          {
            color: isDarkMode.textSecondary,
          },
        ]}>
        {studentClass}
      </Text>
    );
  };

  return (
    <SafeAreaView
      style={[
        styles.container,
        {
          backgroundColor: isDarkMode.appBackground,
        },
      ]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {notification && (
          <View style={styles.content}>
            <Text
              style={[styles.title, {color: isDarkMode.textPrimary}]}
              numberOfLines={1}
              ellipsizeMode="tail">
              {notification.Title}
            </Text>

            <View
              style={[
                styles.infoContainer,
                {
                  borderColor: isDarkMode.textSecondary,
                },
              ]}>
              {true && renderClass()}
              <Text
                style={[
                  styles.date,
                  {
                    color: isDarkMode.textSecondary,
                  },
                ]}>
                {format(notification.Date.toDate(), 'dd.MM.yyyy')}
              </Text>
            </View>
            {user?.Role === 'Professor' && (
              <NotificationSeen
                navigation={navigation}
                notification={notification}
              />
            )}
            <Text
              style={[
                styles.body,
                {
                  color: isDarkMode.textPrimary,
                },
              ]}>
              {notification.Text}
            </Text>
            <Text
              style={[
                styles.sender,
                {
                  color: isDarkMode.lightText,
                },
              ]}>
              {notification.From}
            </Text>
            {/* TODO scrolable */}
            {images && renderImages()}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const screenHeight = Dimensions.get('window').height;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    zIndex: 10,
    paddingHorizontal: 10,
    height: '100%',
    overflow: 'hidden',
  },
  content: {
    minHeight: screenHeight - 80,
    position: 'relative',
    paddingBottom: 200,
  },
  body: {
    marginTop: 20,
    fontSize: 18,
    marginHorizontal: 15,
    fontFamily: 'Mulish',
  },
  title: {
    fontFamily: 'Mulish',
    paddingHorizontal: 10,
    marginBottom: 10,
    fontSize: 30,
  },
  infoContainer: {
    marginTop: 10,
    flexDirection: 'row',
    borderRadius: 0,
    borderBottomWidth: 0.8,
    marginHorizontal: 10,
  },
  date: {
    flex: 1,
    textAlign: 'right',
    fontFamily: 'Mulish',
  },
  class: {
    flex: 1,
    fontFamily: 'Mulish',
  },
  imageContainer: {
    marginVertical: 15,
    width: '100%',
    padding: 10,
    gap: 10,
  },

  sender: {
    marginTop: 5,
    fontSize: 12,
    marginHorizontal: 15,
    fontFamily: 'Mulish',
  },
});
