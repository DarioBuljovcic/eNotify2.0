import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  View,
  useColorScheme,
} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import Colors from '../../constants/Color';
import Zoom from 'react-native-zoom-reanimated';
import storage from '@react-native-firebase/storage';
import firestore from '@react-native-firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RNFS from 'react-native-fs';
import {useFocusEffect} from '@react-navigation/native';
import {t} from 'i18next';
import {useGlobalContext} from '../../context/GlobalProvider';

export default function Table() {
  const {isDarkMode, user} = useGlobalContext();
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [tableCheck, setTableCheck] = useState(false);

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

  useEffect(() => {}, []);

  useFocusEffect(
    useCallback(() => {
      const func = async () => {
        setTableCheck(false);
        console.log(tableCheck);
        if (user?.Role === 'Student') {
          const querySnapshot = await firestore()
            .collection('Classes')
            .where('Class', '==', user.Class)
            .get();

          try {
            const uri = await loadImage(querySnapshot.docs[0].data().Table);
            if (uri !== 'file:///data/user/0/com.enotifyapp/files/') {
              setTableCheck(true);
              setImageUrl(uri);
            }
          } catch {
            setTableCheck(false);
            console.log('s');
          }
        } else if (user?.Role === 'Professor') {
          const querySnapshot = await firestore()
            .collection('Users')
            .where('UserID', '==', user.UserID)
            .get();
          try {
            const uri = await loadImage(querySnapshot.docs[0].data().Table);
            if (uri !== 'file:///data/user/0/com.enotifyapp/files/') {
              setTableCheck(true);
              setImageUrl(uri);
            }
          } catch {
            setTableCheck(false);
          }
        }
      };
      func();
    }, []),
  );

  return (
    <View style={{zIndex: 100}}>
      <View
        style={[
          styles.container,
          {
            backgroundColor: isDarkMode.appBackground,
          },
        ]}>
        <Zoom>
          {tableCheck ? (
            <Image
              source={{uri: imageUrl}}
              resizeMode="contain"
              style={{
                backgroundColor: Colors.Light.appBackground,
                width: Dimensions.get('window').width,
                height: (100 * Dimensions.get('window').width) / 100,
              }}
            />
          ) : (
            <Text
              style={{
                color: isDarkMode.textPrimary,
                fontFamily: 'Mulish',
              }}>
              {t('no table')}
            </Text>
          )}
        </Zoom>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    height: Dimensions.get('window').height,
  },
});
