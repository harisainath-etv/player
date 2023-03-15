import { StatusBar, } from 'expo-status-bar';
import { StyleSheet, View, Text, Pressable, ScrollView, FlatList, Image } from 'react-native';
import React, { useEffect, useState, useRef, useCallback } from 'react';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { Rating, AirbnbRating } from 'react-native-ratings';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import FastImage from 'react-native-fast-image';
import ReadMore from '@fawazahmed/react-native-read-more';
import { useFocusEffect } from '@react-navigation/native';
import NormalHeader from './normalHeader';
import { AUTH_TOKEN, BACKGROUND_COLOR, FIRETV_BASE_URL, NORMAL_TEXT_COLOR, TAB_COLOR, PAGE_WIDTH, VIDEO_TYPES, MORE_LINK_COLOR, LAYOUT_TYPES } from '../constants';

export default function Shows({ navigation, route }) {
    const [toggle, setToggle] = useState(false);
    const [title, setTitle] = useState();
    const [thumbnail, setThumbnail] = useState();
    const [userRating, setUserRating] = useState();
    const [channel, setChannel] = useState();
    const [contentRating, setContentRating] = useState();
    const [displayGenres, setDisplayGenres] = useState();
    const [description, setDescription] = useState();
    const [subcategorySeoUrl, setSubcategorySeoUrl] = useState();
    const [episodeTypeTags, setEpisodeTypeTags] = useState();
    const [relatedUrl, setRelatedUrl] = useState();
    const [subcategoryList, setSubcategoryList] = useState([])
    const [subcategoryImages, setsubcategoryImages] = useState([])
    var totalData = [];

    const { seoUrl } = route.params;
    const [seourl, setSeourl] = useState(seoUrl);
    const filterItems = (stringNeeded, arrayvalues) => {
        let query = stringNeeded.toLowerCase();
        return arrayvalues.filter(item => item.toLowerCase().indexOf(query) >= 0);
    }

    const loadData = async () => {
        const baseUrl = FIRETV_BASE_URL;
        var splittedData = seourl.split("/");
        splittedData = splittedData.filter(function (e) { return e });
        const checkSeason = filterItems('season', splittedData);
        const checkTvShow = filterItems('tv-shows', splittedData);
        const checkNews = filterItems('news', splittedData);
        const checkShow = filterItems('show', splittedData);
        const region = await AsyncStorage.getItem('country_code');
        var urlPath = "";

        if (splittedData.length == 4 && checkSeason.length > 0) {
            urlPath = baseUrl + "catalogs/" + splittedData[0] + "/items/" + splittedData[1] + "/subcategories/" + splittedData[2] + "/episodes/" + splittedData[3];
        }
        else if (checkTvShow.length > 0) {
            if (splittedData[2] == "" || splittedData[2] == null || splittedData[3] == 'undefined')
                urlPath = baseUrl + "catalogs/" + splittedData[0] + "/episodes/" + splittedData[1];
            else
                urlPath = baseUrl + "catalogs/" + splittedData[0] + "/episodes/" + splittedData[2];
        }
        else if (checkNews.length > 0) {
            urlPath = baseUrl + "catalogs/" + splittedData[0] + "/items/" + splittedData[1] + "/episodes/" + splittedData[2];
        }
        else if (checkShow.length > 0 && splittedData.length == 3) {
            urlPath = baseUrl + "catalogs/" + splittedData[0] + "/items/" + splittedData[1] + "/episodes/" + splittedData[2];
        }
        else {
            urlPath = baseUrl + "catalogs/" + splittedData[0] + "/items/" + splittedData[1];
        }

        var relatedurlPath = baseUrl + "catalogs/" + splittedData[0] + "/items/" + splittedData[1] + "/related.gzip?&auth_token=" + AUTH_TOKEN + "&region=" + region;

        const url = urlPath + ".gzip?&auth_token=" + AUTH_TOKEN + "&region=" + region;

        await axios.get(url).then(response => {
            setTitle(response.data.data.title);
            setThumbnail(response.data.data.last_episode.thumbnails.high_4_3.url);
            setUserRating(Math.round(response.data.data.average_user_rating));
            setChannel(response.data.data.channel_object.name);
            setContentRating(response.data.data.cbfc_rating);
            setDisplayGenres(response.data.data.display_genres.join(","));
            setDescription(response.data.data.description);
            setSubcategorySeoUrl(response.data.data.subcategories[0].seo_url);
            setEpisodeTypeTags(response.data.data.subcategories[0].episodetype_tags)
            setRelatedUrl(relatedurlPath);
            var mainArr = [];
            for (var e = 0; e < response.data.data.subcategories[0].episodetype_tags.length; e++) {
                var subcategorySplit = "";
                var subcategoryurlPath = "";
                var subcategoryurl = "";
                subcategorySplit = response.data.data.subcategories[0].seo_url.split("/");
                subcategorySplit = subcategorySplit.filter(function (e) { return e });

                subcategoryurlPath = baseUrl + "catalogs/" + subcategorySplit[0] + "/items/" + subcategorySplit[1] + "/subcategories/" + subcategorySplit[3] + "/episodes";
                subcategoryurl = subcategoryurlPath + ".gzip?&auth_token=" + AUTH_TOKEN + "&region=" + region + "&episode_type=" + response.data.data.subcategories[0].episodetype_tags[e].name;

                mainArr.push({ 'name': response.data.data.subcategories[0].episodetype_tags[e].name, 'display_title': response.data.data.subcategories[0].episodetype_tags[e].display_title, 'item_type': response.data.data.subcategories[0].episodetype_tags[e].item_type, 'subcategoryurl': subcategoryurl })
            }
            mainArr.push({ 'name': 'related', 'display_title': 'Related Shows', 'item_type': 'show', 'subcategoryurl': relatedurlPath })
            //console.log(JSON.stringify(mainArr));
            setSubcategoryList(mainArr);
        }).catch(error => { })
    }

    useFocusEffect(
        useCallback(() => {
            loadData()
        }, [])
    );

    useEffect(() => {
        getThumbnailImages()
    }, [subcategoryImages])
    function dynamicSort(property) {
        var sortOrder = 1;
        if (property[0] === "-") {
            sortOrder = -1;
            property = property.substr(1);
        }
        return function (a, b) {
            /* next line works with strings and numbers, 
             * and you may want to customize it to your needs
             */
            var result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
            return result * sortOrder;
        }
    }

    const getThumbnailImages = async () => {

        if (subcategoryImages.length == 0) {
            {
                subcategoryList.map(async (resp) => {
                    var subcategorydata = [];
                    const thumnailData = await fetch(resp.subcategoryurl);
                    const subcatDataDetails = await thumnailData.json();
                    for (var s = 0; s < subcatDataDetails.data.items.length; s++) {
                        {
                            VIDEO_TYPES.includes(resp.item_type) ?
                                subcategorydata.push({ 'thumbnail': subcatDataDetails.data.items[s].thumbnails.high_4_3.url, 'title': subcatDataDetails.data.items[s].title, 'date': subcatDataDetails.data.items[s].release_date_uts, 'premium': subcatDataDetails.data.items[s].access_control.is_free, 'theme': subcatDataDetails.data.items[s].theme, 'seo_url': subcatDataDetails.data.items[s].seo_url })
                                :
                                subcategorydata.push({ 'thumbnail': subcatDataDetails.data.items[s].thumbnails.high_3_4.url, 'title': subcatDataDetails.data.items[s].title, 'date': subcatDataDetails.data.items[s].release_date_uts, 'premium': subcatDataDetails.data.items[s].access_control.is_free, 'theme': subcatDataDetails.data.items[s].theme, 'seo_url': subcatDataDetails.data.items[s].seo_url })
                        }
                    }
                    totalData.push({ 'name': resp.name, 'display_title': resp.display_title, 'item_type': resp.item_type, 'thumbnails': subcategorydata, 'friendlyId': resp.subcategoryurl })
                    setsubcategoryImages([...subcategoryImages, totalData])
                })
            }
        }
    }
    getThumbnailImages()
    function renderSubcat({ item }) {

        return (
            <View>

                {item.map((subcat, i) => {
                    return (
                        <View style={{}} key={i}>
                            {subcat.thumbnails.length > 0 ?
                                <View>
                                    <Text style={{ color: NORMAL_TEXT_COLOR, marginLeft: 5, fontSize: 18, marginBottom: 10 }} key={i}>{subcat.display_title}</Text>
                                    {subcat.name != 'related' ? <Pressable style={{ position: 'absolute', right: 30 }} onPress={() => navigation.navigate('EpisodesMoreList', { firendlyId: subcat.friendlyId, layoutType: LAYOUT_TYPES[1] })}><Text style={styles.sectionHeaderMore}>+MORE</Text></Pressable> : ""}

                                </View> : ""}

                            <FlatList
                                data={subcat.thumbnails}
                                horizontal={true}
                                keyExtractor={(x, i) => i.toString()}
                                renderItem={(items, index) => {
                                    if (subcat.display_title == 'Episodes') {
                                        var episodeDate = new Date(items.item.date * 1000).toISOString().slice(0, 19).replace('T', ' ');
                                        var splittedDate = episodeDate.split(" ");
                                        var dateArray = splittedDate[0].split("-");
                                    }
                                    return (
                                        <View style={{ marginBottom: 10 }} key={index}>
                                            <View>
                                                {VIDEO_TYPES.includes(items.item.theme) ?
                                                    <FastImage resizeMode={FastImage.resizeMode.stretch} key={index} style={styles.imageSectionHorizontal} source={{ uri: items.item.thumbnail, priority: FastImage.priority.high, cache: FastImage.cacheControl.immutable, }} />
                                                    :
                                                    <Pressable onPress={()=>navigation.navigate({name:'Shows',params:{seoUrl:items.item.seo_url},key:{index}})}><FastImage resizeMode={FastImage.resizeMode.stretch} key={index} style={styles.imageSectionVertical} source={{ uri: items.item.thumbnail, priority: FastImage.priority.high, cache: FastImage.cacheControl.immutable, }} /></Pressable>
                                                }

                                                {VIDEO_TYPES.includes(items.item.theme) ? <Image source={require('../assets/images/play.png')} style={styles.playIcon}></Image> : ""}
                                                {!items.item.premium ? <Image source={require('../assets/images/crown.png')} style={styles.crownIcon}></Image> : ""}
                                            </View>
                                            <View style={VIDEO_TYPES.includes(items.item.theme) ? {width:PAGE_WIDTH / 2.06} : ""}>
                                                {subcat.display_title == 'Episodes' ?
                                                    <View style={{ justifyContent: 'center',  }}><Text style={{ color: NORMAL_TEXT_COLOR, marginLeft: 5 ,fontSize:12}}>{items.item.title} | {dateArray[2]}-{dateArray[1]}-{dateArray[0]}</Text></View> : ""
                                                }
                                            </View>
                                        </View>
                                    )
                                }}
                            ></FlatList>
                        </View>
                    )
                })}
            </View>
        )
    }

    return (
        <View style={styles.mainContainer}>
            <NormalHeader></NormalHeader>
            <ScrollView style={{ flex: 1 }} nestedScrollEnabled={true}>
                <View style={styles.container}>
                    <View
                        style={{
                            height: 270,
                            width: PAGE_WIDTH,
                        }}
                    >
                        <FastImage resizeMode={FastImage.resizeMode.stretch} source={{ uri: thumbnail, priority: FastImage.priority.high, cache: FastImage.cacheControl.immutable, }} style={{ width: '100%', height: 270 }}></FastImage>
                    </View>

                    <View style={styles.bodyContent}>
                        <View style={styles.marginContainer}>
                            <Text style={styles.headingLabel}>{title}</Text>
                            <Text style={styles.detailsText}>{channel}</Text>
                            <View style={{ flexDirection: 'row' }}>
                                <Text style={styles.detailsText}>{contentRating}</Text>
                                <Text style={[{ color: TAB_COLOR, fontWeight: 'bold', borderRightColor: TAB_COLOR, borderWidth: 2 }]}></Text>
                                <Text style={[styles.detailsText, { borderWidth: 1, borderStyle: 'dashed', borderColor: TAB_COLOR, marginLeft: 10, borderRadius: 10 }]}>{displayGenres}</Text>
                            </View>
                            <ReadMore numberOfLines={3} style={styles.detailsText} seeMoreText="Read More" seeMoreStyle={{ color: TAB_COLOR, fontWeight: 'bold' }} seeLessStyle={{ color: TAB_COLOR, fontWeight: 'bold' }}>
                                <Text style={styles.detailsText}>{description}</Text>
                            </ReadMore>
                        </View>
                        <View style={styles.options}>
                            <View style={styles.singleoption}>
                                <AirbnbRating showRating={false} count={5} defaultRating={userRating} size={18} />
                            </View>
                            <View style={styles.singleoption}><MaterialCommunityIcons name="share-variant" size={30} color={NORMAL_TEXT_COLOR} /></View>
                            <View style={styles.singleoption}>
                                <Pressable onPress={() => { setToggle(!toggle) }}>
                                    {toggle ? <MaterialCommunityIcons name="toggle-switch" size={40} color={NORMAL_TEXT_COLOR} /> : <MaterialCommunityIcons name="toggle-switch-off" size={40} color={NORMAL_TEXT_COLOR} />}
                                </Pressable>
                            </View>
                        </View>

                    </View>

                    <Pressable onPress={() => navigation.navigate('Calendarscreen')} style={{ justifyContent: 'center', alignItems: 'center', flexDirection: 'row', padding: 20 }}>
                        <MaterialCommunityIcons name="calendar-month" size={40} color={NORMAL_TEXT_COLOR} />
                        <Text style={{ fontSize: 18, color: NORMAL_TEXT_COLOR, fontWeight: 'bold' }}> FILTER BY DATE</Text>
                    </Pressable>
                    <View style={{ justifyContent: 'flex-start', alignItems: 'flex-start', alignContent: 'flex-start', width: '100%' }}>

                        {/* <Text style={{color:NORMAL_TEXT_COLOR}}>{JSON.stringify(subcategoryImages)}</Text> */}
                        {subcategoryImages ? <FlatList
                            data={subcategoryImages}
                            renderItem={renderSubcat}
                            keyExtractor={(x, i) => i.toString()}
                        /> : ""}

                    </View>
                </View>
            </ScrollView>
            <StatusBar style="auto" />
        </View>
    );
}

