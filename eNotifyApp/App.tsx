import React, {useEffect, useRef, useState} from 'react';
import {StyleSheet, Linking, ActivityIndicator} from 'react-native';
import 'react-native-gesture-handler';
import 'react-native-url-polyfill/auto';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import messaging from '@react-native-firebase/messaging';
import Registration from './screens/All/Registration';
import Loading from './screens/All/Loading';
import Student from './screens/Student/Student';
import Professor from './screens/Professor/Professor';
import Notification from './screens/All/Notification';
import Colors from './components/Constants/Color';
import {Navigation} from './components/Types/indexTypes';
import NavigationScreen from './screens/All/NavigatonScreen';
import LinearGradient from 'react-native-linear-gradient';
import Rasporedv3 from './screens/Student/RasporedV3';

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
            title: 'Unesite kod',
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
