import { View, ActivityIndicator, FlatList, Pressable, StyleSheet, Text, StatusBar } from 'react-native'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { ACCESS_TOKEN, AUTH_TOKEN, BACKGROUND_COLOR, FIRETV_BASE_URL, FIRETV_BASE_URL_STAGING, NORMAL_TEXT_COLOR, PAGE_HEIGHT, PAGE_WIDTH, SECRET_KEY, SHORTS_BASE_URL, SLIDER_PAGINATION_SELECTED_COLOR, VIDEO_AUTH_TOKEN } from '../constants'
import TransparentHeader from './transparentHeader';
import Video from 'react-native-video';
import axios from 'axios';
import AntDesign from 'react-native-vector-icons/AntDesign';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Footer from './footer';
import { stringMd5 } from 'react-native-quick-md5';
var loadedindex = [];
var loadedvideos = [];
export default function Shorts() {
    const [startindex, setstartindex] = useState(0);
    var limit = 3;
    const dataFetch = useRef(null);
    const [Videos, setVideos] = useState([]);
    const [loginid, setloginid] = useState();
    const flatListRef = useRef();
    const videoRef = useRef();
    const [currentIndexValue, setcurrentIndexValue] = useState(0);
    const [showcontrols, setshowcontrols] = useState(true);
    const [state, setState] = useState({ opacity: 0 });
    const [likes, setlikes] = useState(0);
    const [views, setviews] = useState(0);
    const [likedvideo, setlikedvideo] = useState(false);
    const [dislikedvideo, setdislikedvideo] = useState(false);
    const [currentid, setcurrentid] = useState();
    const [scrollvideoid, setscrollvideoid] = useState();
    const [loading, setloading] = useState(false);
    const [totallikes, settotallikes] = useState(0);
    const [totaldislikes, settotaldislikes] = useState(0);
    const [stoploading,setstoploading] = useState(false);
    const loadcontrols = async () => {
        //setshowcontrols(!showcontrols)
    }
    useEffect(() => {
        // if (showcontrols) {
        //     setTimeout(function () { setshowcontrols(!showcontrols) }, 5000);
        // }
    })
    const onLoadStart = () => {
        setState({ opacity: 1 });
    }
    const onLoad = (val) => {
        setState({ opacity: 0 });
        getlikes(val)
    }
    const onBuffer = ({ isBuffering }) => {
        setState({ opacity: isBuffering ? 1 : 0 });
    }

    const filterItems = (stringNeeded, arrayvalues) => {
        let query = stringNeeded.toLowerCase();
        return arrayvalues.filter(item => item.toLowerCase().indexOf(query) >= 0);
    }

    const getData = async () => {
        var loginiddetails = "";
        const email = await AsyncStorage.getItem('email_id');
        const mobile_number = await AsyncStorage.getItem('mobile_number');
        const session = await AsyncStorage.getItem('session');
        const region = await AsyncStorage.getItem('country_code');
        var sessionId = await AsyncStorage.getItem('session');
        if (session != "" && session != null) {
            if (mobile_number != "" && mobile_number != null) {
                setloginid(mobile_number);
                loginiddetails = mobile_number;
            }
            else
                if (email != "" && email != null) {
                    setloginid(email);
                    loginiddetails = email;
                }
        }
        console.log(FIRETV_BASE_URL_STAGING + "catalog_lists/shorts-data?item_language=eng&region=" + region + "&auth_token=" + AUTH_TOKEN + "&page=" + startindex + "&page_size=" + limit);
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
            if(resp.data.data.catalog_list_items.length==0)
            setstoploading(true);
        }).catch(err => {
            console.log("main error"+err);
        })


        const loadGenereratedApiDetails = async(url) =>{
            axios.get(url).then(response => {
                    var currentTimestamp = Math.floor(Date.now() / 1000).toString();
                    if (sessionId == null)
                        sessionId = "";
                    var md5String = stringMd5(response.data.data.catalog_id + response.data.data.content_id + sessionId + currentTimestamp + SECRET_KEY)
                    getDetails(response.data.data.catalog_id,response.data.data.content_id,currentTimestamp,md5String);
                }).catch(error => {
                    console.log("forloop"+error);
                })
        }
        const getDetails = async(catalog_id,content_id,currentTimestamp,md5String) =>{
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
                console.log(res.data.data.stream_info.adaptive_url);
                setVideos((Videos) => [...Videos, ...[{ "video": res.data.data.stream_info.adaptive_url }]]);
            }).catch(er => {
                console.log("getall" + er);
            })
        }
        // axios.get(SHORTS_BASE_URL + 'welcome/getToken').then(response => {
        //     axios.post(SHORTS_BASE_URL + 'welcome/shorts', {
        //         token: response.data.token,
        //         startindex: startindex,
        //         limit: limit,
        //         loginid: loginiddetails
        //     }, { headers: {} }).then(resp => {
        //         var jsonObj = JSON.parse(resp.data);
        //         for (var s = 0; s < jsonObj.data.length; s++) {
        //             var indvideo = jsonObj.data[s].shorts_url;
        //             var indid = jsonObj.data[s].id;
        //             var liked = jsonObj.data[s].liked;
        //             var disliked = jsonObj.data[s].disliked;
        //             var totallikes = jsonObj.data[s].total_likes;
        //             var totalviews = jsonObj.data[s].total_views;
        //             var totaldislikes = jsonObj.data[s].total_dislikes;
        //             loadedvideos.push({ "id": indid, "video": indvideo, "liked": liked, "disliked": disliked, "totallikes": totallikes, "totalviews": totalviews, "totaldislikes": totaldislikes })
        //         }
        //         setVideos((Videos) => [...Videos, ...loadedvideos]);
        //     }).catch(err => {
        //         console.log(err);
        //     })
        // }).catch(error => { })
    }
    useEffect(() => {
        // if (dataFetch.current) return;
        // dataFetch.current = true;
        getData()
    }, [])

    // const likevideo = async (videoid) => {
    //     if (loginid != "" && loginid != null && loginid != 'null' && loginid != 'undefined') {
    //         console.log(likedvideo);
    //         setcurrentid(videoid);
    //         axios.post(SHORTS_BASE_URL + "Welcome/likevideo", {
    //             loginid: loginid,
    //             videoid: videoid
    //         }, { headers: {} }).then(response => {
    //             console.log(response.data);
    //             setlikedvideo(!likedvideo);
    //         }).catch(error => {
    //             console.log(error);
    //         })
    //     }
    //     else {
    //         alert("Please login to like the video");
    //     }
    // }

    // const dislikevideo = async (videoid) => {
    //     if (loginid != "" && loginid != null && loginid != 'null' && loginid != 'undefined') {
    //         setdislikedvideo(!dislikedvideo);
    //         setcurrentid(videoid);
    //         axios.post(SHORTS_BASE_URL + "Welcome/dislikevideo", {
    //             loginid: loginid,
    //             videoid: videoid
    //         }, { headers: {} }).then(response => {
    //         }).catch(error => {
    //             console.log(error);
    //         })
    //     }
    //     else {
    //         alert("Please login to dislike the video");
    //     }
    // }

    // const shareVideo = async () => {

    // }


    const likevideo = async () => {
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
                let jsonObj = { "content_type": contenttype, "video_name": title, "genre": displayGenres, "video_language": contentlanguage, "content_value": contentvalue };
                triggerOtherAnalytics('like_button', jsonObj)
            }).catch(error => {
                alert("Unable to like the content. Please try again later.");
            })
        }
    }
    const deleteLike = async (catalog_id, contentId) => {
        var sessionId = await AsyncStorage.getItem('session');
        var region = await AsyncStorage.getItem('country_code');
        await axios.get(FIRETV_BASE_URL + "/users/" + sessionId + "/playlists/like/listitems?auth_token=" + VIDEO_AUTH_TOKEN + "&access_token=" + ACCESS_TOKEN + "&region=" + region + '&content_id=' + contentId + '&catalog_id=' + catalog_id).then(response => {
            //console.log(JSON.stringify(response.data.data.items[0]));
            axios.delete(FIRETV_BASE_URL + "/users/" + sessionId + "/playlists/like/listitems/" + response.data.data.items[0].listitem_id + "?auth_token=" + VIDEO_AUTH_TOKEN + "&access_token=" + ACCESS_TOKEN + "&region=" + region).then(resp => {
                AsyncStorage.removeItem('like_' + contentId)
                setlikecontent(false);
            }).catch(err => { })


        }).catch(error => {
            //console.log(JSON.stringify(error.response.data));
        })

    }

    const shareOptions = async () => {
        const shareOptions = {
            title: title,
            failOnCancel: false,
            urls: [shareUrl],
        };
        let jsonObj = { "content_type": contenttype, "video_name": title, "genre": displayGenres, "video_language": contentlanguage, "content_value": contentvalue };
        triggerOtherAnalytics('share', jsonObj)

        const ShareResponse = await Share.open(shareOptions);
    }
    function kFormatter(num) {
        return Math.abs(num) > 999 ? Math.sign(num) * ((Math.abs(num) / 1000).toFixed(1)) + 'k' : Math.sign(num) * Math.abs(num)
    }
    const getlikes = async (val) => {
        setloading(true);
        var videoslist = JSON.parse(JSON.stringify(Videos));
        var currentvideo = JSON.parse(JSON.stringify(videoslist[val]));
        axios.post(SHORTS_BASE_URL + "Welcome/getVideoLike", {
            videoid: currentvideo.id,
            loginid: loginid
        }, { headers: {} }).then(resp => {
            setloading(false);
            if (resp.data.userlike == 1) {
                setlikedvideo(true);
            }
            else {
                setlikedvideo(false);
            }

            if (resp.data.userdislike == 1) {
                setdislikedvideo(true);
            }
            else {
                setdislikedvideo(false);
            }


            settotallikes(resp.data.totallikes[0].total_likes)
            settotaldislikes(resp.data.totaldislikes[0].total_dislikes)
        }).catch(err => {
            setloading(false);
            console.log(err);
        })
        setscrollvideoid(val);
    }
    return (
        <View style={{ height: PAGE_HEIGHT, width: PAGE_WIDTH, backgroundColor: BACKGROUND_COLOR }}>
            {showcontrols ?
                <TransparentHeader></TransparentHeader>
                :
                ""}
            <FlatList
                ref={flatListRef}
                data={Videos}
                showsVerticalScrollIndicator={false}
                showsHorizontalScrollIndicator={false}
                keyExtractor={(x, i) => i.toString()}
                onScroll={e => {
                    var val = Math.round(e.nativeEvent.contentOffset.y.toFixed(0) / PAGE_HEIGHT);
                    setcurrentIndexValue(Math.round(e.nativeEvent.contentOffset.y.toFixed(0) / PAGE_HEIGHT));
                    if(currentIndexValue != (Math.round(e.nativeEvent.contentOffset.y.toFixed(0) / PAGE_HEIGHT)) && stoploading==false)
                    {
                        getData()
                    }
                }}
                contentContainerStyle={{ minHeight: '100%', }}
                renderItem={useCallback(
                    ({ item, index }) => {
                        return (

                            <Pressable onPress={loadcontrols} style={{ width: PAGE_WIDTH, height: Math.round(PAGE_HEIGHT), flex: 1, flexGrow: 1 }}>

                                <View style={{ flex: 1, flexGrow: 1, justifyContent: 'center', alignContent: 'center' }}>
                                    <Video
                                        ref={videoRef}
                                        onBuffer={onBuffer}
                                        source={{ uri: item.video }}
                                        controls={false}
                                        onLoadStart={onLoadStart}
                                        onLoad={() => onLoad(currentIndexValue)}
                                        paused={currentIndexValue === index ? false : true}
                                        playInBackground={false}
                                        repeat={true}
                                        volume={1}
                                        rate={1.0}
                                        resizeMode={'cover'}
                                        style={{ width: PAGE_WIDTH, height: Math.round(PAGE_HEIGHT), flexGrow: 1, flex: 1 }}
                                        playWhenInactive={false}
                                    />
                                    {/* {currentIndexValue === index ?
                                        <ActivityIndicator
                                            animating
                                            size="large"
                                            color={SLIDER_PAGINATION_SELECTED_COLOR}
                                            style={[styles.activityIndicator, { opacity: state.opacity }]}
                                        />
                                        :
                                        ""} */}
                                </View>
                                <View style={{ position: 'absolute', right: 15, top: '50%', }}>

                                    {
                                        likedvideo == true ?

                                            <Pressable onPress={() => likevideo(item.id)} style={{ justifyContent: 'center', alignItems: 'center' }}><AntDesign name="like1" size={35} color={SLIDER_PAGINATION_SELECTED_COLOR} style={{}} />
                                            </Pressable>

                                            :
                                            <Pressable onPress={() => likevideo(item.id)} style={{ justifyContent: 'center', alignItems: 'center' }}><AntDesign name="like2" size={35} color={SLIDER_PAGINATION_SELECTED_COLOR} style={{}} /></Pressable>

                                    }


                                    {
                                        dislikedvideo == true ?

                                            <Pressable onPress={() => dislikevideo(item.id)} style={{ justifyContent: 'center', alignItems: 'center', marginTop: 50 }}><AntDesign name="dislike1" size={35} color={SLIDER_PAGINATION_SELECTED_COLOR} style={{}} /></Pressable>

                                            :
                                            <Pressable onPress={() => dislikevideo(item.id)} style={{ justifyContent: 'center', alignItems: 'center', marginTop: 50 }}><AntDesign name="dislike2" size={35} color={SLIDER_PAGINATION_SELECTED_COLOR} style={{}} /></Pressable>

                                    }


                                    {/* <Pressable onPress={shareVideo}><AntDesign name="sharealt" size={35} color={SLIDER_PAGINATION_SELECTED_COLOR} style={{ marginTop: 50 }} /></Pressable> */}

                                    {/* <Pressable style={{ justifyContent: 'center', alignItems: 'center' }}><AntDesign name="eye" size={30} color="#ffffff" style={{ marginTop: 40 }} />
                                        <Text style={{ color: NORMAL_TEXT_COLOR, fontWeight: 'bold' }}>{kFormatter(item.totalviews)}</Text></Pressable> */}
                                </View>
                                {/* :
                                    ""} */}
                            </Pressable>

                        );
                    },
                )}
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