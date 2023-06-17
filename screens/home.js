import * as React from 'react';
import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { View, FlatList, StyleSheet, Text, Pressable, ActivityIndicator, RefreshControl, Image, TouchableOpacity } from 'react-native';
import Carousel from 'react-native-reanimated-carousel';
import Animated, {
    Extrapolate,
    interpolate,
    useAnimatedStyle,
    useSharedValue,
} from 'react-native-reanimated';
import FastImage from 'react-native-fast-image';
import { BACKGROUND_COLOR, AUTH_TOKEN, FIRETV_BASE_URL, SLIDER_PAGINATION_SELECTED_COLOR, SLIDER_PAGINATION_UNSELECTED_COLOR, MORE_LINK_COLOR, TAB_COLOR, HEADING_TEXT_COLOR, IMAGE_BORDER_COLOR, NORMAL_TEXT_COLOR, ACCESS_TOKEN, PAGE_WIDTH, PAGE_HEIGHT, VIDEO_TYPES, LAYOUT_TYPES, VIDEO_AUTH_TOKEN, FIRETV_BASE_URL_STAGING, DATABASE_NAME, DATABASE_VERSION, DATABASE_DISPLAY_NAME, DATABASE_SIZE } from '../constants';
import { StatusBar } from 'expo-status-bar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StackActions } from '@react-navigation/native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
// import RNBackgroundDownloader from 'react-native-background-downloader';
import axios from 'axios';
import Modal from "react-native-modal";
import Footer from './footer';
import Header from './header';

export const ElementsText = {
    AUTOPLAY: 'AutoPlay',
};

