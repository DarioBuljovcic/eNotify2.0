import {Appearance, StyleSheet, Text, View, useColorScheme} from 'react-native';
import Colors from '../../constants/Color';
import {useTranslation} from 'react-i18next';

export default function About() {
  const isDarkMode = useColorScheme() === 'light';
  const {t} = useTranslation();
  return (
    <View
      style={[
        styles.aboutContainer,
        {
          backgroundColor: isDarkMode
            ? Colors.Light.appBackground
            : Colors.Dark.appBackground,
        },
      ]}>
      <Text
        style={[
          styles.aboutText,
          {
            color:
              Appearance.getColorScheme() === 'light'
                ? Colors.Light.textPrimary
                : Colors.Dark.textPrimary,
          },
        ]}>
        {t('about text')}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  aboutContainer: {
    width: '100%',
    height: '150%',
    padding: 20,

    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    zIndex: 10,
    marginTop: -35,
  },
  aboutText: {
    fontSize: 16,

    marginTop: 5,
    marginHorizontal: 5,
    fontFamily: 'Mulish',
  },
});
