import {StyleSheet, Text, View} from 'react-native';
// import { LinearGradient } from "expo-linear-gradient";

export default function About() {
  return (
    <View style={styles.container}>
      <Text style={styles.body}>About</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  background: {
    width: '100%',
    height: '100%',
    opacity: 0.95,
    padding: 30,
  },
  body: {
    fontSize: 20,
  },
});