const styles = StyleSheet.create({
    playIcon: { position: 'absolute', width: 30, height: 30, right: 10, bottom: 15 },
    crownIcon: { position: 'absolute', width: 25, height: 25, left: 10, top: 10 },
    container: {
        backgroundColor: BACKGROUND_COLOR,
        alignItems: 'center',
        justifyContent: 'center',
    },
    mainContainer: { flex: 1, backgroundColor: BACKGROUND_COLOR },
    bodyContent: { backgroundColor: BACKGROUND_COLOR },
    headingLabel: { fontSize: 25, marginBottom: 5, color: '#ffffff', padding: 6 },
    detailsText: { fontSize: 13, marginBottom: 5, color: '#b1cccc', padding: 6 },
    options: { alignItems: 'center', justifyContent: 'center', flexDirection: 'row' },
    singleoption: { width: "33.33%", alignItems: 'center', justifyContent: 'center', borderColor: '#343636', borderWidth: 1, height: 55 },
    marginContainer: { marginLeft: 5, marginRight: 5 },
    imageSectionHorizontal: {
        width: PAGE_WIDTH / 2.06,
        height: 117,
        marginHorizontal: 3,
        borderRadius: 10,
        marginBottom: 10,
        borderWidth: 1
    },
    sectionHeaderMore: {
        color: MORE_LINK_COLOR,
        fontSize: 13,
        textAlign: 'right'
    },
    imageSectionVertical: {
        width: PAGE_WIDTH / 3.15,
        height: 170,
        marginHorizontal: 3,
        borderRadius: 10,
        marginBottom: 10,

    },
});
