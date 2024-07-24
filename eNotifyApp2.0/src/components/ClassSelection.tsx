import React from 'react';
import {FlatList} from 'react-native-gesture-handler';
import {
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  FlatListProps,
} from 'react-native';

import Colors from '../constants/Color';
import {useGlobalContext} from '../context/GlobalProvider';
import {Class} from '../constants/Types/indexTypes';

export default function ClassSelection({
  razredi,
  profClass,
  setProfClass,
}: {
  razredi: Class[];
  profClass: string;
  setProfClass: any;
}) {
  const {isDarkMode, user} = useGlobalContext();

  const renderClasses: FlatListProps<Class>['renderItem'] = ({item, index}) => {
    if (
      !item.ProfessorsList ||
      !item.ProfessorsList.includes(user?.UserID as string)
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
            backgroundColor: isDarkMode.componentBG,
            borderColor: Colors.Light.textPrimary,
          },
          item.Class === profClass
            ? {
                backgroundColor: isDarkMode.accent,
              }
            : null,
        ]}>
        <Text
          style={[
            {
              color: isDarkMode.textPrimary,
              fontFamily: 'Mulish',
            },
            item.Class === profClass
              ? {
                  color: isDarkMode.whiteText,
                }
              : null,
          ]}>
          {item.Class}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <>
      <FlatList
        horizontal
        scrollEnabled={razredi.length > 4}
        style={[styles.list, {backgroundColor: isDarkMode.appBackground}]}
        contentContainerStyle={{paddingLeft: 20}}
        data={razredi}
        renderItem={renderClasses}
        keyExtractor={obavestenje => obavestenje.NotificationId}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
      />
    </>
  );
}

const screenWidth = Dimensions.get('window').width;
const height = 35;

const styles = StyleSheet.create({
  list: {
    minHeight: 80,
    width: screenWidth,
    paddingTop: 15,
    overflow: 'hidden',
    paddingRight: 20,
    flexGrow: 0.02,
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
