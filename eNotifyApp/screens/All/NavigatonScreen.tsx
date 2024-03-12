import firestore from '@react-native-firebase/firestore';
import Colors from '../../components/Constants/Color';
import { User } from '../../components/Types/indexTypes';
import { StyleSheet, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Student from '../Student/Student';
import Settings from './Settings';
import React, { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Image, Text } from 'react-native-elements';
import UserScreen from './UserScreen';
import Ionicons from 'react-native-vector-icons/Ionicons';

const NavigationScreen=()=>{
    const [role,setRole] = useState('');

    useEffect(()=>{
        const saveUser = async () => {
            setRole(await AsyncStorage.getItem('Role') as string);
        };
        saveUser();
    });

    const Tab = createBottomTabNavigator();
    if(role=='Student') {//check role (Student)
        return(
            <Tab.Navigator
                screenOptions={({ route }) => ({
                    tabBarIcon: ({ focused, color, size }) => {
                    let iconName:string='';
        
                    if (route.name === 'Obavestenja') {
                        iconName = focused ? 'notifications': 'notifications-outline';
                    } else if (route.name === 'Raspored') {
                        iconName = focused ? 'calendar' : 'calendar-outline';
                    } else if (route.name === 'Nalog') {
                        iconName = focused ? 'people' : 'people-outline';
                    } 
                    size=30;
                    // You can return any component that you like here!
                    return <Ionicons name={iconName} size={size} color={color} />;
                    },
                    tabBarActiveTintColor: Colors.Light.whiteText,
                    tabBarInactiveTintColor: Colors.Light.whiteText,
                    tabBarStyle: styles.tabBar,
                    headerStyle: {
                        backgroundColor: Colors.Light.accent,
                        height: 90,
                      },
                      headerTintColor: Colors.Light.whiteText,
                      headerTitleStyle: {
                        fontSize: 30,
                      },
                      headerTitleAlign: 'center'
                      
                })}
            >
                <Tab.Screen 
                    name="Obavestenja" 
                    component={Student} 
                    />
                <Tab.Screen
                    name="Raspored"
                    component={UserScreen}//TODO: dodati raspored
                    />
                <Tab.Screen
                    name="Nalog"
                    component={UserScreen}
                    />
            </Tab.Navigator>
        );
    }else if(role=='Professor'){//(Profesor)
        return(
            <View><Text>prof</Text></View>
        );
    }
}

const styles = StyleSheet.create({
    userImage:{
        width:20,
        height:20,
    },
    tabBar:{
        backgroundColor:Colors.Light.accent,
        height:80,
        paddingBottom:10,
        paddingTop:10,
        position:'absolute'
    },
})

export default NavigationScreen;