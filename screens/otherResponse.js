import * as React from 'react';
import { useState, useEffect, useRef, useCallback } from 'react';
import { View, FlatList, StyleSheet, Text, TouchableOpacity, ActivityIndicator, RefreshControl, Pressable,Image } from 'react-native';
import Carousel from 'react-native-reanimated-carousel';
import Animated, {
    Extrapolate,
    interpolate,
    useAnimatedStyle,
    useSharedValue,
} from 'react-native-reanimated';
import FastImage from 'react-native-fast-image';
import { BACKGROUND_COLOR, ANDROID_AUTH_TOKEN, FIRETV_BASE_URL, SLIDER_PAGINATION_SELECTED_COLOR, SLIDER_PAGINATION_UNSELECTED_COLOR, MORE_LINK_COLOR, TAB_COLOR, HEADING_TEXT_COLOR, IMAGE_BORDER_COLOR, NORMAL_TEXT_COLOR, ACCESS_TOKEN, PAGE_WIDTH, PAGE_HEIGHT,VIDEO_TYPES } from '../constants';
import { StatusBar } from 'expo-status-bar';
import Footer from './footer';
import Header from './header';

export const ElementsText = {
    AUTOPLAY: 'AutoPlay',
};

var page = 'featured-1';
var selectedItem = 0;
function OtherResponse({ navigation, route }) {

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
    var menuref = useRef();
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
        var definedPageName = "";
        if (pageName == 'featured-1')
            definedPageName = "home";
        else
            definedPageName = pageName;

        const url = FIRETV_BASE_URL + "/catalog_lists/" + definedPageName + ".gzip?item_language=eng&region=IN&auth_token=" + ANDROID_AUTH_TOKEN + "&access_token=" + ACCESS_TOKEN + "&page=" + p + "&page_size=" + paginationLoadCount + "&npage_size=10";
        const resp = await fetch(url);
        const data = await resp.json();
        if (data.data.catalog_list_items.length > 0) {
            for (var i = 0; i < data.data.catalog_list_items.length; i++) {

                if (data.data.catalog_list_items[i].media_list_in_list) {
                    All.push({"uri":data.data.catalog_list_items[i].list_item_object.banner_image,"theme":data.data.catalog_list_items[i].theme});
                }
                else {
                    if (definedPageName == 'channels') {
                        if (data.data.catalog_list_items[i].thumbnails.hasOwnProperty('high_4_3')) {
                            All.push({"uri":data.data.catalog_list_items[i].thumbnails.high_4_3.url,"theme":data.data.catalog_list_items[i].theme});
                        }
                    }
                    else
                        if (definedPageName == 'live') {
                            if (data.data.catalog_list_items[i].thumbnails.hasOwnProperty('high_3_4')) {
                                All.push({"uri":data.data.catalog_list_items[i].thumbnails.high_3_4.url,"theme":data.data.catalog_list_items[i].theme});
                            }
                        }
                }
            }
            Final.push({ "friendlyId": "", "data": All, "layoutType": data.data.layout_type, "displayName": data.data.display_title });
            All = [];
        }

        settotalHomeData(Final);
    }
    function changeTabData(pageFriendlyId) {
        if (pageFriendlyId != 'live')
            navigation.navigate({ name: 'Home', params: { pageFriendlyId: pageFriendlyId }, key: pageFriendlyId })
        else
            navigation.navigate({ name: 'OtherResponse', params: { pageFriendlyId: pageFriendlyId }, key: pageFriendlyId })
    }
    async function getTopMenu() {
        var TopMenu = [];
        //fetching top menu
        const topMenu = FIRETV_BASE_URL + "/catalog_lists/top-menu.gzip?nested_list_items=false&auth_token=" + ANDROID_AUTH_TOKEN + "&region=IN";
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
                            modeConfig={{
                                parallaxScrollingScale: 0.82,
                                parallaxScrollingOffset: 50,
                                parallaxAdjacentItemScale: 0.82,
                            }}
                            data={item.data}
                            style={{ top: -15, }}
                            renderItem={({ item, index }) => <TouchableOpacity onPress={() => navigation.navigate('CustomeVideoPlayer')}><FastImage resizeMode={FastImage.resizeMode.stretch} key={index} style={styles.image} source={{ uri: item, priority: FastImage.priority.high, cache: FastImage.cacheControl.immutable, }} /></TouchableOpacity>}
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
                            {item.data.length > 1 ? <Text style={styles.sectionHeaderMore}>+MORE</Text> : ""}
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
                            renderItem={({ item, index }) => <TouchableOpacity onPress={() => navigation.navigate('CustomeVideoPlayer')}><FastImage key={index} style={styles.showsbannerimage} source={{ uri: item.uri, priority: FastImage.priority.high, cache: FastImage.cacheControl.immutable, }} /></TouchableOpacity>}
                        />
                    </View>
                    : ""}

                {item.layoutType == 'etv-exclusive_banner' && item.data.length != 0 ?

                    <View style={{ width: PAGE_WIDTH, alignContent: 'center', justifyContent: 'center', alignItems: 'center' }}>
                        <View style={styles.sectionHeaderView}>
                            <Text style={styles.sectionHeader}>{item.displayName}</Text>
                            {item.data.length > 1 ? <Text style={styles.sectionHeaderMore}>+MORE</Text> : ""}
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
                                renderItem={({ item, index }) => <TouchableOpacity onPress={() => navigation.navigate('CustomeVideoPlayer')}><FastImage resizeMode={FastImage.resizeMode.stretch} key={index} style={styles.imageSectionHorizontalSingle} source={{ uri: item.uri, priority: FastImage.priority.high, cache: FastImage.cacheControl.immutable, }} /></TouchableOpacity>}
                            />
                        </View>
                    </View>
                    : ""}

                {item.layoutType == 'channels' && item.data.length != 0 ?
                <View>
                <View style={styles.sectionHeaderView}>
                    <Text style={styles.sectionHeader}>{item.displayName}</Text>
                    {item.data.length > 3 ? <Text style={styles.sectionHeaderMore}>+MORE</Text> : ""}
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
                                                {VIDEO_TYPES.includes(item.theme)  ? <Image source={require('../assets/images/play.png')} style={{position:'absolute',width:30,height:30,right:10,bottom:15}}></Image> : ""}
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
                            <Text style={styles.sectionHeader}>{item.displayName}</Text>
                            {item.data.length > 3 ? <Text style={styles.sectionHeaderMore}>+MORE</Text> : ""}
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
                                        <TouchableOpacity onPress={() => navigation.navigate(ChromeCast)}>
                                            <FastImage
                                                style={[styles.imageSectionVertical, { resizeMode: 'stretch', }]}
                                                source={{ uri: item.uri, priority: FastImage.priority.high, cache: FastImage.cacheControl.immutable, }} />
                                                {VIDEO_TYPES.includes(item.theme)  ? <Image source={require('../assets/images/play.png')} style={{position:'absolute',width:30,height:30,right:10,bottom:15}}></Image> : ""}
                                        </TouchableOpacity>
                                    </View>
                            }
                        />
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
                                        <TouchableOpacity onPress={() => navigation.navigate(ChromeCast)}>
                                            <FastImage
                                                style={[styles.imageSectionVertical,]}
                                                resizeMode={FastImage.resizeMode.stretch}
                                                source={{ uri: item.uri, priority: FastImage.priority.high, cache: FastImage.cacheControl.immutable, }} />
                                                {VIDEO_TYPES.includes(item.theme)  ? <Image source={require('../assets/images/play.png')} style={{position:'absolute',width:30,height:30,right:10,bottom:15}}></Image> : ""}
                                        </TouchableOpacity>
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
                                renderItem={({ item, index }) => <TouchableOpacity onPress={() => navigation.navigate('CustomeVideoPlayer')}><FastImage resizeMode={FastImage.resizeMode.stretch} key={index} style={styles.imageSectionHorizontalSingle} source={{ uri: item.uri, priority: FastImage.priority.high, cache: FastImage.cacheControl.immutable, }} /></TouchableOpacity>}
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

                {item.layoutType != 'tv_shows' && item.layoutType != 'show' && item.layoutType != 'top_banner' && item.layoutType != 'etv-exclusive_banner' && item.layoutType != 'tv_shows_banner' && item.layoutType != 'channels' && item.layoutType != 'live' && item.layoutType != 'banner' && item.data.length != 0 ?
                    <View>
                        <View style={styles.sectionHeaderView}>
                            <Text style={styles.sectionHeader}>{item.displayName}</Text>
                            {item.data.length > 2 ? <Text style={styles.sectionHeaderMore}>+MORE</Text> : ""}
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
                                        <TouchableOpacity onPress={() => navigation.navigate(ChromeCast)}>
                                            <FastImage
                                                style={[styles.imageSectionHorizontal, { resizeMode: 'stretch', }]}
                                                source={{ uri: item.uri, priority: FastImage.priority.high, cache: FastImage.cacheControl.immutable, }} />
                                            {VIDEO_TYPES.includes(item.theme)  ? <Image source={require('../assets/images/play.png')} style={{position:'absolute',width:30,height:30,right:10,bottom:15}}></Image> : ""}
                                        </TouchableOpacity>
                                    </View>
                            }
                        />
                    </View> : ""}

            </View>
        );
    }
    const menuRender = ({ item, index }) => {
        return (
            <View style={{ backgroundColor: BACKGROUND_COLOR, marginBottom: 15, padding: 5 }}>
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

    useEffect(() => {
        if (dataFetchedRef.current) return;
        dataFetchedRef.current = true;
        getTopMenu();
        loadData(0);
        if (selectedItem == "") {
            selectedItem = 0;
        }
    }, []);
    return (
        <View style={{ flex: 1, backgroundColor: BACKGROUND_COLOR, }}>

            <Header pageName="TV-CHANNELS"></Header>

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

export default OtherResponse;