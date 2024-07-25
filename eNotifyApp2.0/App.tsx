import React, {useCallback, useEffect, useState} from 'react';
import {
  Linking,
  ActivityIndicator,
  View,
  Dimensions,
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
import Colors from './src/constants/Color';
import {Navigation} from './src/constants/Types/indexTypes';

import Svg, {Path} from 'react-native-svg';
import SignIn from './src/screens/Auth/SignIn';
import GlobalProvider from './src/context/GlobalProvider';
import LayoutTabs from './src/screens/Tabs/_layout';
import About from './src/screens/Tabs/About';
import Notification from './src/screens/Notifications/Notification';
import LogOutModal from './src/components/LogOutModal';
import LanguageModal from './src/components/LanguageModal';
import OpenImageModal from './src/components/OpenImageModal';
import NotificationViewrs from './src/screens/Notifications/NotificationViewrs';
import {MMKV} from 'react-native-mmkv';
import translations from './src/constants/i18n/translations/translation';
import {useTranslation} from 'react-i18next';

PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS);
PermissionsAndroid.request(
  PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
);
PermissionsAndroid.request(
  PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
);
const CustomDefaultTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: '#f1f6ff',
    card: '#f1f6ff',
  },
};

const CustomDarkTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    background: '#031525',
    card: '#031525',
  },
};
const storage = new MMKV();
function App(): React.JSX.Element {
  LogBox.ignoreAllLogs();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const {t} = useTranslation();

  const Stack = createStackNavigator<Navigation>();
  const screenWidth = Dimensions.get('window').width;

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

  Appearance.addChangeListener(e => {
    const mode = e.colorScheme === 'dark' ? true : false;
    setIsDarkMode(mode);
  });

  const TestTheme = useCallback(() => {
    const themeStorage = storage.getString('Mode');
    let theme = isDarkMode ? CustomDarkTheme : CustomDefaultTheme;

    if (themeStorage) {
      theme = themeStorage === 'dark' ? CustomDarkTheme : CustomDefaultTheme;
    }

    return theme;
  }, [isDarkMode]);

  return (
    <GlobalProvider>
      <NavigationContainer
        linking={linking}
        fallback={<ActivityIndicator animating />}
        theme={TestTheme()}>
        <Stack.Navigator
          initialRouteName="Registration"
          screenOptions={{
            animationEnabled: true,
          }}>
          <Stack.Screen
            name="Registration"
            component={SignIn}
            options={() => ({
              headerTitle: t(translations.registration),
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
                    width={screenWidth}
                    height="241"
                    viewBox={`0 0 ${screenWidth} 241`}
                    fill="none">
                    <Path
                      d="M0 0H541V217.519C464.705 265.682 351.65 226.249 312.115 217.519C272.581 208.789 119.991 145.903 0 217.519V0Z"
                      fill={
                        isDarkMode ? Colors.Dark.accent : Colors.Light.accent
                      }
                    />
                  </Svg>
                </View>
              ),
            })}
          />
          <Stack.Screen
            name="Tabs"
            component={LayoutTabs}
            options={() => ({
              headerShown: false,
            })}
          />
          <Stack.Screen
            name="Notification"
            component={Notification}
            options={() => ({
              headerTitle: '',
              cardStyle: {backgroundColor: Colors.Light.black},
            })}
          />
          <Stack.Screen
            name="NotificationViewrs"
            component={NotificationViewrs}
            options={() => ({
              headerTitle: t(translations.view),
              headerTitleStyle: {
                textTransform: 'capitalize',
                fontFamily: 'Mulish',
              },
              headerShown: true,
              headerStyle: {
                elevation: 0,
                shadowOpacity: 0,
              },
            })}
          />
          <Stack.Screen
            name="About"
            component={About}
            options={() => ({
              headerTitle: t(translations.about),
              headerTitleStyle: {
                textTransform: 'capitalize',
                fontFamily: 'Mulish',
              },
              headerShown: true,
            })}
          />
          <Stack.Screen
            name="LogOutModal"
            component={LogOutModal}
            options={() => ({
              presentation: 'transparentModal',
              header: props => <></>,
            })}
          />
          <Stack.Screen
            name="LanguageModal"
            component={LanguageModal}
            options={() => ({
              presentation: 'transparentModal',
              headerBackVisible: false,
              header: props => <></>,
            })}
          />
          <Stack.Screen
            name="OpenImageModal"
            component={OpenImageModal}
            options={() => ({
              presentation: 'transparentModal',
              headerBackVisible: false,
              header: props => <></>,
            })}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </GlobalProvider>
  );
}

export default App;
