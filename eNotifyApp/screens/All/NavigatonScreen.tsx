import firestore from '@react-native-firebase/firestore';
import Colors from '../../components/Constants/Color';
import { User } from '../../components/Types/indexTypes';
import { View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Student from '../Student/Student';
import Settings from './Settings';
import React, { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Text } from 'react-native-elements';
import UserScreen from './UserScreen';

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
            <Tab.Navigator>
                <Tab.Screen 
                    name="Student" 
                    component={Student} 
                    options={{ 
                        headerShown: false 

                    }}/>
                <Tab.Screen
                    name="Nalog"
                    component={UserScreen}
                    options={{
                        headerShown: false

                    }}/>
            </Tab.Navigator>
        );
    }else if(role=='Professor'){//(Profesor)
        return(
            <View><Text>prof</Text></View>
        );
    }
}

export default NavigationScreen;