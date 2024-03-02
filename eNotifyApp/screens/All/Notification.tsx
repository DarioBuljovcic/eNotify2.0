import {StyleSheet, Text, View} from 'react-native';
//import { LinearGradient } from 'expo-linear-gradient';
import {useNavigation} from '@react-navigation/native';
import Colors from '../../components/Constants/Color';

export default function Obavestenje({route}: any) {
  const navigation = useNavigation();
  navigation.setOptions({title: route.params.title});

  return (
    <View style={styles.container}>
      <View style={styles.infoContainer}>
        <Text style={styles.class}>{route.params.class}</Text>
      </View>

      <Text style={styles.body}>{route.params.body}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  background: {
    width: '100%',
    height: '100%',
    opacity: 0.95,
    padding: 20,
  },
  body: {
    marginTop: 10,
    flex: 15,
    fontSize: 18,
    color: Colors.textPrimary,
    paddingHorizontal: 10,
  },
  infoContainer: {
    paddingHorizontal: 10,
    paddingVertical: 10,
    flexDirection: 'row',
    borderColor: Colors.textSecondary,
    borderRadius: 0,
    borderBottomWidth: 1.5,
    marginHorizontal: 10,
  },
  date: {
    flex: 1,
    textAlign: 'right',
    color: Colors.textPrimary,
  },
  class: {
    flex: 1,
    color: Colors.textPrimary,
  },
});