var page = 'featured-1';
var selectedItem = 0;
var popup = false;
var alreadyloaded = [];
var SQLite = require('react-native-sqlite-storage')
function Home({ navigation, route }) {

    const [colors, setColors] = useState([
        SLIDER_PAGINATION_SELECTED_COLOR,
        SLIDER_PAGINATION_SELECTED_COLOR,
        SLIDER_PAGINATION_SELECTED_COLOR,
        SLIDER_PAGINATION_SELECTED_COLOR,
        SLIDER_PAGINATION_SELECTED_COLOR,
        SLIDER_PAGINATION_SELECTED_COLOR,
        SLIDER_PAGINATION_SELECTED_COLOR,
        SLIDER_PAGINATION_SELECTED_COLOR,
        SLIDER_PAGINATION_SELECTED_COLOR,
        SLIDER_PAGINATION_SELECTED_COLOR,
    ]);

    const [colors1, setColors1] = useState([
        SLIDER_PAGINATION_SELECTED_COLOR,
        SLIDER_PAGINATION_SELECTED_COLOR,
        SLIDER_PAGINATION_SELECTED_COLOR,
        SLIDER_PAGINATION_SELECTED_COLOR,
        SLIDER_PAGINATION_SELECTED_COLOR,
        SLIDER_PAGINATION_SELECTED_COLOR,
        SLIDER_PAGINATION_SELECTED_COLOR,
        SLIDER_PAGINATION_SELECTED_COLOR,
        SLIDER_PAGINATION_SELECTED_COLOR,
        SLIDER_PAGINATION_SELECTED_COLOR,
    ]);
    const [totalHomeData, settotalHomeData] = useState([]);
    const [totalMenuData, settotalMenuData] = useState();
    { route.params ? page = route.params.pageFriendlyId : page = 'featured-1' }
    { route.params ? popup = route.params.popup : popup = false }
    // const {pageFriendlyId}=route.params;
    const [pageName, setpageName] = useState(page);
    const [isVertical, setIsVertical] = useState(false);
    const [autoPlay, setAutoPlay] = useState(true);
    const [pagingEnabled, setPagingEnabled] = useState(true);
    const [snapEnabled, setSnapEnabled] = useState(true);
    const [currentIndexValue, setcurrentIndexValue] = useState();
    const [refreshing, setRefreshing] = useState(false);
    const [pagenumber, setPagenumber] = useState(0);
    const [toload, settoload] = useState(true);
    const [loading, setloading] = useState(false);
    const [imagepopup, setimagepopup] = useState();
    const [redirectionpage, setredirectionpage] = useState()
    const [popupalreadyshown, setpopupalreadyshown] = useState(false)
    const [isModalVisible, setModalVisible] = useState(false);
    var menuref = useRef();
    const progressValue = useSharedValue(0);
    const progressValue1 = useSharedValue(0);
    const progressValue2 = useSharedValue(0);
    const progressValue3 = useSharedValue(0);
    const dataFetchedRef = useRef(false);
    const paginationLoadCount = 10;

    const baseOptions = ({
        vertical: false,
        width: PAGE_WIDTH * 0.9,
        height: 430,
    });
    const baseOptionsOther = ({
        vertical: false,
        width: PAGE_WIDTH * 0.9,
        height: 260,
    });
    const baseOptionsOtherSingle = ({
        vertical: false,
        width: PAGE_WIDTH * 0.95,
        height: 250,
    });
    const toggleModal = () => {
        setModalVisible(!isModalVisible);
    };
    const errorCB = (err) => {
        console.log("SQL Error: " + JSON.stringify(err));
    }

    const successCB = () => {
        console.log("SQL executed fine");
    }

    const openCB = () => {
        console.log("Database OPENED");
    }


    async function loadData(p) {
        var db = SQLite.openDatabase(DATABASE_NAME, DATABASE_VERSION, DATABASE_DISPLAY_NAME, DATABASE_SIZE, openCB, errorCB);
        const mobile = await AsyncStorage.getItem('mobile_number');
        const session = await AsyncStorage.getItem('session');
        var region = await AsyncStorage.getItem('country_code');
        var show_popup = await AsyncStorage.getItem('show_popup');
        var popupshown = await AsyncStorage.getItem('popupshown');
        if (popupshown == 'yes') {
            setpopupalreadyshown(true)
        }

        if (show_popup == 'yes') {
            const imgpopup = await AsyncStorage.getItem('popupimage');
            const redirect_type = await AsyncStorage.getItem('redirect_type');
            setimagepopup(imgpopup);
            if (redirect_type == "plans_page") {
                setredirectionpage('Subscribe')
            }
            if (!popupalreadyshown) {
                toggleModal()
                await AsyncStorage.setItem('popupshown', 'yes');
            }
        }
        if ((mobile == "" || mobile == null) && (session != "" && session != null) && (region == 'IN')) {
            navigation.dispatch(StackActions.replace('MobileUpdate', {}));
        }
        else {
            if (toload && !loading) {
                setloading(true)

                var All = [];
                var internalAll = [];
                var Final = [];
                var definedPageName = "";
                var premiumContent = false;
                var premiumCheckData = "";
                if (pageName == 'featured-1')
                    definedPageName = "home";
                else
                    definedPageName = pageName;
                const url = FIRETV_BASE_URL + "/catalog_lists/" + definedPageName + ".gzip?item_language=eng&region=" + region + "&auth_token=" + AUTH_TOKEN + "&access_token=" + ACCESS_TOKEN + "&page=" + p + "&page_size=" + paginationLoadCount + "&npage_size=10";
                if (!alreadyloaded.includes(url)) {
                    alreadyloaded.push(url);
                    const resp = await fetch(url);
                    const data = await resp.json();
                    setPagenumber(p + 1);
                    if (data.data.catalog_list_items.length > 0) {
                        for (var i = 0; i < data.data.catalog_list_items.length; i++) {
                            if (data.data.catalog_list_items[i].hasOwnProperty('catalog_list_items')) {
                                for (var j = 0; j < data.data.catalog_list_items[i].catalog_list_items.length; j++) {

                                    if (data.data.catalog_list_items[i].catalog_list_items[j].hasOwnProperty('access_control')) {
                                        premiumCheckData = (data.data.catalog_list_items[i].catalog_list_items[j].access_control);
                                        if (premiumCheckData != "") {
                                            if (premiumCheckData['is_free']) {
                                                premiumContent = false;
                                            }
                                            else {
                                                premiumContent = true;
                                            }
                                        }
                                    }
                                    var displayTitle = data.data.catalog_list_items[i].catalog_list_items[j].title
                                    if (displayTitle.length > 19)
                                        displayTitle = displayTitle.substr(0, 19) + "\u2026";
                                    if (data.data.catalog_list_items[i].catalog_list_items[j].media_list_in_list) {
                                        var splitted = data.data.catalog_list_items[i].catalog_list_items[j].seo_url.split("/");
                                        var friendlyId = splitted[splitted.length - 1];
                                        All.push({ "uri": data.data.catalog_list_items[i].catalog_list_items[j].list_item_object.banner_image, "theme": data.data.catalog_list_items[i].catalog_list_items[j].theme, "premium": premiumContent, "seoUrl": data.data.catalog_list_items[i].catalog_list_items[j].seo_url, "medialistinlist": data.data.catalog_list_items[i].catalog_list_items[j].media_list_in_list, "friendlyId": friendlyId, "displayTitle": "" });
                                    }
                                    else {
                                        if (data.data.catalog_list_items[i].catalog_list_items[j].thumbnails.hasOwnProperty('high_4_3') || data.data.catalog_list_items[i].catalog_list_items[j].thumbnails.hasOwnProperty('high_3_4') || data.data.catalog_list_items[i].catalog_list_items[j].thumbnails.hasOwnProperty('high_16_9')) {
                                            if (data.data.catalog_list_items[i].layout_type == "top_banner")
                                                All.push({ "uri": data.data.catalog_list_items[i].catalog_list_items[j].thumbnails.high_3_4.url, "theme": data.data.catalog_list_items[i].catalog_list_items[j].theme, "premium": premiumContent, "seoUrl": data.data.catalog_list_items[i].catalog_list_items[j].seo_url, "medialistinlist": data.data.catalog_list_items[i].catalog_list_items[j].media_list_in_list, "friendlyId": "", "displayTitle": "" });
                                            else
                                                if (data.data.catalog_list_items[i].layout_type == "tv_shows" || data.data.catalog_list_items[i].layout_type == "show")
                                                    All.push({ "uri": data.data.catalog_list_items[i].catalog_list_items[j].thumbnails.high_3_4.url, "theme": data.data.catalog_list_items[i].catalog_list_items[j].theme, "premium": premiumContent, "seoUrl": data.data.catalog_list_items[i].catalog_list_items[j].seo_url, "medialistinlist": data.data.catalog_list_items[i].catalog_list_items[j].media_list_in_list, "friendlyId": "", "displayTitle": displayTitle });
                                                else
                                                    if (data.data.catalog_list_items[i].layout_type == "tv_shows_banner")
                                                        All.push({ "uri": data.data.catalog_list_items[i].catalog_list_items[j].thumbnails.high_4_3.url, "theme": data.data.catalog_list_items[i].catalog_list_items[j].theme, "premium": premiumContent, "seoUrl": data.data.catalog_list_items[i].catalog_list_items[j].seo_url, "medialistinlist": data.data.catalog_list_items[i].catalog_list_items[j].media_list_in_list, "friendlyId": "", "displayTitle": displayTitle });
                                                    else
                                                        All.push({ "uri": data.data.catalog_list_items[i].catalog_list_items[j].thumbnails.high_4_3.url, "theme": data.data.catalog_list_items[i].catalog_list_items[j].theme, "premium": premiumContent, "seoUrl": data.data.catalog_list_items[i].catalog_list_items[j].seo_url, "medialistinlist": data.data.catalog_list_items[i].catalog_list_items[j].media_list_in_list, "friendlyId": "", "displayTitle": displayTitle });

                                        }
                                    }


                                    if (data.data.catalog_list_items[i].catalog_list_items[j].hasOwnProperty('catalog_list_items')) {


                                        for (var k = 0; k < data.data.catalog_list_items[i].catalog_list_items[j].catalog_list_items.length; k++) {

                                            if (data.data.catalog_list_items[i].catalog_list_items[j].catalog_list_items[k].hasOwnProperty('access_control')) {
                                                premiumCheckData = (data.data.catalog_list_items[i].catalog_list_items[j].catalog_list_items[k].access_control);
                                                if (premiumCheckData != "") {
                                                    if (premiumCheckData['is_free']) {
                                                        premiumContent = false;
                                                    }
                                                    else {
                                                        premiumContent = true;
                                                    }
                                                }
                                            }
                                            var displayTitle = data.data.catalog_list_items[i].catalog_list_items[j].catalog_list_items[k].title
                                            if (displayTitle.length > 19)
                                                displayTitle = displayTitle.substr(0, 19) + "\u2026";
                                            if (data.data.catalog_list_items[i].catalog_list_items[j].catalog_list_items[k].media_list_in_list) {
                                                var splitted = data.data.catalog_list_items[i].catalog_list_items[j].catalog_list_items[k].seo_url.split("/");
                                                var friendlyId = splitted[splitted.length - 1];
                                                internalAll.push({ "uri": data.data.catalog_list_items[i].catalog_list_items[j].catalog_list_items[k].list_item_object.banner_image, "theme": data.data.catalog_list_items[i].catalog_list_items[j].catalog_list_items[k].theme, "premium": premiumContent, "seoUrl": data.data.catalog_list_items[i].catalog_list_items[j].catalog_list_items[k].seo_url, "medialistinlist": data.data.catalog_list_items[i].catalog_list_items[j].catalog_list_items[k].media_list_in_list, "friendlyId": friendlyId, "displayTitle": "" });
                                            }
                                            else {
                                                if (data.data.catalog_list_items[i].catalog_list_items[j].catalog_list_items[k].thumbnails.hasOwnProperty('high_4_3') || data.data.catalog_list_items[i].catalog_list_items[j].catalog_list_items[k].thumbnails.hasOwnProperty('high_3_4') || data.data.catalog_list_items[i].catalog_list_items[j].catalog_list_items[k].thumbnails.hasOwnProperty('high_16_9')) {
                                                    if (data.data.catalog_list_items[i].catalog_list_items[j].layout_type == "top_banner")
                                                        internalAll.push({ "uri": data.data.catalog_list_items[i].catalog_list_items[j].catalog_list_items[k].thumbnails.high_3_4.url, "theme": data.data.catalog_list_items[i].catalog_list_items[j].catalog_list_items[k].theme, "premium": premiumContent, "seoUrl": data.data.catalog_list_items[i].catalog_list_items[j].catalog_list_items[k].seo_url, "medialistinlist": data.data.catalog_list_items[i].catalog_list_items[j].catalog_list_items[k].media_list_in_list, "friendlyId": "", "displayTitle": "" });
                                                    else
                                                        if (data.data.catalog_list_items[i].catalog_list_items[j].layout_type == "tv_shows" || data.data.catalog_list_items[i].catalog_list_items[j].layout_type == "show")
                                                            internalAll.push({ "uri": data.data.catalog_list_items[i].catalog_list_items[j].catalog_list_items[k].thumbnails.high_3_4.url, "theme": data.data.catalog_list_items[i].catalog_list_items[j].catalog_list_items[k].theme, "premium": premiumContent, "seoUrl": data.data.catalog_list_items[i].catalog_list_items[j].catalog_list_items[k].seo_url, "medialistinlist": data.data.catalog_list_items[i].catalog_list_items[j].catalog_list_items[k].media_list_in_list, "friendlyId": "", "displayTitle": displayTitle });
                                                        else
                                                            if (data.data.catalog_list_items[i].catalog_list_items[j].layout_type == "tv_shows_banner")
                                                                internalAll.push({ "uri": data.data.catalog_list_items[i].catalog_list_items[j].catalog_list_items[k].thumbnails.high_4_3.url, "theme": data.data.catalog_list_items[i].catalog_list_items[j].catalog_list_items[k].theme, "premium": premiumContent, "seoUrl": data.data.catalog_list_items[i].catalog_list_items[j].catalog_list_items[k].seo_url, "medialistinlist": data.data.catalog_list_items[i].catalog_list_items[j].catalog_list_items[k].media_list_in_list, "friendlyId": "", "displayTitle": displayTitle });
                                                            else
                                                                internalAll.push({ "uri": data.data.catalog_list_items[i].catalog_list_items[j].catalog_list_items[k].thumbnails.high_4_3.url, "theme": data.data.catalog_list_items[i].catalog_list_items[j].catalog_list_items[k].theme, "premium": premiumContent, "seoUrl": data.data.catalog_list_items[i].catalog_list_items[j].catalog_list_items[k].seo_url, "medialistinlist": data.data.catalog_list_items[i].catalog_list_items[j].catalog_list_items[k].media_list_in_list, "friendlyId": "", "displayTitle": displayTitle });

                                                }
                                            }

                                        }
                                        Final.push({ "friendlyId": data.data.catalog_list_items[i].catalog_list_items[j].friendly_id, "data": internalAll, "layoutType": data.data.catalog_list_items[i].catalog_list_items[j].layout_type, "displayName": data.data.catalog_list_items[i].catalog_list_items[j].display_title });
                                        internalAll = [];

                                    }
                                }
                                if (data.data.catalog_list_items[i].layout_type == "continue_watching") {
                                    var sessionId = await AsyncStorage.getItem('session');
                                    if (sessionId != "" && sessionId != null) {
                                        const continueresp = await fetch(FIRETV_BASE_URL + "users/" + sessionId + "/playlists/watchhistory/listitems.gzip?&auth_token=" + VIDEO_AUTH_TOKEN + "&access_token=" + ACCESS_TOKEN + "&item_language=eng&region=" + region);
                                        const continuedata = await continueresp.json();

                                        for (var c = 0; c < continuedata.data.items.length; c++) {
                                            All.push({ "uri": continuedata.data.items[c].thumbnails.high_4_3.url, "theme": continuedata.data.items[c].theme, "premium": false, "seoUrl": continuedata.data.items[c].seo_url, "medialistinlist": false, "friendlyId": "", "displayTitle": continuedata.data.items[c].title });
                                        }


                                    }

                                    // console.log(JSON.stringify(All));
                                }
                            }

                            Final.push({ "friendlyId": data.data.catalog_list_items[i].friendly_id, "data": All, "layoutType": data.data.catalog_list_items[i].layout_type, "displayName": data.data.catalog_list_items[i].display_title });
                            All = [];
                        }
                    }
                    if (Final.length <= 0)
                        settoload(false);
                    //settotalHomeData(Final);
                    settotalHomeData((totalHomeData) => [...totalHomeData, ...Final]);
                    setloading(false)
                }

                //watchlater content
                var allkeys = await AsyncStorage.getAllKeys();
                for (let a = 0; a < allkeys.length; a++) {
                    //checking for watchlater content
                    if (allkeys[a].includes("watchLater_")) {
                        await AsyncStorage.removeItem(allkeys[a]);
                    }
                    //checking for like content
                    if (allkeys[a].includes("like_")) {
                        await AsyncStorage.removeItem(allkeys[a]);
                    }
                }
                var sessionId = await AsyncStorage.getItem('session');
                var region = await AsyncStorage.getItem('country_code');
                if (sessionId != null && sessionId != "") {
                    //setting watch later content
                    await axios.get(FIRETV_BASE_URL_STAGING + "/users/" + sessionId + "/playlists/watchlater/listitems?auth_token=" + VIDEO_AUTH_TOKEN + "&access_token=" + ACCESS_TOKEN + "&region=" + region).then(response => {

                        for (var i = 0; i < response.data.data.items.length; i++) {
                            AsyncStorage.setItem("watchLater_" + response.data.data.items[i].content_id, response.data.data.items[i].content_id);
                        }
                    }).catch(error => {
                        //console.log(JSON.stringify(error.response.data));
                    })

                    //setting like content
                    await axios.get(FIRETV_BASE_URL_STAGING + "/users/" + sessionId + "/playlists/like/listitems?auth_token=" + VIDEO_AUTH_TOKEN + "&access_token=" + ACCESS_TOKEN + "&region=" + region).then(response => {

                        for (var i = 0; i < response.data.data.items.length; i++) {
                            AsyncStorage.setItem("like_" + response.data.data.items[i].content_id, response.data.data.items[i].content_id);
                        }
                    }).catch(error => {
                        //console.log(JSON.stringify(error.response.data));
                    })
                }
            }
            //like content

        }

        alreadyloaded=[];
    }
    async function getTopMenu() {
        var TopMenu = [];
        const region = await AsyncStorage.getItem('country_code');
        //fetching top menu
        const topMenu = FIRETV_BASE_URL + "/catalog_lists/top-menu.gzip?nested_list_items=false&auth_token=" + AUTH_TOKEN + "&region=" + region;
        const menuResp = await fetch(topMenu);
        const menuData = await menuResp.json();
        if (menuData.data.catalog_list_items.length > 0) {
            for (var m = 0; m < menuData.data.catalog_list_items.length; m++) {
                TopMenu.push({ "displayName": menuData.data.catalog_list_items[m].display_title.toUpperCase(), "friendlyId": menuData.data.catalog_list_items[m].friendly_id })
            }
        }
        settotalMenuData(TopMenu);
        for (let p = 0; p < TopMenu.length; p++) {
            if (TopMenu[p].friendlyId == pageName) {
                selectedItem = p;
                setcurrentIndexValue(selectedItem)
            }
        }
        //console.log(selectedItem);
    }

    const renderItem = ({ item, index }) => {
        return (
            <View style={{ backgroundColor: BACKGROUND_COLOR, flex: 1, }}>

                <View style={{ width: PAGE_WIDTH, alignContent: 'center', justifyContent: 'center', alignItems: 'center' }}>
                    {item.layoutType == 'top_banner' ?
                        <Carousel
                            {...baseOptions}
                            loop
                            pagingEnabled={pagingEnabled}
                            snapEnabled={snapEnabled}
                            autoPlay={autoPlay}
                            autoPlayInterval={2000}
                            onProgressChange={(_, absoluteProgress) =>
                                (progressValue.value = absoluteProgress)
                            }
                            mode="parallax"
                            windowSize={3}
                            panGestureHandlerProps={{ activeOffsetX: [-10, 10] }}
                            modeConfig={{
                                parallaxScrollingScale: 0.82,
                                parallaxScrollingOffset: 50,
                                parallaxAdjacentItemScale: 0.82,
                            }}
                            data={item.data}
                            style={{ top: -15, }}
                            renderItem={({ item, index }) => <Pressable onPress={() => {
                                {
                                    item.medialistinlist ?
                                        navigation.dispatch(StackActions.replace('MoreList', { firendlyId: item.friendlyId, layoutType: LAYOUT_TYPES[1] }))
                                        :
                                        VIDEO_TYPES.includes(item.theme) ?
                                            navigation.dispatch(StackActions.replace('Episode', { seoUrl: item.seoUrl, theme: item.theme })) : navigation.dispatch(StackActions.replace('Shows', { seoUrl: item.seoUrl }))
                                }

                            }}><FastImage resizeMode={FastImage.resizeMode.stretch} key={index} style={styles.image} source={{ uri: item.uri, priority: FastImage.priority.high, cache: FastImage.cacheControl.immutable, }} /></Pressable>}
                        />
                        : ""}

                    {item.layoutType == 'top_banner' && !!progressValue ?
                        <View
                            style={{
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                width: 200,
                                alignSelf: 'center',
                                top: -10,
                            }}
                        >
                            {colors.map((backgroundColor, index) => {
                                return (
                                    <PaginationItem
                                        backgroundColor={backgroundColor}
                                        animValue={progressValue}
                                        index={index}
                                        key={index}
                                        isRotate={isVertical}
                                        length={colors.length}
                                    />
                                );
                            })}
                        </View>
                        : ""}
                </View>

                {item.layoutType == 'tv_shows_banner' ?
                    <View style={{ width: PAGE_WIDTH, alignContent: 'center', justifyContent: 'center', alignItems: 'center' }}>
                        <View style={styles.sectionHeaderView}>
                            <Text style={styles.sectionHeader}>{item.displayName}</Text>
                            {item.data.length > 1 ? <Pressable style={{ width: "100%" }} onPress={() => navigation.dispatch(StackActions.replace('MoreList', { firendlyId: item.friendlyId, layoutType: LAYOUT_TYPES[0] }))}><Text style={styles.sectionHeaderMore}>+MORE</Text></Pressable> : ""}
                        </View>
                        <Carousel
                            {...baseOptionsOther}
                            loop
                            pagingEnabled={pagingEnabled}
                            snapEnabled={snapEnabled}
                            autoPlay={autoPlay}
                            autoPlayInterval={2000}
                            onProgressChange={(_, absoluteProgress) =>
                                (progressValue1.value = absoluteProgress)
                            }
                            mode="parallax"
                            windowSize={3}
                            panGestureHandlerProps={{ activeOffsetX: [-10, 10] }}
                            modeConfig={{
                                parallaxScrollingScale: 0.82,
                                parallaxScrollingOffset: 50,
                                parallaxAdjacentItemScale: 0.82,
                            }}
                            data={item.data}
                            style={{}}
                            renderItem={({ item, index }) => <Pressable onPress={() => {
                                {
                                    item.medialistinlist ?
                                        navigation.dispatch(StackActions.replace('MoreList', { firendlyId: item.friendlyId, layoutType: LAYOUT_TYPES[1] }))
                                        :
                                        VIDEO_TYPES.includes(item.theme) ?
                                            navigation.dispatch(StackActions.replace('Episode', { seoUrl: item.seoUrl, theme: item.theme })) : navigation.dispatch(StackActions.replace('Shows', { seoUrl: item.seoUrl }))
                                }
                            }}><FastImage key={index} style={styles.showsbannerimage} source={{ uri: item.uri, priority: FastImage.priority.high, cache: FastImage.cacheControl.immutable, }} /></Pressable>}
                        />
                    </View>
                    : ""}

                {item.layoutType == 'etv-exclusive_banner' && item.data.length != 0 ?

                    <View style={{ width: PAGE_WIDTH, alignContent: 'center', justifyContent: 'center', alignItems: 'center' }}>
                        <View style={styles.sectionHeaderView}>
                            <Text style={styles.sectionHeader}>{item.displayName}</Text>
                            {item.data.length > 1 ? <Pressable style={{ width: "100%" }} onPress={() => navigation.dispatch(StackActions.replace('MoreList', { firendlyId: item.friendlyId, layoutType: LAYOUT_TYPES[0] }))}><Text style={styles.sectionHeaderMore}>+MORE</Text></Pressable> : ""}

                        </View>
                        <View style={{ padding: 10 }}>
                            <Carousel
                                {...baseOptionsOtherSingle}
                                loop
                                pagingEnabled={pagingEnabled}
                                snapEnabled={snapEnabled}
                                autoPlay={autoPlay}
                                autoPlayInterval={2000}
                                onProgressChange={(_, absoluteProgress) =>
                                    (progressValue2.value = absoluteProgress)
                                }
                                mode="parallax"
                                windowSize={3}
                                panGestureHandlerProps={{ activeOffsetX: [-10, 10] }}
                                modeConfig={{
                                    parallaxScrollingScale: 1.1,
                                }}
                                data={item.data}
                                style={{}}
                                renderItem={({ item, index }) => <Pressable onPress={() => {
                                    {
                                        item.medialistinlist ?
                                            navigation.dispatch(StackActions.replace('MoreList', { firendlyId: item.friendlyId, layoutType: LAYOUT_TYPES[1] }))
                                            :
                                            VIDEO_TYPES.includes(item.theme) ?
                                                navigation.dispatch(StackActions.replace('Episode', { seoUrl: item.seoUrl, theme: item.theme })) : navigation.dispatch(StackActions.replace('Shows', { seoUrl: item.seoUrl }))
                                    }
                                }}><FastImage resizeMode={FastImage.resizeMode.stretch} key={index} style={styles.imageSectionHorizontalSingle} source={{ uri: item.uri, priority: FastImage.priority.high, cache: FastImage.cacheControl.immutable, }} /></Pressable>}
                            />
                        </View>
                    </View>
                    : ""}


                {item.layoutType == 'banner' && item.data.length != 0 ?

                    <View style={{ width: PAGE_WIDTH, alignContent: 'center', justifyContent: 'center', alignItems: 'center' }}>
                        <View style={{ padding: 10 }}>
                            <Carousel
                                {...baseOptionsOtherSingle}
                                loop
                                pagingEnabled={pagingEnabled}
                                snapEnabled={snapEnabled}
                                autoPlay={autoPlay}
                                autoPlayInterval={2000}
                                onProgressChange={(_, absoluteProgress) =>
                                    (progressValue3.value = absoluteProgress)
                                }
                                mode="parallax"
                                windowSize={3}
                                panGestureHandlerProps={{ activeOffsetX: [-10, 10] }}
                                modeConfig={{
                                    parallaxScrollingScale: 1.1,
                                }}
                                data={item.data}
                                style={{}}
                                renderItem={({ item, index }) => <Pressable onPress={() => {
                                    {
                                        item.medialistinlist ?
                                            navigation.dispatch(StackActions.replace('MoreList', { firendlyId: item.friendlyId, layoutType: LAYOUT_TYPES[1] }))
                                            :
                                            VIDEO_TYPES.includes(item.theme) ?
                                                navigation.dispatch(StackActions.replace('Episode', { seoUrl: item.seoUrl, theme: item.theme })) : navigation.dispatch(StackActions.replace('Shows', { seoUrl: item.seoUrl }))
                                    }
                                }}><FastImage resizeMode={FastImage.resizeMode.stretch} key={index} style={styles.imageSectionHorizontalSingle} source={{ uri: item.uri, priority: FastImage.priority.high, cache: FastImage.cacheControl.immutable, }} /></Pressable>}
                            />
                        </View>
                        {!!progressValue3 ?
                            <View
                                style={{
                                    flexDirection: 'row',
                                    justifyContent: 'space-between',
                                    width: 200,
                                    alignSelf: 'center',
                                    top: -1,
                                }}
                            >
                                {colors1.map((backgroundColor, index) => {
                                    return (
                                        <PaginationItem
                                            backgroundColor={backgroundColor}
                                            animValue={progressValue3}
                                            index={index}
                                            key={index}
                                            isRotate={isVertical}
                                            length={colors1.length}
                                        />
                                    );
                                })}
                            </View>
                            : ""}
                    </View>
                    : ""}

                {(item.layoutType == 'tv_shows' || item.layoutType == "show") && item.data.length != 0 ?
                    <View>
                        <View style={styles.sectionHeaderView}>
                            <Text style={styles.sectionHeader}>{item.displayName}</Text>
                            {item.data.length > 3 ? <Pressable style={{ width: "100%" }} onPress={() => navigation.dispatch(StackActions.replace('MoreList', { firendlyId: item.friendlyId, layoutType: LAYOUT_TYPES[0] }))}><Text style={styles.sectionHeaderMore}>+MORE</Text></Pressable> : ""}
                        </View>
                        <FlatList
                            data={item.data}
                            keyExtractor={(x, i) => i.toString()}
                            horizontal={true}
                            showsHorizontalScrollIndicator={false}
                            style={styles.containerMargin}
                            renderItem={
                                ({ item, index }) =>
                                    <View>
                                        <Pressable onPress={() => {
                                            {
                                                item.medialistinlist ?
                                                    navigation.dispatch(StackActions.replace('MoreList', { firendlyId: item.friendlyId, layoutType: LAYOUT_TYPES[1] }))
                                                    :
                                                    VIDEO_TYPES.includes(item.theme) ?
                                                        navigation.dispatch(StackActions.replace('Episode', { seoUrl: item.seoUrl, theme: item.theme })) : navigation.dispatch(StackActions.replace('Shows', { seoUrl: item.seoUrl }))
                                            }
                                        }}>
                                            <FastImage
                                                style={[styles.imageSectionVertical, { resizeMode: 'stretch', }]}
                                                resizeMode={FastImage.resizeMode.stretch}
                                                source={{ uri: item.uri, priority: FastImage.priority.high, cache: FastImage.cacheControl.immutable, }} />
                                        </Pressable>
                                        {VIDEO_TYPES.includes(item.theme) ? <Image source={require('../assets/images/play.png')} style={styles.playIcon}></Image> : ""}
                                        {item.premium ? <Image source={require('../assets/images/crown.png')} style={styles.crownIcon}></Image> : ""}
                                    </View>
                            }
                        />
                    </View>
                    : ""}

                {item.layoutType == 'channels' && item.data.length != 0 ?
                    <View>
                        <View style={styles.sectionHeaderView}>
                            <Text style={styles.sectionHeader}>{item.displayName}</Text>
                            {item.data.length > 3 ? <Pressable style={{ width: "100%" }} onPress={() => navigation.dispatch(StackActions.replace('MoreList', { firendlyId: item.friendlyId, layoutType: LAYOUT_TYPES[0] }))}><Text style={styles.sectionHeaderMore}>+MORE</Text></Pressable> : ""}
                        </View>
                        <View style={{ flexDirection: 'column' }}>
                            <FlatList
                                data={item.data}
                                keyExtractor={(x, i) => i.toString()}
                                horizontal={false}
                                showsHorizontalScrollIndicator={false}
                                style={styles.containerMargin}
                                numColumns={3}
                                renderItem={
                                    ({ item, index }) =>
                                        <View style={{ marginRight: 5, marginLeft: 5 }}>
                                            <Pressable onPress={() => {
                                                {
                                                    item.medialistinlist ?
                                                        navigation.dispatch(StackActions.replace('MoreList', { firendlyId: item.friendlyId, layoutType: LAYOUT_TYPES[1] }))
                                                        :
                                                        VIDEO_TYPES.includes(item.theme) ?
                                                            navigation.dispatch(StackActions.replace('Episode', { seoUrl: item.seoUrl, theme: item.theme })) : navigation.dispatch(StackActions.replace('Shows', { seoUrl: item.seoUrl }))
                                                }
                                            }}>
                                                <FastImage
                                                    style={[styles.imageSectionCircle,]}
                                                    resizeMode={FastImage.resizeMode.stretch}
                                                    source={{ uri: item.uri, priority: FastImage.priority.high, cache: FastImage.cacheControl.immutable, }} />
                                                {VIDEO_TYPES.includes(item.theme) ? <Image source={require('../assets/images/play.png')} style={styles.playIcon}></Image> : ""}
                                                {item.premium ? <Image source={require('../assets/images/crown.png')} style={styles.crownIcon}></Image> : ""}
                                            </Pressable>
                                        </View>
                                }
                            />
                        </View>
                    </View>
                    : ""}

                {item.layoutType == 'live' && item.data.length != 0 ?
                    <View>
                        <FlatList
                            data={item.data}
                            keyExtractor={(x, i) => i.toString()}
                            horizontal={false}
                            showsHorizontalScrollIndicator={false}
                            style={styles.containerMargin}
                            numColumns={3}
                            renderItem={
                                ({ item, index }) =>
                                    <View>
                                        <Pressable onPress={() => {
                                            {
                                                item.medialistinlist ?
                                                    navigation.dispatch(StackActions.replace('MoreList', { firendlyId: item.friendlyId, layoutType: LAYOUT_TYPES[1] }))
                                                    :
                                                    VIDEO_TYPES.includes(item.theme) ?
                                                        navigation.dispatch(StackActions.replace('Episode', { seoUrl: item.seoUrl, theme: item.theme })) : navigation.dispatch(StackActions.replace('Shows', { seoUrl: item.seoUrl }))
                                            }
                                        }}>
                                            <FastImage
                                                style={[styles.imageSectionVertical,]}
                                                resizeMode={FastImage.resizeMode.stretch}
                                                source={{ uri: item.uri, priority: FastImage.priority.high, cache: FastImage.cacheControl.immutable, }} />
                                            {VIDEO_TYPES.includes(item.theme) ? <Image source={require('../assets/images/play.png')} style={{ position: 'absolute', width: 30, height: 30, right: 10, bottom: 15 }}></Image> : ""}
                                            {item.premium ? <Image source={require('../assets/images/crown.png')} style={styles.crownIcon}></Image> : ""}
                                        </Pressable>
                                    </View>
                            }
                        />
                    </View>
                    : ""}

                {item.layoutType != 'tv_shows' && item.layoutType != 'show' && item.layoutType != 'top_banner' && item.layoutType != 'etv-exclusive_banner' && item.layoutType != 'tv_shows_banner' && item.layoutType != 'banner' && item.layoutType != 'channels' && item.layoutType != 'live' && item.data.length != 0 ?
                    <View>
                        <View style={styles.sectionHeaderView}>
                            <Text style={styles.sectionHeader}>{item.displayName}</Text>
                            {item.data.length > 2 ? <Pressable style={{ width: "100%" }} onPress={() => navigation.dispatch(StackActions.replace('MoreList', { firendlyId: item.friendlyId, layoutType: LAYOUT_TYPES[1] }))}><Text style={styles.sectionHeaderMore}>+MORE</Text></Pressable> : ""}
                        </View>
                        <FlatList
                            data={item.data}
                            keyExtractor={(x, i) => i.toString()}
                            horizontal={true}
                            showsHorizontalScrollIndicator={false}
                            style={styles.containerMargin}
                            renderItem={
                                ({ item, index }) =>
                                    <View style={{ width: PAGE_WIDTH / 2.06, }}>
                                        <Pressable onPress={() => {
                                            {
                                                item.medialistinlist ?
                                                    navigation.dispatch(StackActions.replace('MoreList', { firendlyId: item.friendlyId, layoutType: LAYOUT_TYPES[1] }))
                                                    :
                                                    VIDEO_TYPES.includes(item.theme) ?
                                                        navigation.dispatch(StackActions.replace('Episode', { seoUrl: item.seoUrl, theme: item.theme })) : navigation.dispatch(StackActions.replace('Shows', { seoUrl: item.seoUrl }))
                                            }
                                        }}>
                                            <FastImage
                                                style={[styles.imageSectionHorizontal, { resizeMode: 'stretch', }]}
                                                resizeMode={FastImage.resizeMode.stretch}
                                                source={{ uri: item.uri, priority: FastImage.priority.high, cache: FastImage.cacheControl.immutable, }} />
                                            {VIDEO_TYPES.includes(item.theme) ? <Image source={require('../assets/images/play.png')} style={styles.playIcon}></Image> : ""}
                                            {item.premium ? <Image source={require('../assets/images/crown.png')} style={styles.crownIcon}></Image> : ""}
                                        </Pressable>
                                        <Text style={{ color: NORMAL_TEXT_COLOR, alignSelf: 'center', marginBottom: 20 }}>{item.displayTitle}</Text>
                                    </View>
                            }
                        />
                    </View> : ""}

            </View>
        );
    }
    function changeTabData(pageFriendlyId) {
        if (pageFriendlyId != 'live')
            navigation.dispatch(StackActions.replace('Home', { pageFriendlyId: pageFriendlyId }))
        else
            navigation.dispatch(StackActions.replace('OtherResponse', { pageFriendlyId: pageFriendlyId }))
    }
    const menuRender = ({ item, index }) => {
        return (
            <View style={{ backgroundColor: BACKGROUND_COLOR, marginBottom: 25, padding: 5 }}>
                {item.friendlyId == pageName ?

                    <View style={{ backgroundColor: TAB_COLOR, padding: 8, height: 35, borderRadius: 15, marginRight: 15, justifyContent: 'center', alignItems: 'center' }}>
                        <Text style={{ color: NORMAL_TEXT_COLOR, fontWeight: 'bold', marginRight: 5, marginLeft: 5 }}>{item.displayName}</Text>
                    </View>
                    :
                    <Pressable onPress={() => changeTabData(item.friendlyId)}>
                        <View style={{ padding: 8, height: 35, borderRadius: 15, marginRight: 15, justifyContent: 'center', alignItems: 'center' }}>
                            <Text style={{ color: NORMAL_TEXT_COLOR, fontWeight: 'bold', marginRight: 5, marginLeft: 5 }}>{item.displayName}</Text>
                        </View>
                    </Pressable>
                }

            </View>
        )
    }

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        setTimeout(() => {
            getTopMenu();
            loadData(0);
            if (selectedItem == "") {
                selectedItem = 0;
            }
            setRefreshing(false);
        }, 2000);
    }, []);
    const loadNextData = async () => {
        loadData(pagenumber);
    }
    useEffect(() => {
        if (dataFetchedRef.current) return;
        dataFetchedRef.current = true;
        getTopMenu();
        loadData(pagenumber);
        if (selectedItem == "") {
            selectedItem = 0;
        }
    }, []);

    const memoizedValue = useMemo(() => renderItem, [totalHomeData]);
    const loadFilters = async () => {
        navigation.navigate('FoodFilter');
    }
    return (
        <View style={{ flex: 1, backgroundColor: BACKGROUND_COLOR, }}>

            <Header pageName="Home"></Header>


            {/* header menu */}
            {currentIndexValue >= 0 ?
                <FlatList
                    data={totalMenuData}
                    initialNumToRender={8}
                    initialScrollIndex={currentIndexValue}
                    renderItem={menuRender}
                    keyExtractor={(x, i) => i.toString()}
                    horizontal={true}
                    ref={menuref}
                />
                :
                ""
            }

            {pageName == 'recipes' ?
                <TouchableOpacity onPress={loadFilters} style={{ justifyContent: 'center', alignItems: 'center', flexDirection: 'row', marginTop: 15, marginBottom: 15 }}>
                    <MaterialCommunityIcons name='filter-variant' size={30} color={NORMAL_TEXT_COLOR} />
                    <Text style={{ color: NORMAL_TEXT_COLOR, fontSize: 22 }}>FILTER</Text>
                </TouchableOpacity>
                :
                ""}
            <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                {loading ? <ActivityIndicator size="large" color={NORMAL_TEXT_COLOR} ></ActivityIndicator> : ""}
            </View>
            {/* body content */}
            {totalHomeData ? <FlatList
                data={totalHomeData}
                keyExtractor={(x, i) => i.toString()}
                horizontal={false}
                onEndReached={loadNextData}
                contentContainerStyle={{ flexGrow: 1, flexWrap: 'nowrap' }}
                style={{ height: PAGE_HEIGHT }}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
                renderItem={memoizedValue}
            /> : ""}
            <View style={{ height: 25 }}></View>
            <Footer
                pageName="Home"
            ></Footer>


            <Modal
                isVisible={isModalVisible}
                testID={'modal'}
                animationIn="slideInDown"
                animationOut="slideOutDown"
                onBackdropPress={toggleModal}
                backdropColor={"black"}
                backdropOpacity={0.40}
            >
                <View style={{ backgroundColor: NORMAL_TEXT_COLOR, width: '100%', backgroundColor: BACKGROUND_COLOR, justifyContent: 'center', alignItems: 'center' }}>
                    <Pressable onPress={toggleModal} style={{ position: 'absolute', right: 0, zIndex: 1000, top: 0 }}><MaterialCommunityIcons name='close-circle' color={NORMAL_TEXT_COLOR} size={30} /></Pressable>
                    {imagepopup ?
                        <Pressable onPress={() => { navigation.dispatch(StackActions.replace(redirectionpage)) }}><Image source={{ uri: imagepopup }} style={{ width: PAGE_WIDTH - 50, height: PAGE_HEIGHT - 50 }} resizeMode='contain'></Image></Pressable>
                        :
                        ""
                    }

                </View>
            </Modal>


            <StatusBar style="auto" />
        </View>
    );
}

