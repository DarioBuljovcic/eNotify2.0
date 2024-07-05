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

export default function TimeTable() {
  const isDarkMode = useColorScheme() === 'light';
  const [url, setUrl] = useState('');

  useEffect(() => {
    const func = async () => {
      const myClass = await AsyncStorage.getItem('Class');

      const querySnapshot = await firestore()
        .collection('Classes')
        .where('Class', '==', myClass)
        .get();

      const imageUrl = await storage()
        .ref(querySnapshot.docs[0].data().Table)
        .getDownloadURL();

      if (imageUrl) setUrl(imageUrl);
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
            source={{uri: url}}
            resizeMode="contain"
            style={{
              backgroundColor: isDarkMode
                ? Colors.Light.white
                : Colors.Dark.accentGreen,
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
