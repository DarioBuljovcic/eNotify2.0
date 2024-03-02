/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, {useEffect} from 'react';
import {
  StyleSheet,
  Image,
  AppState,
  TouchableOpacity,
  Alert,
  Linking,
  ActivityIndicator,
} from 'react-native';
import 'react-native-gesture-handler';
import 'react-native-url-polyfill/auto';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import messaging from '@react-native-firebase/messaging';
import Registration from './screens/All/Registration';
import Loading from './screens/All/Loading';
import Student from './screens/Student/Student';
import Notification from './screens/All/Notification';

import Colors from './components/Constants/Color';
import {Navigation} from './components/Types/indexTypes';
import {LinkingOptions} from '@react-navigation/native';

const Stack = createStackNavigator<Navigation>();
const NAVIGATION_IDS = ['home', 'post', 'settings'];
type Loading1 = string;

function buildDeepLinkFromNotificationData(data: any): string | null {
  const navigationId = data?.navigationId;
  if (!NAVIGATION_IDS.includes(navigationId)) {
    console.warn('Unverified navigationId', navigationId);
    return null;
  }
  if (navigationId === 'home') {
    return 'myapp://home';
  }
  if (navigationId === 'settings') {
    return 'myapp://settings';
  }
  const postId = data?.postId;
  if (typeof postId === 'string') {
    return `myapp://post/${postId}`;
  }
  console.warn('Missing postId');
  return null;
}

const linking = {
  prefixes: ['myapp://'],
  config: {
    initialRouteName: 'Home',
    screens: {},
  },
  async getInitialURL() {
    const url = await Linking.getInitialURL();
    if (typeof url === 'string') {
      return url;
    }
    //getInitialNotification: When the application is opened from a quit state.
    const message = await messaging().getInitialNotification();
    const deeplinkURL = buildDeepLinkFromNotificationData(message?.data);
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
      const url = buildDeepLinkFromNotificationData(remoteMessage.data);
      if (typeof url === 'string') {
        listener(url);
      }
    });

    return () => {
      linkingSubscription.remove();
      unsubscribe();
    };
  },
};
function App(): React.JSX.Element {
  //Display message when in foreground
  useEffect(() => {
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      Alert.alert('A new FCM message arrived!', JSON.stringify(remoteMessage));
    });

    return unsubscribe;
  }, []);
  return (
    <NavigationContainer
      linking={linking}
      fallback={<ActivityIndicator animating />}>
      <Stack.Navigator>
        <Stack.Screen name="Loading" component={Loading} />
        {/* <Stack.Screen
          name="Registration"
          component={Registration}
          options={({navigation}) => ({
            headerBackVisible: false,
            title: 'Registracija',
            headerLeft: () => null,
            headerStyle: {
              backgroundColor: Colors.Light.accent,
              height: 100,
            },
            headerTintColor: Colors.Light.headerText,
            headerTitleStyle: {
              marginLeft: 10,
              fontSize: 22,
              textTransform: 'uppercase',
            },
            headerRight: () => (
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => navigation.navigate('Settings')}>
                <Image
                  style={{width: 25, height: 25, marginRight: 15}}
                  source={require('./images/cog-wheel.png')}
                />
              </TouchableOpacity>
            ),
          })}
        />
        <Stack.Screen
          name="Student"
          component={Student}
          options={({navigation}) => ({
            headerBackVisible: false,
            title: 'Glavni Meni',
            headerLeft: () => null,
            headerStyle: {
              backgroundColor: Colors.Light.accent,
              height: 100,
            },
            headerTintColor: Colors.Light.headerText,
            headerTitleStyle: {
              marginLeft: 10,
              fontSize: 22,
              textTransform: 'uppercase',
            },
            headerRight: () => (
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => navigation.navigate('Settings')}>
                <Image
                  style={{width: 25, height: 25, marginRight: 15}}
                  source={require('./images/cog-wheel.png')}
                />
              </TouchableOpacity>
            ),
          })}
        />
        <Stack.Screen
          name="Notification"
          component={Notification}
          options={({navigation}) => ({
            headerBackVisible: false,
            title: 'Notifikacija',
            headerLeft: () => null,
            headerStyle: {
              backgroundColor: Colors.Light.accent,
              height: 100,
            },
            headerTintColor: Colors.Light.headerText,
            headerTitleStyle: {
              marginLeft: 10,
              fontSize: 22,
              textTransform: 'uppercase',
            },
            headerRight: () => (
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => navigation.navigate('Settings')}>
                <Image
                  style={{width: 25, height: 25, marginRight: 15}}
                  source={require('./images/cog-wheel.png')}
                />
              </TouchableOpacity>
            ),
          })}
        /> */}
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
