import * as React from 'react';
import { useState, useEffect, useRef, useCallback } from 'react';
import { View, FlatList, StyleSheet, Text, TouchableOpacity, ActivityIndicator, RefreshControl, Image } from 'react-native';
import Animated, {
    Extrapolate,
    interpolate,
    useAnimatedStyle,
} from 'react-native-reanimated';
import FastImage from 'react-native-fast-image';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { BACKGROUND_COLOR, ANDROID_AUTH_TOKEN, FIRETV_BASE_URL, SLIDER_PAGINATION_UNSELECTED_COLOR, MORE_LINK_COLOR, TAB_COLOR, HEADING_TEXT_COLOR, IMAGE_BORDER_COLOR, NORMAL_TEXT_COLOR, ACCESS_TOKEN, PAGE_WIDTH, PAGE_HEIGHT, VIDEO_TYPES } from '../constants';
import { StatusBar } from 'expo-status-bar';
import Footer from './footer';


export const ElementsText = {
    AUTOPLAY: 'AutoPlay',
};

var page = 'featured-1';
var selectedItem = 0;
function MoreList({ navigation, route }) {
    const [totalHomeData, settotalHomeData] = useState();
    { route.params ? page = route.params.firendlyId : page = 'featured-1' }
    const [pageName, setpageName] = useState(page);
    const [refreshing, setRefreshing] = useState(false);
    const dataFetchedRef = useRef(false);
    const paginationLoadCount = 50;
    async function loadData(p) {
        var All = [];
        var Final = [];
        var definedPageName = "";
        var premiumContent = false;
        var premiumCheckData = "";
        if (pageName == 'featured-1')
            definedPageName = "home";
        else
            definedPageName = pageName;
        const url = FIRETV_BASE_URL + "/catalog_lists/" + definedPageName + ".gzip?item_language=eng&region=IN&auth_token=" + ANDROID_AUTH_TOKEN + "&access_token=" + ACCESS_TOKEN + "&page=" + p + "&page_size=" + paginationLoadCount + "&npage_size=10";
        const resp = await fetch(url);
        const data = await resp.json();
        if (data.data.catalog_list_items.length > 0) {
            for (var i = 0; i < data.data.catalog_list_items.length; i++) {
                if (data.data.catalog_list_items[i].hasOwnProperty('access_control')) {
                    premiumCheckData = (data.data.catalog_list_items[i].access_control);
                    if (premiumCheckData != "") {
                        if (premiumCheckData['is_free']) {
                            premiumContent = false;
                        }
                        else {
                            premiumContent = true;
                        }
                    }
                }

                if (data.data.catalog_list_items[i].media_list_in_list) {
                    All.push({ "uri": data.data.catalog_list_items[i].list_item_object.banner_image, "theme": data.data.catalog_list_items[i].theme, "premium": premiumContent });
                }
                else {

                    if (data.data.catalog_list_items[i].thumbnails.hasOwnProperty('high_4_3') || data.data.catalog_list_items[i].thumbnails.hasOwnProperty('high_3_4') || data.data.catalog_list_items[i].thumbnails.hasOwnProperty('high_16_9')) {
                        
                            if (data.data.catalog_list_items[i].layout_type == "tv_shows" || data.data.catalog_list_items[i].layout_type == "show")
                                All.push({ "uri": data.data.catalog_list_items[i].thumbnails.high_3_4.url, "theme": data.data.catalog_list_items[i].theme, "premium": premiumContent });

                                else
                                    All.push({ "uri": data.data.catalog_list_items[i].thumbnails.high_4_3.url, "theme": data.data.catalog_list_items[i].theme, "premium": premiumContent });


                    }

                }
            }
            Final.push({ "friendlyId": data.data.friendly_id, "data": All, "layoutType": data.data.layout_type, "displayName": data.data.display_title });
            All = [];
        }
        settotalHomeData(Final);
    }
    const renderItem = ({ item, index }) => {
        return (
            <View style={{ backgroundColor: BACKGROUND_COLOR, flex: 1, }}>



                {item.layoutType == 'channels' && item.data.length != 0 ?
                    <View>
                        <View style={styles.sectionHeaderView}>
                        <TouchableOpacity onPress={()=>navigation.goBack()}>
                            <MaterialCommunityIcons name="keyboard-backspace" size={30} color={NORMAL_TEXT_COLOR}></MaterialCommunityIcons>
                        </TouchableOpacity>
                            <Text style={styles.sectionHeader}>{item.displayName}</Text>
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
                                            <TouchableOpacity onPress={() => navigation.navigate(ChromeCast)}>
                                                <FastImage
                                                    style={[styles.imageSectionCircle,]}
                                                    resizeMode={FastImage.resizeMode.stretch}
                                                    source={{ uri: item.uri, priority: FastImage.priority.high, cache: FastImage.cacheControl.immutable, }} />
                                                {VIDEO_TYPES.includes(item.theme) ? <Image source={require('../assets/images/play.png')} style={{ position: 'absolute', width: 30, height: 30, right: 10, bottom: 15 }}></Image> : ""}
                                                {item.premium ? <Image source={require('../assets/images/crown.png')} style={styles.crownIcon}></Image> : ""}
                                            </TouchableOpacity>
                                        </View>
                                }
                            />
                        </View>
                    </View>
                    : ""}

                {(item.layoutType == 'tv_shows' || item.layoutType == 'show') && item.data.length != 0 ?
                    <View>
                        <View style={styles.sectionHeaderView}>
                        <TouchableOpacity onPress={()=>navigation.goBack()}>
                            <MaterialCommunityIcons name="keyboard-backspace" size={30} color={NORMAL_TEXT_COLOR}></MaterialCommunityIcons>
                        </TouchableOpacity>
                            <Text style={styles.sectionHeader}>{item.displayName}</Text>
                        </View>
                        <FlatList
                            data={item.data}
                            keyExtractor={(x, i) => i.toString()}
                            horizontal={false}
                            numColumns={3}
                            showsHorizontalScrollIndicator={false}
                            style={styles.containerMargin}
                            renderItem={
                                ({ item, index }) =>
                                    <View>
                                        <TouchableOpacity onPress={() => navigation.navigate(ChromeCast)}>
                                            <FastImage
                                                resizeMode={FastImage.resizeMode.stretch}
                                                style={[styles.imageSectionVertical, { resizeMode: 'stretch', }]}
                                                source={{ uri: item.uri, priority: FastImage.priority.high, cache: FastImage.cacheControl.immutable, }} />
                                            {VIDEO_TYPES.includes(item.theme) ? <Image source={require('../assets/images/play.png')} style={{ position: 'absolute', width: 30, height: 30, right: 10, bottom: 15 }}></Image> : ""}
                                            {item.premium ? <Image source={require('../assets/images/crown.png')} style={styles.crownIcon}></Image> : ""}
                                        </TouchableOpacity>
                                    </View>
                            }
                        />
                    </View>
                    : ""}


                {item.layoutType == 'live' && item.data.length != 0 ?
                    <View>
                        <View style={styles.sectionHeaderView}>
                        <TouchableOpacity onPress={()=>navigation.goBack()}>
                            <MaterialCommunityIcons name="keyboard-backspace" size={30} color={NORMAL_TEXT_COLOR}></MaterialCommunityIcons>
                        </TouchableOpacity>
                            <Text style={styles.sectionHeader}>{item.displayName}</Text>
                        </View>
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
                                        <TouchableOpacity onPress={() => navigation.navigate(ChromeCast)}>
                                            <FastImage
                                                style={[styles.imageSectionVertical,]}
                                                resizeMode={FastImage.resizeMode.stretch}
                                                source={{ uri: item.uri, priority: FastImage.priority.high, cache: FastImage.cacheControl.immutable, }} />
                                            {VIDEO_TYPES.includes(item.theme) ? <Image source={require('../assets/images/play.png')} style={{ position: 'absolute', width: 30, height: 30, right: 10, bottom: 15 }}></Image> : ""}
                                            {item.premium ? <Image source={require('../assets/images/crown.png')} style={styles.crownIcon}></Image> : ""}
                                        </TouchableOpacity>
                                    </View>
                            }
                        />
                    </View>
                    : ""}



                {item.layoutType != 'tv_shows' && item.layoutType != 'show' && item.layoutType != 'channels' && item.layoutType != 'live' && item.data.length != 0 ?
                    <View>
                        <View style={styles.sectionHeaderView}>
                        <TouchableOpacity onPress={()=>navigation.goBack()}>
                            <MaterialCommunityIcons name="keyboard-backspace" size={30} color={NORMAL_TEXT_COLOR}></MaterialCommunityIcons>
                        </TouchableOpacity>
                            <Text style={styles.sectionHeader}>{item.displayName}</Text>
                        </View>
                        <FlatList
                            data={item.data}
                            keyExtractor={(x, i) => i.toString()}
                            horizontal={false}
                            showsHorizontalScrollIndicator={false}
                            style={styles.containerMargin}
                            numColumns={2}
                            renderItem={
                                ({ item, index }) =>
                                    <View>
                                        <TouchableOpacity onPress={() => navigation.navigate(ChromeCast)}>
                                            <FastImage
                                                resizeMode={FastImage.resizeMode.stretch}
                                                style={[styles.imageSectionHorizontal, { resizeMode: 'stretch', }]}
                                                source={{ uri: item.uri, priority: FastImage.priority.high, cache: FastImage.cacheControl.immutable, }} />
                                            {VIDEO_TYPES.includes(item.theme) ? <Image source={require('../assets/images/play.png')} style={{ position: 'absolute', width: 30, height: 30, right: 10, bottom: 15 }}></Image> : ""}
                                            {item.premium ? <Image source={require('../assets/images/crown.png')} style={styles.crownIcon}></Image> : ""}
                                        </TouchableOpacity>
                                    </View>
                            }
                        />
                    </View> : ""}

            </View>
        );
    }

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        setTimeout(() => {
            loadData(0);
            if (selectedItem == "") {
                selectedItem = 0;
            }
            setRefreshing(false);
        }, 2000);
    }, []);

    useEffect(() => {
        if (dataFetchedRef.current) return;
        dataFetchedRef.current = true;
        loadData(0);
        if (selectedItem == "") {
            selectedItem = 0;
        }
    }, []);
    return (
        <View style={{ flex: 1, backgroundColor: BACKGROUND_COLOR, }}>




            {/* body content */}
            {totalHomeData ? <FlatList
                data={totalHomeData}
                keyExtractor={(x, i) => i.toString()}
                horizontal={false}
                contentContainerStyle={{ flexGrow: 1, flexWrap: 'nowrap' }}
                style={{ height: PAGE_HEIGHT }}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
                renderItem={renderItem}
            /> : <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}><ActivityIndicator size="large" color={NORMAL_TEXT_COLOR} /></View>}

            <Footer
                pageName={page}
            ></Footer>
            <StatusBar style="auto" />
        </View>
    );
}

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
        alignItems:'center',
        padding:8
    },
    sectionHeader: {
        color: HEADING_TEXT_COLOR,
        fontSize: 20,
        fontWeight: '400',
        marginLeft:20
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
        height: 250,
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

export default MoreList;