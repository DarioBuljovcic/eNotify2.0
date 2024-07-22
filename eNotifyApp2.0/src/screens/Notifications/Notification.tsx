import {
  StyleSheet,
  Text,
  View,
  Image,
  Animated,
  useColorScheme,
  PermissionsAndroid,
  Dimensions,
  ScrollView,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import Colors from '../../constants/Color';
import {format} from 'date-fns';
import {
  NotificationType,
  Navigation,
  Images,
  Icon,
} from '../../constants/Types/indexTypes';
import firestore from '@react-native-firebase/firestore';
import {useEffect, useState, useRef} from 'react';
import storage from '@react-native-firebase/storage';
import {useGlobalContext} from '../../context/GlobalProvider';
import NotificationSeen from '../../components/NotificationSeen';
import ImageModal from '../../components/ImageModal';
import OpenImage from '../../components/OpenImage';
import SmallImage from '../../components/SmallImage';

export default function Notification({route}: any) {
  const {isDarkMode, user} = useGlobalContext();
  const navigation: any = useNavigation();
  const [notification, setNotification] = useState<NotificationType>();

  const [images, setImages] = useState<Images[]>([]);
  const [message, setMessage] = useState('Slika je uspešno skinuta!');
  const [shown, setShown] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [icon, setIcon] = useState<Icon>({
    name: 'checkmark-circle-outline',
    color: 'green',
  });

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
        const url = await storage().ref(imgs[i]).getDownloadURL();
        imgUrls.push({imageName: imgs[i], imageUrl: url});
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
    <>
      <OpenImage
        shown={shown}
        shownImage={shownImage}
        setShown={setShown}
        setIcon={setIcon}
        setMessage={setMessage}
        setModalOpen={setModalOpen}
      />
      <ImageModal message={message} icon={icon} shown={modalOpen} />
      <View
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
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    zIndex: 10,
    paddingHorizontal: 10,
    height: '100%',
    backgroundColor: 'red',
    overflow: 'hidden',
  },
  content: {
    minHeight: Dimensions.get('window').height - 80,
    position: 'relative',
    paddingBottom: 200,
  },
  body: {
    marginTop: 40,
    fontSize: 18,

    marginHorizontal: 15,
    fontFamily: 'Mulish',
  },
  title: {
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
    position: 'absolute',
    bottom: 0,
    width: '100%',
    padding: 10,
    gap: 10,
  },
  imageButton: {
    borderRadius: 10,
    padding: 10,

    flexDirection: 'row',
    elevation: 3,
    shadowColor: Colors.Light.black,
    shadowOffset: {width: 2, height: 5},
    shadowRadius: 1,
  },
  image: {
    height: 70,
    width: 70,
    borderRadius: 10,
    borderWidth: 1,
  },
  txtContainer: {
    marginLeft: 10,
  },
  txtImageName: {
    fontSize: 14,
    fontFamily: 'Mulish',
  },
  txtClick: {
    fontSize: 11,
    fontFamily: 'Mulish',
  },

  sender: {
    marginTop: 5,
    fontSize: 12,

    marginHorizontal: 15,
    fontFamily: 'Mulish',
  },
  modal: {
    zIndex: 110,

    position: 'absolute',
    top: -70,
    left: 0,

    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height - 20,

    backgroundColor: 'rgba(000, 0, 0, 0.8)',

    padding: 20,
  },
  closeImage: {
    position: 'absolute',
    top: 0,
    right: -10,
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  downloadImage: {
    position: 'absolute',
    top: 0,
    right: 40,
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  modalImage: {
    height: '90%',
    width: '95%',
    alignSelf: 'center',
    top: '10%',
    borderRadius: 10,
  },
});
