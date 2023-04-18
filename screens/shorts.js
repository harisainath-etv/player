import { View, Text, FlatList, Dimensions } from 'react-native'
import React, { useState,useEffect } from 'react'
import VideoPlayer from 'expo-video-player'
import { ResizeMode } from 'expo-av'
import GestureRecognizer, {swipeDirections} from 'react-native-swipe-gestures';
import { StatusBar,setStatusBarHidden } from 'expo-status-bar';
import * as NavigationBar from "expo-navigation-bar";

export default function Shorts() {
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [barVisibility, setBarVisibility] = useState();
    //const [state, setState] = useState();
    const Videos = [
        "https://etvwin-s3.akamaized.net/63e08dfeb64c2f0fd8961660/4K_playlist.m3u8",
        "https://etvwin-s3.akamaized.net/63e08dccb64c2f0fd896165e/4K_playlist.m3u8",
        "https://etvwin-s3.akamaized.net/63e08d8db64c2f0fd896165c/4K_playlist.m3u8",
                ];
    const onSwipeUp = (gestureState) => {
    //setState('You swiped up!');
    var curindex= +selectedIndex + 1;
    if(curindex>Videos.length)
    curindex=Videos.length
    setSelectedIndex(curindex)
  }
 
    const onSwipeDown = (gestureState)=> {
        //setState('You swiped down!');
        var curindex= +selectedIndex - 1;
        if(curindex<0)
        curindex=0
        setSelectedIndex(curindex)
    }
    const config = {
      velocityThreshold: 0.1,
      directionalOffsetThreshold: 80
    };
    NavigationBar.addVisibilityListener(({ visibility }) => {
        if (visibility === "visible") {
          setBarVisibility(visibility);
        }
      });

      useEffect(() => {
          navigationConfig();
      });
      const navigationConfig = async () => {
       // NavigationBar.setVisibilityAsync("hidden");
      };
    return (
        <View style={{ flex: 1,width:Dimensions.get('window').width,height:Dimensions.get('window').height }}>
            
            <GestureRecognizer
                onSwipeUp={(state) => onSwipeUp(state)}
                onSwipeDown={(state) => onSwipeDown(state)}
                config={config}
                style={{
                flex: 1,
                width:Dimensions.get('window').width,height:Dimensions.get('window').height
                }}
                >
             <VideoPlayer
                style={{width:Dimensions.get('window').width,height:Dimensions.get('window').height}}
                videoProps={{
                    shouldPlay: true,
                    resizeMode: ResizeMode.STRETCH,
                    source: {
                    uri: Videos[selectedIndex],
                    },
                    isLooping:true,
                    isMuted:false,
                    audioPan:1
                }}
                slider={{visible:false}}
                timeVisible={false}
                fullscreen={{visible: false,inFullscreen:true}}
                activityIndicator={true}
                />
            </GestureRecognizer>
            <StatusBar style="auto" />
        </View>
    )
}