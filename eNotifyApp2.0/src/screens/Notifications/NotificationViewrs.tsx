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
import {FlatList} from 'react-native-gesture-handler';
import Ionicons from 'react-native-vector-icons/Ionicons';
import storage from '@react-native-firebase/storage';
import getUsers from '../../hooks/getUsers';
import {useGlobalContext} from '../../context/GlobalProvider';

export default function NotificationViewrs({route}: {route: any}) {
  console.warn = () => {};

  const {isDarkMode} = useGlobalContext();
  const [students, setStudents] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const studentsViewd: string = route.params.Seen.split(',');

  useEffect(() => {
    const getData = async () => {
      const data = await getUsers(route.params.Class[0]);
      setStudents(data);
    };
    if (students.length == 0) getData();
    if (students.length != 0) setLoading(true);
  }, [students]);

  const updateImage = async (item: User) => {
    if (item) {
      const imageUrl = await storage()
        .ref(item.profile_picture)
        .getDownloadURL();

      if (imageUrl) return imageUrl;
    }
    return null;
  };

  const RenderObavestenje = ({item}: {item: User}) => {
    const [imageUrl, setImageUrl] = useState<string | null>(null);

    useEffect(() => {
      const fetchImageUrl = async () => {
        const url = await updateImage(item);
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
              : isDarkMode === Colors.Light
              ? require('../../assets/images/user-light.png')
              : require('../../assets/images/user-dark.png')
          }
          style={styles.userImage}
        />
        <Text
          style={[
            styles.userText,
            {
              color: isDarkMode.textSecondary,
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
            backgroundColor: isDarkMode.appBackground,
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
    width: screenWidth,
    height: screenHeight,
    zIndex: 10,
  },
  list: {
    flex: 1,

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
