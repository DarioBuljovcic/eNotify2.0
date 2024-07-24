import {BottomTabScreenProps} from '@react-navigation/bottom-tabs';
import {ParamListBase} from '@react-navigation/native';
import {StackScreenProps} from '@react-navigation/stack';
import {Timestamp} from 'firebase/firestore';
import {Dispatch, SetStateAction} from 'react';
import {DocumentPickerResponse} from 'react-native-document-picker';
import {MMKV} from 'react-native-mmkv';

//Navigation
export type Navigation = {
  Registration: undefined;
  Notification: NotificationData;
  Tabs: undefined;
  About: undefined;
  LogOutModal: undefined;
  LanguageModal: undefined;
  NotificationViewrs: undefined;
  OpenImageModal: undefined;
};
export type NotificationData = {
  Notification: NotificationType;
};

export type RegistrationProps = StackScreenProps<Navigation, 'Registration'>;

//Notification
export type NotificationType = {
  NotificationId: string;
  Title: string;
  Text: string;
  Class: string | string[];
  Type: string;
  Files: string;
  Date: Timestamp;
  Seen: string;
  From: string;
};
export type User = {
  UserID: string;
  Name: string;
  Email: string;
  Class: string;
  Role: string;
  LogOut: boolean;
  profile_picture: string;
};
export type Class = {
  [key: string]: string;
  Class: string;
  ponedeljak: string;
  utorak: string;
  sreda: string;
  cetvrtak: string;
  petak: string;
};
export type Images = {
  imageUrl: string;
  imageName: string;
};
export type Icon = {
  name: string;
  color: string;
};

//Colors
export type Color = {
  appBackground: string;
  componentBG: string;
  textPrimary: string;
  textSecondary: string;

  headerFirst: string;
  headerSecond: string;
  headerThird: string;

  white: string;
  black: string;
  green: string;

  accent: string;

  textInputBackground: string;

  lightText: string;
  whiteText: string;
  hyperlinkText: string;
  warningRed: string;
};
export type Theme = {
  Light: Color;
  Dark: Color;
};

//components
export type TabIconProps = {
  icon: string;
  focused: boolean;
  color: string;
  size: number;
};
export type GlobarProviderProps = {
  isLoggedIn: boolean;
  setIsLoggedIn: (o: boolean) => void;
  user: User | undefined;
  setUser: Dispatch<SetStateAction<User | undefined>>;
  isLoading: boolean;
  storage: MMKV;
  isDarkMode: Color;
  setMode: (o: Color) => void;
};
export type LogOutModalProps = {
  onConfirm: () => void;
  onCancle: () => void;
};
export type OneNotificationProps = {
  item: NotificationType;
  index: number;
  navigation: any;
  date: string;
};
export type NotificationSeenProps = {
  navigation: any;
  notification: NotificationType;
};
export type OpenImageProps = {
  setShown: (o: boolean) => void;
  setMessage: (o: string) => void;
  setIcon: (o: Icon) => void;
  shownImage: Images;
  shown: boolean;
  setModalOpen: (o: boolean) => void;
  navigation: any;
};
export type ImageModalProps = {
  message: string;
  shown: boolean;
  icon: Icon;
};
export type SmallImageProps = {
  image: Images;
  index: number;
  handleOpen: () => void;
};

//Hooks
export type getNotificationProps = {
  role: string;
  userClass: string;
  userId: string;
};
export type sendNotificationProps = {
  TextValue: string;
  TitleValue: string;
  selectedFiles: DocumentPickerResponse[] | null;
  selectedClass: string;
  Name: string;
};
export type logOutProps = {
  navigation: any;
  User: User;
};
