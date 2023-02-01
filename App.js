import * as React from 'react';
import { useEffect,useState } from 'react';
import { View,StyleSheet,Text,Image,TouchableOpacity,Pressable,BackHandler,Dimensions  } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import { createNavigationContainerRef } from '@react-navigation/native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'
import { DrawerActions } from '@react-navigation/native';

import Home from './screens/home';
import Video from './screens/videoPlayer';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();
const Top = createMaterialTopTabNavigator();
const Drawer = createDrawerNavigator();
const ref = createNavigationContainerRef();



const width=Dimensions.get('window').width;
const height=Dimensions.get('window').height;
export default function App() {
  useEffect(() => {
    //BackHandler.addEventListener('hardwareBackPress', onBackPress);
  });  

  return (
    <View style={styles.body}>
    <NavigationContainer
    >
      <Stack.Navigator>
        <Stack.Screen name="MainHome" component={Home}  options={{}}/>
        
        <Stack.Screen name="CustomeVideoPlayer" component={Video} options={{header:()=>null,}}/>
      </Stack.Navigator>
    </NavigationContainer>
    </View>
  );
}


const styles = StyleSheet.create({
  
});
