import {
  Appearance,
  Dimensions,
  StyleSheet,
  View,
  useColorScheme,
} from 'react-native';
import React, {useEffect, useState, useRef} from 'react';
import {ProfessorTabProps, User} from '../../components/Types/indexTypes';
import {Text} from 'react-native-elements';
import Colors from '../../components/Constants/Color';
import firestore from '@react-native-firebase/firestore';
import {FlatList} from 'react-native-gesture-handler';
import Ionicons from 'react-native-vector-icons/Ionicons';

export default function NotificationViewrs({route}: {route: any}) {
  const isDarkMode = useColorScheme() === 'light';
  const [students, setStudents] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const studentsViewd: string = route.params.Seen.split(',');

  useEffect(() => {
    const getData = async () => {
      const stud = await firestore()
        .collection('Users')
        .where('Class', '==', route.params.Class)
        .where('Role', '==', 'Student')
        .get();
      let data: User[] = [];
      stud.docs.forEach(s => {
        data.push(s.data() as User);
      });

      setStudents(
        [...data].sort((a, b) =>
          a.Name.split(' ')[1].localeCompare(b.Name.split(' ')[1]),
        ),
      );
    };
    if (students.length == 0) getData();
    if (students.length != 0) setLoading(true);
  }, [students]);

  const renderObavestenje = ({item}: {item: User}) => {
    if (studentsViewd.includes(item.UserID)) {
      return (
        <View
          style={[
            styles.studentContainer,
            {
              backgroundColor: isDarkMode
                ? Colors.Light.notificationBG
                : Colors.Dark.notificationBG,
            },
          ]}>
          <Text
            style={{
              color: isDarkMode
                ? Colors.Light.textSecondary
                : Colors.Dark.textSecondary,
            }}>
            {item.Name}
          </Text>
          <Ionicons
            name={'checkmark-circle'}
            size={21}
            color={'green'}></Ionicons>
        </View>
      );
    } else {
      return (
        <View
          style={[
            styles.studentContainer,
            {
              backgroundColor: isDarkMode
                ? Colors.Light.notificationBG
                : Colors.Dark.notificationBG,
            },
          ]}>
          <Text
            style={{
              color: isDarkMode
                ? Colors.Light.textSecondary
                : Colors.Dark.textSecondary,
            }}>
            {item.Name}
          </Text>
          <Ionicons
            name={'checkmark-circle-outline'}
            size={21}
            color={'gray'}></Ionicons>
        </View>
      );
    }
  };

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.list,
          {
            backgroundColor: isDarkMode
              ? Colors.Light.appBackground
              : Colors.Dark.appBackground,
          },
        ]}>
        <FlatList
          style={styles.flatList}
          data={students}
          renderItem={renderObavestenje}
          keyExtractor={(stud: User) => stud.UserID}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </View>
  );
}
const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

const styles = StyleSheet.create({
  container: {
    flex: 1,

    borderWidth: 0,
    marginTop: -40,
    width: screenWidth,
    height: screenHeight,
    zIndex: 10,
  },
  list: {
    flex: 1,
    alignItems: 'center',
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,

    overflow: 'hidden',
    elevation: 2,
    shadowColor: Colors.Light.black,
    shadowOffset: {width: 2, height: 5},
    shadowRadius: 1,
  },

  flatList: {
    width: screenWidth,
  },
  studentContainer: {
    height: 40,
    width: '90%',
    marginTop: 10,
    marginBottom: 10,
    marginLeft: screenWidth * 0.05,
    padding: 10,
    flexDirection:'row',
    justifyContent:'space-between',

    borderRadius: 10,
    elevation: 3,
    shadowColor: Colors.Light.black,
    shadowOffset: {width: 2, height: 5},
    shadowRadius: 1,

  },
});