const PaginationItem = (props) => {
    const { animValue, index, length, backgroundColor, isRotate } = props;
    const width = 10;

    const animStyle = useAnimatedStyle(() => {
        let inputRange = [index - 1, index, index + 1];
        let outputRange = [-width, 0, width];

        if (index === 0 && animValue?.value > length - 1) {
            inputRange = [length - 1, length, length + 1];
            outputRange = [-width, 0, width];
        }

        return {
            transform: [
                {
                    translateX: interpolate(
                        animValue?.value,
                        inputRange,
                        outputRange,
                        Extrapolate.CLAMP
                    ),
                },
            ],
        };
    }, [animValue, index, length]);
    return (
        <View
            style={{
                backgroundColor: SLIDER_PAGINATION_UNSELECTED_COLOR,
                width,
                height: width,
                borderRadius: 50,
                overflow: 'hidden',
                transform: [
                    {
                        rotateZ: isRotate ? '90deg' : '0deg',
                    },
                ],
            }}
        >
            <Animated.View
                style={[
                    {
                        borderRadius: 50,
                        backgroundColor,
                        flex: 1,
                    },
                    animStyle,
                ]}
            />
        </View>
    );
};


const styles = StyleSheet.create({
    playIcon: { position: 'absolute', width: 30, height: 30, right: 10, bottom: 15 },
    crownIcon: { position: 'absolute', width: 25, height: 25, left: 10, top: 10 },
    Container: {
        backgroundColor: BACKGROUND_COLOR,
        textAlign: "center",
        justifyContent: "center",
        height: 60,
        width: "100%",
    },
    textTabActive: {
        textAlign: "center",
        justifyContent: "center",
        backgroundColor: TAB_COLOR,
        height: 43,
        borderRadius: 25,
        width: '100%'
    },
    textTab: {
        textAlign: "center",
        justifyContent: "center",
        height: 43,
        borderRadius: 25,
        width: '100%'
    },
    textStyle: {
        color: NORMAL_TEXT_COLOR,
        textAlign: "center",
        justifyContent: "center",

        fontWeight: '600'
    },
    sectionHeaderView: {
        flexDirection: 'row',
        marginVertical: 10,
        width: '100%',
        justifyContent: 'space-between',

    },
    sectionHeader: {
        color: HEADING_TEXT_COLOR,
        fontSize: 16,
        fontWeight: '400',
        left: 3,

        width: "50%"
    },
    sectionHeaderMore: {
        color: MORE_LINK_COLOR,
        right: 15,
        fontSize: 13,
        width: "50%",
        textAlign: 'right'
    },
    imageSectionHorizontal: {
        width: PAGE_WIDTH / 2.06,
        height: 117,
        marginHorizontal: 3,
        borderRadius: 10,
        marginBottom: 10,
        borderWidth: 1
    },
    imageSectionHorizontalSingle: {
        width: PAGE_WIDTH - 20,
        height: 240,
        marginHorizontal: 3,
        borderRadius: 10,
        marginBottom: 10,
        borderWidth: 1,
        resizeMode: 'stretch'
    },
    imageSectionVertical: {
        width: PAGE_WIDTH / 3.15,
        height: 170,
        marginHorizontal: 3,
        borderRadius: 10,
        marginBottom: 10,

    },
    imageSectionCircle: {
        marginHorizontal: 0,
        marginBottom: 10,
        width: (PAGE_WIDTH / 3) - 10,
        height: (PAGE_WIDTH / 3) - 10,
        borderRadius: ((PAGE_WIDTH / 3) - 10) / 2,
    },
    imageSectionBig: {
        width: PAGE_WIDTH / 1.1,
        height: 230,
        marginHorizontal: 8,
        borderRadius: 1,
        padding: 20,
        borderColor: IMAGE_BORDER_COLOR,
        borderWidth: 1
    },
    imageSectionBigSingle: {
        width: PAGE_WIDTH / 1.04,
        height: 230,
        marginHorizontal: 8,
        borderRadius: 7,
        padding: 20,

    },
    imageSectionBigWithBorder: {
        width: PAGE_WIDTH / 1.1,
        height: 230,
        marginHorizontal: 8,
        borderRadius: 1,
        padding: 20,
        borderRadius: 10,
        borderColor: IMAGE_BORDER_COLOR,
        borderWidth: 1
    },
    image: {
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
        resizeMode: 'stretch',
        borderRadius: 10,
        height: 470
    },
    showsbannerimage: {
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
        resizeMode: 'cover',
        borderRadius: 10,
        height: 250
    },
});

export default Home;