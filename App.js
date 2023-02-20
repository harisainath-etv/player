import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import Home from './screens/home';
import Video from './screens/videoPlayer';
import News from './screens/news';
import OtherResponse from './screens/otherResponse';
import Channels from './screens/channels';
import MoreList from './screens/moreList';
import Splash from './screens/splash';
import { BACKGROUND_COLOR } from './constants';
import { View } from 'react-native';

const Stack = createStackNavigator();
export default function App() {
  return (
    <View style={{ backgroundColor: BACKGROUND_COLOR,flex:1 }}>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{presentation:'transparentModal',backgroundColor:BACKGROUND_COLOR}}>
          <Stack.Screen name="Splash" component={Splash} options={{ header: () => null,backgroundColor:BACKGROUND_COLOR }} />
          <Stack.Screen name="Home" component={Home} options={{ header: () => null, }} />
          <Stack.Screen name="CustomeVideoPlayer" component={Video} options={{ header: () => null, }} />
          <Stack.Screen name="News" component={News} options={{ header: () => null, }} />
          <Stack.Screen name="OtherResponse" component={OtherResponse} options={{ header: () => null, }} />
          <Stack.Screen name="Channels" component={Channels} options={{ header: () => null, }} />
          <Stack.Screen name="MoreList" component={MoreList} options={{ header: () => null, }} />
        </Stack.Navigator>
      </NavigationContainer>
    </View>
  );
}