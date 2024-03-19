import Colors from '../../components/Constants/Color';
import {StyleSheet} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Student from '../Student/Student';
import React, {useEffect, useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import UserScreen from './UserScreen';
import Ionicons from 'react-native-vector-icons/Ionicons';
import RasporedV3 from '../Student/RasporedV3';
import LinearGradient from 'react-native-linear-gradient';
import {NavigationScreenProps} from '../../components/Types/indexTypes';

const NavigationScreen = ({navigation}: NavigationScreenProps) => {
  const [role, setRole] = useState('');
  navigation.addListener('beforeRemove', e => {
    e.preventDefault();
  });
  useEffect(() => {
    const saveUser = async () => {
      setRole((await AsyncStorage.getItem('Role')) as string);
    };
    saveUser();
  });

  const Tab = createBottomTabNavigator();
  if (role == 'Student') {
    //check role (Student)
    return (
      <Tab.Navigator
        screenOptions={({route}) => ({
          tabBarIcon: ({focused, color, size}) => {
            let iconName: string = '';

            if (route.name === 'Obavestenja') {
              iconName = focused ? 'notifications' : 'notifications-outline';
            } else if (route.name === 'Raspored') {
              iconName = focused ? 'calendar' : 'calendar-outline';
            } else if (route.name === 'Moj Nalog') {
              iconName = focused ? 'people' : 'people-outline';
            }
            size = 30;
            // You can return any component that you like here!
            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: Colors.Light.whiteText,
          tabBarInactiveTintColor: Colors.Light.whiteText,
          tabBarStyle: styles.tabBar,
          tabBarLabelStyle: {
            fontSize: 12,
            fontFamily: 'Mulish',
          },
          headerStyle: {
            backgroundColor: Colors.Light.accent,
            height: 60,
          },
          headerTintColor: Colors.Light.whiteText,
          headerTitleStyle: {
            fontSize: 23,
            fontFamily: 'Mulish',
          },
          headerTitleAlign: 'left',
          tabBarBackground: () => (
            <LinearGradient
              start={{x: 0.8, y: 0}}
              end={{x: 0, y: 0}}
              colors={[Colors.Light.accent, Colors.Light.accentGreen]}
              style={{flex: 1}}
            />
          ),
          headerBackground: () => (
            <LinearGradient
              start={{x: 0.8, y: 0}}
              end={{x: 0, y: 0}}
              colors={[Colors.Light.accent, Colors.Light.accentGreen]}
              style={{flex: 1}}
            />
          ),
        })}>
        <Tab.Screen name="Obavestenja" component={Student} />
        <Tab.Screen name="Raspored" component={RasporedV3} />
        <Tab.Screen name="Moj Nalog" component={UserScreen}>
          {/* TODO: add stack tree*/}
        </Tab.Screen>
      </Tab.Navigator>
    );
  } else if (role == 'Professor') {
    //(Profesor)
    return (
      <Tab.Navigator
        screenOptions={({route}) => ({
          tabBarIcon: ({focused, color, size}) => {
            let iconName: string = '';

            if (route.name === 'Obavestenja') {
              iconName = focused ? 'notifications' : 'notifications-outline';
            } else if (route.name === 'Raspored') {
              iconName = focused ? 'calendar' : 'calendar-outline';
            } else if (route.name === 'Moj Nalog') {
              iconName = focused ? 'people' : 'people-outline';
            }
            size = 30;
            // You can return any component that you like here!
            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: Colors.Light.whiteText,
          tabBarInactiveTintColor: Colors.Light.whiteText,
          tabBarStyle: styles.tabBar,
          tabBarLabelStyle: {
            fontSize: 12,
            fontFamily: 'Mulish',
          },
          headerStyle: {
            backgroundColor: Colors.Light.accent,
            height: 60,
          },
          headerTintColor: Colors.Light.whiteText,
          headerTitleStyle: {
            fontSize: 23,
            fontFamily: 'Mulish',
          },
          headerTitleAlign: 'left',
        })}>
        <Tab.Screen name="Obavestenja" component={Student} />
        <Tab.Screen name="Raspored" component={RasporedV3} />
        <Tab.Screen name="Moj Nalog" component={UserScreen}>
          {/* TODO: add stack tree*/}
        </Tab.Screen>
      </Tab.Navigator>
    );
  }
};

const styles = StyleSheet.create({
  userImage: {
    width: 20,
    height: 20,
  },
  tabBar: {
    backgroundColor: Colors.Light.accent,
    height: 70,
    paddingBottom: 10,
    paddingTop: 10,
  },
});

export default NavigationScreen;
