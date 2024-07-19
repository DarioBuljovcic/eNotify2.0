import Colors from '../../constants/Color';
import {
  StyleSheet,
  View,
  Animated,
  Dimensions,
  useColorScheme,
} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Student from '../Student/Student';
import React, {useEffect, useState, useRef} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import UserScreen from './UserScreen';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {NavigationScreenProps} from '../../constants/Types/indexTypes';
import Professor from '../Professor/Professor';
import Svg, {Path, G, Defs, ClipPath} from 'react-native-svg';
import {useTranslation} from 'react-i18next';
import TimeTable from '../Student/TimeTable';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';

const NavigationScreen = ({navigation}: NavigationScreenProps) => {
  const isDarkMode = useColorScheme() === 'dark';
  const {t} = useTranslation();

  const [role, setRole] = useState('');
  const [pressed, setPressed] = useState('');

  const Tab = createMaterialTopTabNavigator();

  navigation.addListener('beforeRemove', e => {
    e.preventDefault();
  });
  useEffect(() => {
    const saveUser = async () => {
      setRole((await AsyncStorage.getItem('Role')) as string);
    };
    saveUser();
  });

  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        tabBarIcon: ({focused, color, size}) => {
          let iconName: string = '';

          if (route.name === 'Notifications') {
            iconName = focused ? 'notifications' : 'notifications-outline';
          } else if (route.name === 'TimeTable') {
            iconName = focused ? 'calendar' : 'calendar-outline';
          } else if (route.name === 'MyAccount') {
            iconName = focused ? 'people' : 'people-outline';
          }
          size = 30;
          // You can return any component that you like here!
          if (focused) {
            <View style={styles.backCircle}>
              <Ionicons name={iconName} size={size} color={color} />
            </View>;
          } else {
            return (
              <View style={styles.tabButton}>
                <Ionicons name={iconName} size={size} color={color} />
              </View>
            );
          }
        },
        tabBarActiveTintColor: '#003060',
        tabBarInactiveTintColor: '#68BBE3',
        tabBarStyle: {
          backgroundColor: '#f7faff',
          borderWidth: 0,
          borderTopColor: 'transparent',
          height: 84,
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 10,
          shadowColor: 'transparent', // iOS
          shadowOffset: {width: 0, height: 0}, // iOS
          shadowOpacity: 0, // iOS
          shadowRadius: 0, // iOS
          elevation: 0, // Android
          display: 'flex',
          justifyContent: 'center',
          gap: 1,
        },

        tabBarLabelStyle: {
          fontSize: 10,
          fontFamily: 'Mulish',
          textTransform: 'capitalize',
        },
        tabBarIndicatorStyle: {
          height: 0,
          width: 0,
        },
      })}>
      <Tab.Screen
        name="Notifications"
        component={role === 'Professor' ? Professor : Student}
        options={{
          tabBarLabel: t('notification'),
        }}
        listeners={{
          tabPress: e => {
            if (pressed !== 'Notifications') {
              setPressed('Notifications');
            }
          },
        }}
      />
      <Tab.Screen
        name="TimeTable"
        component={TimeTable}
        options={{
          tabBarLabel: t('timetable'),
        }}
        listeners={{
          tabPress: e => {
            if (pressed !== 'TimeTable') {
              setPressed('TimeTable');
            }
          },
        }}
      />
      <Tab.Screen
        name="MyAccount"
        component={UserScreen}
        options={{
          tabBarLabel: t('account'),
        }}
        listeners={{
          tabPress: () => {
            if (pressed !== 'MyAccount') {
              setPressed('MyAccount');
            }
          },
        }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    height: 70,
    width: '100%',
    paddingBottom: 10,
    paddingTop: 10,
    position: 'absolute',
    bottom: 0,
    zIndex: 100,
  },
  tabButton: {
    width: 40,
    aspectRatio: 1,
    zIndex: 100,
  },
  tabButtonSelected: {
    width: 40,
    aspectRatio: 1,
    zIndex: 100,
  },
  tabBackground: {
    width: 45,
    height: 45,
    borderWidth: 1,
    borderColor: 'transparent',
    borderRadius: 30,
    position: 'absolute',
  },
  backCircle: {
    height: 30,
    width: 30,
    backgroundColor: 'red',
    borderRadius: 30,
  },
});

export default NavigationScreen;
