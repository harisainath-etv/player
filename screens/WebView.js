import { StyleSheet, StatusBar, View, Linking, } from 'react-native'
import React, { useRef, useState } from 'react'
import { BACKGROUND_COLOR, DARKED_BORDER_COLOR, NORMAL_TEXT_COLOR, PAGE_HEIGHT, PAGE_WIDTH, } from '../constants'
import NormalHeader from './normalHeader';
import WebView from 'react-native-webview';
import { StackActions } from '@react-navigation/native';

export default function Webview({ navigation, route }) {
    var url=route.params.uri;
    const [uri,setUri]=useState(url);
    const ref= useRef(null);
    return (
        <View style={styles.mainContainer}>
            <NormalHeader></NormalHeader>
            {uri != "" ?
                <WebView ref={ref} source={{ uri: uri }} scalesPageToFit
                originWhitelist={["*"]}  
                geolocationEnabled={true}
                mediaPlaybackRequiresUserAction={false}
                javaScriptEnabled={true} 
                style={{ flex: 1,width:PAGE_WIDTH, height: PAGE_HEIGHT+50,backgroundColor:BACKGROUND_COLOR,marginTop:90 }} onNavigationStateChange={(resp)=>{
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
                    if(resp.url.includes("/paymentstatus"))
                    {
                        var splitted=resp.url.split("payment_status=success");
                        if(splitted.length==2)
                        {
                            alert("Transaction Successfull.")
                        }
                        else
                        {
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