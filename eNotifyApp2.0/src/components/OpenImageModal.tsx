import {
  Dimensions,
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useState} from 'react';
import Animated, {FadeIn, FadeOut} from 'react-native-reanimated';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Colors from '../constants/Color';
import RNFS from 'react-native-fs';
import {Icon, OpenImageProps} from '../constants/Types/indexTypes';
import {useTranslation} from 'react-i18next';
import ImageModal from './ImageModal';

const OpenImageModal = ({navigation, route}: any) => {
  const [message, setMessage] = useState('Slika je uspešno skinuta!');
  const [modalOpen, setModalOpen] = useState(false);
  const [icon, setIcon] = useState<Icon>({
    name: 'checkmark-circle-outline',
    color: Colors.Light.green,
  });

  console.log('img: ' + route.params.shownImage);
  const {t} = useTranslation();
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
                ['img', 'jpg', 'jpeg', 'png'].includes(extention)
                  ? t('image downloaded')
                  : t('file downloaded'),
              );
              setIcon({
                name: 'checkmark-circle-outline',
                color: Colors.Light.green,
              });
              setModalOpen(true);
              setTimeout(() => {
                setModalOpen(false);
              }, 2000);
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
          ['img', 'jpg', 'jpeg', 'png'].includes(extention)
            ? t('image exists')
            : t('file exists'),
        );
        setIcon({name: 'alert-circle-outline', color: Colors.Light.warningRed});
        setModalOpen(true);
        setTimeout(() => {
          setModalOpen(false);
        }, 2000);
      }
    } catch (error) {
      console.error('Error downloading file:', error);
    }
  };
  const ImageFile = () => {
    if (
      /\.(jpg|jpeg|png|gif|bmp|svg|webp|tiff)$/i.test(
        route.params.shownImage?.imageName,
      )
    )
      return (
        <Image
          source={{uri: route.params.shownImage?.imageUrl}}
          style={styles.modalImage}
        />
      );
    else
      return (
        <Ionicons
          size={360}
          name="document-outline"
          color={Colors.Light.white}
          style={{alignSelf: 'center', marginTop: '55%'}}></Ionicons>
      );
  };
  return (
    <Animated.View
      entering={FadeIn}
      exiting={FadeOut}
      style={[styles.modal, {opacity: 1}]}>
      <ImageModal message={message} icon={icon} shown={modalOpen} />
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.downloadImage}
          onPress={() => {
            downloadImage(
              route.params.shownImage.imageUrl,
              route.params.shownImage.imageName,
            );
          }}>
          <Ionicons
            size={35}
            color={Colors.Dark.white}
            name="download-outline"></Ionicons>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.closeImage}
          onPress={() => navigation.goBack()}>
          <Ionicons
            size={40}
            color={Colors.Dark.white}
            name="close-outline"></Ionicons>
        </TouchableOpacity>
      </View>
      {ImageFile()}
    </Animated.View>
  );
};

export default OpenImageModal;

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

const styles = StyleSheet.create({
  modal: {
    zIndex: 110,
    width: screenWidth,
    height: screenHeight,
    backgroundColor: 'rgba(000, 0, 0, 0.8)',
    padding: 20,
  },
  buttonContainer: {flexDirection: 'row', alignSelf: 'flex-end'},
  closeImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  downloadImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  modalImage: {
    height: '90%',
    width: '95%',
    alignSelf: 'center',
    borderRadius: 10,
    marginTop: 20,
  },
});
