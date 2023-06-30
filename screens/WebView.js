import { StyleSheet, StatusBar, View, } from 'react-native'
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
                <WebView ref={ref} source={{ html: uri }} scalesPageToFit
                originWhitelist={["*"]}  style={{ flex: 1,width:PAGE_WIDTH, height: PAGE_HEIGHT+50,backgroundColor:BACKGROUND_COLOR,marginBottom:50 }} onNavigationStateChange={(resp)=>{
                    if(resp.url.includes("/paymentstatus"))
                    {
                        var splitted=resp.url.split("|");
                        if(splitted[14]=='0300')
                        {
                            alert("Transaction Successfull.")
                        }
                        else
                        {
                            alert(splitted[24])
                        }
                        navigation.dispatch(StackActions.replace('Home', { pageFriendlyId: 'featured-1' }))
                    }
                
                }} />
                : ""}
            <StatusBar barStyle={'default'}></StatusBar>
        </View>
    )
}

const styles = StyleSheet.create({
    mainContainer: { flex: 1, backgroundColor: BACKGROUND_COLOR },
    item: { padding: 15, borderBottomColor: DARKED_BORDER_COLOR, borderWidth: 1, flexDirection: 'row', },
    textstyle: { color: NORMAL_TEXT_COLOR, fontSize: 18 },
})