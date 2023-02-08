import * as React from 'react';
import { View,StyleSheet,Text,Image,  } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';

import Home from './screens/home';
import Video from './screens/videoPlayer';

// import ChromeCast from './screens/chromecast';
import Shorts from './screens/shorts';
const Stack = createStackNavigator();

const CustomDrawer = (props) =>{
  return(
    <View style={{flex:1}}>
    <DrawerContentScrollView {...props}>
      <View style={{flexDirection:'row', justifyContent:'space-between', padding:20, alignItems:'center', backgroundColor:'#f6f6f6',marginBottom:20,}}>
        <View>
          <Text>Hari</Text>
          <Text>hari.sainath@etv.co.in</Text>
        </View>
        <Image
        style={styles.profilePic}
        source={require('./assets/images/logo.png')}
      />
      </View>
      <DrawerItemList  {...props}></DrawerItemList>
    </DrawerContentScrollView>
    <Text style={{position:'absolute',bottom:0,fontSize:10,fontWeight:'bold',right:0}}>v.1.1.1</Text>
    </View>
  );
}

export default function App() {
    return (
    <NavigationContainer>
      <Stack.Navigator>
      {/* <Stack.Screen name="Shorts" component={Shorts}  options={{header:()=>null,}}/> */}
        <Stack.Screen name="Home" component={Home} options={{header:()=>null,}}/>
        <Stack.Screen name="CustomeVideoPlayer" component={Video} options={{header:()=>null,}}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}


const styles = StyleSheet.create({
  
});
