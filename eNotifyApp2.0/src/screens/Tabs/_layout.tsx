import {StyleSheet, View} from 'react-native';
import React from 'react';
import {
  createMaterialTopTabNavigator,
  MaterialTopTabBar,
} from '@react-navigation/material-top-tabs';
import HomeStudent from './HomeStudent.tsx';
import Table from './Table.tsx';
import Profile from './Profile.tsx';
import {useGlobalContext} from '../../context/GlobalProvider.tsx';
import TabIcon from '../../components/TabIcon.tsx';
import HomeProfessor from './HomeProfessor.tsx';
import translations from '../../constants/i18n/translations/translation.js';
import {translateTextOutOfComponent, TranslatedText} from '../../hooks/getTranslation.tsx';

const Tab = createMaterialTopTabNavigator();

const LayoutTabs = ({navigation}: {navigation: any}) => {
  const {isDarkMode, user} = useGlobalContext();
  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        tabBarActiveTintColor: isDarkMode.accent,
        tabBarInactiveTintColor: isDarkMode.textPrimary,
        tabBarPressColor: isDarkMode.componentBG,
        tabBarStyle: {
          backgroundColor: isDarkMode.componentBG,
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
          marginTop: 10,
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
        name="Home"
        component={user?.Role === 'Student' ? HomeStudent : HomeProfessor}
        options={{
          tabBarLabel: translateTextOutOfComponent(translations.notification),
          tabBarIcon: ({focused, color}) => (
            <TabIcon
              focused={focused}
              color={color}
              size={25}
              icon="notifications"
            />
          ),
        }}
      />
      <Tab.Screen
        name="Table"
        component={Table}
        options={{
          tabBarLabel: translateTextOutOfComponent(translations.timetable),
          tabBarIcon: ({focused, color}) => (
            <TabIcon
              focused={focused}
              color={color}
              size={25}
              icon="calendar"
            />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={Profile}
        options={{
          tabBarLabel: translateTextOutOfComponent(translations.account),
          tabBarIcon: ({focused, color}) => (
            <TabIcon focused={focused} color={color} size={25} icon="people" />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default LayoutTabs;
