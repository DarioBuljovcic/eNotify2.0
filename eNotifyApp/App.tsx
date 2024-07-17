import React, {useEffect} from 'react';
import {
  StyleSheet,
  Linking,
  ActivityIndicator,
  View,
  Dimensions,
  useColorScheme,
  LogBox,
  Appearance,
  PermissionsAndroid,
} from 'react-native';
import 'react-native-gesture-handler';
import 'react-native-url-polyfill/auto';
import {
  DarkTheme,
  DefaultTheme,
  NavigationContainer,
} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import messaging from '@react-native-firebase/messaging';
import Registration from './src/screens/All/Registration';
import Student from './src/screens/Student/Student';
import Professor from './src/screens/Professor/Professor';
import Notification from './src/screens/All/Notification';
import Colors from './src/constants/Color';
import {Navigation} from './src/constants/Types/indexTypes';
import About from './src/screens/All/About';
import NavigationScreen from './src/screens/All/NavigationScreen';
import NotificationViewrs from './src/screens/Professor/NotificationViewrs';
import Svg, {Path, G, Defs, ClipPath} from 'react-native-svg';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useTranslation} from 'react-i18next';
import firestore from '@react-native-firebase/firestore';
import {QuerySnapshot} from 'firebase/firestore';

PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS);
PermissionsAndroid.request(
  PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
);
PermissionsAndroid.request(
  PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
);

