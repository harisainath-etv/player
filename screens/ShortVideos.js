import { View, Text, FlatList, Pressable, } from 'react-native'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { BACKGROUND_COLOR, PAGE_HEIGHT, PAGE_WIDTH } from '../constants'
import TransparentHeader from './transparentHeader';
import Video from 'react-native-video';

export default function Shorts() {
    const Videos = [
        "https://etvwin-s3.akamaized.net/63e08dfeb64c2f0fd8961660/4K_playlist.m3u8",
        "https://etvwin-s3.akamaized.net/63e08dccb64c2f0fd896165e/4K_playlist.m3u8",
        "https://etvwin-s3.akamaized.net/63e08d8db64c2f0fd896165c/4K_playlist.m3u8",
        "https://etvwin-s3.akamaized.net/63e08dfeb64c2f0fd8961660/4K_playlist.m3u8",
        "https://etvwin-s3.akamaized.net/63e08dccb64c2f0fd896165e/4K_playlist.m3u8",
        "https://etvwin-s3.akamaized.net/63e08d8db64c2f0fd896165c/4K_playlist.m3u8",
        "https://etvwin-s3.akamaized.net/63e08dfeb64c2f0fd8961660/4K_playlist.m3u8",
        "https://etvwin-s3.akamaized.net/63e08dccb64c2f0fd896165e/4K_playlist.m3u8",
        "https://etvwin-s3.akamaized.net/63e08d8db64c2f0fd896165c/4K_playlist.m3u8",
    ];
    const flatListRef = useRef();
    const videoRef = useRef();
    const [currentIndexValue, setcurrentIndexValue] = useState(0);
    const [showcontrols, setshowcontrols] = useState(true);
    const loadcontrols = async () => {        
            setshowcontrols(!showcontrols)
    }
    useEffect(()=>{
        if(showcontrols)
        {
            setTimeout(function(){ setshowcontrols(!showcontrols) },5000);
        }
    })
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
                    setcurrentIndexValue(Math.round(e.nativeEvent.contentOffset.y.toFixed(0) / PAGE_HEIGHT));
                }}
                contentContainerStyle={{ minHeight: '100%', }}
                renderItem={useCallback(
                    ({ item, index }) => {
                        return (

                            <Pressable onPress={loadcontrols} style={{ width: PAGE_WIDTH, height: Math.round(PAGE_HEIGHT), flex: 1, flexGrow: 1 }}>
                                {currentIndexValue === index ?
                                    <View style={{ flex: 1, flexGrow: 1 }}>
                                        <Video
                                            ref={videoRef}
                                            source={{ uri: item }}
                                            controls={false}
                                            paused={currentIndexValue === index ? false : true}
                                            playInBackground={false}
                                            repeat={true}
                                            volume={1}
                                            bufferConfig={{
                                                minBufferMs: 1000000,
                                                maxBufferMs: 2000000,
                                                bufferForPlaybackMs: 7000
                                            }}
                                            rate={1.0}
                                            resizeMode={'stretch'}
                                            style={{ width: PAGE_WIDTH, height: Math.round(PAGE_HEIGHT), flexGrow: 1, flex: 1 }}
                                            playWhenInactive={false}
                                        />
                                    </View>
                                    :
                                    ""}
                            </Pressable>

                        );
                    },
                )}
                pagingEnabled
            />

        </View>
    )
}