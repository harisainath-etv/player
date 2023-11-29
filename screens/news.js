import * as React from 'react';
import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { View, FlatList, StyleSheet, Text, Pressable, ActivityIndicator, RefreshControl, TouchableOpacity, Image, LogBox, StatusBar } from 'react-native';
import Carousel from 'react-native-reanimated-carousel';
import Animated, {
    Extrapolate,
    interpolate,
    useAnimatedStyle,
    useSharedValue,
} from 'react-native-reanimated';
import FastImage from 'react-native-fast-image';
import { BACKGROUND_COLOR, AUTH_TOKEN, FIRETV_BASE_URL, SLIDER_PAGINATION_SELECTED_COLOR, SLIDER_PAGINATION_UNSELECTED_COLOR, MORE_LINK_COLOR, TAB_COLOR, HEADING_TEXT_COLOR, IMAGE_BORDER_COLOR, NORMAL_TEXT_COLOR, ACCESS_TOKEN, PAGE_WIDTH, PAGE_HEIGHT, VIDEO_TYPES, LAYOUT_TYPES, VIDEO_AUTH_TOKEN, FIRETV_BASE_URL_STAGING, APP_VERSION, BACKGROUND_TOTAL_TRANSPARENT_COLOR_MENU, BACKGROUND_TRANSPARENT_COLOR_MENU, BUTTON_COLOR } from '../constants';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StackActions } from '@react-navigation/native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
// import RNBackgroundDownloader from 'react-native-background-downloader';
import axios from 'axios';
import Modal from "react-native-modal";
import Footer from './footer';
import Header from './header';
import DeviceInfo from 'react-native-device-info';
import LinearGradient from 'react-native-linear-gradient';
import { useFocusEffect } from '@react-navigation/native';


export const ElementsText = {
    AUTOPLAY: 'AutoPlay',
};

