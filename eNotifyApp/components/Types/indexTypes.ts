import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import { ParamListBase } from "@react-navigation/native";
import { StackScreenProps } from "@react-navigation/stack";
import { Timestamp } from "firebase/firestore";



//Navigation
type Navigation = {
    Loading: undefined,
    About : undefined,
    Student : undefined,
    Professor: undefined,
    Registration: undefined,
    Notification: undefined,
    NotificationLoader: undefined,
    Settings: undefined,
    NavigationScreen: undefined,
}
type LoadingProps = StackScreenProps<Navigation, "Loading">
type StudentProps = StackScreenProps<Navigation, "Student">
type StudentTabProps = BottomTabScreenProps<ParamListBase,"Student">
type ProfessorProps = StackScreenProps<Navigation, "Professor">
type RegistrationProps = StackScreenProps<Navigation, "Registration">
type NotificationLoaderProps = StackScreenProps<Navigation, "NotificationLoader">
type SettingsProps = StackScreenProps<Navigation, "Settings">
type NavigationScreen = StackScreenProps<Navigation,"NavigationScreen">
//Notification
type Notification ={
  Tittle: string,
  Text:string,
  Class: string,
  Type:string,
  File: string,
  Image: string,
  Date: Timestamp
}
type User = {
  UserID: string,
  Name: string,
  Email: string,
  Class: string
  Role: string
}


//Colors
type Color = {
    primary: string,
    secondary: string,
    notificationBG: string,
    headerBG: string,
    textPrimary: string,
    textSecondary: string,
    headerText: string,

    white: string,
    black: string,

    accent: string,
    appBackground: string,
    textInputBackground: string,
    lightText: string,
    whiteText:string,
    //darkText:string,
};
type Theme ={
  Light:Color,
  Dark:Color
}


export type {Navigation,Theme,LoadingProps,StudentProps,StudentTabProps,ProfessorProps,RegistrationProps,NotificationLoaderProps,SettingsProps,Notification,User,NavigationScreen};


