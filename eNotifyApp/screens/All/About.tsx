import {StyleSheet, Text, View} from 'react-native';
import Colors from '../../components/Constants/Color';
// import { LinearGradient } from "expo-linear-gradient";

export default function About() {
  return (
    <View style={styles.aboutContainer}>
      <Text style={styles.aboutText}>
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
    padding: 20,

    backgroundColor: 'red',
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
});