var page = 'featured-1';
var selectedItem = 0;
var popup = false;
var isTablet = DeviceInfo.isTablet();
var gateways = [];
function News({ navigation, route }) {

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
    const [loggedin, setloggedin] = useState(false);
    const [menubgcolor, setmenubgColor] = useState(BACKGROUND_TOTAL_TRANSPARENT_COLOR_MENU);
    var menuref = useRef();
    const progressValue = useSharedValue(0);
    const progressValue1 = useSharedValue(0);
    const progressValue2 = useSharedValue(0);
    const progressValue3 = useSharedValue(0);
    const dataFetchedRef = useRef(false);

    const [subscription_title, setsubscription_title] = useState("");

    const paginationLoadCount = 10;

    const baseOptions = isTablet ? ({
        vertical: false,
        width: PAGE_WIDTH,
        height: 500,
    }) : ({
        vertical: false,
        width: PAGE_WIDTH,
        height: 540,
    });
    const baseOptionsOther = isTablet ? ({
        vertical: false,
        width: PAGE_WIDTH,
        height: 260,
    }) : ({
        vertical: false,
        width: PAGE_WIDTH,
        height: 300,
    });
    const baseOptionsOtherSingle = isTablet ? ({
        vertical: false,
        width: PAGE_WIDTH,
        height: 355,
    }) : ({
        vertical: false,
        width: PAGE_WIDTH,
        height: 268,
    });
    const toggleModal = () => {
        setModalVisible(!isModalVisible);
    };

    async function loadData(p) {
        const mobile = await AsyncStorage.getItem('mobile_number');
        const session = await AsyncStorage.getItem('session');
        var region = await AsyncStorage.getItem('country_code');
        var show_popup = await AsyncStorage.getItem('show_popup');
        var popupshown = await AsyncStorage.getItem('popupshown');
        const subscriptiontitle = await AsyncStorage.getItem('subscription_title');
        if (session != "" && session != null) {
            setsubscription_title(subscriptiontitle)
            setloggedin(true);
        }



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
                const region = await AsyncStorage.getItem('country_code');
                const url = FIRETV_BASE_URL + "/catalog_lists/" + definedPageName + ".gzip?item_language=eng&region=" + region + "&auth_token=" + AUTH_TOKEN + "&access_token=" + ACCESS_TOKEN + "&page=" + p + "&page_size=" + paginationLoadCount + "&npage_size=10";
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
                                        if (data.data.catalog_list_items[i].layout_type == "top_banner") {
                                            if (isTablet)
                                                All.push({ "uri": data.data.catalog_list_items[i].catalog_list_items[j].thumbnails.high_16_9.url, "theme": data.data.catalog_list_items[i].catalog_list_items[j].theme, "premium": premiumContent, "seoUrl": data.data.catalog_list_items[i].catalog_list_items[j].seo_url, "medialistinlist": data.data.catalog_list_items[i].catalog_list_items[j].media_list_in_list, "friendlyId": "", "displayTitle": data.data.catalog_list_items[i].catalog_list_items[j].title, "genres": data.data.catalog_list_items[i].catalog_list_items[j].genres, "content_id": data.data.catalog_list_items[i].catalog_list_items[j].content_id, "catalog_id": data.data.catalog_list_items[i].catalog_list_items[j].catalog_id });
                                            else
                                                All.push({ "uri": data.data.catalog_list_items[i].catalog_list_items[j].thumbnails.high_3_4.url, "theme": data.data.catalog_list_items[i].catalog_list_items[j].theme, "premium": premiumContent, "seoUrl": data.data.catalog_list_items[i].catalog_list_items[j].seo_url, "medialistinlist": data.data.catalog_list_items[i].catalog_list_items[j].media_list_in_list, "friendlyId": "", "displayTitle": data.data.catalog_list_items[i].catalog_list_items[j].title, "genres": data.data.catalog_list_items[i].catalog_list_items[j].genres, "content_id": data.data.catalog_list_items[i].catalog_list_items[j].content_id, "catalog_id": data.data.catalog_list_items[i].catalog_list_items[j].catalog_id });
                                        }
                                        else
                                            if (data.data.catalog_list_items[i].layout_type == "tv_shows" || data.data.catalog_list_items[i].layout_type == "show" || data.data.catalog_list_items[i].layout_type == "movie_poster") {
                                                All.push({ "uri": data.data.catalog_list_items[i].catalog_list_items[j].thumbnails.high_3_4.url, "theme": data.data.catalog_list_items[i].catalog_list_items[j].theme, "premium": premiumContent, "seoUrl": data.data.catalog_list_items[i].catalog_list_items[j].seo_url, "medialistinlist": data.data.catalog_list_items[i].catalog_list_items[j].media_list_in_list, "friendlyId": "", "displayTitle": displayTitle });
                                            }
                                            else
                                                if (data.data.catalog_list_items[i].layout_type == "tv_shows_banner") {
                                                    if (isTablet)
                                                        All.push({ "uri": data.data.catalog_list_items[i].catalog_list_items[j].thumbnails.web_banner.url, "theme": data.data.catalog_list_items[i].catalog_list_items[j].theme, "premium": premiumContent, "seoUrl": data.data.catalog_list_items[i].catalog_list_items[j].seo_url, "medialistinlist": data.data.catalog_list_items[i].catalog_list_items[j].media_list_in_list, "friendlyId": "", "displayTitle": displayTitle });
                                                    else
                                                        All.push({ "uri": data.data.catalog_list_items[i].catalog_list_items[j].thumbnails.high_4_3.url, "theme": data.data.catalog_list_items[i].catalog_list_items[j].theme, "premium": premiumContent, "seoUrl": data.data.catalog_list_items[i].catalog_list_items[j].seo_url, "medialistinlist": data.data.catalog_list_items[i].catalog_list_items[j].media_list_in_list, "friendlyId": "", "displayTitle": displayTitle });
                                                }
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
            //offline downloads
            // let lostTasks = await RNBackgroundDownloader.checkForExistingDownloads();
            // for (let task of lostTasks) {
            //     task.begin(expectedBytes => {
            //         //console.log('Expected: ' + expectedBytes);
            //     }).progress((percent) => {
            //         AsyncStorage.setItem('download_' + task.id, JSON.stringify(percent * 100));
            //         //console.log(`Downloaded: ${percent * 100}%`);
            //     }).done(() => {
            //         AsyncStorage.setItem('download_' + task.id, JSON.stringify(1 * 100));
            //         //console.log('Downlaod is done!');
            //     }).error((error) => {
            //         //console.log('Download canceled due to error: ', error);
            //     });

            // }

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
                    if (error.response.data.error.code == '1016') {
                        removeunwanted()
                    }
                })

                //setting like content
                await axios.get(FIRETV_BASE_URL_STAGING + "/users/" + sessionId + "/playlists/like/listitems?auth_token=" + VIDEO_AUTH_TOKEN + "&access_token=" + ACCESS_TOKEN + "&region=" + region).then(response => {

                    for (var i = 0; i < response.data.data.items.length; i++) {
                        AsyncStorage.setItem("like_" + response.data.data.items[i].content_id, response.data.data.items[i].content_id);
                    }
                }).catch(error => {
                    //console.log(JSON.stringify(error.response.data));
                    if (error.response.data.error.code == '1016') {
                        removeunwanted()
                    }
                })
            }
            else {
                await AsyncStorage.clear();
                await loadasyncdata()
            }

            //like content

        }
    }
    const removeunwanted = async () => {
        await AsyncStorage.clear();
        await loadasyncdata()
        navigation.push("Home", {
            screen: 'Home',
            params: {
                pageFriendlyId: "featured-1",
            },
        });

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


        //if (getCurrentVersion != APP_VERSION) {
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
                if (APP_VERSION < appConfigData.data.params_hash2.config_params.ios_version.min_version || appConfigData.data.params_hash2.config_params.ios_version.force_upgrade == true) {
                    alert(appConfigData.data.params_hash2.config_params.ios_version.message);
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
        for (var i = 0; i < appConfigData.data.params_hash2.config_params.payment_gateway.length; i++) {
            if (appConfigData.data.params_hash2.config_params.payment_gateway[i].default == true) {
                await AsyncStorage.setItem('payment_gateway', appConfigData.data.params_hash2.config_params.payment_gateway[i].gateway.toLowerCase())
            }
            gateways.push({ "name": appConfigData.data.params_hash2.config_params.payment_gateway[i].gateway.toLowerCase() })
        }
        await AsyncStorage.setItem('availableGateways', JSON.stringify(gateways))
        await AsyncStorage.setItem('watchhistory_api', appConfigData.data.params_hash2.config_params.watchhistory_api);
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
        //}
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
    const watchLater = async (catalogId, contentId) => {
        if (!loggedin) {
            navigation.dispatch(StackActions.replace("Login"));
        }
        else {
            var sessionId = await AsyncStorage.getItem('session');
            await axios.post(FIRETV_BASE_URL + "users/" + sessionId + "/playlists/watchlater", {
                listitem: { catalog_id: catalogId, content_id: contentId },
                auth_token: VIDEO_AUTH_TOKEN,
                access_token: ACCESS_TOKEN,

            }, {
                headers: {
                    'Content-Type': 'application/json',
                }
            }).then(response => {
                alert("Added to watchlist");
                AsyncStorage.setItem("watchLater_" + contentId, contentId);
            }).catch(error => {
                console.log(error);
                alert("Unable to add to watchlist. Please try again later.");
            })
        }
    }

    const naviagtetopage = async (page, url, theme) => {
        settotalHomeData([]);
        navigation.navigate(page, { seoUrl: url, theme: theme })
    }

    const renderItem = ({ item, index }) => {
        const modeconfigobj = isTablet ? ({
            parallaxScrollingScale: 0.90,
            parallaxScrollingOffset: 65,
            parallaxAdjacentItemScale: 0.90,
        }) : ({
            parallaxScrollingScale: 0.82,
            parallaxScrollingOffset: 50,
            parallaxAdjacentItemScale: 0.82,
        });
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
                            autoPlayInterval={5000}
                            onProgressChange={(_, absoluteProgress) =>
                                (progressValue.value = absoluteProgress)
                            }

                            windowSize={3}
                            panGestureHandlerProps={{ activeOffsetX: [-10, 10] }}
                            data={item.data}
                            style={{ top: -15, }}
                            renderItem={({ item, index }) => <View style={{ height: '100%', }}>

                                <FastImage resizeMode={isTablet ? FastImage.resizeMode.contain : FastImage.resizeMode.stretch} key={index} style={[styles.image, { borderBottomLeftRadius: 0, borderBottomRightRadius: 0 }]} source={{ uri: item.uri, priority: FastImage.priority.high, cache: FastImage.cacheControl.immutable, }} />

                                <View style={styles.buttonsContainer}>
                                    <Text style={{ color: NORMAL_TEXT_COLOR, bottom: 120, position: 'absolute', fontSize: 13, }}>{JSON.stringify(item.genres).toUpperCase().split('["').join(".").split('"]').join("").split('","').join("  .")}</Text>
                                    <Text style={{ color: NORMAL_TEXT_COLOR, bottom: 90, position: 'absolute', fontSize: 20, fontWeight: 'bold' }}>
                                        <FontAwesome5 size={20} color={TAB_COLOR} name="grip-lines-vertical" />
                                        {item.displayTitle}
                                    </Text>
                                    <View style={styles.buttonsPosition}>

                                        <Pressable onPress={() => {
                                            {
                                                item.medialistinlist ?
                                                    navigation.dispatch(StackActions.replace('MoreList', { firendlyId: item.friendlyId, layoutType: LAYOUT_TYPES[1] }))
                                                    :
                                                    VIDEO_TYPES.includes(item.theme) ?
                                                        naviagtetopage('Episode', item.seoUrl, item.theme) : naviagtetopage('Shows', item.seoUrl, item.theme)
                                            }

                                        }}>
                                            <LinearGradient
                                                useAngle={true}
                                                angle={125}
                                                angleCenter={{ x: 0.5, y: 0.5 }}
                                                colors={[BUTTON_COLOR, TAB_COLOR, TAB_COLOR,TAB_COLOR, BUTTON_COLOR]}
                                                style={[styles.button, { borderColor: BACKGROUND_COLOR, borderWidth: 0.5, borderRadius: 40 }]}>
                                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                    <FontAwesome5 name='play' size={18} color={NORMAL_TEXT_COLOR} style={{ marginRight: 10 }} />
                                                    <Text style={{ color: NORMAL_TEXT_COLOR, fontSize: 18, fontWeight: 'bold' }}>Watch Now</Text>
                                                </View>
                                            </LinearGradient>
                                        </Pressable>


                                        {VIDEO_TYPES.includes(item.theme) ?
                                            <Pressable onPress={() => { watchLater(item.catalog_id, item.content_id) }} style={styles.wishlistbutton}>
                                                <Text style={{ color: NORMAL_TEXT_COLOR, fontSize: 18, fontWeight: 'bold' }}> + Watch Later</Text>
                                            </Pressable>
                                            :
                                            ""}

                                    </View>
                                </View>


                            </View>}
                        />
                        : ""}
                </View>

                {item.layoutType == 'tv_shows_banner' ?
                    <View style={{ width: PAGE_WIDTH, alignContent: 'center', justifyContent: 'center', alignItems: 'center' }}>
                        <View style={styles.sectionHeaderView}>
                            <Text style={styles.sectionHeader}>{item.displayName}</Text>
                            {item.data.length > 1 ? <Pressable style={{ width: "100%" }} onPress={() => navigation.dispatch(StackActions.replace('MoreList', { firendlyId: item.friendlyId, layoutType: LAYOUT_TYPES[0] }))}><Text style={styles.sectionHeaderMore}>
                                <MaterialCommunityIcons name='dots-grid' size={25} color={NORMAL_TEXT_COLOR} />
                            </Text></Pressable> : ""}
                        </View>
                        <Carousel
                            {...baseOptionsOther}
                            loop
                            pagingEnabled={pagingEnabled}
                            snapEnabled={snapEnabled}
                            autoPlay={page == 'featured-1' ? !autoPlay : autoPlay}
                            autoPlayInterval={2000}
                            onProgressChange={(_, absoluteProgress) =>
                                (progressValue1.value = absoluteProgress)
                            }
                            mode="parallax"
                            windowSize={3}
                            panGestureHandlerProps={{ activeOffsetX: [-10, 10] }}
                            modeConfig={modeconfigobj}
                            data={item.data}
                            style={{}}
                            renderItem={({ item, index }) => <Pressable onPress={() => {
                                {
                                    item.medialistinlist ?
                                        navigation.dispatch(StackActions.replace('MoreList', { firendlyId: item.friendlyId, layoutType: LAYOUT_TYPES[1] }))
                                        :
                                        VIDEO_TYPES.includes(item.theme) ?
                                            naviagtetopage('Episode', item.seoUrl, item.theme) : naviagtetopage('Shows', item.seoUrl, item.theme)
                                }
                            }}><FastImage key={index} style={styles.showsbannerimage} source={{ uri: item.uri, priority: FastImage.priority.high, cache: FastImage.cacheControl.immutable, }} /></Pressable>}
                        />
                    </View>
                    : ""}

                {item.layoutType == 'etv-exclusive_banner' && item.data.length != 0 ?

                    <View style={{ width: PAGE_WIDTH, alignContent: 'center', justifyContent: 'center', alignItems: 'center' }}>
                        <View style={styles.sectionHeaderView}>
                            <Text style={styles.sectionHeader}>{item.displayName}</Text>
                            {item.data.length > 1 ? <Pressable style={{ width: "100%" }} onPress={() => navigation.dispatch(StackActions.replace('MoreList', { firendlyId: item.friendlyId, layoutType: LAYOUT_TYPES[0] }))}><Text style={styles.sectionHeaderMore}><MaterialCommunityIcons name='dots-grid' size={25} color={NORMAL_TEXT_COLOR} />    </Text></Pressable> : ""}

                        </View>
                        <View style={{}}>
                            <Carousel
                                {...baseOptionsOtherSingle}
                                loop
                                pagingEnabled={pagingEnabled}
                                snapEnabled={snapEnabled}
                                autoPlay={page == 'featured-1' ? !autoPlay : autoPlay}
                                autoPlayInterval={2000}
                                onProgressChange={(_, absoluteProgress) =>
                                    (progressValue2.value = absoluteProgress)
                                }
                                windowSize={3}
                                panGestureHandlerProps={{ activeOffsetX: [-10, 10] }}
                                data={item.data}
                                style={{}}
                                renderItem={({ item, index }) => <Pressable onPress={() => {
                                    {
                                        item.medialistinlist ?
                                            navigation.dispatch(StackActions.replace('MoreList', { firendlyId: item.friendlyId, layoutType: LAYOUT_TYPES[1] }))
                                            :
                                            VIDEO_TYPES.includes(item.theme) ?
                                                naviagtetopage('Episode', item.seoUrl, item.theme) : naviagtetopage('Shows', item.seoUrl, item.theme)
                                    }
                                }}><FastImage resizeMode={FastImage.resizeMode.stretch} key={index} style={isTablet ? styles.imageSectionHorizontalSingleTab : styles.imageSectionHorizontalSingle} source={{ uri: item.uri, priority: FastImage.priority.high, cache: FastImage.cacheControl.immutable, }} /></Pressable>}
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
                                autoPlay={page == 'featured-1' ? !autoPlay : autoPlay}
                                autoPlayInterval={2000}
                                onProgressChange={(_, absoluteProgress) =>
                                    (progressValue3.value = absoluteProgress)
                                }
                                windowSize={3}
                                panGestureHandlerProps={{ activeOffsetX: [-10, 10] }}
                                data={item.data}
                                style={{}}
                                renderItem={({ item, index }) => <Pressable onPress={() => {
                                    {
                                        item.medialistinlist ?
                                            navigation.dispatch(StackActions.replace('MoreList', { firendlyId: item.friendlyId, layoutType: LAYOUT_TYPES[1] }))
                                            :
                                            VIDEO_TYPES.includes(item.theme) ?
                                                naviagtetopage('Episode', item.seoUrl, item.theme) : naviagtetopage('Shows', item.seoUrl, item.theme)
                                    }
                                }}><FastImage resizeMode={FastImage.resizeMode.stretch} key={index} style={isTablet ? styles.imageSectionHorizontalSingleTab : styles.imageSectionHorizontalSingle} source={{ uri: item.uri, priority: FastImage.priority.high, cache: FastImage.cacheControl.immutable, }} /></Pressable>}
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
                    <View style={index == 0 ? { marginTop: 60 } : {}}>
                        <View style={styles.sectionHeaderView}>
                            <Text style={styles.sectionHeader}>{item.displayName}</Text>
                            {item.data.length > 3 ? <Pressable style={{ width: "100%" }} onPress={() => navigation.dispatch(StackActions.replace('MoreList', { firendlyId: item.friendlyId, layoutType: LAYOUT_TYPES[0] }))}><Text style={styles.sectionHeaderMore}><MaterialCommunityIcons name='dots-grid' size={25} color={NORMAL_TEXT_COLOR} />    </Text></Pressable> : ""}
                        </View>
                        {isTablet ?
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
                                                            naviagtetopage('Episode', item.seoUrl, item.theme) : naviagtetopage('Shows', item.seoUrl, item.theme)
                                                }
                                            }}>
                                                <FastImage
                                                    style={[styles.imageSectionVerticalTab, { resizeMode: 'stretch', }]}
                                                    resizeMode={FastImage.resizeMode.stretch}
                                                    source={{ uri: item.uri, priority: FastImage.priority.high, cache: FastImage.cacheControl.immutable, }} />
                                            </Pressable>
                                            {/* {VIDEO_TYPES.includes(item.theme) ? <Image source={require('../assets/images/play.png')} style={styles.playIcon}></Image> : ""} */}
                                            {item.premium ? <Image source={require('../assets/images/crown.png')} style={styles.crownIcon}></Image> : ""}
                                        </View>
                                }
                            />
                            :
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
                                                            naviagtetopage('Episode', item.seoUrl, item.theme) : naviagtetopage('Shows', item.seoUrl, item.theme)
                                                }
                                            }}>
                                                <FastImage
                                                    style={[styles.imageSectionVertical, { resizeMode: 'stretch', }]}
                                                    resizeMode={FastImage.resizeMode.stretch}
                                                    source={{ uri: item.uri, priority: FastImage.priority.high, cache: FastImage.cacheControl.immutable, }} />
                                            </Pressable>
                                            {/* {VIDEO_TYPES.includes(item.theme) ? <Image source={require('../assets/images/play.png')} style={styles.playIcon}></Image> : ""} */}
                                            {item.premium ? <Image source={require('../assets/images/crown.png')} style={styles.crownIcon}></Image> : ""}
                                        </View>
                                }
                            />
                        }
                    </View>
                    : ""}

                {item.layoutType == 'channels' && item.data.length != 0 ?
                    <View>
                        <View style={styles.sectionHeaderView}>
                            <Text style={styles.sectionHeader}>{item.displayName}</Text>
                            {item.data.length > 3 ? <Pressable style={{ width: "100%" }} onPress={() => navigation.dispatch(StackActions.replace('MoreList', { firendlyId: item.friendlyId, layoutType: LAYOUT_TYPES[0] }))}><Text style={styles.sectionHeaderMore}><MaterialCommunityIcons name='dots-grid' size={25} color={NORMAL_TEXT_COLOR} />    </Text></Pressable> : ""}
                        </View>
                        <View style={{ flexDirection: 'column' }}>
                            {isTablet ?
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
                                                                naviagtetopage('Episode', item.seoUrl, item.theme) : naviagtetopage('Shows', item.seoUrl, item.theme)
                                                    }
                                                }}>
                                                    <FastImage
                                                        style={[styles.imageSectionCircleTab,]}
                                                        resizeMode={FastImage.resizeMode.stretch}
                                                        source={{ uri: item.uri, priority: FastImage.priority.high, cache: FastImage.cacheControl.immutable, }} />
                                                    {VIDEO_TYPES.includes(item.theme) ? <Image source={require('../assets/images/play.png')} style={styles.playIcon}></Image> : ""}
                                                    {item.premium ? <Image source={require('../assets/images/crown.png')} style={styles.crownIcon}></Image> : ""}
                                                </Pressable>
                                            </View>
                                    }
                                />
                                :
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
                                                                naviagtetopage('Episode', item.seoUrl, item.theme) : naviagtetopage('Shows', item.seoUrl, item.theme)
                                                    }
                                                }}>
                                                    <FastImage
                                                        style={[styles.imageSectionCircle,]}
                                                        resizeMode={FastImage.resizeMode.stretch}
                                                        source={{ uri: item.uri, priority: FastImage.priority.high, cache: FastImage.cacheControl.immutable, }} />
                                                    {/* {VIDEO_TYPES.includes(item.theme) ? <Image source={require('../assets/images/play.png')} style={styles.playIcon}></Image> : ""} */}
                                                    {item.premium ? <Image source={require('../assets/images/crown.png')} style={styles.crownIcon}></Image> : ""}
                                                </Pressable>
                                            </View>
                                    }
                                />
                            }
                        </View>
                    </View>
                    : ""}

                {item.layoutType == 'live' && item.data.length != 0 ?
                    <View>
                        {isTablet ?
                            <FlatList
                                data={item.data}
                                keyExtractor={(x, i) => i.toString()}
                                horizontal={false}
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
                                                            naviagtetopage('Episode', item.seoUrl, item.theme) : naviagtetopage('Shows', item.seoUrl, item.theme)
                                                }
                                            }}>
                                                <FastImage
                                                    style={[styles.imageSectionVerticalTab,]}
                                                    resizeMode={FastImage.resizeMode.stretch}
                                                    source={{ uri: item.uri, priority: FastImage.priority.high, cache: FastImage.cacheControl.immutable, }} />
                                                {VIDEO_TYPES.includes(item.theme) ? <Image source={require('../assets/images/play.png')} style={{ position: 'absolute', width: 30, height: 30, right: 10, bottom: 15 }}></Image> : ""}
                                                {item.premium ? <Image source={require('../assets/images/crown.png')} style={styles.crownIcon}></Image> : ""}
                                            </Pressable>
                                        </View>
                                }
                            />
                            :
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
                                                            naviagtetopage('Episode', item.seoUrl, item.theme) : naviagtetopage('Shows', item.seoUrl, item.theme)
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
                        }
                    </View>
                    : ""}

                {item.layoutType == 'movie_poster' && item.data.length != 0 ?
                    <View>
                        <View style={styles.sectionHeaderView}>
                            <Text style={styles.sectionHeader}>{item.displayName}</Text>
                            {item.data.length > 2 ? <Pressable style={{ width: "100%" }} onPress={() => navigation.dispatch(StackActions.replace('MoreList', { firendlyId: item.friendlyId, layoutType: LAYOUT_TYPES[1] }))}><Text style={styles.sectionHeaderMore}><MaterialCommunityIcons name='dots-grid' size={25} color={NORMAL_TEXT_COLOR} />    </Text></Pressable> : ""}
                        </View>
                        {isTablet ?
                            <FlatList
                                data={item.data}
                                keyExtractor={(x, i) => i.toString()}
                                horizontal={false}
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
                                                            naviagtetopage('Episode', item.seoUrl, item.theme) : naviagtetopage('Shows', item.seoUrl, item.theme)
                                                }
                                            }}>
                                                <FastImage
                                                    style={[styles.imageSectionVerticalMoviePoster,]}
                                                    resizeMode={FastImage.resizeMode.stretch}
                                                    source={{ uri: item.uri, priority: FastImage.priority.high, cache: FastImage.cacheControl.immutable, }} />
                                                {VIDEO_TYPES.includes(item.theme) ? <Image source={require('../assets/images/play.png')} style={{ position: 'absolute', width: 30, height: 30, right: 10, bottom: 15 }}></Image> : ""}
                                                {item.premium ? <Image source={require('../assets/images/crown.png')} style={styles.crownIcon}></Image> : ""}
                                            </Pressable>
                                        </View>
                                }
                            />
                            :
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
                                                            naviagtetopage('Episode', item.seoUrl, item.theme) : naviagtetopage('Shows', item.seoUrl, item.theme)
                                                }
                                            }}>
                                                <FastImage
                                                    style={[styles.imageSectionVerticalMoviePoster,]}
                                                    resizeMode={FastImage.resizeMode.stretch}
                                                    source={{ uri: item.uri, priority: FastImage.priority.high, cache: FastImage.cacheControl.immutable, }} />
                                                {VIDEO_TYPES.includes(item.theme) ? <Image source={require('../assets/images/play.png')} style={{ position: 'absolute', width: 30, height: 30, right: 10, bottom: 15 }}></Image> : ""}
                                                {item.premium ? <Image source={require('../assets/images/crown.png')} style={styles.crownIcon}></Image> : ""}
                                            </Pressable>
                                        </View>
                                }
                            />
                        }
                    </View>
                    : ""}


                {item.layoutType == 'mini_movie_poster' && item.data.length != 0 ?
                    <View>
                        <View style={styles.sectionHeaderView}>
                            <Text style={styles.sectionHeader}>{item.displayName}</Text>
                            {item.data.length > 2 ? <Pressable style={{ width: "100%" }} onPress={() => navigation.dispatch(StackActions.replace('MoreList', { firendlyId: item.friendlyId, layoutType: LAYOUT_TYPES[1] }))}><Text style={styles.sectionHeaderMore}><MaterialCommunityIcons name='dots-grid' size={25} color={NORMAL_TEXT_COLOR} />    </Text></Pressable> : ""}
                        </View>
                        {isTablet ?
                            <FlatList
                                data={item.data}
                                keyExtractor={(x, i) => i.toString()}
                                horizontal={false}
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
                                                            naviagtetopage('Episode', item.seoUrl, item.theme) : naviagtetopage('Shows', item.seoUrl, item.theme)
                                                }
                                            }}>
                                                <FastImage
                                                    style={[styles.imageSectionMiniMoviePoster,]}
                                                    resizeMode={FastImage.resizeMode.stretch}
                                                    source={{ uri: item.uri, priority: FastImage.priority.high, cache: FastImage.cacheControl.immutable, }} />
                                                {VIDEO_TYPES.includes(item.theme) ? <Image source={require('../assets/images/play.png')} style={{ position: 'absolute', width: 30, height: 30, right: 10, bottom: 15 }}></Image> : ""}
                                                {item.premium ? <Image source={require('../assets/images/crown.png')} style={styles.crownIcon}></Image> : ""}
                                            </Pressable>
                                        </View>
                                }
                            />
                            :
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
                                                            naviagtetopage('Episode', item.seoUrl, item.theme) : naviagtetopage('Shows', item.seoUrl, item.theme)
                                                }
                                            }}>
                                                <FastImage
                                                    style={[styles.imageSectionMiniMoviePoster,]}
                                                    resizeMode={FastImage.resizeMode.stretch}
                                                    source={{ uri: item.uri, priority: FastImage.priority.high, cache: FastImage.cacheControl.immutable, }} />
                                                {VIDEO_TYPES.includes(item.theme) ? <Image source={require('../assets/images/play.png')} style={{ position: 'absolute', width: 30, height: 30, right: 10, bottom: 15 }}></Image> : ""}
                                                {item.premium ? <Image source={require('../assets/images/crown.png')} style={styles.crownIcon}></Image> : ""}
                                            </Pressable>
                                        </View>
                                }
                            />
                        }
                    </View>
                    : ""}

                {item.layoutType == 'news_slider' && item.data.length != 0 ?
                    <View style={{ width: PAGE_WIDTH, alignContent: 'center', justifyContent: 'center', alignItems: 'center' }}>
                        <View style={{}}>
                            <Carousel
                                {...baseOptionsOtherSingle}
                                loop
                                pagingEnabled={pagingEnabled}
                                snapEnabled={snapEnabled}
                                autoPlay={page == 'featured-1' ? !autoPlay : autoPlay}
                                autoPlayInterval={2000}
                                onProgressChange={(_, absoluteProgress) =>
                                    (progressValue2.value = absoluteProgress)
                                }
                                windowSize={3}
                                panGestureHandlerProps={{ activeOffsetX: [-10, 10] }}
                                data={item.data}
                                style={{}}
                                renderItem={({ item, index }) => <Pressable onPress={() => {
                                    {
                                        item.medialistinlist ?
                                            navigation.dispatch(StackActions.replace('MoreList', { firendlyId: item.friendlyId, layoutType: LAYOUT_TYPES[1] }))
                                            :
                                            VIDEO_TYPES.includes(item.theme) ?
                                                naviagtetopage('Episode', item.seoUrl, item.theme) : naviagtetopage('Shows', item.seoUrl, item.theme)
                                    }
                                }}><FastImage resizeMode={FastImage.resizeMode.stretch} key={index} style={isTablet ? styles.imageSectionHorizontalSingleTab : styles.imageSectionHorizontalSingle} source={{ uri: item.uri, priority: FastImage.priority.high, cache: FastImage.cacheControl.immutable, }} />

                                    <LinearGradient
                                        useAngle={true}
                                        angle={125}
                                        angleCenter={{ x: 0.5, y: 0.5 }}
                                        colors={[BUTTON_COLOR, TAB_COLOR, TAB_COLOR,TAB_COLOR, BUTTON_COLOR]}
                                        style={[styles.button, { position: 'absolute', bottom: 10, width: "100%" }]}>
                                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                                            <FontAwesome5 name='play' size={16} color={NORMAL_TEXT_COLOR} style={{ marginRight: 10 }} />
                                            <Text style={{ color: NORMAL_TEXT_COLOR, fontSize: 18 }}>Watch Now</Text>
                                        </View>
                                    </LinearGradient>

                                </Pressable>}
                            />
                        </View>
                    </View>
                    : ""}



                {item.layoutType != 'tv_shows' && item.layoutType != 'show' && item.layoutType != 'top_banner' && item.layoutType != 'etv-exclusive_banner' && item.layoutType != 'tv_shows_banner' && item.layoutType != 'banner' && item.layoutType != 'channels' && item.layoutType != 'live' && item.layoutType != 'movie_poster' && item.layoutType != 'mini_movie_poster' && item.layoutType != 'news_slider' && item.data.length != 0 ?
                    <View style={index == 0 ? { marginTop: 60 } : {}}>
                        <View style={styles.sectionHeaderView}>
                            <Text style={styles.sectionHeader}>{item.displayName}</Text>
                            {item.data.length > 2 ? <Pressable style={{ width: "100%" }} onPress={() => navigation.dispatch(StackActions.replace('MoreList', { firendlyId: item.friendlyId, layoutType: LAYOUT_TYPES[1] }))}><Text style={styles.sectionHeaderMore}><MaterialCommunityIcons name='dots-grid' size={25} color={NORMAL_TEXT_COLOR} />    </Text></Pressable> : ""}
                        </View>
                        {isTablet ?
                            <FlatList
                                data={item.data}
                                keyExtractor={(x, i) => i.toString()}
                                horizontal={true}
                                showsHorizontalScrollIndicator={false}
                                style={styles.containerMargin}
                                renderItem={
                                    ({ item, index }) =>
                                        <View style={{}}>
                                            <Pressable onPress={() => {
                                                {
                                                    item.medialistinlist ?
                                                        navigation.dispatch(StackActions.replace('MoreList', { firendlyId: item.friendlyId, layoutType: LAYOUT_TYPES[1] }))
                                                        :
                                                        VIDEO_TYPES.includes(item.theme) ?
                                                            naviagtetopage('Episode', item.seoUrl, item.theme) : naviagtetopage('Shows', item.seoUrl, item.theme)
                                                }
                                            }}>
                                                <FastImage
                                                    style={[styles.imageSectionHorizontalTab, { resizeMode: 'stretch', }]}
                                                    resizeMode={FastImage.resizeMode.stretch}
                                                    source={{ uri: item.uri, priority: FastImage.priority.high, cache: FastImage.cacheControl.immutable, }} />
                                                {/* {VIDEO_TYPES.includes(item.theme) ? <Image source={require('../assets/images/play.png')} style={styles.playIcon}></Image> : ""} */}
                                                {item.premium ? <Image source={require('../assets/images/crown.png')} style={styles.crownIcon}></Image> : ""}
                                            </Pressable>
                                            <Text style={{ color: NORMAL_TEXT_COLOR, alignSelf: 'center', marginBottom: 20 }}>{item.displayTitle}</Text>
                                        </View>
                                }
                            />
                            :
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
                                                            naviagtetopage('Episode', item.seoUrl, item.theme) : naviagtetopage('Shows', item.seoUrl, item.theme)
                                                }
                                            }}>
                                                <FastImage
                                                    style={[styles.imageSectionHorizontal, { resizeMode: 'stretch', }]}
                                                    resizeMode={FastImage.resizeMode.stretch}
                                                    source={{ uri: item.uri, priority: FastImage.priority.high, cache: FastImage.cacheControl.immutable, }} />
                                                {/* {VIDEO_TYPES.includes(item.theme) ? <Image source={require('../assets/images/play.png')} style={styles.playIcon}></Image> : ""} */}
                                                {item.premium ? <Image source={require('../assets/images/crown.png')} style={styles.crownIcon}></Image> : ""}
                                            </Pressable>
                                            <Text style={{ color: NORMAL_TEXT_COLOR, alignSelf: 'center', marginBottom: 20 }}>{item.displayTitle}</Text>
                                        </View>
                                }
                            />
                        }
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
            <View style={{ paddingTop: 5, flexDirection: 'row' }}>

                {item.friendlyId == pageName ?

                    <View style={styles.menuitem}>
                        <Text style={{ color: NORMAL_TEXT_COLOR, fontWeight: 'bold', }}>{item.displayName}</Text>
                    </View>
                    :
                    <Pressable onPress={() => changeTabData(item.friendlyId)}>
                        <View style={styles.menuitem}>
                            <Text style={{ color: NORMAL_TEXT_COLOR, fontWeight: 'bold', }}>{item.displayName}</Text>
                        </View>
                    </Pressable>
                }
            </View>
        )
    }

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        setTimeout(() => {
            settotalHomeData([]);
            settotalMenuData([]);
            settoload(true);
            getTopMenu();
            loadData(0);
            if (selectedItem == "") {
                selectedItem = 0;
            }
            setRefreshing(false);
        }, 1000);
    }, []);
    const loadNextData = async () => {
        loadData(pagenumber);
    }
    useFocusEffect(
        useCallback(() => {


            // if (dataFetchedRef.current) return;
            // dataFetchedRef.current = true;
            getTopMenu();
            loadData(0);
            if (selectedItem == "") {
                selectedItem = 0;
            }
            LogBox.ignoreLogs(['`new NativeEventEmitter()` was called with a non-null']);
        }, [totalHomeData])
    );


    const memoizedValue = useMemo(() => renderItem, [totalHomeData]);
    const loadFilters = async () => {
        navigation.navigate('FoodFilter');
    }
    return (
        <View style={{ flex: 1, backgroundColor: BACKGROUND_COLOR }}>
            {pageName == 'recipes' ?
                <TouchableOpacity onPress={loadFilters} style={{ justifyContent: 'center', alignItems: 'center', flexDirection: 'row', marginTop: 75, }}>
                    <MaterialCommunityIcons name='filter-variant' size={30} color={NORMAL_TEXT_COLOR} />
                    <Text style={{ color: NORMAL_TEXT_COLOR, fontSize: 22 }}>FILTER</Text>
                </TouchableOpacity>
                :
                ""}

            {/* body content */}
            {totalHomeData ? <FlatList
                data={totalHomeData}
                keyExtractor={(x, i) => i.toString()}
                horizontal={false}
                onEndReached={loadNextData}
                onScroll={(resp) => {
                    if (resp.nativeEvent.contentOffset.y != 0)
                        setmenubgColor(BACKGROUND_TRANSPARENT_COLOR_MENU)
                    else {
                        setmenubgColor(BACKGROUND_TOTAL_TRANSPARENT_COLOR_MENU);
                    }
                }}
                contentContainerStyle={{ flexGrow: 1, flexWrap: 'nowrap' }}
                style={{ height: PAGE_HEIGHT }}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
                renderItem={memoizedValue}
            /> : ""}
            {/* header menu */}
            <View style={{ left: "50%", position: 'absolute', zIndex: 10000, top: '50%' }}>
                {loading ? <ActivityIndicator size="large" color={NORMAL_TEXT_COLOR} style={{}}></ActivityIndicator> : ""}
            </View>
            <View style={{ position: 'absolute', backgroundColor: menubgcolor, width: PAGE_WIDTH }}>
                <View style={{ marginTop: 30, justifyContent: 'center', alignContent: 'center', alignItems: 'center', flexDirection: 'row', width: "100%" }}>

                    <View style={[styles.menulogo, { width: "20%" }]}>
                        <Image source={require('../assets/images/winlogo.png')} style={{ width: 70, height: 40 }}></Image>
                    </View>
                    <View style={{ width: "53%" }}>
                    </View>
                    <View style={{ width: "27%", flexDirection: 'row' }}>
                    </View>
                </View>

            </View>


            {subscription_title == '' || subscription_title == null || subscription_title == 'Free' ?
                <View style={{ justifyContent: 'center', alignItems: 'center' }}><TouchableOpacity style={{ position: 'absolute', bottom: 10 }} onPress={() => navigation.navigate('Subscribe', {})}>
                    <LinearGradient
                        useAngle={true}
                        angle={125}
                        angleCenter={{ x: 0.5, y: 0.5 }}
                        colors={[BUTTON_COLOR, TAB_COLOR, TAB_COLOR,TAB_COLOR, BUTTON_COLOR]}
                        style={styles.button}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <FontAwesome5 name='lock' size={16} color={NORMAL_TEXT_COLOR} style={{ marginRight: 10 }} />
                            <Text style={{ color: NORMAL_TEXT_COLOR, fontSize: 18 }}>Subscribe</Text>
                        </View>
                    </LinearGradient>
                </TouchableOpacity></View>
                :
                ""}

            <View style={{ height: 25 }}></View>
            <Footer
                pageName="NEWS"
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


            <StatusBar
                animated
                backgroundColor="transparent"
                barStyle="dark-content"
                translucent={true}
            />
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
    buttonsContainer: { width: "100%", height: "100%", alignItems: 'center', justifyContent: 'center', zIndex: 1000, },
    buttonsPosition: { position: 'absolute', bottom: 20, flexDirection: 'row', width: '100%', alignItems: 'center', justifyContent: 'center' },
    button: { paddingLeft: 22, paddingRight: 22, paddingBottom: 7, paddingTop: 7, borderRadius: 40, marginRight: 5 },
    wishlistbutton: { borderRadius: 40, borderWidth: 2, borderColor: TAB_COLOR, justifyContent: 'center', alignItems: 'center', paddingLeft: 22, paddingRight: 22, paddingBottom: 7, paddingTop: 7 },
    subscribeImage: { width: 160, height: 85, resizeMode: 'contain', justifyContent: 'center', alignItems: 'center', },
    menulogo: { height: 35, justifyContent: 'center', alignItems: 'center', },
    menuitem: { height: 35, justifyContent: 'center', alignItems: 'center', padding: 8, borderRadius: 15 },
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
    imageSectionHorizontalTab: {
        width: 190,
        height: 117,
        marginHorizontal: 3,
        borderRadius: 10,
        marginBottom: 10,
        borderWidth: 1
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
        width: PAGE_WIDTH - 5,
        height: 265,
        marginHorizontal: 3,
        marginBottom: 10,
        borderWidth: 1,
        resizeMode: 'stretch'
    },
    imageSectionHorizontalSingleTab: {
        width: PAGE_WIDTH - 20,
        height: 340,
        marginHorizontal: 3,
        borderRadius: 10,
        marginBottom: 10,
        borderWidth: 1,
        resizeMode: 'contain'
    },
    imageSectionVertical: {
        width: PAGE_WIDTH / 3.15,
        height: 170,
        marginHorizontal: 3,
        borderRadius: 10,
        marginBottom: 10,

    },
    imageSectionVerticalMoviePoster: {
        width: PAGE_WIDTH / 1.35,
        height: 370,
        marginHorizontal: 3,
        borderRadius: 10,
        marginBottom: 10,
    },
    imageSectionMiniMoviePoster: {
        width: PAGE_WIDTH / 4,
        height: 70,
        marginHorizontal: 3,
        borderRadius: 10,
        marginBottom: 10,
    },
    imageSectionVerticalTab: {
        width: 150,
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
    imageSectionCircleTab: {
        marginHorizontal: 0,
        marginBottom: 10,
        width: 200,
        height: 200,
        borderRadius: 100,
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
        height: 540
    },
    showsbannerimage: {
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
        resizeMode: 'cover',
        borderRadius: 10,
        height: 300
    },
});

export default News;