import {
  Dimensions,
  Image,
  StyleSheet,
  View,
  useColorScheme,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import Colors from '../../constants/Color';
import Zoom from 'react-native-zoom-reanimated';
import storage from '@react-native-firebase/storage';
import firestore from '@react-native-firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RNFS from 'react-native-fs';

export default function TimeTable() {
  const isDarkMode = useColorScheme() === 'light';
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  const downloadAndSaveImage = async (
    imageName: string,
  ): Promise<string | null> => {
    const storageRef = storage().ref(imageName);
    const localPath = `${RNFS.DocumentDirectoryPath}/${imageName}`;

    try {
      const url = await storageRef.getDownloadURL();
      const downloadResult = await RNFS.downloadFile({
        fromUrl: url,
        toFile: localPath,
      }).promise;

      if (downloadResult.statusCode === 200) {
        return localPath;
      } else {
        console.error('Error downloading image:', downloadResult);
        return null;
      }
    } catch (error) {
      console.error('Error getting download URL or saving image:', error);
      return null;
    }
  };

  const loadImage = async (imageName: string): Promise<string | null> => {
    const localPath = `${RNFS.DocumentDirectoryPath}/${imageName}`;

    const fileExists = await RNFS.exists(localPath);

    if (fileExists) {
      return `file://${localPath}`;
    } else {
      const downloadedPath = await downloadAndSaveImage(imageName);
      return downloadedPath ? `file://${downloadedPath}` : null;
    }
  };

  useEffect(() => {
    const func = async () => {
      const myClass = await AsyncStorage.getItem('Class');

      const querySnapshot = await firestore()
        .collection('Classes')
        .where('Class', '==', myClass)
        .get();

      const uri = await loadImage(querySnapshot.docs[0].data().Table);
      setImageUrl(uri);
    };
    func();
  }, []);

  return (
    <View style={{marginTop: -35, zIndex: 100}}>
      <View
        style={[
          styles.container,
          {
            backgroundColor: isDarkMode
              ? Colors.Light.appBackground
              : Colors.Dark.appBackground,
          },
        ]}>
        <Zoom>
          <Image
            source={{uri: imageUrl}}
            resizeMode="contain"
            style={{
              backgroundColor: isDarkMode
                ? Colors.Light.white
                : Colors.Dark.white,
              width: Dimensions.get('window').width,
              height: (100 * Dimensions.get('window').width) / 100,
            }}
          />
        </Zoom>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    overflow: 'hidden',
    height: Dimensions.get('window').height / 1.2,
  },
});
