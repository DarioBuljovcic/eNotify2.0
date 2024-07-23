import {Appearance, StyleSheet, Text, View} from 'react-native';
import {useTranslation} from 'react-i18next';
import {useGlobalContext} from '../../context/GlobalProvider';

export default function About() {
  const {isDarkMode} = useGlobalContext();
  const {t} = useTranslation();
  return (
    <View
      style={[
        styles.aboutContainer,
        {
          backgroundColor: isDarkMode.appBackground,
        },
      ]}>
      <Text
        style={[
          styles.aboutText,
          {
            color: isDarkMode.textPrimary,
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

    zIndex: 10,
  },
  aboutText: {
    fontSize: 16,

    marginTop: 5,
    marginHorizontal: 5,
    fontFamily: 'Mulish',
  },
});
