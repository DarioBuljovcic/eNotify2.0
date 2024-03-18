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
    Notification: NotificationData,
    NotificationLoader: undefined,
    Settings: undefined,
    NavigationScreen: undefined,
    RasporedV2:undefined,
    RasporedV3:undefined,
}
type NotificationData={
  Notification:NotificationType;
}
export type RasporedV2 = StackScreenProps<Navigation,"RasporedV2">
export type RasporedV3 = StackScreenProps<Navigation,"RasporedV3">


type LoadingProps = StackScreenProps<Navigation, "Loading">
type StudentProps = StackScreenProps<Navigation, "Student" >
type StudentTabProps = BottomTabScreenProps<ParamListBase,"Obavestenja">
type ProfessorProps = StackScreenProps<Navigation, "Professor">
type RegistrationProps = StackScreenProps<Navigation, "Registration">
type NotificationLoaderProps = StackScreenProps<Navigation, "NotificationLoader">
type NavigationScreen = StackScreenProps<Navigation,"NavigationScreen">
//Notification
type NotificationType ={
  NotificationId:string,
  Tittle: string,
  Text:string,
  Class: string,
  Type:string,
  Files: string,
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
    accentGreen: string,

    appBackground: string,
    textInputBackground: string,

    lightText: string,
    whiteText:string,
    hyperlinkText: string,
};
type Theme ={
  Light:Color,
  Dark:Color
}


export type {Navigation,Theme,LoadingProps,StudentProps,StudentTabProps,ProfessorProps,RegistrationProps,NotificationLoaderProps,NotificationType,User,NavigationScreen};


