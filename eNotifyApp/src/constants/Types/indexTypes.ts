import {BottomTabScreenProps} from '@react-navigation/bottom-tabs';
import {ParamListBase} from '@react-navigation/native';
import {StackScreenProps} from '@react-navigation/stack';
import {Timestamp} from 'firebase/firestore';

//Navigation
export type Navigation = {
  About: undefined;
  Student: undefined;
  Professor: undefined;
  Registration: undefined;
  Notification: NotificationData;
  NotificationLoader: undefined;
  Settings: undefined;
  NavigationScreen: undefined;
  TimeTable: undefined;
  UserScreen: undefined;
  NotificationViewrs: undefined;
};
export type NotificationData = {
  Notification: NotificationType;
};
export type TimeTable = StackScreenProps<Navigation, 'TimeTable'>;

export type StudentProps = StackScreenProps<Navigation, 'Student'>;
export type StudentTabProps = BottomTabScreenProps<
  ParamListBase,
  'Notifications'
>;
export type ProfessorProps = StackScreenProps<Navigation, 'Professor'>;
export type ProfessorTabProps = BottomTabScreenProps<
  ParamListBase,
  'Notifications'
>;
export type RegistrationProps = StackScreenProps<Navigation, 'Registration'>;
export type NotificationLoaderProps = StackScreenProps<
  Navigation,
  'NotificationLoader'
>;
export type NavigationScreenProps = StackScreenProps<
  Navigation,
  'NavigationScreen'
>;
export type UserScreenTabProps = BottomTabScreenProps<
  ParamListBase,
  'UserScreen' | 'MyAccount'
>;

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

//Colors
export type Color = {
  primary: string;
  secondary: string;
  notificationBG: string;
  headerBG: string;
  textPrimary: string;
  textSecondary: string;
  headerText: string;

  headerFirst: string;
  headerSecond: string;
  headerThird: string;

  white: string;
  black: string;

  accent: string;
  accentGreen: string;

  appBackground: string;
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
