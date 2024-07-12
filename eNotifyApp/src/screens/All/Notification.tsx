import {
  StyleSheet,
  Text,
  View,
  Image,
  Animated,
  useColorScheme,
  PermissionsAndroid,
  Dimensions,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import Colors from '../../constants/Color';
import {format} from 'date-fns';
import {NotificationType, Navigation} from '../../constants/Types/indexTypes';
import firestore from '@react-native-firebase/firestore';
import {useEffect, useState, useRef} from 'react';
import storage from '@react-native-firebase/storage';
import {TouchableOpacity} from 'react-native-gesture-handler';
import RNFS from 'react-native-fs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';

type Images = {
  imageUrl: string;
  imageName: string;
};
type Icon = {
  name: string;
  color: string;
};

export default function Obavestenje({route}: any) {
  const isDarkMode = useColorScheme() === 'light';
  const navigation: any = useNavigation();
  const [notification, setNotification] = useState<NotificationType>();
  const [role, setRole] = useState('');
  const [images, setImages] = useState<Images[]>([]);
  const animationValue = useRef(new Animated.Value(-250)).current;
  const [message, setMessage] = useState('Slika je uspešno skinuta!');
  const [shown, setShown] = useState(false);
  const opacity = useRef(new Animated.Value(0)).current;
  const [icon, setIcon] = useState<Icon>({
    name: 'checkmark-circle-outline',
    color: 'green',
  });

  const startAnimation = () => {
    Animated.sequence([
      Animated.timing(animationValue, {
        toValue: -130,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(animationValue, {
        toValue: -250,
        duration: 200,
        useNativeDriver: true,
        delay: 2000,
      }),
    ]).start();
  };

  useEffect(() => {
    const getNotification = async () => {
      //console.log('Gets data');
      const querySnapshot = await firestore()
        .collection('Notifications')
        .where('NotificationId', '==', route.params.id)
        .get();
      const UserdId = await AsyncStorage.getItem('UserId');
      const data = querySnapshot.docs[0].data() as NotificationType;

      if (UserdId && !data.Seen.includes(UserdId)) {
        querySnapshot.docs[0].ref.update({
          Seen: [UserdId, ...data.Seen.split(',')].join(','),
        });
      }

      setNotification(data);

      navigation.setOptions({title: data.Title});

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

  useEffect(() => {
    if (!notification) {
      animationValue.setValue(-250);
      getRole();
      navigation.setOptions({title: ''});
      requestStoragePermission();
    }
  }, []);

  const getRole = async () => {
    const data = await AsyncStorage.getItem('Role');
    if (data) setRole(data);
  };

  const downloadImage = async (imageUrl: string, fileName: string) => {
    try {
      const extention = fileName.split('.')[fileName.split('.').length - 1];
      const directory =
        extention === 'img'
          ? RNFS.PicturesDirectoryPath
          : RNFS.DownloadDirectoryPath;
      const downloadDest = `${directory}/${fileName}`;
      const options = {
        fromUrl: imageUrl,
        toFile: downloadDest,
      };
      const exists = await RNFS.exists(downloadDest);
      if (!exists) {
        RNFS.downloadFile(options)
          .promise.then(result => {
            if (result.statusCode === 200) {
              setMessage(
                extention === 'img'
                  ? 'Image succesfuly downloaded!'
                  : 'FIle succesfuly downloaded!',
              );
              setIcon({name: 'checkmark-circle-outline', color: 'green'});
              startAnimation();
            } else {
              console.log(
                'Failed to download file. Status code:',
                result.statusCode,
              );
            }
          })
          .catch(error => {
            console.error('Error downloading file:', error);
          });
      } else {
        setMessage(
          extention === 'img'
            ? 'Image already downloaded!'
            : 'File already downloaded!',
        );
        setIcon({name: 'alert-circle-outline', color: 'red'});
        startAnimation();
      }
    } catch (error) {
      console.error('Error downloading file:', error);
    }
  };

  //TODO: fix
  const requestStoragePermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        {
          title: 'Storage Permission Required',
          message: 'This app needs access to your storage to download files.',
          buttonPositive: 'OK',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('Storage permission granted');
        return true;
      } else {
        console.log('Storage permission denied');
        return false;
      }
    } catch (error) {
      console.error('Error requesting storage permission:', error);
      return false;
    }
  };

  const [shownImage, setShownImage] = useState<Images>({
    imageUrl: '',
    imageName: '',
  });

  const openImage = (image: any) => {
    setShownImage(image);
    setShown(true);
    Animated.sequence([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const closeImage = () => {
    Animated.sequence([
      Animated.timing(opacity, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const renderImages = () => {
    return (
      <View style={styles.imageContainer}>
        {images.map((image, index) => (
          <TouchableOpacity
            key={index}
            activeOpacity={0.8}
            onPress={() => {
              openImage(image);
              // downloadImage(image.imageUrl, image.imageName);
            }}>
            <View
              style={[
                styles.imageButton,
                {
                  backgroundColor: isDarkMode
                    ? Colors.Light.textInputBackground
                    : Colors.Dark.textInputBackground,
                },
              ]}>
              <View>
                <Image
                  key={index}
                  source={{uri: image.imageUrl}}
                  style={[
                    styles.image,
                    {
                      borderColor: isDarkMode
                        ? Colors.Light.lightText
                        : Colors.Dark.lightText,
                    },
                  ]}
                />
              </View>
              <View style={styles.txtContainer}>
                <Text
                  style={[
                    styles.txtImageName,
                    {
                      color: isDarkMode
                        ? Colors.Light.hyperlinkText
                        : Colors.Dark.hyperlinkText,
                    },
                  ]}>
                  {image.imageName}
                </Text>
                <Text
                  style={[
                    styles.txtClick,
                    {
                      color: isDarkMode
                        ? Colors.Light.lightText
                        : Colors.Dark.lightText,
                    },
                  ]}>
                  Click to Download
                </Text>
              </View>
            </View>
          </TouchableOpacity>
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
            color: isDarkMode
              ? Colors.Light.textSecondary
              : Colors.Dark.textSecondary,
          },
        ]}>
        {studentClass}
      </Text>
    );
  };

  return (
    <>
      <Animated.View
        style={[styles.modal, {opacity}, {display: shown ? 'flex' : 'none'}]}>
        <TouchableOpacity
          style={styles.closeImage}
          onPress={() => {
            closeImage();
            setTimeout(() => {
              setShown(false);
            }, 300);
          }}>
          <Ionicons
            size={40}
            color={Colors.Dark.white}
            name="close-outline"></Ionicons>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.downloadImage}
          onPress={() =>
            downloadImage(shownImage.imageUrl, shownImage.imageName)
          }>
          <Ionicons
            size={35}
            color={Colors.Dark.white}
            name="download-outline"></Ionicons>
        </TouchableOpacity>
        <Image source={{uri: shownImage?.imageUrl}} style={styles.modalImage} />
      </Animated.View>
      <Animated.View
        style={[
          styles.message,
          {
            backgroundColor: isDarkMode
              ? Colors.Light.textInputBackground
              : Colors.Dark.textInputBackground,
          },
          {transform: [{translateY: animationValue}]},
        ]}>
        <Ionicons name={icon.name} size={24} color={icon.color}></Ionicons>
        <Text
          style={[
            styles.messageText,
            {
              color: isDarkMode
                ? Colors.Light.textSecondary
                : Colors.Dark.textSecondary,
            },
          ]}>
          {message}
        </Text>
      </Animated.View>
      <View
        style={[
          styles.container,
          {
            backgroundColor: isDarkMode
              ? Colors.Light.appBackground
              : Colors.Dark.appBackground,
          },
        ]}>
        {notification && (
          <>
            <View
              style={[
                styles.infoContainer,
                {
                  borderColor: isDarkMode
                    ? Colors.Light.textSecondary
                    : Colors.Dark.textSecondary,
                },
              ]}>
              {true && renderClass()}
              <Text
                style={[
                  styles.date,
                  {
                    color: isDarkMode
                      ? Colors.Light.textSecondary
                      : Colors.Dark.textSecondary,
                  },
                ]}>
                {format(notification.Date.toDate(), 'dd.MM.yyyy')}
              </Text>
            </View>
            {role === 'Professor' && (
              <TouchableOpacity
                style={styles.seen}
                onPress={() =>
                  navigation.navigate('NotificationViewrs', {
                    Seen: notification.Seen,
                    Class: notification.Class,
                  })
                }>
                <Ionicons
                  name={'eye-outline'}
                  size={28}
                  color={
                    isDarkMode
                      ? Colors.Light.textSecondary
                      : Colors.Dark.textSecondary
                  }></Ionicons>
              </TouchableOpacity>
            )}
            <Text
              style={[
                styles.body,
                {
                  color: isDarkMode
                    ? Colors.Light.textPrimary
                    : Colors.Dark.textPrimary,
                },
              ]}>
              {notification.Text}
            </Text>
            <Text
              style={[
                styles.sender,
                {
                  color: isDarkMode
                    ? Colors.Light.lightText
                    : Colors.Dark.lightText,
                },
              ]}>
              {notification.From}
            </Text>
            {/* TODO scrolable */}
            {images && renderImages()}
          </>
        )}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    zIndex: 10,
    marginTop: -35,

    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
  },

  body: {
    marginTop: 40,
    fontSize: 18,

    marginHorizontal: 15,
    fontFamily: 'Mulish',
  },

  infoContainer: {
    marginTop: 10,
    paddingHorizontal: 10,
    paddingVertical: 10,
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
    position: 'absolute',
    bottom: 10,
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

  message: {
    flex: 1,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 5,

    alignSelf: 'center',

    width: '90%',
    height: 50,
    position: 'absolute',

    zIndex: 120,
    borderWidth: 0.5,
    borderRadius: 10,
  },

  messageText: {
    fontSize: 18,
  },

  seen: {
    width: 30,
    height: 30,
    position: 'absolute',
    right: 15,
    top: 10,
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
    top: -160,
    left: 0,

    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height + 10,

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
