import { View, FlatList, Pressable, StyleSheet, StatusBar, TouchableOpacity } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { ACCESS_TOKEN, AUTH_TOKEN, BACKGROUND_COLOR, FIRETV_BASE_URL, FIRETV_BASE_URL_STAGING, NORMAL_TEXT_COLOR, PAGE_HEIGHT, PAGE_WIDTH, SECRET_KEY, VIDEO_AUTH_TOKEN } from '../constants'
import TransparentHeader from './transparentHeader';
import Video from 'react-native-video';
import axios from 'axios';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Footer from './footer';
import { stringMd5 } from 'react-native-quick-md5';
import Share from 'react-native-share';
import { StackActions } from '@react-navigation/native';
export default function Shorts({ navigation }) {
    const [startindex, setstartindex] = useState(0);
    var limit = 3;
    const [Videos, setVideos] = useState([]);
    const flatListRef = useRef();
    const videoRef = useRef();
    const [currentIndexValue, setcurrentIndexValue] = useState(0);
    const [stoploading, setstoploading] = useState(false);
    const [likecontent, setlikecontent] = useState(false);
    const [loggedin, setloggedin] = useState(false);
    const [scrollvideoid, setscrollvideoid] = useState();

    const filterItems = (stringNeeded, arrayvalues) => {
        let query = stringNeeded.toLowerCase();
        return arrayvalues.filter(item => item.toLowerCase().indexOf(query) >= 0);
    }
    const loginValidation = async () => {
        const session = await AsyncStorage.getItem('session');
        if (session != "" && session != null) {

            await axios.get(FIRETV_BASE_URL_STAGING + "user/session/" + session + "?auth_token=" + AUTH_TOKEN).then(resp => {
                if (resp.data.message == 'Valid session id.') {
                    setloggedin(true)
                }
            }).catch(err => {
                console.log(err);
                setloggedin(false)
            })
        }
    }
    const getData = async () => {
        const region = await AsyncStorage.getItem('country_code');
        var sessionId = await AsyncStorage.getItem('session');

        axios.get(FIRETV_BASE_URL_STAGING + "catalog_lists/shorts-data?item_language=eng&region=" + region + "&auth_token=" + AUTH_TOKEN + "&page=" + startindex + "&page_size=" + limit).then(resp => {
            for (var s = 0; s < resp.data.data.catalog_list_items.length; s++) {
                var removequeryStrings = resp.data.data.catalog_list_items[s].seo_url.split("?");
                var splittedData = removequeryStrings[0].split("/");
                splittedData = splittedData.filter(function (e) { return e });
                const checkNews = filterItems('news', splittedData);
                const checkShow = filterItems('show', splittedData);
                const checkSeason = filterItems('season', splittedData);
                const checkChannel = filterItems('channel', splittedData);
                const checkEvent = filterItems('event', splittedData);
                const checkLive = filterItems('live', splittedData);
                var urlPath = "";
                if (splittedData.length == 4 && checkChannel == 0) {
                    urlPath = FIRETV_BASE_URL + "catalogs/" + splittedData[0] + "/items/" + splittedData[1] + "/subcategories/" + splittedData[2] + "/episodes/" + splittedData[3];
                }
                else if (splittedData[0] == 'tv-shows') {
                    urlPath = FIRETV_BASE_URL + "catalogs/" + splittedData[0] + "/episodes/" + splittedData[splittedData.length - 1];
                }
                else if (splittedData[0] == 'news' || checkNews.length > 0) {
                    urlPath = FIRETV_BASE_URL + "catalogs/" + splittedData[splittedData.length - 3] + "/items/" + splittedData[splittedData.length - 2] + "/episodes/" + splittedData[splittedData.length - 1];
                }
                else if ((checkShow.length > 0 || checkEvent.length > 0) && checkLive.length == 0) {
                    urlPath = FIRETV_BASE_URL + "catalogs/" + splittedData[0] + "/items/" + splittedData[splittedData.length - 2] + "/episodes/" + splittedData[splittedData.length - 1];
                }
                else if (checkChannel.length > 0) {
                    urlPath = FIRETV_BASE_URL + "catalogs/" + splittedData[1] + "/items/" + splittedData[splittedData.length - 1];
                }
                else {
                    urlPath = FIRETV_BASE_URL + "catalogs/" + splittedData[0] + "/items/" + splittedData[splittedData.length - 1];
                }
                const url = urlPath + ".gzip?&auth_token=" + AUTH_TOKEN + "&region=" + region;
                loadGenereratedApiDetails(url)
            }
            setstartindex(startindex + 1);
            if (resp.data.data.catalog_list_items.length == 0)
                setstoploading(true);
        }).catch(err => {
            console.log("main error" + err);
        })


        const loadGenereratedApiDetails = async (url) => {
            axios.get(url).then(response => {
                var currentTimestamp = Math.floor(Date.now() / 1000).toString();
                if (sessionId == null)
                    sessionId = "";
                var md5String = stringMd5(response.data.data.catalog_id + response.data.data.content_id + sessionId + currentTimestamp + SECRET_KEY)
                var likecontent = false;
                setlikecontent(false);
                getDetails(response.data.data.catalog_id, response.data.data.content_id, currentTimestamp, md5String, response.data.data.dynamic_url, response.data.data.title, likecontent, response.data.data.shorts_full_video_details.catalog_id, response.data.data.shorts_full_video_details.content_id);
            }).catch(error => {
                console.log("forloop" + error);
            })
        }
        const getDetails = async (catalog_id, content_id, currentTimestamp, md5String, shareUrl, title, likecontent, full_catalog_id, full_content_id) => {
            axios.post(FIRETV_BASE_URL + "v2/users/get_all_details", {
                catalog_id: catalog_id,
                content_id: content_id,
                category: "",
                region: region,
                auth_token: VIDEO_AUTH_TOKEN,
                access_token: ACCESS_TOKEN,
                id: sessionId,
                ts: currentTimestamp,
                md5: md5String
            }, {
                headers: {
                    'Content-Type': 'application/json',
                }
            }).then(res => {
                setVideos((Videos) => [...Videos, ...[{ "video": res.data.data.stream_info.adaptive_url, "catalog_id": catalog_id, "content_id": content_id, "shareUrl": shareUrl, "title": title, "likecontent": likecontent, "full_catalog_id": full_catalog_id, "full_content_id": full_content_id }]]);
            }).catch(er => {
                console.log("getall" + er);
            })
        }
    }
    useEffect(() => {
        loginValidation()
        getData()

    }, [currentIndexValue])

    const likevideo = async (catalogId, contentId) => {
        if (!loggedin) {
            navigation.dispatch(StackActions.replace("Login"));
        }
        else {
            var sessionId = await AsyncStorage.getItem('session');
            await axios.post(FIRETV_BASE_URL + "users/" + sessionId + "/playlists/like", {
                listitem: { catalog_id: catalogId, content_id: contentId, like_count: "true" },
                auth_token: VIDEO_AUTH_TOKEN,
                access_token: ACCESS_TOKEN,

            }, {
                headers: {
                    'Content-Type': 'application/json',
                }
            }).then(response => {
                AsyncStorage.setItem("like_" + contentId, contentId);
                setlikecontent(true);
            }).catch(error => {
                alert("Unable to like the content. Please try again later.");
            })
        }
    }
    const deleteLike = async (catalog_id, contentId) => {
        var sessionId = await AsyncStorage.getItem('session');
        var region = await AsyncStorage.getItem('country_code');
        await axios.get(FIRETV_BASE_URL + "/users/" + sessionId + "/playlists/like/listitems?auth_token=" + VIDEO_AUTH_TOKEN + "&access_token=" + ACCESS_TOKEN + "&region=" + region + '&content_id=' + contentId + '&catalog_id=' + catalog_id).then(response => {

            axios.delete(FIRETV_BASE_URL + "/users/" + sessionId + "/playlists/like/listitems/" + response.data.data.items[0].listitem_id + "?auth_token=" + VIDEO_AUTH_TOKEN + "&access_token=" + ACCESS_TOKEN + "&region=" + region).then(resp => {
                AsyncStorage.removeItem('like_' + contentId)
            }).catch(err => {
                console.log("hihih");
                console.log(err);
            })


        }).catch(error => {
            console.log("hellooooo");
            console.log(JSON.stringify(error));
        })

        setlikecontent(false);

    }

    const shareOptions = async (shareUrl, title) => {
        const shareOptions = {
            title: title,
            failOnCancel: false,
            urls: [shareUrl],
        };
        const ShareResponse = await Share.open(shareOptions);
    }
    const getlikes = async (val) => {
        var videoslist = JSON.parse(JSON.stringify(Videos));
        var currentvideo = JSON.parse(JSON.stringify(videoslist[val]));
        var sessionId = await AsyncStorage.getItem('session');
        var region = await AsyncStorage.getItem('country_code');

        if (sessionId != null) {
            axios.get(FIRETV_BASE_URL + "users/" + sessionId + "/playlists/like/listitems?auth_token=" + VIDEO_AUTH_TOKEN + "&access_token=" + ACCESS_TOKEN + "&region=" + region + "&content_id=" + currentvideo.content_id + "&catalog_id=" + currentvideo.catalog_id).then(likeresp => {
                console.log(likeresp.data.data.items[0].content_id);
                console.log(currentvideo.content_id);
                if (likeresp.data.data.items[0].content_id == currentvideo.content_id) {
                    setlikecontent(true);
                }
                else {
                    setlikecontent(true);
                }
            }).catch(likeerror => {
                console.log(likeerror);
                setlikecontent(false);
            })
        }

        setscrollvideoid(val);
    }
    const fullEpisode = async (full_catalog_id, full_content_id) => {
        const region = await AsyncStorage.getItem('country_code');
        var urlPath = FIRETV_BASE_URL + "catalogs/" + full_catalog_id + "/items/" + full_content_id + ".gzip?&auth_token=" + AUTH_TOKEN + "&region=" + region;;
        axios.get(urlPath).then(response => {
            navigation.dispatch(StackActions.replace('Episode', { seoUrl: response.data.data.seo_url, theme: response.data.data.theme, goto: 'Shorts' }))
        }).catch(error => {
            console.log(error);
        })
    }
    const renderItem = ({ item, index }) => {

        return (

            <View style={{ width: PAGE_WIDTH, height: Math.round(PAGE_HEIGHT), flex: 1, flexGrow: 1 }}>

                
                    <Video
                        ref={videoRef}
                        source={{ uri: item.video }}
                        controls={false}
                        paused={currentIndexValue === index ? false : true}
                        playInBackground={false}
                        repeat={true}
                        volume={1}
                        rate={1.0}
                        useTextureView={false}
                        resizeMode={'contain'}
                        style={{ width: PAGE_WIDTH, height: Math.round(PAGE_HEIGHT), flexGrow: 1, flex: 1 }}
                        playWhenInactive={false}
                    />
                
                <View style={{ position: 'absolute', right: 15, top: '50%', }}>
                    {
                        item.likecontent ?

                            <TouchableOpacity onPress={() => deleteLike(item.catalog_id, item.content_id)} style={{ justifyContent: 'center', alignItems: 'center' }}><AntDesign name="like1" size={28} color={NORMAL_TEXT_COLOR} style={{}} /></TouchableOpacity>

                            :
                            likecontent ?
                                <TouchableOpacity onPress={() => deleteLike(item.catalog_id, item.content_id)} style={{ justifyContent: 'center', alignItems: 'center' }}><AntDesign name="like1" size={28} color={NORMAL_TEXT_COLOR} style={{}} /></TouchableOpacity>
                                :

                                <TouchableOpacity onPress={() => likevideo(item.catalog_id, item.content_id)} style={{ justifyContent: 'center', alignItems: 'center' }}><AntDesign name="like2" size={28} color={NORMAL_TEXT_COLOR} style={{}} />
                                </TouchableOpacity>

                    }


                    <TouchableOpacity onPress={() => shareOptions(item.shareUrl, item.title)}><AntDesign name="sharealt" size={28} color={NORMAL_TEXT_COLOR} style={{ marginTop: 50 }} /></TouchableOpacity>

                    {item.full_catalog_id && item.full_content_id ?
                        <TouchableOpacity onPress={() => fullEpisode(item.full_catalog_id, item.full_content_id)} style={{ justifyContent: 'center', alignItems: 'center' }}>
                            <Ionicons name="navigate-circle" size={34} color={NORMAL_TEXT_COLOR} style={{ marginTop: 50 }} />
                        </TouchableOpacity>
                        :

                        ""}


                </View>
                {/* :
                                    ""} */}
            </View>

        );
    }
    return (
        <View style={{ height: PAGE_HEIGHT, width: PAGE_WIDTH,backgroundColor: BACKGROUND_COLOR }}>
            <TransparentHeader></TransparentHeader>
            <FlatList
                ref={flatListRef}
                data={Videos}
                showsVerticalScrollIndicator={false}
                showsHorizontalScrollIndicator={false}
                keyExtractor={(x, i) => i.toString()}
                onScroll={e => {
                    var val = Math.round(e.nativeEvent.contentOffset.y.toFixed(0) / PAGE_HEIGHT);
                    setcurrentIndexValue(Math.round(e.nativeEvent.contentOffset.y.toFixed(0) / PAGE_HEIGHT));
                    if (Math.round(e.nativeEvent.contentOffset.y.toFixed(0) / PAGE_HEIGHT) != (Math.round(e.nativeEvent.contentOffset.y.toFixed(0) / PAGE_HEIGHT)) && stoploading == false) {
                        if (Math.round(e.nativeEvent.contentOffset.y.toFixed(0) / PAGE_HEIGHT) % 2 == 0) {
                            getData();
                        }
                    }
                    if (val != scrollvideoid) {
                        getlikes(val);
                    }
                }}
                contentContainerStyle={{ minHeight: '100%',}}
                renderItem={renderItem}
                pagingEnabled
            />
            <Footer pageName="SHORTS" />
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
    activityIndicator: {
        position: 'absolute',
        top: 70,
        left: 70,
        right: 70,
        height: 50,
    },

});