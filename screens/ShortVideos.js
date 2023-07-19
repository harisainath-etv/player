import { View, ActivityIndicator, FlatList, Pressable, StyleSheet, Text } from 'react-native'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { BACKGROUND_COLOR, NORMAL_TEXT_COLOR, PAGE_HEIGHT, PAGE_WIDTH, SHORTS_BASE_URL, SLIDER_PAGINATION_SELECTED_COLOR } from '../constants'
import TransparentHeader from './transparentHeader';
import Video from 'react-native-video';
import axios from 'axios';
import AntDesign from 'react-native-vector-icons/AntDesign';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Share from 'react-native-share';
var loadedindex = [];
export default function Shorts() {
    const [startindex, setstartindex] = useState(0);
    var limit = 3;
    const dataFetch = useRef(null);
    const [Videos, setVideos] = useState([]);
    const [loginid, setloginid] = useState();
    var loadedvideos = [];
    const getData = async (startindex) => {
        var loginiddetails = "";
        const email = await AsyncStorage.getItem('email_id');
        const mobile_number = await AsyncStorage.getItem('mobile_number');
        const session = await AsyncStorage.getItem('session');
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
        axios.get(SHORTS_BASE_URL + 'welcome/getToken').then(response => {
            axios.post(SHORTS_BASE_URL + 'welcome/shorts', {
                token: response.data.token,
                startindex: startindex,
                limit: limit,
                loginid: loginiddetails
            }, { headers: {} }).then(resp => {
                var jsonObj = JSON.parse(resp.data);
                for (var s = 0; s < jsonObj.data.length; s++) {
                    var indvideo = jsonObj.data[s].shorts_url;
                    var indid = jsonObj.data[s].id;
                    var liked = jsonObj.data[s].liked;
                    var disliked = jsonObj.data[s].disliked;
                    var totallikes = jsonObj.data[s].total_likes;
                    var totalviews = jsonObj.data[s].total_views;
                    var totaldislikes = jsonObj.data[s].total_dislikes;
                    loadedvideos.push({ "id": indid, "video": indvideo, "liked": liked, "disliked": disliked, "totallikes": totallikes, "totalviews": totalviews, "totaldislikes": totaldislikes })
                }
                setVideos((Videos) => [...Videos, ...loadedvideos]);
            }).catch(err => {
                console.log(err);
            })
        }).catch(error => { })
    }
    useEffect(() => {
        if (dataFetch.current) return;
        dataFetch.current = true;
        getData(0)
    })
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
    const [shareUrl, setShareUrl] = useState()
    const [title, setTitle] = useState();
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

    const likevideo = async (videoid) => {
        if (loginid != "" && loginid != null && loginid != 'null' && loginid != 'undefined') {
            console.log(likedvideo);
            setcurrentid(videoid);
            axios.post(SHORTS_BASE_URL + "Welcome/likevideo", {
                loginid: loginid,
                videoid: videoid
            }, { headers: {} }).then(response => {
                console.log(response.data);
                setlikedvideo(!likedvideo);
            }).catch(error => {
                console.log(error);
            })
        }
        else {
            alert("Please login to like the video");
        }
    }

    const dislikevideo = async (videoid) => {
        if (loginid != "" && loginid != null && loginid != 'null' && loginid != 'undefined') {
            setdislikedvideo(!dislikedvideo);
            setcurrentid(videoid);
            axios.post(SHORTS_BASE_URL + "Welcome/dislikevideo", {
                loginid: loginid,
                videoid: videoid
            }, { headers: {} }).then(response => {
            }).catch(error => {
                console.log(error);
            })
        }
        else {
            alert("Please login to dislike the video");
        }
    }

    const shareVideo = async () => {
        const shareOptions = {
            title: title,
            failOnCancel: false,
            urls: [shareUrl],
          };
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
                    // if (!loadedindex.includes(val)) {
                    //     loadedindex.push(val);
                        if (val % 2 == 0 && val != 0 && val != 1) {
                        setstartindex(startindex + limit);
                        getData(startindex + limit);
                        }
                    //}

                    if (val != scrollvideoid) {
                        getlikes(val);
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
                                        controls={true}
                                        onLoadStart={onLoadStart}
                                        onLoad={()=>onLoad(currentIndexValue)}
                                        paused={currentIndexValue === index ? false : true}
                                        playInBackground={false}
                                        repeat={true}
                                        volume={1}
                                        rate={1.0}
                                        resizeMode={'contain'}
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
                                                {/* {totallikes != 0 ?
                                                    <Text style={{ color: NORMAL_TEXT_COLOR, fontWeight: 'bold' }}>{kFormatter(totallikes)}</Text>
                                                    :
                                                    <Text style={{ color: NORMAL_TEXT_COLOR, fontWeight: 'bold' }}>{kFormatter(item.totallikes)}</Text>
                                                } */}
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