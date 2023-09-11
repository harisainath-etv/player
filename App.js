import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Home from './screens/home';
// import Video from './screens/videoPlayer';
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
import FrontProfile from './screens/frontProfile';
import Feedback from './screens/feedback';
import Settings from './screens/settings';
import Subscribe from './screens/subscribe';
import ForgotPassword from './screens/forgotPassword';
import Confirmation from './screens/confirmation';
import Shorts from './screens/ShortVideos';
import TransparentHeader from './screens/transparentHeader';
import Reload from './screens/reload';
import { BACKGROUND_COLOR, FIRETV_BASE_URL, AUTH_TOKEN, APP_VERSION, FIRETV_BASE_URL_STAGING, VIDEO_AUTH_TOKEN, ACCESS_TOKEN } from './constants';
import { View, Dimensions, Platform, Linking, Alert } from 'react-native';
//import SplashScreen from 'react-native-splash-screen'
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

import messaging from '@react-native-firebase/messaging';
import queryString from 'query-string';


const Stack = createStackNavigator();

const useInitialURL = () => {
  const [url, setUrl] = React.useState(null);
  const [processing, setProcessing] = React.useState(true);
  React.useEffect(() => {
    const getUrlAsync = async () => {
      // Get the deep link used to open the app      
      const initialUrl = await Linking.getInitialURL();
      // The setTimeout is just for testing purpose      
      if (initialUrl != "" && initialUrl != null && initialUrl != 'null') {
        setTimeout(() => {
          setUrl(initialUrl);
          setProcessing(false);
          console.log(initialUrl);
          const parsed = queryString.parseUrl(initialUrl);
          if (parsed.query.device_code != "" && parsed.query.device_code != null && parsed.query.device_code != 'null') activateTv(parsed.query.device_code)
        }, 1000);
      }
    };
    getUrlAsync();
  }, []);
  return { url, processing };
};

const activateTv = async (otp) => {
  var sessionId = await AsyncStorage.getItem('session');
  var region = await AsyncStorage.getItem('country_code');
  if (sessionId != "" && sessionId != null && sessionId != 'null') {
    axios.post(FIRETV_BASE_URL_STAGING + "/generate_session_tv", {
      auth_token: VIDEO_AUTH_TOKEN,
      access_token: ACCESS_TOKEN,
      region: region,
      user: { session_id: sessionId, token: otp }
    }, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      }
    }).then(response => { alert("Activated"); }).catch(error => { })
  }
}


async function requestUserPermission() {
  const authStatus = await messaging().requestPermission();
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  if (enabled) {
    console.log('Authorization status:', authStatus);
  }
}

