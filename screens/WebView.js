import { StyleSheet, StatusBar, View, } from 'react-native'
import React, { useState } from 'react'
import { BACKGROUND_COLOR, DARKED_BORDER_COLOR, NORMAL_TEXT_COLOR, PAGE_HEIGHT, PAGE_WIDTH, } from '../constants'
import NormalHeader from './normalHeader';
import WebView from 'react-native-webview';

export default function Webview({ navigation, route }) {
    var url=route.params.uri;
    const [uri,setUri]=useState(url);
    
    return (
        <View style={styles.mainContainer}>
            <NormalHeader></NormalHeader>
            {uri != "" ?
                <WebView source={{ uri: uri }} style={{ flex: 0,width:PAGE_WIDTH, height: PAGE_HEIGHT+50,backgroundColor:BACKGROUND_COLOR,marginBottom:50 }} />
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