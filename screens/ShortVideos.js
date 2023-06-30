import { View, ActivityIndicator, FlatList, Pressable, StyleSheet } from 'react-native'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { BACKGROUND_COLOR, NORMAL_TEXT_COLOR, PAGE_HEIGHT, PAGE_WIDTH, SHORTS_BASE_URL, SLIDER_PAGINATION_SELECTED_COLOR } from '../constants'
import TransparentHeader from './transparentHeader';
import Video from 'react-native-video';
import axios from 'axios';
var loadedindex = [];
export default function Shorts() {
    const [startindex, setstartindex] = useState(0);
    var limit = 3;
    const dataFetch = useRef(null);
    const [Videos, setVideos] = useState([]);
    var loadedvideos = [];
    const getData = async () => {
        axios.get(SHORTS_BASE_URL + 'welcome/getToken').then(response => {
            axios.post(SHORTS_BASE_URL + 'welcome/shorts', {
                token: response.data.token,
                startindex: startindex,
                limit: limit
            }, { headers: {} }).then(resp => {
                var jsonObj = JSON.parse(resp.data);
                for (var s = 0; s < jsonObj.data.length; s++) {
                    var indvideo = jsonObj.data[s].shorts_url;
                    loadedvideos.push(indvideo)
                }
                console.log(JSON.stringify(loadedvideos));
                setVideos((Videos) => [...Videos, ...loadedvideos]);

            }).catch(err => {
                console.log(err);
            })
        }).catch(error => { })

        console.log(JSON.stringify(Videos));
    }
    useEffect(() => {
        if (dataFetch.current) return;
        dataFetch.current = true;
        getData()
    })
    const flatListRef = useRef();
    const videoRef = useRef();
    const [currentIndexValue, setcurrentIndexValue] = useState(0);
    const [showcontrols, setshowcontrols] = useState(true);
    const [state, setState] = useState({ opacity: 0 });
    const loadcontrols = async () => {
        setshowcontrols(!showcontrols)
    }
    useEffect(() => {
        if (showcontrols) {
            setTimeout(function () { setshowcontrols(!showcontrols) }, 5000);
        }
    })
    const onLoadStart = () => {
        setState({ opacity: 1 });
    }
    const onLoad = () => {
        setState({ opacity: 0 });
    }
    const onBuffer = ({ isBuffering }) => {
        setState({ opacity: isBuffering ? 1 : 0 });
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
                keyExtractor={(x, i) => { i.toString(); }}
                onScroll={e => {
                    var val = Math.round(e.nativeEvent.contentOffset.y.toFixed(0) / PAGE_HEIGHT);
                    setcurrentIndexValue(Math.round(e.nativeEvent.contentOffset.y.toFixed(0) / PAGE_HEIGHT));
                    if (!loadedindex.includes(val)) {
                        loadedindex.push(val);
                        if(val%2==0 && val!=0 && val!=1)
                        {
                            setstartindex(startindex+limit);
                            getData()
                        }
                    }
                }}
                contentContainerStyle={{ minHeight: '100%', }}
                renderItem={useCallback(
                    ({ item, index }) => {
                        return (

                            <Pressable onPress={loadcontrols} style={{ width: PAGE_WIDTH, height: Math.round(PAGE_HEIGHT), flex: 1, flexGrow: 1 }}>
                                {/* {currentIndexValue === index ? */}
                                <View style={{ flex: 1, flexGrow: 1, justifyContent: 'center', alignContent: 'center' }}>
                                    <Video
                                        ref={videoRef}
                                        onBuffer={onBuffer}
                                        source={{ uri: item }}
                                        controls={true}
                                        onLoadStart={onLoadStart}
                                        onLoad={onLoad}
                                        paused={currentIndexValue === index ? false : true}
                                        playInBackground={false}
                                        repeat={true}
                                        volume={1}
                                        rate={1.0}
                                        resizeMode={'contain'}
                                        style={{ width: PAGE_WIDTH, height: Math.round(PAGE_HEIGHT), flexGrow: 1, flex: 1 }}
                                        playWhenInactive={false}
                                    />
                                    <ActivityIndicator
                                        animating
                                        size="large"
                                        color={SLIDER_PAGINATION_SELECTED_COLOR}
                                        style={[styles.activityIndicator, { opacity: state.opacity }]}
                                    />
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