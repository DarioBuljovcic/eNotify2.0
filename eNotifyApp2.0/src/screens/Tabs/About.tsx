import {SafeAreaView, StyleSheet, Text, View} from 'react-native';
import {useGlobalContext} from '../../context/GlobalProvider';
import translations from '../../constants/i18n/translations/translation';
import {translateTextOutOfComponent} from '../../hooks/getTranslation.tsx';

export default function About() {
  const {isDarkMode} = useGlobalContext();

  return (
    <SafeAreaView
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
        {translateTextOutOfComponent(translations.aboutText)}
      </Text>
    </SafeAreaView>
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
