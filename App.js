
import { StyleSheet} from 'react-native';
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import tasks from './component/tasks';
import Login from './component/Login';
import Create from './component/Create';


const Stack = createNativeStackNavigator();


export default function App() {

  return (
    
    <NavigationContainer>
    <Stack.Navigator initialRouteName='Login'>
      <Stack.Screen name='tasks' component={tasks}/>
      <Stack.Screen name='Login' component={Login}/>
      <Stack.Screen name='Create' component={Create}/>
    </Stack.Navigator>
    </NavigationContainer>
  );
}
