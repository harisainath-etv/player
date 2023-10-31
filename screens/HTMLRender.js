import axios from "axios";
import React, { useEffect, useState } from "react";
import { ScrollView, StyleSheet, StatusBar, View } from "react-native";
import { WebView } from "react-native-webview";

import {
    ACCESS_TOKEN,
    AUTH_TOKEN,
    BACKGROUND_COLOR,
    FIRETV_BASE_URL,
    NORMAL_TEXT_COLOR,
    PAGE_HEIGHT,
    PAGE_WIDTH,
} from "../constants";
import NormalHeader from "./normalHeader";
var pagename = "";
const HTMLRender = ({ navigation, route }) => {
    const [staticPage, setStaticPage] = useState({
        display_title: "",
        description: "",
    });
    { route.params ? pagename = route.params.pagename : pagename = '' }

    useEffect(() => {
        fetchData();
    }, []);

    async function fetchData() {
        await axios.get(FIRETV_BASE_URL + "config/static_page/" + pagename + "?auth_token=" + AUTH_TOKEN + "&access_token=" + ACCESS_TOKEN).then(response => {
            setStaticPage(response.data.static_page);
        }).catch(error => {
            console.log(error);
        })
    }

    return (
        <View style={styles.mainContainer}>
            <NormalHeader></NormalHeader>
            <View style={{flex:1,justifyContent:"center",alignItems:"center"}}>
                <WebView
                    source={{ html: '<html><head><meta name="viewport" content="width=device-width, initial-scale=1.0"></head><body><p>'+staticPage.description+'</p></body></html>' }}
                    scalesPageToFit
                    scrollEnabled
                    showsVerticalScrollIndicator
                    originWhitelist={["*"]}
                    style={{
                        alignItems: "center",
                        backgroundColor: BACKGROUND_COLOR,
                        width: PAGE_WIDTH - 20,
                        height: PAGE_HEIGHT,
                        marginTop: 100,
                    }}
                />
            </View>
            <StatusBar
                animated
                backgroundColor="transparent"
                barStyle="dark-content"
                translucent={true}
            />
        </View>
    );
};

export default HTMLRender;

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: BACKGROUND_COLOR,
        color: NORMAL_TEXT_COLOR,
    },
});