function App(): React.JSX.Element {
  LogBox.ignoreAllLogs();

  const isDarkMode = useColorScheme() === 'dark';
  const {t, i18n} = useTranslation();

  const Stack = createStackNavigator<Navigation>();

  type Screens = {
    [key: string]: string;
  };

  function buildDeepLinkFromNotificationData(data: any): string | null {
    const notificationId = data.notification.android.channelId;
    return `eNotify://Notification/${notificationId}`;
  }

  const linking = {
    prefixes: ['eNotify://'],
    config: {
      initialRouteName: `Registration`,
      screens: {
        Registration: `Registration`,
        Notification: {
          path: 'Notification/:id',
          parse: {
            id: (id: string) => `${id}`,
          },
        },
      } as any,
    },
    async getInitialURL() {
      const url = await Linking.getInitialURL();
      if (typeof url === 'string') {
        return url;
      }
      //getInitialNotification: When the application is opened from a quit state.
      const message = await messaging().getInitialNotification();
      const deeplinkURL = buildDeepLinkFromNotificationData('Notification');
      if (typeof deeplinkURL === 'string') {
        return deeplinkURL;
      }
    },
    subscribe(listener: (url: string) => void) {
      const onReceiveURL = ({url}: {url: string}) => listener(url);

      // Listen to incoming links from deep linking
      const linkingSubscription = Linking.addEventListener('url', onReceiveURL);

      //onNotificationOpenedApp: When the application is running, but in the background.
      const unsubscribe = messaging().onNotificationOpenedApp(remoteMessage => {
        const url = buildDeepLinkFromNotificationData(remoteMessage);

        if (typeof url === 'string') {
          listener(url);
          Linking.openURL(url);
        }
      });

      return () => {
        linkingSubscription.remove();
        unsubscribe();
      };
    },
  };

  const setLanguage = async () => {
    const lang = await AsyncStorage.getItem('Language');

    if (lang === 'sr') {
      i18n.changeLanguage('sr');
    } else if (lang === 'hu') {
      i18n.changeLanguage('hu');
    } else if (lang === 'en') {
      i18n.changeLanguage('en');
    }
  };
  const getMode = async () => {
    const mode = await AsyncStorage.getItem('Mode');
    Appearance.setColorScheme(mode === 'dark' ? 'dark' : 'light');
  };

  //user data check
  useEffect(() => {
    const getID = async () => {
      // console.log('eff');
      const userID = await AsyncStorage.getItem('UserId');
      if (userID) {
        // console.log('userID');
        const userSnapshot = await firestore()
          .collection('Users')
          .where('UserID', '==', userID)
          .get();

        if (!userSnapshot.empty) {
          // console.log('not empty');
          const currentName = userSnapshot.docs[0].data().Name;
          const currentEmail = userSnapshot.docs[0].data().Email;
          const currentClass = userSnapshot.docs[0].data().Class;

          const asyncName = await AsyncStorage.getItem('Name');
          const asyncEmail = await AsyncStorage.getItem('Email');
          const asyncClass = await AsyncStorage.getItem('Class');

          // console.log(currentName + ' - ' + asyncName);
          // console.log(currentEmail + ' - ' + asyncEmail);
          // console.log(currentClass + ' - ' + asyncClass);

          if (currentName !== asyncName)
            await AsyncStorage.setItem('Name', currentName);
          if (currentEmail !== asyncEmail)
            await AsyncStorage.setItem('Email', currentEmail);
          if (currentClass !== asyncClass)
            await AsyncStorage.setItem('Class', currentClass);
        } else {
          messaging().unsubscribeFromTopic('Svi');
          messaging().unsubscribeFromTopic('Prvi');
          messaging().unsubscribeFromTopic('Drugi');
          messaging().unsubscribeFromTopic('Treci');
          messaging().unsubscribeFromTopic('Cetvrit');

          const classTopic = await AsyncStorage.getItem('Class');
          if (classTopic) messaging().unsubscribeFromTopic(classTopic);

          AsyncStorage.clear();
        }
      }
    };
    getID();
  }, []);
  //gets light mode and languge
  useEffect(() => {
    getMode();
    setLanguage();
  }, []);
  useEffect(() => {
    const unsubscribe = messaging().onMessage(async remoteMessage => {});

    return unsubscribe;
  }, []);
  useEffect(() => {
    const unsubscribe = messaging().setBackgroundMessageHandler(
      async remoteMessage => {},
    );
    return unsubscribe;
  }, []);

  return (
    <NavigationContainer
      linking={linking}
      fallback={<ActivityIndicator animating />}
      theme={isDarkMode ? DarkTheme : DefaultTheme}>
      <Stack.Navigator
        screenOptions={{
          animationEnabled: true,
        }}>
        <Stack.Screen
          name="Registration"
          component={Registration}
          options={() => ({
            headerTitle: t('registration'),
            headerBackVisible: false,
            headerLeft: () => null,
            headerStyle: {
              height: 170,
              elevation: 0,
            },
            headerTintColor: Colors.Light.whiteText,
            headerTitleStyle: {
              marginTop: 40,
              fontSize: 50,
              fontFamily: 'Mulish',
              letterSpacing: 2,
            },
            headerTitleAlign: 'center',
            headerBackground: () => (
              <View style={{position: 'absolute', top: -1, zIndex: -11}}>
                <Svg
                  width={Dimensions.get('window').width}
                  height="241"
                  viewBox={`0 0 ${Dimensions.get('window').width} 241`}
                  fill="none">
                  <Path
                    d="M0 0H541V217.519C464.705 265.682 351.65 226.249 312.115 217.519C272.581 208.789 119.991 145.903 0 217.519V0Z"
                    fill={isDarkMode ? Colors.Dark.accent : Colors.Light.accent}
                  />
                </Svg>
              </View>
            ),
          })}
        />
        <Stack.Screen
          name="NavigationScreen"
          component={NavigationScreen}
          options={navigation => ({
            headerBackVisible: false,
            headerShown: false,
            headerLeft: () => null,
            headerStyle: {
              height: 60,
            },
            headerTintColor: Colors.Light.whiteText,
            headerTitleStyle: {
              fontSize: 23,
              fontFamily: 'Mulish-Light',
            },
          })}
        />
        <Stack.Screen
          name="Notification"
          component={Notification}
          options={() => ({
            headerBackVisible: false,
            title: 'Notifikacija',
            headerStyle: {
              height: 100,
              elevation: 0,
            },
            headerTintColor: Colors.Light.whiteText,
            headerTitleStyle: {
              fontSize: 28,
              fontFamily: 'Mulish-Light',
              width: '100%',
            },
            headerBackground: () => (
              <View>
                <Svg
                  style={{position: 'absolute', top: -1}}
                  width={Dimensions.get('window').width + 10}
                  height="160"
                  fill="none"
                  viewBox={`0 0 ${Dimensions.get('window').width + 10} 160`}>
                  <G clip-path="url(#a)">
                    <Path
                      fill={
                        isDarkMode ? Colors.Dark.accent : Colors.Light.accent
                      }
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
          })}
        />
        <Stack.Screen
          name="NotificationViewrs"
          component={NotificationViewrs}
          options={() => ({
            headerBackVisible: false,
            title: 'Pregled',
            tabBarActiveTintColor: Colors.Light.whiteText,
            tabBarInactiveTintColor: Colors.Light.whiteText,
            tabBarLabelStyle: {
              fontSize: 12,
              fontFamily: 'Mulish',
            },
            headerStyle: {
              backgroundColor: Colors.Light.accent,
              height: 100,
              elevation: 0,
            },
            headerTintColor: Colors.Light.whiteText,
            headerTitleStyle: {
              fontSize: 28,
              fontFamily: 'Mulish',
            },
            headerTitleAlign: 'left',
            headerBackground: () => (
              <View>
                <Svg
                  style={{position: 'absolute', top: -1}}
                  width={Dimensions.get('window').width + 10}
                  height="160"
                  fill="none"
                  viewBox={`0 0 ${Dimensions.get('window').width + 10} 160`}>
                  <G clip-path="url(#a)">
                    <Path
                      fill={
                        isDarkMode ? Colors.Dark.accent : Colors.Light.accent
                      }
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
          })}
        />
        <Stack.Screen
          name="About"
          component={About}
          options={() => ({
            headerBackVisible: false,
            title: t('about'),
            headerStyle: {
              height: 100,
              elevation: 0,
            },
            headerTintColor: Colors.Light.whiteText,
            headerTitleStyle: {
              fontSize: 28,
              fontFamily: 'Mulish-Light',
              textTransform: 'capitalize',
            },
            headerBackground: () => (
              <View>
                <Svg
                  style={{position: 'absolute', top: -1}}
                  width={Dimensions.get('window').width + 10}
                  height="160"
                  fill="none"
                  viewBox={`0 0 ${Dimensions.get('window').width + 10} 160`}>
                  <G clip-path="url(#a)">
                    <Path
                      fill={
                        isDarkMode ? Colors.Dark.accent : Colors.Light.accent
                      }
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
          })}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
