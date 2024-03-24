import {StyleSheet, Text, View, Image, Animated} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import Colors from '../../components/Constants/Color';
import {format} from 'date-fns';
import {NotificationType} from '../../components/Types/indexTypes';
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
  const navigation = useNavigation();
  const [notification, setNotification] = useState<NotificationType>();
  const [images, setImages] = useState<Images[]>([]);
  const animationValue = useRef(new Animated.Value(-110)).current;
  const [message, setMessage] = useState('Slika je uspešno skinuta!');
  const [icon, setIcon] = useState<Icon>({
    name: 'checkmark-circle-outline',
    color: 'green',
  });

  const startAnimation = () => {
    Animated.sequence([
      Animated.timing(animationValue, {
        toValue: -50,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(animationValue, {
        toValue: -110,
        duration: 200,
        useNativeDriver: true,
        delay: 2000,
      }),
    ]).start();
  };

  useEffect(() => {
    const getNotification = async () => {
      //Kod da uzmes podatke za notifikaciju
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
      navigation.setOptions({title: data.Tittle});
      //Kod da uzmes slike
      let imgs: string[] = data.Files.split(',');
      let imgUrls: Images[] = [];
      for (let i = 0; i < imgs.length; i++) {
        const url = await storage().ref(imgs[i]).getDownloadURL();
        imgUrls.push({imageName: imgs[i], imageUrl: url});
      }
      setImages(imgUrls);
    };
    const setSeen = async () => {};
    if (!notification) getNotification();
  });
  useEffect(() => {
    if (!notification) navigation.setOptions({title: ''});
  });

  const downloadImage = async (imageUrl: string, fileName: string) => {
    try {
      const downloadDest = `${RNFS.DownloadDirectoryPath}/${fileName}`;
      const options = {
        fromUrl: imageUrl,
        toFile: downloadDest,
      };
      const exists = await RNFS.exists(downloadDest);
      if (!exists) {
        RNFS.downloadFile(options)
          .promise.then(result => {
            if (result.statusCode === 200) {
              setMessage('Slika je uspešno skinuta!');
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
        setMessage('Slika je već skinuta!');
        setIcon({name: 'alert-circle-outline', color: 'red'});
        startAnimation();
      }
    } catch (error) {
      console.error('Error downloading file:', error);
    }
  };

  //request premission ne radi ali idalje mozes dodavati slike jer ne koristimo ovo ali trebamo popraviti :D
  // const requestStoragePermission = async () => {
  //   try {
  //     const granted = await PermissionsAndroid.request(
  //       PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
  //       {
  //         title: 'Storage Permission Required',
  //         message: 'This app needs access to your storage to download files.',
  //         buttonPositive: 'OK',
  //       },
  //     );
  //     if (granted === PermissionsAndroid.RESULTS.GRANTED) {
  //       console.log('Storage permission granted');
  //       return true;
  //     } else {
  //       console.log('Storage permission denied');
  //       return false;
  //     }
  //   } catch (error) {
  //     console.error('Error requesting storage permission:', error);
  //     return false;
  //   }
  // };

  //funkcija za prikazivanje slike -- trebas malo dorediti style i dodati na klik da se moze skinuti
  const renderImages = () => {
    return (
      <View style={styles.imageContainer}>
        {images.map((image, index) => (
          <TouchableOpacity
            key={index}
            activeOpacity={0.8}
            onPress={() => {
              downloadImage(image.imageUrl, image.imageName);
              //requestStoragePermission();
            }}>
            <View style={styles.imageButton}>
              <Image
                key={index}
                source={{uri: image.imageUrl}}
                style={styles.image}
              />
              <View style={styles.txtContainer}>
                <Text style={styles.txtImageName}>{image.imageName}</Text>
                <Text style={styles.txtClick}>Click to Download</Text>
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
    return <Text style={styles.class}>{studentClass}</Text>;
  };

  return (
    <View style={styles.container}>
      <Animated.View
        style={[styles.message, {transform: [{translateY: animationValue}]}]}>
        <Ionicons name={icon.name} size={24} color={icon.color}></Ionicons>
        <Text style={styles.messageText}>{message}</Text>
      </Animated.View>
      {notification && (
        <>
          <View style={styles.infoContainer}>
            {true && renderClass()}
            <Text style={styles.date}>
              {format(notification.Date.toDate(), 'dd.MM.yyyy')}
            </Text>
          </View>
          <Text style={styles.body}>{notification.Text}</Text>

          {images && renderImages()}
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  body: {
    marginTop: 10,
    fontSize: 18,
    color: Colors.Light.textPrimary,
    marginHorizontal: 15,
    fontFamily: 'Mulish',
  },
  infoContainer: {
    paddingHorizontal: 10,
    paddingVertical: 10,
    flexDirection: 'row',
    borderColor: Colors.Light.textSecondary,
    borderRadius: 0,
    borderBottomWidth: 1.5,
    marginHorizontal: 10,
  },
  date: {
    flex: 1,
    textAlign: 'right',
    color: Colors.Light.textPrimary,
    fontFamily: 'Mulish',
  },
  class: {
    flex: 1,
    color: Colors.Light.textPrimary,
    fontFamily: 'Mulish',
  },
  imageContainer: {
    position: 'absolute',
    bottom: 10,
    width: '100%',
    gap: 10,
    padding: 10,
  },
  imageButton: {
    backgroundColor: Colors.Light.textInputBackground,
    borderRadius: 10,
    padding: 10,
    flexDirection: 'row',

    elevation: 3,
    shadowColor: Colors.Light.black,
    shadowOffset: {width: 2, height: 5},
    shadowRadius: 1,
  },
  image: {
    width: 70,
    height: 70,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.Light.lightText,
  },
  txtContainer: {
    marginLeft: 10,
  },
  txtImageName: {
    color: Colors.Light.hyperlinkText,
    fontSize: 14,
    fontFamily: 'Mulish',
  },
  txtClick: {
    color: Colors.Light.lightText,
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
    backgroundColor: Colors.Light.textInputBackground,
    zIndex: 10,

    borderWidth: 0.5,
    borderRadius: 10,
  },
  messageText: {
    fontSize: 18,
    color: Colors.Light.textSecondary,
  },
});
