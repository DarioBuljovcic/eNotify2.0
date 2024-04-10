import {StyleSheet, Text, View, useColorScheme} from 'react-native';
import Colors from '../../components/Constants/Color';
// import { LinearGradient } from "expo-linear-gradient";

export default function About() {
  const isDarkMode = useColorScheme()==='dark';
  return (
    <View style={isDarkMode?styles.aboutContainerDark:styles.aboutContainer}>
      <Text style={isDarkMode?styles.aboutTextDark:styles.aboutText}>
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
    backgroundColor: Colors.Light.appBackground,
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    zIndex: 10,
    marginTop: -35,
  },
  aboutContainerDark: {
    width: '100%',
    height: '150%',
    padding: 20,
    backgroundColor: Colors.Dark.appBackground,
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    zIndex: 10,
    marginTop: -35,
  },
  aboutLine: {
    backgroundColor: Colors.Light.textPrimary,
    height: 1,
    marginTop: 5,
  },
  aboutHeaderText: {
    fontSize: 16,
    color: Colors.Light.textPrimary,
    marginLeft: 5,
    fontFamily: 'Mulish',
  },
  aboutText: {
    fontSize: 16,
    color: Colors.Light.textPrimary,
    marginTop: 5,
    marginHorizontal: 5,
    fontFamily: 'Mulish',
  },
  aboutTextDark:{
    fontSize: 16,
    color: Colors.Dark.textPrimary,
    marginTop: 5,
    marginHorizontal: 5,
    fontFamily: 'Mulish',
  }
});
