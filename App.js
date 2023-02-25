import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Home from './screens/home';
import Video from './screens/videoPlayer';
import News from './screens/news';
import OtherResponse from './screens/otherResponse';
import Channels from './screens/channels';
import MoreList from './screens/moreList';
import Signup from './screens/signup';
import Login from './screens/login';
import { BACKGROUND_COLOR,FIRETV_BASE_URL, AUTH_TOKEN,APP_VERSION } from './constants';
import { View,Dimensions, Platform } from 'react-native';
import SplashScreen from 'react-native-splash-screen'
import AsyncStorage from '@react-native-async-storage/async-storage';

const Stack = createStackNavigator();
export default function App() {

    const width = Dimensions.get('window').width;
    const height = Dimensions.get('window').height;
    async function loadDefaultData() {

        const getCurrentVersion = await AsyncStorage.getItem('currentVersion');
        if (getCurrentVersion != APP_VERSION) {
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
        SplashScreen.hide();
    }


  React.useEffect(()=>{
    loadDefaultData();
  })
  return (
    <View style={{ backgroundColor: BACKGROUND_COLOR,flex:1 }}>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{presentation:'transparentModal',backgroundColor:BACKGROUND_COLOR}}>
          <Stack.Screen name="Home" component={Home} options={{ header: () => null, }} />
          <Stack.Screen name="CustomeVideoPlayer" component={Video} options={{ header: () => null, }} />
          <Stack.Screen name="News" component={News} options={{ header: () => null, }} />
          <Stack.Screen name="OtherResponse" component={OtherResponse} options={{ header: () => null, }} />
          <Stack.Screen name="Channels" component={Channels} options={{ header: () => null, }} />
          <Stack.Screen name="MoreList" component={MoreList} options={{ header: () => null, }} />
          <Stack.Screen name="Signup" component={Signup} options={{ header: () => null, }} />
          <Stack.Screen name="Login" component={Login} options={{ header: () => null, }} />
        </Stack.Navigator>
      </NavigationContainer>
    </View>
  );
}