import Colors from '../../components/Constants/Color';
import {StyleSheet, View, Animated} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Student from '../Student/Student';
import React, {useEffect, useState, useRef} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import UserScreen from './UserScreen';
import Ionicons from 'react-native-vector-icons/Ionicons';
import RasporedV3 from '../Student/RasporedV3';
import LinearGradient from 'react-native-linear-gradient';
import {NavigationScreenProps} from '../../components/Types/indexTypes';
import {Button, Text} from 'react-native-elements';

const Test = ({navigation}: NavigationScreenProps) => {
  const [role, setRole] = useState('');
  const [pressed, setPressed] = useState('');

  const translateY = useRef(new Animated.Value(0)).current;
  const bgColor = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0)).current;
  const backgroundColor = bgColor.interpolate({
    inputRange: [0, 1],
    outputRange: [Colors.Light.accent, Colors.Light.accentGreen], // Change these colors as needed
  });

  useEffect(() => {
    if (pressed === '') {
      ResetAnimation();
      animateCircle();
    }
  }, []);

  const animateCircle = () => {
    Animated.parallel([
      Animated.timing(translateY, {
        toValue: -20, // Change this value to change how far the circle moves up
        duration: 200, // Adjust duration as needed
        useNativeDriver: true,
      }),
      Animated.timing(bgColor, {
        toValue: 1, // Change this value to change the target color
        duration: 200, // Adjust duration as needed
        useNativeDriver: true,
      }),
      Animated.timing(scale, {
        toValue: 1.1, // Change this value to change the target color
        duration: 300, // Adjust duration as needed
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
            return (
              <Animated.View
                style={
                  focused
                    ? [styles.tabButton, {transform: [{translateY}]}]
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
          tabBarStyle: styles.tabBar,
          tabBarLabelStyle: {
            fontSize: 12,
            fontFamily: 'Mulish',
          },
          headerStyle: {
            backgroundColor: Colors.Light.accent,
            height: 80,
          },
          headerTintColor: Colors.Light.whiteText,
          headerTitleStyle: {
            fontSize: 30,
            fontFamily: 'Mulish',
          },
          headerTitleAlign: 'left',
          //   tabBarBackground: () => (
          //     <LinearGradient
          //       start={{x: 0.8, y: 0}}
          //       end={{x: 0, y: 0}}
          //       colors={[Colors.Light.accent, Colors.Light.accentGreen]}
          //       style={{flex: 1}}
          //     />
          //   ),
        })}>
        <Tab.Screen
          name="Obavestenja"
          component={Student}
          listeners={{
            tabPress: e => {
              if (pressed !== 'Obavestenja') {
                ResetAnimation();
                animateCircle();
                setPressed('Obavestenja');
              }
            },
          }}
        />
        <Tab.Screen
          name="Raspored"
          component={RasporedV3}
          listeners={{
            tabPress: e => {
              if (pressed !== 'Raspored') {
                ResetAnimation();
                animateCircle();
                setPressed('Raspored');
              }
            },
          }}
        />
        <Tab.Screen
          name="Moj Nalog"
          component={UserScreen}
          listeners={{
            tabPress: () => {
              if (pressed !== 'Moj Nalog') {
                ResetAnimation();
                animateCircle();
                setPressed('Moj Nalog');
              }
            },
          }}>
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
  tabButton: {
    width: 60,
    height: 60,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'transparent',
    borderRadius: 30,
    backgroundColor: Colors.Light.accent,
  },
  tabBackground: {
    width: 45,
    height: 45,
    backgroundColor: 'blue',
    borderWidth: 1,
    borderColor: 'transparent',
    borderRadius: 30,
    position: 'absolute',
  },
});

export default Test;
