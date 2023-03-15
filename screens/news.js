import * as React from 'react';
import { useState, useEffect, useRef, useCallback } from 'react';
import { View, FlatList, StyleSheet, Text, ActivityIndicator, RefreshControl, Image, Pressable } from 'react-native';
import Carousel from 'react-native-reanimated-carousel';
import Animated, {
    Extrapolate,
    interpolate,
    useAnimatedStyle,
    useSharedValue,
} from 'react-native-reanimated';
import FastImage from 'react-native-fast-image';
import { BACKGROUND_COLOR, AUTH_TOKEN, FIRETV_BASE_URL, SLIDER_PAGINATION_SELECTED_COLOR, SLIDER_PAGINATION_UNSELECTED_COLOR, MORE_LINK_COLOR, TAB_COLOR, HEADING_TEXT_COLOR, IMAGE_BORDER_COLOR, NORMAL_TEXT_COLOR, ACCESS_TOKEN, PAGE_WIDTH, PAGE_HEIGHT, VIDEO_TYPES, LAYOUT_TYPES } from '../constants';
import { StatusBar } from 'expo-status-bar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Footer from './footer';
import Header from './header';

export const ElementsText = {
    AUTOPLAY: 'AutoPlay',
};

var page = 'featured-1';
var selectedItem = 0;
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
    const [totalHomeData, settotalHomeData] = useState();
    const [totalMenuData, settotalMenuData] = useState();
    { route.params ? page = route.params.pageFriendlyId : page = 'featured-1' }
    // const {pageFriendlyId}=route.params;
    const [pageName, setpageName] = useState(page);
    const [isVertical, setIsVertical] = useState(false);
    const [autoPlay, setAutoPlay] = useState(true);
    const [pagingEnabled, setPagingEnabled] = useState(true);
    const [snapEnabled, setSnapEnabled] = useState(true);
    const [currentIndexValue, setcurrentIndexValue] = useState();
    const [refreshing, setRefreshing] = useState(false);
    const progressValue = useSharedValue(0);
    const dataFetchedRef = useRef(false);
    const paginationLoadCount = 50;

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

    async function loadData(p) {
        var All = [];
        var Final = [];
        var premiumContent = false;
        var premiumCheckData = "";
        var definedPageName = "";
        if (pageName == 'featured-1')
            definedPageName = "home";
        else
            definedPageName = pageName;
        const region = await AsyncStorage.getItem('country_code');
        const url = FIRETV_BASE_URL + "/catalog_lists/" + definedPageName + ".gzip?item_language=eng&region=" + region + "&auth_token=" + AUTH_TOKEN + "&access_token=" + ACCESS_TOKEN + "&page=" + p + "&page_size=" + paginationLoadCount + "&npage_size=10";
        const resp = await fetch(url);
        const data = await resp.json();
        // console.log(url);
        if (data.data.catalog_list_items.length > 0) {
            for (var i = 0; i < data.data.catalog_list_items.length; i++) {
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
                    if (data.data.catalog_list_items[i].catalog_list_items[j].media_list_in_list) {
                        All.push({ "uri": data.data.catalog_list_items[i].catalog_list_items[j].list_item_object.banner_image, "theme": data.data.catalog_list_items[i].catalog_list_items[j].theme, "premium": premiumContent, "seoUrl": data.data.catalog_list_items[i].catalog_list_items[j].seo_url });
                    }
                    else {
                        if (data.data.catalog_list_items[i].catalog_list_items[j].thumbnails.hasOwnProperty('high_4_3') || data.data.catalog_list_items[i].catalog_list_items[j].thumbnails.hasOwnProperty('high_3_4') || data.data.catalog_list_items[i].catalog_list_items[j].thumbnails.hasOwnProperty('high_16_9')) {
                            if (data.data.catalog_list_items[i].layout_type == "top_banner")
                                All.push({ "uri": data.data.catalog_list_items[i].catalog_list_items[j].thumbnails.high_3_4.url, "theme": data.data.catalog_list_items[i].catalog_list_items[j].theme, "premium": premiumContent, "seoUrl": data.data.catalog_list_items[i].catalog_list_items[j].seo_url });
                            else
                                if (data.data.catalog_list_items[i].layout_type == "tv_shows" || data.data.catalog_list_items[i].layout_type == "show")
                                    All.push({ "uri": data.data.catalog_list_items[i].catalog_list_items[j].thumbnails.high_3_4.url, "theme": data.data.catalog_list_items[i].catalog_list_items[j].theme, "premium": premiumContent, "seoUrl": data.data.catalog_list_items[i].catalog_list_items[j].seo_url });
                                else
                                    if (data.data.catalog_list_items[i].layout_type == "tv_shows_banner")
                                        All.push({ "uri": data.data.catalog_list_items[i].catalog_list_items[j].thumbnails.high_4_3.url, "theme": data.data.catalog_list_items[i].catalog_list_items[j].theme, "premium": premiumContent, "seoUrl": data.data.catalog_list_items[i].catalog_list_items[j].seo_url });
                                    else
                                        All.push({ "uri": data.data.catalog_list_items[i].catalog_list_items[j].thumbnails.high_4_3.url, "theme": data.data.catalog_list_items[i].catalog_list_items[j].theme, "premium": premiumContent, "seoUrl": data.data.catalog_list_items[i].catalog_list_items[j].seo_url });


                        }
                    }
                }

                Final.push({ "friendlyId": data.data.catalog_list_items[i].friendly_id, "data": All, "layoutType": data.data.catalog_list_items[i].layout_type, "displayName": data.data.catalog_list_items[i].display_title });
                All = [];
            }
        }

        settotalHomeData(Final);
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
                            modeConfig={{
                                parallaxScrollingScale: 0.82,
                                parallaxScrollingOffset: 50,
                                parallaxAdjacentItemScale: 0.82,
                            }}
                            data={item.data}
                            style={{ top: -15, }}
                            renderItem={({ item, index }) => <Pressable onPress={() => {
                                {
                                    VIDEO_TYPES.includes(item.theme) ?
                                        navigation.navigate('Episode', { seoUrl: item.seoUrl }) : navigation.navigate('Shows', { seoUrl: item.seoUrl })
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
                            {item.data.length > 1 ? <Pressable style={{ width: "100%" }} onPress={() => navigation.navigate('MoreList', { firendlyId: item.friendlyId, layoutType: LAYOUT_TYPES[0] })}><Text style={styles.sectionHeaderMore}>+MORE</Text></Pressable> : ""}
                        </View>
                        <Carousel
                            {...baseOptionsOther}
                            loop
                            pagingEnabled={pagingEnabled}
                            snapEnabled={snapEnabled}
                            autoPlay={autoPlay}
                            autoPlayInterval={2000}
                            onProgressChange={(_, absoluteProgress) =>
                                (progressValue.value = absoluteProgress)
                            }
                            mode="parallax"
                            modeConfig={{
                                parallaxScrollingScale: 0.82,
                                parallaxScrollingOffset: 50,
                                parallaxAdjacentItemScale: 0.82,
                            }}
                            data={item.data}
                            style={{}}
                            renderItem={({ item, index }) => <Pressable onPress={() => {
                                {
                                    VIDEO_TYPES.includes(item.theme) ?
                                        navigation.navigate('Episode', { seoUrl: item.seoUrl }) : navigation.navigate('Shows', { seoUrl: item.seoUrl })
                                }
                            }}><FastImage key={index} style={styles.showsbannerimage} source={{ uri: item.uri, priority: FastImage.priority.high, cache: FastImage.cacheControl.immutable, }} /></Pressable>}
                        />
                    </View>
                    : ""}

                {item.layoutType == 'etv-exclusive_banner' && item.data.length != 0 ?

                    <View style={{ width: PAGE_WIDTH, alignContent: 'center', justifyContent: 'center', alignItems: 'center' }}>
                        <View style={styles.sectionHeaderView}>
                            <Text style={styles.sectionHeader}>{item.displayName}</Text>
                            {item.data.length > 1 ? <Pressable style={{ width: "100%" }} onPress={() => navigation.navigate('MoreList', { firendlyId: item.friendlyId, layoutType: LAYOUT_TYPES[0] })}><Text style={styles.sectionHeaderMore}>+MORE</Text></Pressable> : ""}
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
                                    (progressValue.value = absoluteProgress)
                                }
                                mode="parallax"
                                modeConfig={{
                                    parallaxScrollingScale: 1.1,
                                }}
                                data={item.data}
                                style={{}}
                                renderItem={({ item, index }) => <Pressable onPress={() => {
                                    {
                                        VIDEO_TYPES.includes(item.theme) ?
                                            navigation.navigate('Episode', { seoUrl: item.seoUrl }) : navigation.navigate('Shows', { seoUrl: item.seoUrl })
                                    }
                                }}><FastImage resizeMode={FastImage.resizeMode.stretch} key={index} style={styles.imageSectionHorizontalSingle} source={{ uri: item.uri, priority: FastImage.priority.high, cache: FastImage.cacheControl.immutable, }} /></Pressable>}
                            />
                        </View>
                    </View>
                    : ""}
                {item.layoutType == 'channels' && item.data.length != 0 ?
                    <View>
                        <View style={styles.sectionHeaderView}>
                            <Text style={styles.sectionHeader}>{item.displayName}</Text>
                            {item.data.length > 3 ? <Pressable style={{ width: "100%" }} onPress={() => navigation.navigate('MoreList', { firendlyId: item.friendlyId, layoutType: LAYOUT_TYPES[0] })}><Text style={styles.sectionHeaderMore}>+MORE</Text></Pressable> : ""}
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
                                                    VIDEO_TYPES.includes(item.theme) ?
                                                        navigation.navigate('Episode', { seoUrl: item.seoUrl }) : navigation.navigate('Shows', { seoUrl: item.seoUrl })
                                                }
                                            }}>
                                                <FastImage
                                                    style={[styles.imageSectionCircle,]}
                                                    resizeMode={FastImage.resizeMode.stretch}
                                                    source={{ uri: item.uri, priority: FastImage.priority.high, cache: FastImage.cacheControl.immutable, }} />
                                                {VIDEO_TYPES.includes(item.theme) ? <Image source={require('../assets/images/play.png')} style={{ position: 'absolute', width: 30, height: 30, right: 10, bottom: 15 }}></Image> : ""}
                                                {item.premium ? <Image source={require('../assets/images/crown.png')} style={styles.crownIcon}></Image> : ""}
                                            </Pressable>
                                        </View>
                                }
                            />
                        </View>
                    </View>
                    : ""}

                {(item.layoutType == 'tv_shows' || item.layoutType == 'show') && item.data.length != 0 ?
                    <View>
                        <View style={styles.sectionHeaderView}>
                            <Text style={styles.sectionHeader}>{item.displayName}</Text>
                            {item.data.length > 3 ? <Pressable style={{ width: "100%" }} onPress={() => navigation.navigate('MoreList', { firendlyId: item.friendlyId, layoutType: LAYOUT_TYPES[0] })}><Text style={styles.sectionHeaderMore}>+MORE</Text></Pressable> : ""}
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
                                                VIDEO_TYPES.includes(item.theme) ?
                                                    navigation.navigate('Episode', { seoUrl: item.seoUrl }) : navigation.navigate('Shows', { seoUrl: item.seoUrl })
                                            }
                                        }}>
                                            <FastImage
                                                style={[styles.imageSectionVertical, { resizeMode: 'stretch', }]}
                                                source={{ uri: item.uri, priority: FastImage.priority.high, cache: FastImage.cacheControl.immutable, }} />
                                            {VIDEO_TYPES.includes(item.theme) ? <Image source={require('../assets/images/play.png')} style={{ position: 'absolute', width: 30, height: 30, right: 10, bottom: 15 }}></Image> : ""}
                                            {item.premium ? <Image source={require('../assets/images/crown.png')} style={styles.crownIcon}></Image> : ""}
                                        </Pressable>
                                    </View>
                            }
                        />
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
                                    (progressValue.value = absoluteProgress)
                                }
                                mode="parallax"
                                modeConfig={{
                                    parallaxScrollingScale: 1.1,
                                }}
                                data={item.data}
                                style={{}}
                                renderItem={({ item, index }) => <Pressable onPress={() => {
                                    {
                                        VIDEO_TYPES.includes(item.theme) ?
                                            navigation.navigate('Episode', { seoUrl: item.seoUrl }) : navigation.navigate('Shows', { seoUrl: item.seoUrl })
                                    }
                                }}><FastImage resizeMode={FastImage.resizeMode.stretch} key={index} style={styles.imageSectionHorizontalSingle} source={{ uri: item.uri, priority: FastImage.priority.high, cache: FastImage.cacheControl.immutable, }} /></Pressable>}
                            />
                        </View>
                        {!!progressValue ?
                            <View
                                style={{
                                    flexDirection: 'row',
                                    justifyContent: 'space-between',
                                    width: 200,
                                    alignSelf: 'center',
                                    top: -1,
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
                                                VIDEO_TYPES.includes(item.theme) ?
                                                    navigation.navigate('Episode', { seoUrl: item.seoUrl }) : navigation.navigate('Shows', { seoUrl: item.seoUrl })
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
                {item.layoutType != 'tv_shows' && item.layoutType != 'show' && item.layoutType != 'top_banner' && item.layoutType != 'etv-exclusive_banner' && item.layoutType != 'tv_shows_banner' && item.layoutType != 'channels' && item.layoutType != 'banner' && item.layoutType != 'live' && item.data.length != 0 ?
                    <View>
                        <View style={styles.sectionHeaderView}>
                            <Text style={styles.sectionHeader}>{item.displayName}</Text>
                            {item.data.length > 2 ? <Pressable style={{ width: "100%" }} onPress={() => navigation.navigate('MoreList', { firendlyId: item.friendlyId, layoutType: LAYOUT_TYPES[1] })}><Text style={styles.sectionHeaderMore}>+MORE</Text></Pressable> : ""}
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
                                                VIDEO_TYPES.includes(item.theme) ?
                                                    navigation.navigate('Episode', { seoUrl: item.seoUrl }) : navigation.navigate('Shows', { seoUrl: item.seoUrl })
                                            }
                                        }}>
                                            <FastImage
                                                style={[styles.imageSectionHorizontal, { resizeMode: 'stretch', }]}
                                                source={{ uri: item.uri, priority: FastImage.priority.high, cache: FastImage.cacheControl.immutable, }} />
                                        </Pressable>
                                        {VIDEO_TYPES.includes(item.theme) ? <Image source={require('../assets/images/play.png')} style={{ position: 'absolute', width: 30, height: 30, right: 10, bottom: 15 }}></Image> : ""}
                                        {item.premium ? <Image source={require('../assets/images/crown.png')} style={styles.crownIcon}></Image> : ""}
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

            <Header pageName="NEWS"></Header>


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
                pageName="NEWS"
            ></Footer>
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
        fontFamily: 'Montserrat_500Medium',
        fontWeight: '600'
    },
    sectionHeaderView: {
        flexDirection: 'row',
        marginVertical: 10,
        width: '100%',
        justifyContent: 'space-between',
        fontFamily: 'Montserrat_500Medium',
    },
    sectionHeader: {
        color: HEADING_TEXT_COLOR,
        fontSize: 16,
        fontWeight: '400',
        left: 3,
        fontFamily: 'Montserrat_500Medium',
        width: "50%"
    },
    sectionHeaderMore: {
        color: MORE_LINK_COLOR,
        right: 15,
        fontFamily: 'Montserrat_500Medium',
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

export default News;