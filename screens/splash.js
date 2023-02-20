import { View, Dimensions } from 'react-native'
import React, { useEffect } from 'react'
import { BACKGROUND_COLOR } from '../constants'
import { Video } from 'expo-av';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FIRETV_BASE_URL,ANDROID_AUTH_TOKEN } from '../constants';

export default function Splash({ navigation }) {
    const width = Dimensions.get('window').width;
    const height = Dimensions.get('window').height;
    async function loadDefaultData() {
        var TopMenu = [];
        //fetching data
        
        const ipdetails = FIRETV_BASE_URL+"/regions/autodetect/ip.gzip?auth_token="+ANDROID_AUTH_TOKEN;
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
        setTimeout(function(){
            navigation.navigate('Home');
        },3000)
    }

    useEffect(()=>{
        loadDefaultData()
    })
    return (
        <View style={{backgroundColor:BACKGROUND_COLOR}}>
            <Video
            source={require('../assets/video/launch_screen.mp4')}
            shouldPlay={true}
            resizeMode="stretch"
            style={{ width:width, height: height,backgroundColor:BACKGROUND_COLOR }}
            isMuted={false}
            audioPan={1}
            volume={1}
            shouldCorrectPitch={true}
            />
        </View>
    )
}