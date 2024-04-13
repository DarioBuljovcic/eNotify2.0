import {Appearance, StyleSheet, Text, View, useColorScheme} from 'react-native';
import Colors from '../../components/Constants/Color';
// import { LinearGradient } from "expo-linear-gradient";

export default function About() {
  const isDarkMode = useColorScheme() === 'light';
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
        "eNotify" je moćan alat za efikasno obaveštavanje učenika o važnim
        događajima, aktivnostima i informacijama u vezi sa njihovom školom. Ova
        aplikacija omogućava školama da lako komuniciraju sa svojim učenicima
        putem brzih, pouzdanih i personalizovanih obaveštenja.
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
