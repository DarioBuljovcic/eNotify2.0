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

const NavigationScreen = ({navigation}: NavigationScreenProps) => {
  const isDarkMode = useColorScheme() === 'dark';
  const {t} = useTranslation();

  const [role, setRole] = useState('');
  const [pressed, setPressed] = useState('');

  const translateY = useRef(new Animated.Value(0)).current;
  const bgColor = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0)).current;
  const backgroundColor = bgColor.interpolate({
    inputRange: [0, 1],
    outputRange: isDarkMode
      ? [Colors.Dark.accent, Colors.Dark.accentGreen]
      : [Colors.Light.accent, Colors.Light.accentGreen],
  });

  const Tab = createBottomTabNavigator();

  useEffect(() => {
    if (pressed === '') {
      ResetAnimation();
      animateCircle();
    }
  }, []);

  const animateCircle = () => {
    Animated.parallel([
      Animated.timing(translateY, {
        toValue: -20,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(bgColor, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(scale, {
        toValue: 1.1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  };
  const ResetAnimation = () => {
    translateY.setValue(0);
    bgColor.setValue(0);
    scale.setValue(0);
  };

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
          return (
            <Animated.View
              style={
                focused
                  ? [
                      styles.tabButton,
                      {
                        backgroundColor: isDarkMode
                          ? Colors.Dark.accent
                          : Colors.Light.accent,
                      },
                      {transform: [{translateY}]},
                    ]
                  : null
              }>
              <Animated.View
                style={
                  focused
                    ? [
                        styles.tabBackground,
                        {backgroundColor, transform: [{scale}]},
                      ]
                    : null
                }></Animated.View>
              <Ionicons name={iconName} size={size} color={color} />
            </Animated.View>
          );
        },
        tabBarActiveTintColor: Colors.Light.whiteText,
        tabBarInactiveTintColor: Colors.Light.whiteText,
        tabBarStyle: [
          styles.tabBar,
          {
            backgroundColor: isDarkMode
              ? Colors.Dark.accent
              : Colors.Light.accent,
          },
        ],
        tabBarLabelStyle: {
          fontSize: 12,
          fontFamily: 'Mulish',
          textTransform: 'capitalize',
        },
        headerStyle: {
          height: 100,
          elevation: 0,
        },
        headerTintColor: Colors.Light.whiteText,
        headerTitleStyle: {
          fontSize: 28,
          fontFamily: 'Mulish',
          textTransform: 'capitalize',
          letterSpacing: 3,
        },
        headerTitleAlign: 'center',
        headerBackground: () => (
          <View>
            <Svg
              style={{position: 'absolute', top: -1}}
              width={Dimensions.get('window').width + 10}
              height="130"
              fill="none"
              viewBox={`0 0 ${Dimensions.get('window').width + 10} 130`}>
              <G clip-path="url(#a)">
                <Path
                  fill={isDarkMode ? Colors.Dark.accent : Colors.Light.accent}
                  d="M0 0h390v234H0z"
                />
                <Path
                  fill={
                    isDarkMode
                      ? Colors.Dark.headerFirst
                      : Colors.Light.headerFirst
                  }
                  d="M376.3 105.314c43.088 197.888-49.188 185.883-185.853 162.133-13.245-2.302-20.441-16.805-15.339-29.243 23.369-56.97 18.098-95.949-16.553-116.305-42.185-24.782-98.442-59.87-66.937-97.303C135.429-27.458 250.217-8.186 312.134-8.186c82.843 0 64.166 30.657 64.166 113.5Z"
                />
                <Path
                  fill={
                    isDarkMode
                      ? Colors.Dark.headerSecond
                      : Colors.Light.headerSecond
                  }
                  d="M448.3 99.889c38.177 175.333-29.912 185.893-140.987 169.503-20.086-2.964-46.196-56.658-44.273-76.871 4.264-44.831-10.242-100.086-75.96-122.42-18.342-6.235-30.754-25.903-21.712-43.036 67.933-128.732 174.629-40.676 218.766-40.676 82.843 0 64.166 30.657 64.166 113.5Z"
                />
                <Path
                  fill={
                    isDarkMode
                      ? Colors.Dark.headerThird
                      : Colors.Light.headerThird
                  }
                  d="M517.3 100.214c38.177 175.333-29.912 185.893-140.987 169.503-20.086-2.964-46.196-56.657-44.273-76.871 4.264-44.83-10.242-100.085-75.96-122.42-18.342-6.234-30.754-25.902-21.712-43.036 67.933-128.732 174.629-40.676 218.766-40.676 82.843 0 64.166 30.657 64.166 113.5Z"
                />
              </G>
              <Defs>
                <ClipPath id="a">
                  <Path fill="#fff" d="M0 0h390v234H0z" />
                </ClipPath>
              </Defs>
            </Svg>
          </View>
        ),
      })}>
      <Tab.Screen
        name="Notifications"
        component={role === 'Professor' ? Professor : Student}
        options={{
          tabBarLabel: t('notification'),
          headerTitle: t('notification'),
        }}
        listeners={{
          tabPress: e => {
            if (pressed !== 'Notifications') {
              ResetAnimation();
              animateCircle();
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
          headerTitle: t('timetable'),
        }}
        listeners={{
          tabPress: e => {
            if (pressed !== 'TimeTable') {
              ResetAnimation();
              animateCircle();
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
          headerTitle: t('account'),
        }}
        listeners={{
          tabPress: () => {
            if (pressed !== 'MyAccount') {
              ResetAnimation();
              animateCircle();
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
    paddingBottom: 10,
    paddingTop: 10,
  },
  tabButton: {
    width: 60,
    height: 60,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'transparent',
    borderRadius: 30,
  },
  tabBackground: {
    width: 45,
    height: 45,
    borderWidth: 1,
    borderColor: 'transparent',
    borderRadius: 30,
    position: 'absolute',
  },
});

export default NavigationScreen;
