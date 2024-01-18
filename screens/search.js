import { View, TextInput, TouchableOpacity, StyleSheet, Text, Pressable, StatusBar, FlatList, ActivityIndicator, Image } from 'react-native'
import React, { useState } from 'react'
import Ionicons from 'react-native-vector-icons/Ionicons';
import { BACKGROUND_COLOR, BACKGROUND_TRANSPARENT_COLOR, SLIDER_PAGINATION_UNSELECTED_COLOR, NORMAL_TEXT_COLOR, DETAILS_TEXT_COLOR, FIRETV_BASE_URL_STAGING, VIDEO_AUTH_TOKEN, ACCESS_TOKEN, PAGE_HEIGHT, PAGE_WIDTH, LAYOUT_TYPES, VIDEO_TYPES, actuatedNormalize } from '../constants'
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import FastImage from 'react-native-fast-image';
import { StackActions } from '@react-navigation/native';
import Footer from './footer';

export default function Search({ navigation }) {
    const [search, setSearch] = useState("");
    const [episodes, setEpisodes] = useState([]);
    const [pagenumber, setPagenumber] = useState(0);
    const [loading, setloading] = useState(true);
    const [toload, settoload] = useState(true);
    const [clear, setClear] = useState(true);
    const [emptyResponse, setEmptyResponse] = useState("");

    const paginationLoadCount = 18;

    const loadData = async (clear) => {
        if(clear)
        {
            setEpisodes([]);
            setPagenumber(0);
            settoload(true);
        }
        if (toload && search!="") {
            setloading(true);
            setEmptyResponse("");
            var Final = [];
            var All = [];
            var premiumContent = false;
            var premiumCheckData = "";
            const region = await AsyncStorage.getItem('country_code');
            const from = paginationLoadCount * pagenumber;
            console.log(FIRETV_BASE_URL_STAGING + "/search?q=" + search + "&page_size=" + paginationLoadCount + "&from=" + from + "&start_count=0&page=" + pagenumber + "&item_language=eng&region=" + region + "&auth_token=" + VIDEO_AUTH_TOKEN + "&access_token=" + ACCESS_TOKEN);
            axios.get(FIRETV_BASE_URL_STAGING + "/search?q=" + search + "&page_size=" + paginationLoadCount + "&from=" + from + "&start_count=0&page=" + pagenumber + "&item_language=eng&region=" + region + "&auth_token=" + VIDEO_AUTH_TOKEN + "&access_token=" + ACCESS_TOKEN).then(response => {
                setPagenumber(pagenumber + 1);
                if (response.data.data.items.length > 0) {
                    for (var i = 0; i < response.data.data.items.length; i++) {
                        if (response.data.data.items[i].hasOwnProperty('access_control')) {
                            premiumCheckData = (response.data.data.items[i].access_control);
                            if (premiumCheckData != "") {
                                if (premiumCheckData['is_free']) {
                                    premiumContent = false;
                                }
                                else {
                                    premiumContent = true;
                                }
                            }
                        }
                        var displayTitle = response.data.data.items[i].title
                        if (displayTitle.length > 19)
                            displayTitle = displayTitle.substr(0, 19) + "\u2026";
                        if (response.data.data.items[i].media_list_in_list) {
                            var splitted = response.data.data.items[i].seo_url.split("/");
                            var friendlyId = splitted[splitted.length - 1];
                            All.push({ "uri": response.data.data.items[i].list_item_object.banner_image, "theme": response.data.data.items[i].theme, "premium": premiumContent, "seoUrl": response.data.data.items[i].seo_url, "medialistinlist": response.data.data.items[i].media_list_in_list, "friendlyId": friendlyId, "displayTitle": displayTitle });
                        }
                        else {
                            if (response.data.data.items[i].thumbnails.hasOwnProperty('high_4_3') || response.data.data.items[i].thumbnails.hasOwnProperty('high_3_4')) {
                                All.push({ "uri": response.data.data.items[i].thumbnails.high_4_3.url, "theme": response.data.data.items[i].theme, "premium": premiumContent, "seoUrl": response.data.data.items[i].seo_url, "medialistinlist": response.data.data.items[i].media_list_in_list, "friendlyId": "", "displayTitle": displayTitle });
                            }

                        }
                    }
                    Final.push({ "friendlyId": response.data.data.friendly_id, "data": All, "layoutType": LAYOUT_TYPES[1], "displayName": response.data.data.display_title });
                    All = [];
                }
                else {
                    setEmptyResponse("No Episodes Found");
                }
                if (Final.length <= 0)
                    settoload(false);
                // if(clear)
                // setEpisodes(Final);
                // else
                setEpisodes(episodes => [...episodes, ...Final]);
                setloading(false);
            }).catch(error => { })
        }
    }
    const loadDataCheck = async () => {
        loadData(clear)
    }
    const loadNextData = async () => {
        loadData(!clear);
    }
    const naviagtetopage = async (page, url, theme, sourceName) => {
        await AsyncStorage.setItem('sourceName',sourceName);
        navigation.navigate(page, { seoUrl: url, theme: theme })
    }
    const renderItem = ({ item, index }) => {
        return (
            <View style={{ backgroundColor: BACKGROUND_COLOR, flex: 1, }}>
                <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                    <FlatList
                        data={item.data}
                        keyExtractor={(x, i) => i.toString()}
                        horizontal={false}
                        onEndReached={loadNextData}
                        showsHorizontalScrollIndicator={false}
                        style={styles.containerMargin}
                        numColumns={2}
                        renderItem={
                            ({ item, index }) =>
                                <View style={{ width: PAGE_WIDTH / 2.06, }}>
                                    <Pressable onPress={() => {
                                        {
                                            item.medialistinlist ?
                                                navigation.navigate('MoreList', { firendlyId: item.friendlyId, layoutType: LAYOUT_TYPES[1] })
                                                :
                                                VIDEO_TYPES.includes(item.theme) ?
                                                naviagtetopage('Episode',item.seoUrl,'','Search') : naviagtetopage('Shows',item.seoUrl,'','Search')
                                        }
                                    }}>
                                        <FastImage
                                            resizeMode={FastImage.resizeMode.cover}
                                            style={[styles.imageSectionHorizontal]}
                                            source={{ uri: item.uri, priority: FastImage.priority.high, cache: FastImage.cacheControl.immutable, }} />
                                        {VIDEO_TYPES.includes(item.theme) ? <Image source={require('../assets/images/play.png')} style={{ position: 'absolute', width: 30, height: 30, right: 10, bottom: 15 }}></Image> : ""}
                                        {item.premium ? <Image source={require('../assets/images/crown.png')} style={styles.crownIcon}></Image> : ""}
                                    </Pressable>
                                    <Text style={{ color: NORMAL_TEXT_COLOR, alignSelf: 'center', marginBottom: 20 }}>{item.displayTitle}</Text>
                                </View>
                        }
                    />
                </View>
            </View>
        );
    }
    return (
        <View style={{ backgroundColor: BACKGROUND_COLOR, flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <View style={{ width: "100%", flexDirection: 'row', marginTop: 50, position: 'absolute', top: 0, zIndex: 40 }}>
                <View style={{ marginRight: 10 }}>
                    <TouchableOpacity onPress={() => {
                        if (navigation.canGoBack())
                            navigation.goBack()
                        else
                            navigation.dispatch(StackActions.replace('Home', { pageFriendlyId: 'featured-1' }))
                    }}>
                        <Ionicons name="arrow-back" size={30} color="#ffffff" style={{ marginTop: 10 }} />
                    </TouchableOpacity>
                </View>
                <View style={{ width: "80%" }}>
                    <TextInput onChangeText={setSearch} value={search} style={styles.textinput} placeholder="Start Searching.." placeholderTextColor={NORMAL_TEXT_COLOR} />
                </View>
                <View style={{ marginLeft: 0 }}>
                    <TouchableOpacity onPress={loadDataCheck}><Ionicons name="search-circle" size={30} color="#ffffff" style={{ marginTop: 10 }} /></TouchableOpacity>
                </View>
            </View>
            {episodes.length == 0 && search == "" ?
                <View style={{ alignItems: 'center', justifyContent: 'center', width: "100%" }}>
                    <Text style={{ color: DETAILS_TEXT_COLOR, fontSize: 22 }}>Search for Shows, Serials, Episodes, Movies, Recipes and Videos</Text>
                </View>
                :
                <View style={{ marginTop: 120 }}>
                    {/* body content */}
                    {episodes ? <FlatList
                        data={episodes}
                        keyExtractor={(x, i) => i.toString()}
                        horizontal={false}
                        contentContainerStyle={{ flexGrow: 1, flexWrap: 'nowrap' }}
                        style={{ height: PAGE_HEIGHT }}
                        renderItem={renderItem}
                    /> : <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}><ActivityIndicator size="large" color={NORMAL_TEXT_COLOR} /></View>}
                    <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                        {episodes.length == 0 && search != "" ? <Text style={{ color: NORMAL_TEXT_COLOR, fontSize: 20 }}>No Results Found</Text> : ""}
                    </View>

                    <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                        {loading ? <ActivityIndicator size="large" color={NORMAL_TEXT_COLOR} ></ActivityIndicator> : ""}
                    </View>
                </View>
            }
            <Footer pageName="SEARCH"></Footer>
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
    textinput: { borderColor: SLIDER_PAGINATION_UNSELECTED_COLOR, borderBottomWidth: 1, fontSize: 18, color: NORMAL_TEXT_COLOR, padding: 5, backgroundColor: BACKGROUND_TRANSPARENT_COLOR, width: "100%" },
    playIcon: { position: 'absolute', width: 30, height: 30, right: 10, bottom: 15 },
    crownIcon: { position: 'absolute', width: 25, height: 25, left: 20, top: 10 },
    imageSectionHorizontal: {
        width: PAGE_WIDTH / 2.20,
        height: actuatedNormalize(117),
        marginRight: 5,
        borderRadius: 15,
        marginHorizontal: 10,
        marginBottom: 10,
        borderWidth: 1
    },
});