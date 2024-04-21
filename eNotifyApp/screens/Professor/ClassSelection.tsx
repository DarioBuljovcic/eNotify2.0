import React, {useEffect, useState} from 'react';
import {FlatList, ScrollView} from 'react-native-gesture-handler';
import {Class} from '../../components/Types/indexTypes';
import {
  View,
  Text,
  StyleSheet,
  useColorScheme,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import Colors from '../../components/Constants/Color';

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

  const renderClasses = ({item}: {item: Class}) => {
    return (
      <TouchableOpacity
        onPress={() => setProfClass(item.Class)}
        style={[
          styles.class,
          {
            backgroundColor: isDarkMode
              ? Colors.Dark.notificationBG
              : Colors.Light.notificationBG,
            borderColor: isDarkMode
              ? Colors.Dark.lightText
              : Colors.Light.lightText,
          },
          item.Class === profClass
            ? {
                backgroundColor: isDarkMode
                  ? Colors.Dark.accent
                  : Colors.Light.accentGreen,
                borderColor: isDarkMode
                  ? Colors.Dark.lightText
                  : Colors.Light.lightText,
              }
            : null,
        ]}>
        <Text
          style={[
            {
              color: isDarkMode
                ? Colors.Dark.lightText
                : Colors.Light.lightText,
            },
            item.Class === profClass
              ? {
                  color: isDarkMode
                    ? Colors.Dark.whiteText
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
    height: height,
    width: screenWidth,
    marginTop: 10,
    overflow: 'hidden',
    paddingHorizontal: 30,
    flexGrow: 0,
    marginBottom:5,
  },
  class: {
    marginRight: 20,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',

    height: height - 5,
    width: 60,

    paddingHorizontal: 10,

    borderWidth: 1,
    borderRadius: 15,
  },
});
