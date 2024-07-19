import React, {useEffect, useState} from 'react';
import {FlatList} from 'react-native-gesture-handler';
import {Class} from '../../constants/Types/indexTypes';
import {
  Text,
  StyleSheet,
  useColorScheme,
  Dimensions,
  TouchableOpacity,
  FlatListProps,
} from 'react-native';
import Colors from '../../constants/Color';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function ClassSelection({
  razredi,
  profClass,
  setProfClass,
}: {
  razredi: Class[];
  profClass: string;
  setProfClass: any;
}) {
  const isDarkMode = useColorScheme() === 'dark';
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserID = async () => {
      const id = await AsyncStorage.getItem('UserId');
      setUserId(id);
    };

    fetchUserID();
  }, []);

  const renderClasses: FlatListProps<Class>['renderItem'] = ({item, index}) => {
    if (
      !item.ProfessorsList ||
      !userId ||
      !item.ProfessorsList.includes(userId)
    ) {
      return null;
    }

    return (
      <TouchableOpacity
        onPress={() => setProfClass(item.Class)}
        activeOpacity={0.7}
        style={[
          styles.class,
          {
            backgroundColor: isDarkMode
              ? Colors.Dark.componentBG
              : Colors.Light.componentBG,
            borderColor: Colors.Light.textPrimary,
          },
          item.Class === profClass
            ? {
                backgroundColor: isDarkMode
                  ? Colors.Dark.accent
                  : Colors.Light.accent,
              }
            : null,
        ]}>
        <Text
          style={[
            {
              color: isDarkMode
                ? Colors.Dark.textPrimary
                : Colors.Light.textPrimary,
            },
            item.Class === profClass
              ? {
                  color: isDarkMode
                    ? Colors.Dark.textPrimary
                    : Colors.Light.whiteText,
                }
              : null,
          ]}>
          {item.Class}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <FlatList
      horizontal
      scrollEnabled={razredi.length > 4}
      style={styles.list}
      contentContainerStyle={{paddingLeft: 20}}
      data={razredi}
      renderItem={renderClasses}
      keyExtractor={obavestenje => obavestenje.NotificationId}
      showsVerticalScrollIndicator={false}
    />
  );
}

const screenWidth = Dimensions.get('window').width;
const height = 35;

const styles = StyleSheet.create({
  list: {
    height: 65,
    width: screenWidth,
    marginTop: 15,
    overflow: 'hidden',
    paddingRight: 20,
    flexGrow: 0.02,
    marginBottom: 5,
  },
  class: {
    marginRight: 20,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',

    height: 55,
    aspectRatio: 1,

    borderRadius: 50,
  },
});
