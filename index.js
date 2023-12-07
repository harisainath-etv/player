import { registerRootComponent } from 'expo';

import App from './App';
import messaging from '@react-native-firebase/messaging';
import { VIDEO_TYPES } from './constants';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AnalyticsSdk from './assets/js/sdk.analytics_v_2';
window.sdk = new AnalyticsSdk('Etv-Saranyu-React-Native', {
  apiUrl: 'https://apicollect-etvwin.apisaranyu.in/',
  batchSize: 1,
  timeout: 3000,
});

const setAsynData = async (page, seourl, theme) => {
  await AsyncStorage.setItem('notificationPage', page);
  await AsyncStorage.setItem('notificationSeourl', seourl);
  await AsyncStorage.setItem('notificationTheme', theme);
}
messaging().setBackgroundMessageHandler(async remoteMessage => {
  console.log('Message handled in the background!', remoteMessage);
  console.log(JSON.stringify(remoteMessage));
  VIDEO_TYPES.includes(remoteMessage.data.catalog_layout_type) ? setAsynData('Episode', remoteMessage.data.seo_url, remoteMessage.data.catalog_layout_type) : setAsynData('Shows', remoteMessage.data.seo_url, remoteMessage.data.catalog_layout_type)
});

messaging()
  .getInitialNotification()
  .then(remoteMessage => {
    if (remoteMessage) {
      console.log(
        'Notification caused app to open from quit state:',
        remoteMessage,
      );
      VIDEO_TYPES.includes(remoteMessage.data.catalog_layout_type) ? setAsynData('Episode', remoteMessage.data.seo_url, remoteMessage.data.catalog_layout_type) : setAsynData('Shows', remoteMessage.data.seo_url, remoteMessage.data.catalog_layout_type)
    }
  });
// const loadPrefData = async () => {
//     await AsyncStorage.setItem('receivenotification','yes');
//     var receivenotification = await AsyncStorage.getItem('receivenotification');
//     var dndpref = await AsyncStorage.getItem('dndpref');
//     if (receivenotification == "yes") {
//         if (dndpref == 'no') {
//             PushNotification.configure({
//                 onNotification: function (notification) {
//                     console.log("NOTIFICATION:", notification);
//                 },
//                 requestPermissions: Platform.OS == 'ios'

//             });
//         }
//         else
//         {
//             var dndStartTime = await AsyncStorage.getItem('dndStartTime');
//             var dndEndTime = await AsyncStorage.getItem('dndEndTime');
//             var starttime = dndStartTime.split(":");
//             var endtime = dndEndTime.split(":");
//             var now = new Date();
//             if(now.getHours()<starttime[0] && now.getHours()>=endtime[0])
//             {
//                 PushNotification.configure({
//                     onNotification: function (notification) {
//                         console.log("NOTIFICATION:", notification);
//                     },
//                     requestPermissions: Platform.OS == 'ios'

//                 });
//             }
//         }
//     }

// }

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately
registerRootComponent(App);