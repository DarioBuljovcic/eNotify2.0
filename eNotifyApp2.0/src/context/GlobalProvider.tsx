import {createContext, useContext, useState, useEffect} from 'react';
import {MMKV} from 'react-native-mmkv';
import {Appearance, ColorSchemeName, useColorScheme} from 'react-native';
import {Color, GlobarProviderProps, User} from '../constants/Types/indexTypes';
import loginUser from '../hooks/loginUser';
import Colors from '../constants/Color';

const storage = new MMKV();
const defaultContext = {
  isLoggedIn: false,
  setIsLoggedIn: (o: boolean) => {},
  user: undefined,
  setUser: () => {},
  isLoading: false,
  storage: storage,
  isDarkMode: Colors.Light,
  setMode: (o: Color) => {},
};
const GlobalContext = createContext<GlobarProviderProps>(defaultContext);

const useGlobalContext = () => useContext(GlobalContext);

const GlobalProvider = ({children}: any) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<User>();
  const [isLoading, setIsLoading] = useState(false);
  const [isDarkMode, setMode] = useState<Color>(Colors.Light);
  useEffect(() => {
    const getUser = async () => {
      setIsLoading(true);
      const UserID = await storage.getString('UserID');

      const Mode: ColorSchemeName = (await storage.getString(
        'Mode',
      )) as ColorSchemeName;
      try {
        if (UserID === undefined) {
          console.log('No account');
          setIsLoggedIn(false);
          setUser(undefined);
          return;
        }

        const user = await loginUser(UserID);

        user
          ? setUser(user)
          : () => {
              throw new Error();
            };
        setIsLoggedIn(true);
      } catch (error: any) {
        console.log(error.message);
      } finally {
        setIsLoading(false);
        if (Mode) {
          const theme = Mode === 'dark' ? Colors.Dark : Colors.Light;
          setMode(theme);
          Appearance.setColorScheme(Mode);
        } else Appearance.setColorScheme('light');
      }
    };
    getUser();
  }, []);
  useEffect(() => {
    console.log(isDarkMode);
  }, [isDarkMode]);

  return (
    <GlobalContext.Provider
      value={{
        isLoggedIn,
        setIsLoggedIn,
        user,
        setUser,
        isLoading,
        storage,
        isDarkMode,
        setMode,
      }}>
      {children}
    </GlobalContext.Provider>
  );
};
export {useGlobalContext};
export default GlobalProvider;
