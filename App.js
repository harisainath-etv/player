import { StatusBar,setStatusBarHidden } from 'expo-status-bar';
import { Dimensions,StyleSheet,Platform, TouchableOpacity, View } from 'react-native';
import { ResizeMode } from 'expo-av'
import VideoPlayer from 'expo-video-player'
import * as ScreenOrientation from 'expo-screen-orientation'
import React, { useState,useRef,useEffect } from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import * as NavigationBar from "expo-navigation-bar";

const width=Dimensions.get('window').width;
const height=Dimensions.get('window').height;
export default function App() {
  const [barVisibility, setBarVisibility] = useState();
  NavigationBar.addVisibilityListener(({ visibility }) => {
    if (visibility === "visible") {
      setBarVisibility(visibility);
    }
  });

  useEffect(() => {
    if(inFullscreen2)
    {
      navigationConfig();
    }
    else
    {
      navigationConfigVisible();
    }
  });
  const navigationConfig = async () => {
    // // Just incase it is not hidden
    // NavigationBar.setBackgroundColorAsync('red');
    NavigationBar.setVisibilityAsync("hidden");
  };
  const navigationConfigVisible = async () => {
    NavigationBar.setVisibilityAsync("visible");
  };


  const [inFullscreen, setInFullsreen] = useState(false)
  const [inFullscreen2, setInFullsreen2] = useState(false)
  const refVideo2 = useRef(0)
  const [curtime, setcurtime] = useState();
 

 const exitScreen = async () =>{
      setStatusBarHidden(false, 'fade')
      setInFullsreen2(!inFullscreen2)
      await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.DEFAULT)
 }
 const forward = () =>{
  refVideo2.current.playFromPositionAsync(+curtime.positionMillis + +10000)
 }

 const backward = () =>{
  refVideo2.current.playFromPositionAsync(+curtime.positionMillis - +10000)
 }
 
  return (
    <View style={styles.container}>
      <VideoPlayer
        videoProps={{
          shouldPlay: true,
          defaultControlsVisible: false,
          resizeMode: ResizeMode.CONTAIN,
          source: {
            uri: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
          },
          ref: refVideo2,
        }}
        
        header={<View style={{
          width:"100%",
          }}>
          
          {inFullscreen2 ? 
              <TouchableOpacity onPress={exitScreen}>
                <Ionicons name="arrow-back" size={30} color="#ffffff" style={{marginTop:10}}/>
              </TouchableOpacity> : 
              <TouchableOpacity >
                <Ionicons name="arrow-back" size={30} color="#ffffff" style={{marginTop:10}}/>
              </TouchableOpacity>
              }
              
              <View style={{width:'100%',flexDirection:'row'}}>
                
                <View style={{position:'absolute',
                left: inFullscreen2 ? ((width/2)-20) : 50,
                top: inFullscreen2 ? ((width/2)-70) : 65}}>
                  <TouchableOpacity onPress={backward}><Ionicons name="ios-play-back-circle" size={40} color="" style={{color:"#ffffff"}}/></TouchableOpacity>
                </View>
                <View style={{position:'absolute',
                right:inFullscreen2 ? ((width/2)-20) : 50,
                top: inFullscreen2 ? ((width/2)-70) : 65}}>
                  <TouchableOpacity onPress={forward}><Ionicons name="play-forward-circle" size={40} color="" style={{color:"#ffffff"}}/></TouchableOpacity>
                </View>
              </View>
        
        </View>}
        fullscreen={{
          inFullscreen: inFullscreen2,
          enterFullscreen: async () => {
            setStatusBarHidden(true, 'fade')
            setInFullsreen2(!inFullscreen2)
            await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE_LEFT)
            refVideo2.current.setStatusAsync({
              shouldPlay: true,
            })
          },
          exitFullscreen: async () => {
            setStatusBarHidden(false, 'fade')
            setInFullsreen2(!inFullscreen2)
            await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.DEFAULT)
            refVideo2.current.setStatusAsync({
              shouldPlay: true,
            })
          },
        }}
        style={{
          videoBackgroundColor: 'black',
          height: inFullscreen2 ? width : 250,
          width: inFullscreen2 ? height : width,
        }}
        playbackCallback={(playbackStatus) => {
          setcurtime(playbackStatus)
          if(inFullscreen2)
          setInFullsreen2(inFullscreen2)
        }}
      />
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
