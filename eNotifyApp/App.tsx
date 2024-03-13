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
import Professor from './screens/Professor/Professor';
import Notification from './screens/All/Notification';
import Settings from './screens/All/Settings';

import Colors from './components/Constants/Color';
import {Navigation} from './components/Types/indexTypes';
import NavigationScreen from './screens/All/NavigatonScreen';


const Stack = createStackNavigator<Navigation>();
const NAVIGATION_IDS = ['Registration', 'Notification', 'Professor'];
type Screens = {
  [key: string]: string;
};

function buildDeepLinkFromNotificationData(data: any): string | null {
  console.log('This opened');
  const navigationId = data?.navigationId;
  if (!NAVIGATION_IDS.includes(navigationId)) {
    console.warn('Unverified navigationId', navigationId);
    return null;
  }
  if (navigationId === 'Registration') {
    return 'myapp://Registration';
  }
  if (navigationId === 'Notification') {
    return 'myapp://Notification';
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
    initialRouteName: `Registration`,
    screens: {
      Registration: `Registration`,
    } as Screens,
  },
  async getInitialURL() {
    console.log('This opened getInitialURL');
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
    console.log('This opened subscribe');
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
        <Stack.Screen
          name="Registration"
          component={Registration}
          options={() => ({
            headerBackVisible: false,
            title: 'Unesite kod',
            headerLeft: () => null,
            headerStyle: {
              backgroundColor: Colors.Light.accent,
              height: 100,
            },
            headerTintColor: Colors.Light.whiteText,
            headerTitleStyle: {
              fontSize: 30,
            },
            headerTitleAlign: 'center'
          })}
        />
        <Stack.Screen
          name="NavigationScreen"
          component={NavigationScreen}
          options={({navigation}) => ({
            headerBackVisible: false,
            headerShown: false,
            headerLeft: () => null,
            headerStyle: {
              backgroundColor: Colors.Light.accent,
              height: 100,
            },
            headerTintColor: Colors.Light.whiteText,
            headerTitleStyle: {
              marginLeft: 20,
              fontSize: 30,
            },
          })}
        />
        <Stack.Screen
          name="Student"
          component={Student}
          options={({navigation}) => ({
            headerBackVisible: false,
            title: 'Obavestenja',
            headerLeft: () => null,
            headerStyle: {
              backgroundColor: Colors.Light.accent,
              height: 100,
            },
            headerTintColor: Colors.Light.whiteText,
            headerTitleStyle: {
              marginLeft: 20,
              fontSize: 30,
            },
          })}
        />
        <Stack.Screen
          name="Professor"
          component={Professor}
          options={({navigation}) => ({
            headerBackVisible: false,
            title: 'Glavni Meni',
            headerLeft: () => null,
            headerStyle: {
              backgroundColor: Colors.Light.accent,
              height: 100,
            },
            headerTintColor: Colors.Light.whiteText,
            headerTitleStyle: {
              marginLeft: 10,
              fontSize: 30,
            },
          })}
        />
        <Stack.Screen
          name="Notification"
          component={Notification}
          options={({navigation}) => ({
            headerBackVisible: false,
            title: 'Notifikacija',
            headerStyle: {
              backgroundColor: Colors.Light.accent,
              height: 100,
            },
            headerTintColor: Colors.Light.whiteText,
            headerTitleStyle: {
              fontSize: 30,
            },
          })}
        />
        <Stack.Screen
          name="Settings"
          component={Settings}
          options={({navigation}) => ({
            headerBackVisible: false,
            title: 'Notifikacija',
            headerStyle: {
              backgroundColor: Colors.Light.accent,
              height: 100,
            },
            headerTintColor: Colors.Light.whiteText,
            headerTitleStyle: {
              fontSize: 30,
            },
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
