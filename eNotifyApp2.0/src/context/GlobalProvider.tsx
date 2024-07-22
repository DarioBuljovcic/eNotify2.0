import {createContext, useContext, useState, useEffect} from 'react';
import {MMKV} from 'react-native-mmkv';
import {useColorScheme} from 'react-native';
import {GlobarProviderProps, User} from '../constants/Types/indexTypes';
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
};
const GlobalContext = createContext<GlobarProviderProps>(defaultContext);

const useGlobalContext = () => useContext(GlobalContext);

const GlobalProvider = ({children}: any) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<User>();
  const [isLoading, setIsLoading] = useState(false);
  const isDarkMode = useColorScheme() === 'dark' ? Colors.Dark : Colors.Light;
  useEffect(() => {
    const getUser = async () => {
      const UserID = await storage.getString('UserID');
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
      }
      setIsLoading(false);
    };
    getUser();
  }, []);

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
      }}>
      {children}
    </GlobalContext.Provider>
  );
};
export {useGlobalContext};
export default GlobalProvider;
