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

export default function ClassSelection({razredi}: {razredi: Class[]}) {
  const isDarkMode = useColorScheme() === 'dark';
  const [selected, setSelected] = useState('');

  const renderClasses = ({item}: {item: Class}) => {
    return (
      <TouchableOpacity
        onPress={() => setSelected(item.Class)}
        style={[
          styles.class,
          {
            backgroundColor: isDarkMode
              ? Colors.Dark.notificationBG
              : Colors.Light.notificationBG,
            borderColor: isDarkMode
              ? Colors.Dark.textSecondary
              : Colors.Light.textSecondary,
          },
          item.Class === selected
            ? {
                backgroundColor: isDarkMode
                  ? Colors.Dark.accent
                  : Colors.Light.accentGreen,
                borderColor: isDarkMode
                  ? Colors.Dark.textPrimary
                  : Colors.Light.textPrimary,
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
            item.Class === selected
              ? {
                  color: isDarkMode
                    ? Colors.Dark.textPrimary
                    : Colors.Light.textPrimary,
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
