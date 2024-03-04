import React, { Component, useEffect, useState } from 'react';
import { NavigationContainer, DarkTheme } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import FrontProfile from './screens/frontProfile';
import Home from './screens/home';
import News from './screens/news';
import OtherResponse from './screens/otherResponse';
import Channels from './screens/channels';
import MoreList from './screens/moreList';
import Signup from './screens/signup';
import Login from './screens/login';
import Shows from './screens/shows';
import Episode from './screens/episode';
import Calendarscreen from './screens/calendarscreen';
import EpisodesMoreList from './screens/episodesMoreList';
import Offline from './screens/offline';
import Otp from './screens/otp';
import MobileUpdate from './screens/mobileUpdate';
import WatchLater from './screens/watchLater';
import ActivateTv from './screens/activateTv';
import More from './screens/more';
import Webview from './screens/WebView';
import SearchCalendarEpisodes from './screens/searchCalendarEpisodes';
import Search from './screens/search';
import FoodFilter from './screens/FoodFilter';
import FilterData from './screens/FilterData';
import Profile from './screens/profile';
import EditProfile from './screens/editProfile';
import Feedback from './screens/feedback';
import Settings from './screens/settings';
import Subscribe from './screens/subscribe';
import Confirmation from './screens/confirmation';
import ForgotPassword from './screens/forgotPassword';
import Shorts from './screens/ShortVideos';
import TransparentHeader from './screens/transparentHeader';
import HtmlWebview from './screens/HtmlWebview';
import Menu from './screens/Menu';
import HTMLRender from './screens/HTMLRender';
import EpisodesMoreListUrl from './screens/EpisodesMoreListUrl';
import AsyncStorage from '@react-native-async-storage/async-storage';


const StackNav = () => {
  const[realtoken,setRealtoken] = useState('');
  const Stack = createStackNavigator();
  useEffect(()=>{
    const token = async()=>{
      var session = await AsyncStorage.getItem('session');
      setRealtoken(JSON.stringify(session));
    }
    token();
  },[])

  console.log('token', realtoken);
  const mytheme = {
    ...DarkTheme,
    colors: {
      ...DarkTheme.colors,
    },
  }
  const Screens =
    realtoken
      ?
      {
        Home:Home,
        News:News,
        OtherResponse:OtherResponse,
        Channels:Channels,
        MoreList:MoreList,
        Shows:Shows,
        Episode:Episode,
        Calendarscreen:Calendarscreen,
        EpisodesMoreList:EpisodesMoreList,
        Offline:Offline,
        MobileUpdate:MobileUpdate,
        WatchLater:WatchLater,
        ActivateTv:ActivateTv,
        More:More,
        Webview:Webview,
        SearchCalendarEpisodes:SearchCalendarEpisodes,
        Search:Search,
        FoodFilter:FoodFilter,
        FilterData:FilterData,
        Profile:Profile,
        EditProfile:EditProfile,
        Feedback:Feedback,
        Settings:Settings,
        Subscribe:Subscribe,
        Confirmation:Confirmation,
        Shorts:Shorts,
        TransparentHeader:TransparentHeader,
        HtmlWebview:HtmlWebview,
        Menu:Menu,
        HTMLRender:HTMLRender,
        EpisodesMoreListUrl:EpisodesMoreListUrl
      }
      :
      {
        // Splash: Splash,
        FrontProfile: FrontProfile,
        Signup:Signup,
        Login:Login,
        Otp:Otp,
        ForgotPassword:ForgotPassword
       
      }
  
    return (
      <NavigationContainer theme={mytheme}>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          {Object.entries({
            ...Screens,
          }).map(([name, component]) => {
            return <Stack.Screen name={name} component={component} />
          })}

        </Stack.Navigator>
      </NavigationContainer>
    );
};
export default StackNav;