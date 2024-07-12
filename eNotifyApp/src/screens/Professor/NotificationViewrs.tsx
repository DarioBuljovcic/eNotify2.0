import {
  Dimensions,
  StyleSheet,
  View,
  useColorScheme,
  Image,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {User} from '../../constants/Types/indexTypes';
import {Text} from 'react-native-elements';
import Colors from '../../constants/Color';
import firestore from '@react-native-firebase/firestore';
import {FlatList} from 'react-native-gesture-handler';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import storage from '@react-native-firebase/storage';

export default function NotificationViewrs({route}: {route: any}) {
  console.warn = () => {};

  const isDarkMode = useColorScheme() === 'light';
  const [students, setStudents] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const studentsViewd: string = route.params.Seen.split(',');

  useEffect(() => {
    const getData = async () => {
      const stud = await firestore()
        .collection('Users')
        .where('Class', '==', route.params.Class[0])
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

  const updateImage = async (userID: any) => {
    if (userID) {
      const querySnapshot = await firestore()
        .collection('Users')
        .where('UserID', '==', userID)
        .get();

      if (!querySnapshot.empty) {
        const imageUrl = await storage()
          .ref(querySnapshot.docs[0].data().profile_picture)
          .getDownloadURL();

        if (imageUrl) return imageUrl;
      }
    }
    return null;
  };

  const RenderObavestenje = ({item}: {item: User}) => {
    const [imageUrl, setImageUrl] = useState<string | null>(null);

    useEffect(() => {
      const fetchImageUrl = async () => {
        const url = await updateImage(item.UserID);
        setImageUrl(url);
      };

      fetchImageUrl();
    }, [item]);

    return (
      <View style={[styles.studentContainer]}>
        <Image
          source={
            imageUrl
              ? {uri: imageUrl}
              : isDarkMode
              ? require('../../assets/images/user-light.png')
              : require('../../assets/images/user-dark.png')
          }
          style={styles.userImage}
        />
        <Text
          style={[
            styles.userText,
            {
              color: isDarkMode
                ? Colors.Light.textSecondary
                : Colors.Dark.textSecondary,
            },
          ]}>
          {item.Name}
        </Text>
        <Ionicons
          name={
            studentsViewd.includes(item.UserID)
              ? 'checkmark-circle'
              : 'checkmark-circle-outline'
          }
          size={25}
          color={studentsViewd.includes(item.UserID) ? 'green' : 'gray'}
        />
      </View>
    );
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
          renderItem={({item}) => <RenderObavestenje item={item} />}
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
    height: 70,
    width: '80%',
    marginTop: 10,
    marginBottom: 10,
    marginLeft: screenWidth * 0.05,
    padding: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignContent: 'center',
    alignItems: 'center',
  },
  userImage: {
    width: 50,
    height: 50,
    borderRadius: 50,
  },
  userText: {
    fontSize: 17,
    fontFamily: 'Mulish',
  },
});