export default function App() {
  const { url: initialUrl, processing } = useInitialURL();
  const width = Dimensions.get('window').width;
  const height = Dimensions.get('window').height;
  async function loadDefaultData() {

    {
      processing
        ? console.log('Processing the initial url from a deep link')
        : console.log(`The deep link is: ${initialUrl || 'None'}`)
    }

    const getCurrentVersion = await AsyncStorage.getItem('currentVersion');
    const firstload = await AsyncStorage.getItem('firstload');
    if (firstload == "" || firstload == null) {
      await AsyncStorage.setItem('firstload', 'yes');
    }
    else {
      await AsyncStorage.setItem('firstload', 'no');
    }

    //fetching ip data
    const ipdetails = FIRETV_BASE_URL + "/regions/autodetect/ip.gzip?auth_token=" + AUTH_TOKEN;
    const ipResp = await fetch(ipdetails);
    const ipData = await ipResp.json();
    await AsyncStorage.setItem('requestIp', ipData.region.request)
    await AsyncStorage.setItem('ip', ipData.region.ip)
    await AsyncStorage.setItem('country_code', ipData.region.country_code2)
    await AsyncStorage.setItem('country_name', ipData.region.country_name)
    await AsyncStorage.setItem('continent_code', ipData.region.continent_code)
    await AsyncStorage.setItem('latitude', JSON.stringify(ipData.region.latitude))
    await AsyncStorage.setItem('longitude', JSON.stringify(ipData.region.longitude))
    await AsyncStorage.setItem('timezone', ipData.region.timezone)
    await AsyncStorage.setItem('calling_code', ipData.region.calling_code)
    await AsyncStorage.setItem('min_digits', JSON.stringify(ipData.region.min_digits))
    await AsyncStorage.setItem('max_digits', JSON.stringify(ipData.region.max_digits))


    if (getCurrentVersion != APP_VERSION) {
      //fetching app config data
      const appConfig = FIRETV_BASE_URL + "/catalogs/message/items/app-config-params.gzip?region=" + ipData.region.country_code2 + "&auth_token=" + AUTH_TOKEN + "&current_version=" + APP_VERSION;
      const appConfigResp = await fetch(appConfig);
      const appConfigData = await appConfigResp.json();
      await AsyncStorage.setItem('configTitle', appConfigData.data.title);
      if (Platform.OS == "android") {
        await AsyncStorage.setItem('currentVersion', appConfigData.data.params_hash2.config_params.android_version.current_version);
        await AsyncStorage.setItem('minVersion', appConfigData.data.params_hash2.config_params.android_version.min_version);
        await AsyncStorage.setItem('forceUpdate', appConfigData.data.params_hash2.config_params.android_version.force_upgrade);
        await AsyncStorage.setItem('forceUpdateMessage', appConfigData.data.params_hash2.config_params.android_version.message);
        if (APP_VERSION < appConfigData.data.params_hash2.config_params.android_version.min_version || appConfigData.data.params_hash2.config_params.android_version.force_upgrade == true) {
          alert(appConfigData.data.params_hash2.config_params.android_version.message);
          return true;
        }
      }
      else
        if (Platform.OS == "ios") {
          await AsyncStorage.setItem('currentVersion', appConfigData.data.params_hash2.config_params.ios_version.current_version);
          await AsyncStorage.setItem('minVersion', appConfigData.data.params_hash2.config_params.ios_version.min_version);
          await AsyncStorage.setItem('forceUpdate', appConfigData.data.params_hash2.config_params.ios_version.force_upgrade);
          await AsyncStorage.setItem('forceUpdateMessage', appConfigData.data.params_hash2.config_params.ios_version.message);
          if (APP_VERSION < appConfigData.data.params_hash2.config_params.android_version.min_version || appConfigData.data.params_hash2.config_params.ios_version.force_upgrade == true) {
            alert(appConfigData.data.params_hash2.config_params.android_version.message);
            return true;
          }
        }
      if (appConfigData.data.params_hash2.config_params.popup_details.show_popup) {
        await AsyncStorage.setItem('show_popup', 'yes');
        if (ipData.region.country_code2 == 'IN') {
          await AsyncStorage.setItem('popupimage', appConfigData.data.params_hash2.config_params.popup_details.images.high_3_4);
        }
        else {
          await AsyncStorage.setItem('popupimage', appConfigData.data.params_hash2.config_params.popup_details.other_region_images.high_3_4);
        }
        await AsyncStorage.setItem('redirect_type', appConfigData.data.params_hash2.config_params.popup_details.redirect_type);
      }
      else
        await AsyncStorage.setItem('show_popup', 'no');
      await AsyncStorage.setItem('dndStartTime', appConfigData.data.params_hash2.config_params.dnd[0].start_time);
      await AsyncStorage.setItem('dndEndTime', appConfigData.data.params_hash2.config_params.dnd[0].end_time);
      await AsyncStorage.setItem('faq', appConfigData.data.params_hash2.config_params.faq);
      await AsyncStorage.setItem('contactUs', appConfigData.data.params_hash2.config_params.contact_us);
      const jsonData = ((appConfigData.data.params_hash2.config_params))
      for (var t in jsonData) {
        if (t == 't&c') {
          await AsyncStorage.setItem('termsCondition', jsonData[t]);
        }
      }
      await AsyncStorage.setItem('privacy', appConfigData.data.params_hash2.config_params.privacy_policy);
      await AsyncStorage.setItem('about', appConfigData.data.params_hash2.config_params.about_us);
      await AsyncStorage.setItem('webPortalUrl', appConfigData.data.params_hash2.config_params.web_portal_url);
      await AsyncStorage.setItem('offlineDeleteDays', appConfigData.data.params_hash2.config_params.offline_deletion_days);
      await AsyncStorage.setItem('globalViewCount', JSON.stringify(appConfigData.data.params_hash2.config_params.global_view_count));
      await AsyncStorage.setItem('commentable', JSON.stringify(appConfigData.data.params_hash2.config_params.commentable));
      await AsyncStorage.setItem('subscriptionUrl', appConfigData.data.params_hash2.config_params.subscription_url);
      await AsyncStorage.setItem('tvLoginUrl', appConfigData.data.params_hash2.config_params.tv_login_url);
    }

    var session = await AsyncStorage.getItem('session');
    var region = await AsyncStorage.getItem('country_code');
    const removeunwanted = async () => {
      await AsyncStorage.clear();
      await loadasyncdata()
    }
    if (session != "" && session != null) {
      axios.get(FIRETV_BASE_URL_STAGING + "users/" + session + "/user_plans.gzip?auth_token=" + AUTH_TOKEN + "&tran_history=true&region=" + region).then(planresponse => {
        if (planresponse.data.data.length > 0) {
          AsyncStorage.setItem('subscription', 'done');
          AsyncStorage.setItem('user_id', planresponse.data.data[0].user_id);
          AsyncStorage.setItem('subscription_id', planresponse.data.data[0].subscription_id);
          AsyncStorage.setItem('plan_id', planresponse.data.data[0].plan_id);
          AsyncStorage.setItem('category', planresponse.data.data[0].category);
          AsyncStorage.setItem('valid_till', planresponse.data.data[0].valid_till);
          AsyncStorage.setItem('start_date', planresponse.data.data[0].start_date);
          AsyncStorage.setItem('transaction_id', planresponse.data.data[0].transaction_id);
          AsyncStorage.setItem('created_at', planresponse.data.data[0].created_at);
          AsyncStorage.setItem('updated_at', planresponse.data.data[0].updated_at);
          AsyncStorage.setItem('plan_status', planresponse.data.data[0].plan_status);
          AsyncStorage.setItem('invoice_inc_id', JSON.stringify(planresponse.data.data[0].invoice_inc_id));
          AsyncStorage.setItem('price_charged', JSON.stringify(planresponse.data.data[0].price_charged));
          AsyncStorage.setItem('email_id', JSON.stringify(planresponse.data.data[0].email_id));
          AsyncStorage.setItem('plan_title', JSON.stringify(planresponse.data.data[0].plan_title));
          AsyncStorage.setItem('subscription_title', JSON.stringify(planresponse.data.data[0].subscription_title));
          AsyncStorage.setItem('invoice_id', JSON.stringify(planresponse.data.data[0].invoice_id));
          AsyncStorage.setItem('currency', JSON.stringify(planresponse.data.data[0].currency));
          AsyncStorage.setItem('currency_symbol', JSON.stringify(planresponse.data.data[0].currency_symbol));
          AsyncStorage.setItem('status', JSON.stringify(planresponse.data.data[0].status));
        }
      }).catch(planerror => {
        console.log(planerror.response.data);
        if (planerror.response.data.error.code == '1016') {
          removeunwanted();
        }
      })
      await axios.get(FIRETV_BASE_URL_STAGING + "users/" + session + "/account.gzip?auth_token=" + AUTH_TOKEN).then(resp => {
        AsyncStorage.setItem('address', resp.data.data.address)
        AsyncStorage.setItem('age', resp.data.data.age)
        AsyncStorage.setItem('birthdate', resp.data.data.birthdate)
        AsyncStorage.setItem('email_id', resp.data.data.email_id)
        AsyncStorage.setItem('ext_account_email_id', resp.data.data.ext_account_email_id)
        AsyncStorage.setItem('ext_user_id', resp.data.data.ext_user_id)
        AsyncStorage.setItem('firstname', resp.data.data.firstname)
        AsyncStorage.setItem('gender', resp.data.data.gender)
        //AsyncStorage.setItem('is_mobile_verify',JSON.stringify(resp.data.data.is_mobile_verify))
        AsyncStorage.setItem('lastname', JSON.stringify(resp.data.data.lastname))
        AsyncStorage.setItem('login_type', resp.data.data.login_type)
        AsyncStorage.setItem('mobile_number', resp.data.data.mobile_number)
        //AsyncStorage.setItem('mobile_number',"")
        AsyncStorage.setItem('primary_id', resp.data.data.primary_id)
        AsyncStorage.setItem('profile_pic', resp.data.data.profile_pic)
        AsyncStorage.setItem('user_email_id', resp.data.data.user_email_id)
        AsyncStorage.setItem('user_id', resp.data.data.user_id)
        if (resp.data.data.isUserSubscribed) {
          AsyncStorage.setItem('isUserSubscribed', 'yes')
        }
        else {
          AsyncStorage.setItem('isUserSubscribed', 'no')
        }

      }).catch(err => {
        removeunwanted()
      })
    }
    //SplashScreen.hide();
  }


  const loadasyncdata = async () => {
    await AsyncStorage.setItem('firstload', 'no');
    const getCurrentVersion = await AsyncStorage.getItem('currentVersion');

    //fetching ip data
    const ipdetails = FIRETV_BASE_URL + "/regions/autodetect/ip.gzip?auth_token=" + AUTH_TOKEN;
    const ipResp = await fetch(ipdetails);
    const ipData = await ipResp.json();
    await AsyncStorage.setItem('requestIp', ipData.region.request)
    await AsyncStorage.setItem('ip', ipData.region.ip)
    await AsyncStorage.setItem('country_code', ipData.region.country_code2)
    await AsyncStorage.setItem('country_name', ipData.region.country_name)
    await AsyncStorage.setItem('continent_code', ipData.region.continent_code)
    await AsyncStorage.setItem('latitude', JSON.stringify(ipData.region.latitude))
    await AsyncStorage.setItem('longitude', JSON.stringify(ipData.region.longitude))
    await AsyncStorage.setItem('timezone', ipData.region.timezone)
    await AsyncStorage.setItem('calling_code', ipData.region.calling_code)
    await AsyncStorage.setItem('min_digits', JSON.stringify(ipData.region.min_digits))
    await AsyncStorage.setItem('max_digits', JSON.stringify(ipData.region.max_digits))


    if (getCurrentVersion != APP_VERSION) {
      //fetching app config data
      const appConfig = FIRETV_BASE_URL + "/catalogs/message/items/app-config-params.gzip?region=" + ipData.region.country_code2 + "&auth_token=" + AUTH_TOKEN + "&current_version=" + APP_VERSION;
      const appConfigResp = await fetch(appConfig);
      const appConfigData = await appConfigResp.json();
      await AsyncStorage.setItem('configTitle', appConfigData.data.title);
      if (Platform.OS == "android") {
        await AsyncStorage.setItem('currentVersion', appConfigData.data.params_hash2.config_params.android_version.current_version);
        await AsyncStorage.setItem('minVersion', appConfigData.data.params_hash2.config_params.android_version.min_version);
        await AsyncStorage.setItem('forceUpdate', appConfigData.data.params_hash2.config_params.android_version.force_upgrade);
        await AsyncStorage.setItem('forceUpdateMessage', appConfigData.data.params_hash2.config_params.android_version.message);
        if (APP_VERSION < appConfigData.data.params_hash2.config_params.android_version.min_version || appConfigData.data.params_hash2.config_params.android_version.force_upgrade == true) {
          alert(appConfigData.data.params_hash2.config_params.android_version.message);
          return true;
        }
      }
      else
        if (Platform.OS == "ios") {
          await AsyncStorage.setItem('currentVersion', appConfigData.data.params_hash2.config_params.ios_version.current_version);
          await AsyncStorage.setItem('minVersion', appConfigData.data.params_hash2.config_params.ios_version.min_version);
          await AsyncStorage.setItem('forceUpdate', appConfigData.data.params_hash2.config_params.ios_version.force_upgrade);
          await AsyncStorage.setItem('forceUpdateMessage', appConfigData.data.params_hash2.config_params.ios_version.message);
          if (APP_VERSION < appConfigData.data.params_hash2.config_params.android_version.min_version || appConfigData.data.params_hash2.config_params.ios_version.force_upgrade == true) {
            alert(appConfigData.data.params_hash2.config_params.android_version.message);
            return true;
          }
        }
      if (appConfigData.data.params_hash2.config_params.popup_details.show_popup) {
        await AsyncStorage.setItem('show_popup', 'yes');
        if (ipData.region.country_code2 == 'IN') {
          await AsyncStorage.setItem('popupimage', appConfigData.data.params_hash2.config_params.popup_details.images.high_3_4);
        }
        else {
          await AsyncStorage.setItem('popupimage', appConfigData.data.params_hash2.config_params.popup_details.other_region_images.high_3_4);
        }
        await AsyncStorage.setItem('redirect_type', appConfigData.data.params_hash2.config_params.popup_details.redirect_type);
      }
      else
        await AsyncStorage.setItem('show_popup', 'no');
      await AsyncStorage.setItem('dndStartTime', appConfigData.data.params_hash2.config_params.dnd[0].start_time);
      await AsyncStorage.setItem('dndEndTime', appConfigData.data.params_hash2.config_params.dnd[0].end_time);
      await AsyncStorage.setItem('faq', appConfigData.data.params_hash2.config_params.faq);
      await AsyncStorage.setItem('contactUs', appConfigData.data.params_hash2.config_params.contact_us);
      const jsonData = ((appConfigData.data.params_hash2.config_params))
      for (var t in jsonData) {
        if (t == 't&c') {
          await AsyncStorage.setItem('termsCondition', jsonData[t]);
        }
      }
      await AsyncStorage.setItem('privacy', appConfigData.data.params_hash2.config_params.privacy_policy);
      await AsyncStorage.setItem('about', appConfigData.data.params_hash2.config_params.about_us);
      await AsyncStorage.setItem('webPortalUrl', appConfigData.data.params_hash2.config_params.web_portal_url);
      await AsyncStorage.setItem('offlineDeleteDays', appConfigData.data.params_hash2.config_params.offline_deletion_days);
      await AsyncStorage.setItem('globalViewCount', JSON.stringify(appConfigData.data.params_hash2.config_params.global_view_count));
      await AsyncStorage.setItem('commentable', JSON.stringify(appConfigData.data.params_hash2.config_params.commentable));
      await AsyncStorage.setItem('subscriptionUrl', appConfigData.data.params_hash2.config_params.subscription_url);
      await AsyncStorage.setItem('tvLoginUrl', appConfigData.data.params_hash2.config_params.tv_login_url);
    }
  }


  React.useEffect(() => {
    requestUserPermission();
    loadDefaultData();
    gettoken();
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      Alert.alert('A new FCM message arrived!', JSON.stringify(remoteMessage));
    });
    return unsubscribe;

  })
  const gettoken = async () => {
    const token = await messaging().getToken();
    console.log(token);
  }
  return (
    <View style={{ backgroundColor: BACKGROUND_COLOR, flex: 1 }}>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ presentation: 'transparentModal', backgroundColor: BACKGROUND_COLOR }}>
          <Stack.Screen name="FrontProfile" component={FrontProfile} options={{ header: () => null, }} />
          <Stack.Screen name="Home" component={Home} options={{ header: () => null, }} />
          <Stack.Screen name="News" component={News} options={{ header: () => null, }} />
          <Stack.Screen name="OtherResponse" component={OtherResponse} options={{ header: () => null, }} />
          <Stack.Screen name="Channels" component={Channels} options={{ header: () => null, }} />
          <Stack.Screen name="MoreList" component={MoreList} options={{ header: () => null, }} />
          <Stack.Screen name="Signup" component={Signup} options={{ header: () => null, }} />
          <Stack.Screen name="Login" component={Login} options={{ header: () => null, }} />
          <Stack.Screen name="Shows" component={Shows} options={{ header: () => null, }} />
          <Stack.Screen name="Episode" component={Episode} options={{ header: () => null, }} />
          <Stack.Screen name="Calendarscreen" component={Calendarscreen} options={{ header: () => null, }} />
          <Stack.Screen name="EpisodesMoreList" component={EpisodesMoreList} options={{ header: () => null, }} />
          <Stack.Screen name="Offline" component={Offline} options={{ header: () => null, }} />
          <Stack.Screen name="Otp" component={Otp} options={{ header: () => null, }} />
          <Stack.Screen name="MobileUpdate" component={MobileUpdate} options={{ header: () => null, }} />
          <Stack.Screen name="WatchLater" component={WatchLater} options={{ header: () => null, }} />
          <Stack.Screen name="ActivateTv" component={ActivateTv} options={{ header: () => null, }} />
          <Stack.Screen name="More" component={More} options={{ header: () => null, }} />
          <Stack.Screen name="Webview" component={Webview} options={{ header: () => null, }} />
          <Stack.Screen name="SearchCalendarEpisodes" component={SearchCalendarEpisodes} options={{ header: () => null, }} />
          <Stack.Screen name="Search" component={Search} options={{ header: () => null, }} />
          <Stack.Screen name="FoodFilter" component={FoodFilter} options={{ header: () => null, }} />
          <Stack.Screen name="FilterData" component={FilterData} options={{ header: () => null, }} />
          <Stack.Screen name="Profile" component={Profile} options={{ header: () => null, }} />
          <Stack.Screen name="EditProfile" component={EditProfile} options={{ header: () => null, }} />
          <Stack.Screen name="Feedback" component={Feedback} options={{ header: () => null, }} />
          <Stack.Screen name="Settings" component={Settings} options={{ header: () => null, }} />
          <Stack.Screen name="Subscribe" component={Subscribe} options={{ header: () => null, }} />
          <Stack.Screen name="Confirmation" component={Confirmation} options={{ header: () => null, }} />
          <Stack.Screen name="ForgotPassword" component={ForgotPassword} options={{ header: () => null, }} />
          <Stack.Screen name="Shorts" component={Shorts} options={{ header: () => null, }} />
          <Stack.Screen name="TransparentHeader" component={TransparentHeader} options={{ header: () => null, }} />
          <Stack.Screen name="Reload" component={Reload} options={{ header: () => null, }} />
        </Stack.Navigator>
      </NavigationContainer>
    </View>
  );
}