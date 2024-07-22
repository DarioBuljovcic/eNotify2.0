import {Dimensions, Image, StyleSheet, TouchableOpacity} from 'react-native';
import React from 'react';
import Animated, {FadeIn, FadeOut} from 'react-native-reanimated';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Colors from '../constants/Color';
import RNFS from 'react-native-fs';
import {OpenImageProps} from '../constants/Types/indexTypes';
import {useTranslation} from 'react-i18next';

const OpenImage = ({
  setShown,
  setMessage,
  setIcon,
  shownImage,
  shown,
  setModalOpen,
}: OpenImageProps) => {
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
              setIcon({name: 'checkmark-circle-outline', color: 'green'});
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
        setIcon({name: 'alert-circle-outline', color: 'red'});
        setModalOpen(true);
        setTimeout(() => {
          setModalOpen(false);
        }, 2000);
      }
    } catch (error) {
      console.error('Error downloading file:', error);
    }
  };
  if (shown)
    return (
      <Animated.View
        entering={FadeIn}
        exiting={FadeOut}
        style={[styles.modal, {opacity: 1}]}>
        <TouchableOpacity
          style={styles.closeImage}
          onPress={() => setShown(false)}>
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
    );
  else return <></>;
};

export default OpenImage;

const styles = StyleSheet.create({
  modal: {
    zIndex: 110,

    position: 'absolute',
    top: '-7.1%',
    left: 0,

    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,

    backgroundColor: 'rgba(000, 0, 0, 0.8)',

    padding: 20,
  },
  closeImage: {
    position: 'absolute',
    top: 0,
    right: 0,
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
