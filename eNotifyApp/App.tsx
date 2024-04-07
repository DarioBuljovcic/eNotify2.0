import React, {useEffect, useRef, useState} from 'react';
import {
  StyleSheet,
  Linking,
  ActivityIndicator,
  View,
  Dimensions,
} from 'react-native';
import 'react-native-gesture-handler';
import 'react-native-url-polyfill/auto';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import messaging from '@react-native-firebase/messaging';
import Registration from './screens/All/Registration';
import Student from './screens/Student/Student';
import Professor from './screens/Professor/Professor';
import Notification from './screens/All/Notification';
import Colors from './components/Constants/Color';
import {Navigation} from './components/Types/indexTypes';
import LinearGradient from 'react-native-linear-gradient';
import About from './screens/All/About';
import NavigationScreen from './screens/All/NavigationScreen';
import NotificationViewrs from './screens/Professor/NotificationViewrs';
import Svg, {Path, G, Defs, ClipPath} from 'react-native-svg';

const Stack = createStackNavigator<Navigation>();
const NAVIGATION_IDS = ['Registration', 'Notification', 'Professor'];
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
      console.log(remoteMessage);
      const url = buildDeepLinkFromNotificationData(remoteMessage);

      if (typeof url === 'string') {
        console.log(url);
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

function App(): React.JSX.Element {
  const [unseenNotify, setUnseenNotify] = useState(0);
  useEffect(() => {
    const unsubscribe = messaging().onMessage(async remoteMessage => {});

    return unsubscribe;
  }, []);
  useEffect(() => {
    const unsubscribe = messaging().setBackgroundMessageHandler(
      async remoteMessage => {},
    );
    return unsubscribe;
  });
  return (
    <NavigationContainer
      linking={linking}
      fallback={<ActivityIndicator animating />}>
      <Stack.Navigator>
        <Stack.Screen
          name="Registration"
          component={Registration}
          options={() => ({
            headerBackVisible: false,
            title: 'Registracija',
            headerLeft: () => null,
            headerStyle: {
              height: 100,
            },
            headerTintColor: Colors.Light.whiteText,
            headerTitleStyle: {
              fontSize: 35,
              fontFamily: 'Mulish-Light',
            },
            headerBackground: () => (
              <View>
                {/* <Svg
                  viewBox="0 0 1440 320"
                  height={100}
                  width={}
                  style={{position: 'absolute', top: 80, right: 0}}>
                  <Path
                    fill={Colors.Light.accent}
                    fill-opacity="1"
                    d="M0,160L40,165.3C80,171,160,181,240,160C320,139,400,85,480,74.7C560,64,640,96,720,117.3C800,139,880,149,960,170.7C1040,192,1120,224,1200,245.3C1280,267,1360,277,1400,282.7L1440,288L1440,0L1400,0C1360,0,1280,0,1200,0C1120,0,1040,0,960,0C880,0,800,0,720,0C640,0,560,0,480,0C400,0,320,0,240,0C160,0,80,0,40,0L0,0Z"></Path>
                </Svg> */}
                <Svg
                  width={Dimensions.get('window').width}
                  height="250"
                  fill="none"
                  viewBox={`0 0 ${Dimensions.get('window').width} 250`}>
                  <Path
                    fill={Colors.Light.accent}
                    d="M0 0h410v220.645c-55 48.855-136.5 8.855-165 0S86.5 148 0 220.645V0Z"
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
            headerBackground: () => (
              <LinearGradient
                start={{x: 0.8, y: 0}}
                end={{x: 0, y: 0}}
                colors={[Colors.Light.accent, Colors.Light.accentGreen]}
                style={{flex: 1}}
              />
            ),
          })}
        />
        <Stack.Screen
          name="Student"
          component={Student}
          options={() => ({
            headerBackVisible: false,
            title: 'Obavestenja',
            headerLeft: () => null,
            headerStyle: {
              height: 60,
            },
            headerTintColor: Colors.Light.whiteText,
            headerTitleStyle: {
              fontSize: 23,
              fontFamily: 'Mulish-Light',
            },
            headerBackground: () => (
              <LinearGradient
                start={{x: 0.8, y: 0}}
                end={{x: 0, y: 0}}
                colors={[Colors.Light.accent, Colors.Light.accentGreen]}
                style={{flex: 1}}
              />
            ),
          })}
        />
        <Stack.Screen
          name="Professor"
          component={Professor}
          options={() => ({
            headerBackVisible: false,
            title: 'Glavni Meni',
            headerLeft: () => null,
            headerStyle: {
              height: 60,
            },
            headerTintColor: Colors.Light.whiteText,
            headerTitleStyle: {
              fontSize: 23,
              fontFamily: 'Mulish-Light',
            },
            headerBackground: () => (
              <LinearGradient
                start={{x: 0.8, y: 0}}
                end={{x: 0, y: 0}}
                colors={[Colors.Light.accent, Colors.Light.accentGreen]}
                style={{flex: 1}}
              />
            ),
          })}
        />
        <Stack.Screen
          name="Notification"
          component={Notification}
          options={() => ({
            headerBackVisible: false,
            title: 'Notifikacija',
            headerStyle: {
              height: 200,
              elevation: 0,
            },
            headerTintColor: Colors.Light.whiteText,
            headerTitleStyle: {
              fontSize: 35,
              fontFamily: 'Mulish-Light',
            },
            headerBackground: () => (
              <View>
                <Svg
                  style={{position: 'absolute', top: -1}}
                  width={Dimensions.get('window').width}
                  height="200"
                  fill="none"
                  viewBox={`0 0 ${Dimensions.get('window').width} 200`}>
                  <G clip-path="url(#a)">
                    <Path fill={Colors.Light.accent} d="M0 0h390v234H0z" />
                    <Path
                      fill="#206AF9"
                      d="M376.3 105.314c43.088 197.888-49.188 185.883-185.853 162.133-13.245-2.302-20.441-16.805-15.339-29.243 23.369-56.97 18.098-95.949-16.553-116.305-42.185-24.782-98.442-59.87-66.937-97.303C135.429-27.458 250.217-8.186 312.134-8.186c82.843 0 64.166 30.657 64.166 113.5Z"
                    />
                    <Path
                      fill="#205DF9"
                      d="M448.3 99.889c38.177 175.333-29.912 185.893-140.987 169.503-20.086-2.964-46.196-56.658-44.273-76.871 4.264-44.831-10.242-100.086-75.96-122.42-18.342-6.235-30.754-25.903-21.712-43.036 67.933-128.732 174.629-40.676 218.766-40.676 82.843 0 64.166 30.657 64.166 113.5Z"
                    />
                    <Path
                      fill="#2050F9"
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
              height: 200,
              elevation: 0,
            },
            headerTintColor: Colors.Light.whiteText,
            headerTitleStyle: {
              fontSize: 35,
              fontFamily: 'Mulish',
            },
            headerTitleAlign: 'left',
            headerBackground: () => (
              <View>
                <Svg
                  style={{position: 'absolute', top: -1}}
                  width={Dimensions.get('window').width}
                  height="200"
                  fill="none"
                  viewBox={`0 0 ${Dimensions.get('window').width} 200`}>
                  <G clip-path="url(#a)">
                    <Path fill={Colors.Light.accent} d="M0 0h390v234H0z" />
                    <Path
                      fill="#206AF9"
                      d="M376.3 105.314c43.088 197.888-49.188 185.883-185.853 162.133-13.245-2.302-20.441-16.805-15.339-29.243 23.369-56.97 18.098-95.949-16.553-116.305-42.185-24.782-98.442-59.87-66.937-97.303C135.429-27.458 250.217-8.186 312.134-8.186c82.843 0 64.166 30.657 64.166 113.5Z"
                    />
                    <Path
                      fill="#205DF9"
                      d="M448.3 99.889c38.177 175.333-29.912 185.893-140.987 169.503-20.086-2.964-46.196-56.658-44.273-76.871 4.264-44.831-10.242-100.086-75.96-122.42-18.342-6.235-30.754-25.903-21.712-43.036 67.933-128.732 174.629-40.676 218.766-40.676 82.843 0 64.166 30.657 64.166 113.5Z"
                    />
                    <Path
                      fill="#2050F9"
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
            title: 'O aplikaciji',
            headerStyle: {
              height: 200,
              elevation: 0,
            },
            headerTintColor: Colors.Light.whiteText,
            headerTitleStyle: {
              fontSize: 35,
              fontFamily: 'Mulish-Light',
            },
            headerBackground: () => (
              <View>
                <Svg
                  style={{position: 'absolute', top: -1}}
                  width={Dimensions.get('window').width}
                  height="200"
                  fill="none"
                  viewBox={`0 0 ${Dimensions.get('window').width} 200`}>
                  <G clip-path="url(#a)">
                    <Path fill={Colors.Light.accent} d="M0 0h390v234H0z" />
                    <Path
                      fill="#206AF9"
                      d="M376.3 105.314c43.088 197.888-49.188 185.883-185.853 162.133-13.245-2.302-20.441-16.805-15.339-29.243 23.369-56.97 18.098-95.949-16.553-116.305-42.185-24.782-98.442-59.87-66.937-97.303C135.429-27.458 250.217-8.186 312.134-8.186c82.843 0 64.166 30.657 64.166 113.5Z"
                    />
                    <Path
                      fill="#205DF9"
                      d="M448.3 99.889c38.177 175.333-29.912 185.893-140.987 169.503-20.086-2.964-46.196-56.658-44.273-76.871 4.264-44.831-10.242-100.086-75.96-122.42-18.342-6.235-30.754-25.903-21.712-43.036 67.933-128.732 174.629-40.676 218.766-40.676 82.843 0 64.166 30.657 64.166 113.5Z"
                    />
                    <Path
                      fill="#2050F9"
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

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default App;
