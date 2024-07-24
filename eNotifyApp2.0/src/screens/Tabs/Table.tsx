import {
  Dimensions,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import Colors from '../../constants/Color';
import Zoom from 'react-native-zoom-reanimated';
import storage from '@react-native-firebase/storage';
import firestore from '@react-native-firebase/firestore';
import RNFS from 'react-native-fs';
import {useGlobalContext} from '../../context/GlobalProvider';
import translations from '../../constants/i18n/translations/translation';
import {TranslatedText} from '../../hooks/getTranslation.tsx';

export default function Table() {
  const {isDarkMode, user} = useGlobalContext();
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [tableCheck, setTableCheck] = useState(false);
  const screenWidth = Dimensions.get('window').width;

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
      setTableCheck(false);
      if (user?.Role === 'Student') {
        await firestore()
          .collection('Classes')
          .where('Class', '==', user.Class)
          .onSnapshot(async snapshot => {
            try {
              const uri = await loadImage(snapshot.docs[0].data().Table);
              if (uri !== 'file:///data/user/0/com.enotifyapp/files/') {
                setTableCheck(true);
                setImageUrl(uri);
              }
            } catch {
              setTableCheck(false);
              console.log('s');
            }
          });
      } else if (user?.Role === 'Professor') {
        await firestore()
          .collection('Users')
          .where('UserID', '==', user.UserID)
          .onSnapshot(async snapshot => {
            try {
              const uri = await loadImage(snapshot.docs[0].data().Table);
              if (uri !== 'file:///data/user/0/com.enotifyapp/files/') {
                setTableCheck(true);
                setImageUrl(uri);
              }
            } catch {
              setTableCheck(false);
              console.log('s');
            }
          });
      }
    };
    func();
  }, []);

  return (
    <SafeAreaView style={{zIndex: 100}}>
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
                width: screenWidth,
                height: (100 * screenWidth) / 100,
              }}
            />
          ) : (
            <TranslatedText
              value={translations.noTable}
              style={{
                color: isDarkMode.textPrimary,
                fontFamily: 'Mulish',
              }}
            />
          )}
        </Zoom>
      </View>
    </SafeAreaView>
  );
}

const screenHeight = Dimensions.get('window').height;

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    height: screenHeight,
  },
});
