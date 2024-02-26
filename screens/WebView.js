import { StyleSheet, StatusBar, View, Linking, BackHandler, LogBox, } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { BACKGROUND_COLOR, DARKED_BORDER_COLOR, NORMAL_TEXT_COLOR, PAGE_HEIGHT, PAGE_WIDTH, } from '../constants'
import NormalHeader from './normalHeader';
import WebView from 'react-native-webview';
import { StackActions, useIsFocused } from '@react-navigation/native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Webview({ navigation, route }) {
    var url = route.params.uri;
    const [uri, setUri] = useState(url);
    const ref = useRef(null);
    const isfocued = useIsFocused();
  useEffect(()=>{
    const finalSes =async()=>{
        try {
            BackHandler.addEventListener('hardwareBackPress', Back);
            LogBox.ignoreLogs(['`new NativeEventEmitter()` was called with a non-null']);
        } catch (error) {
            console.log(error)
        }
    }
    finalSes();
},[isfocued])
const Back = async () => {
    try {
        if (navigation.canGoBack()) {
            navigation.goBack();
        } else {
            const sessionlo = await AsyncStorage.getItem('session');
            const login = JSON.parse(sessionlo); // Parse the session data if needed

            if (login) {
                navigation.dispatch(StackActions.replace('Menu', { pageFriendlyId: 'Menu' }));
            } else {
                navigation.dispatch(StackActions.replace('Signup'));
            }
        }
    } catch (error) {
        console.error("Error occurred while navigating:", error);
        // Handle the error as per your requirement
    }
}

    return (
        <View style={styles.mainContainer}>
            <NormalHeader></NormalHeader>
            {uri != "" ?
                <WebView ref={ref} source={{ uri: uri }} scalesPageToFit
                    originWhitelist={["*"]}
                    geolocationEnabled={true}
                    mediaPlaybackRequiresUserAction={false}
                    javaScriptEnabled={true}
                    style={{ flex: 1, width: PAGE_WIDTH, height: PAGE_HEIGHT + 50, backgroundColor: BACKGROUND_COLOR, marginTop: 90 }} onNavigationStateChange={(resp) => {
                        console.log(resp.url);
                        if (resp.url.startsWith('tel:')) {
                            const phoneNumber = resp.url.substring(4);
                            Linking.openURL(`tel:${phoneNumber}`);
                            navigation.goBack();
                        }
                        if (resp.url.startsWith('mailto:')) {
                            const email = resp.url.substring(7);
                            Linking.openURL(`mailto:${email}`);
                            navigation.goBack();
                        }
                        if (resp.url.includes("/paymentstatus")) {
                            var splitted = resp.url.split("payment_status=success");
                            if (splitted.length == 2) {
                                alert("Transaction Successfull.")
                            }
                            else {
                                alert("Something went wrong. Please try again later.")
                            }
                            //DevSettings.reload()
                            navigation.dispatch(StackActions.replace('Home', { pageFriendlyId: 'featured-1' }))
                        }

                    }} />
                : ""}
            <StatusBar
                animated
                backgroundColor="transparent"
                barStyle="dark-content"
                translucent={true}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    mainContainer: { flex: 1, backgroundColor: BACKGROUND_COLOR },
    item: { padding: 15, borderBottomColor: DARKED_BORDER_COLOR, borderWidth: 1, flexDirection: 'row', },
    textstyle: { color: NORMAL_TEXT_COLOR, fontSize: 18 },
})