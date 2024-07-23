import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React from 'react';
import {useGlobalContext} from '../context/GlobalProvider';
import Colors from '../constants/Color';
import {SmallImageProps} from '../constants/Types/indexTypes';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {t} from 'i18next';

const SmallImage = ({image, index, handleOpen}: SmallImageProps) => {
  const {isDarkMode} = useGlobalContext();
  const ImageFile = () => {
    if (/\.(jpg|jpeg|png|gif|bmp|svg|webp|tiff)$/i.test(image.imageName))
      return (
        <Image
          key={index}
          source={{uri: image.imageUrl}}
          style={[
            styles.image,
            {
              borderColor: isDarkMode.lightText,
            },
          ]}
        />
      );
    else
      return (
        <Ionicons
          size={60}
          name="document-outline"
          color={isDarkMode.textPrimary}></Ionicons>
      );
  };
  return (
    <TouchableOpacity key={index} activeOpacity={0.8} onPress={handleOpen}>
      <View
        style={[
          styles.imageButton,
          {
            backgroundColor: isDarkMode.textInputBackground,
          },
        ]}>
        <View>{ImageFile()}</View>
        <View style={styles.txtContainer}>
          <Text
            numberOfLines={1}
            style={[
              styles.txtImageName,
              {
                color: isDarkMode.hyperlinkText,
              },
            ]}>
            {image.imageName}
          </Text>
          <Text
            style={[
              styles.txtClick,
              {
                color: isDarkMode.lightText,
              },
            ]}>
            {t('download')}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default SmallImage;

const styles = StyleSheet.create({
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
    maxWidth: Dimensions.get('screen').width / 1.5,
  },
  txtClick: {
    fontSize: 11,
    fontFamily: 'Mulish',
  },
});
