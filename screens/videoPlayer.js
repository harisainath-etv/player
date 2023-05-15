import { StatusBar,setStatusBarHidden } from 'expo-status-bar';
import { Dimensions,StyleSheet,Platform, TouchableOpacity, View, Text, PermissionsAndroid,BackHandler } from 'react-native';
import { ResizeMode } from 'expo-av'
import VideoPlayer from 'expo-video-player'
import * as ScreenOrientation from 'expo-screen-orientation'
import React, { useState,useRef,useEffect } from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import * as NavigationBar from "expo-navigation-bar";
import RNFS from'react-native-fs';
import ReactNativeBlobUtil from 'react-native-blob-util';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { BACKGROUND_COLOR,} from '../constants';


const width=Dimensions.get('window').width;
const height=Dimensions.get('window').height;
export default function Video({navigation}) {
  const [barVisibility, setBarVisibility] = useState();
  const [state, setState] = useState({downloadProgress:0});
  const [isAndroid, setisAndroid] = useState(true);
  const [startTime, setstartTime] = useState();
  
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
    BackHandler.addEventListener('hardwareBackPress', exitScreen);
    // setInterval(function(){

    // },2000)
  });
  const navigationConfig = async () => {
    // // Just incase it is not hidden
    // NavigationBar.setBackgroundColorAsync('red');
    NavigationBar.setVisibilityAsync("hidden");
  };
  const navigationConfigVisible = async () => {
    NavigationBar.setVisibilityAsync("visible");
  };

  const url="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4"
  const LOCAL_PATH_TO_VIDEO = Platform.OS === 'ios' ? `${RNFS.DocumentDirectoryPath}/5a28f21875627519a3300000.mp4` : `${RNFS.ExternalDirectoryPath}/5a28f21875627519a3300000.mp4`

  const downloadFile = async () => {

    try {
      if (Platform.OS === 'android') {
        
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          {
            title: "Files Storing Permission",
            message:
              "Please give permissions to store the downloaded file.",
            buttonPositive: "OK"
          }
        );

        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
           continueDownload()
        }
        else{
          //downloadFile()
        }
      } else {
        continueDownload()
      }
    } catch (e) {
      console.log(e);
    }
  }

  // const continueDownload = async () =>{
  //   const { config, fs } = ReactNativeBlobUtil;
    
  //   let RootDir = fs.dirs.PictureDir;
  //   const fileExtension = url.split(/[#?]/)[0].split(".").pop().trim()
  //   //const fileNameWithExtension = 'file_5a28f21875627519a3300000' + '.' + fileExtension
  //   const fileNameWithExtension="file_5a28f21875627519a3300000.mp3";
  //   const storageURL = RootDir + '/' + fileNameWithExtension
  
  //   const check = await RNFS.exists(storageURL)
  
  
  //   console.log('CHECK:',check)
  
  //   if(check == true){
  //     //FileViewer.open(storageURL)
  //   }
  //   else {
  //   let options = {
  //     fileCache: true,
  //     appendExt: 'mp3',
  //     path: storageURL,
  //     transform: true,
  //     addAndroidDownloads: {
  //        path: storageURL,
  //        description: `${fileNameWithExtension} is downloading...`,
  //        title: `${fileNameWithExtension} is dowloaded successfully.`,
  //        notification: false,
  //        useDownloadManager: true, 
  //      },
  //   }
  //   config(options)
  //     .fetch('GET', url)
  //     .progress({count: 1}, (received, total) => {
  //       console.log('PROGRESS:',(received / total) * 100)
  //   })
  //     .then(res => {
  //       //FileViewer.open(res.data)
  //       console.log('The file saved to ', res.path())
  //     })
  //     .catch((err) => {
  //       alert(err)
  //     })
  // }
  // }


  const continueDownload = () => {
    const { config, fs } = ReactNativeBlobUtil;
    let RootDir = fs.dirs.PictureDir;
    const fileExtension = url.split(/[#?]/)[0].split(".").pop().trim();
    var startTime="";
    //const fileNameWithExtension = 'file_5a28f21875627519a3300000' + '.' + fileExtension
    const fileNameWithExtension="file_5a28f21875627519a3300000.mp3";
    const tmpPath = RootDir + '/' + fileNameWithExtension
    fs.ls(url).then(files => {
          console.log(files)
        })
        fs.exists(tmpPath)
          .then(ext => {
            if (ext) {
              if (isAndroid) {
                startTime = new Date().valueOf()
                return fs.stat(RootDir)
              }
              return fs.appendFile(RootDir, tmpPath, 'uri').then(() => {
                startTime = new Date().valueOf()
                return fs.stat(tmpPath)
              })
            }
            startTime = new Date().valueOf()
            return Promise.resolve({ size: 0 })
          })
          .then(stat => {
            const downtask = ReactNativeBlobUtil.config({
              IOSBackgroundTask: true, // required for both upload
              IOSDownloadTask: true, // Use instead of IOSDownloadTask if uploading
              path: isAndroid ? tmpPath : RootDir,
              fileCache: true
            })
              .fetch('GET', url, {
                Range: isAndroid ? `bytes=${stat.size}-` : ''
              })
              .progress((receivedStr, totalStr) => {
                // Do any things

              })
              downtask.catch(async err => {
                // Check error
              })
       })
       .then(file => {
            if (Platform.OS === 'android') {
              return fs.appendFile(RootDir, file.path(), 'uri')
            }
          })

          // remove tmp file ( file at ${RootDir}.download )
          .then(() => {
            if (Platform.OS === 'android') {
              return fs.unlink(tmpPath)
            }
            return null
          })
          // stat RootDir to get info downloaded of a video
          .then(() => {
            return fs.stat(RootDir)
          })
          .then(async stat => {
          // Downloaded successfully
          })
  }

  
  

  const [inFullscreen, setInFullsreen] = useState(false)
  const [inFullscreen2, setInFullsreen2] = useState(false)
  const refVideo2 = useRef(0)
  const [curtime, setcurtime] = useState();
  const [prevcurtime, setprevcurtime] = useState();
 

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
    <View style={styles.mainContainer}>
      <View style={styles.container}>
        {/* <TouchableOpacity onPress={downloadFile}><Text>Download</Text></TouchableOpacity> */}
        <VideoPlayer
          videoProps={{
            shouldPlay: true,
            defaultControlsVisible: false,
            resizeMode: ResizeMode.CONTAIN,
            source: {
              uri: url,
            },
            ref: refVideo2,
            isLooping:true,
            isMuted:false,
            audioPan:1
          }}
          activityIndicator={true}
          header={<View style={{
            width:"100%",
            }}>
            
            {inFullscreen2 ? 
                <TouchableOpacity onPress={exitScreen}>
                  <Ionicons name="arrow-back" size={30} color="#ffffff" style={{marginTop:10}}/>
                </TouchableOpacity> : 
                <TouchableOpacity  onPress={()=>navigation.goBack()}>
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
          {!inFullscreen2 ? <View style={styles.bodyContent}>
            <View style={styles.marginContainer}>
              <Text style={styles.headingLabel}>Test Name Label</Text>
              <Text style={styles.detailsText}>16 hours ago</Text>
              <Text style={styles.detailsText}>ETV Plus</Text>
              <Text style={styles.detailsText}>U/A 13+</Text>
              <Text style={styles.detailsText}>Loreum Ipsum Loreum Ipsum Loreum Ipsum Loreum Ipsum </Text>
            </View>
            <View style={styles.options}>
                  <View style={styles.singleoption}><MaterialCommunityIcons name="thumb-up" size={30} color="#566666"/></View>
                  <View style={styles.singleoption}><MaterialCommunityIcons name="share-variant" size={30} color="#566666"/></View>
                  <View style={styles.singleoption}><MaterialCommunityIcons name="download" size={30} color="#566666"/></View>
                  <View style={styles.singleoption}><MaterialIcons name="watch-later" size={30} color="#566666"/></View>
            </View>
          </View>: ""}
          
        <StatusBar style="auto" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#000000',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mainContainer:{flex: 1,backgroundColor:BACKGROUND_COLOR},
  bodyContent:{backgroundColor:BACKGROUND_COLOR},
  headingLabel:{fontSize:25,marginBottom:5,color:'#ffffff',padding:6},
  detailsText:{fontSize:13,marginBottom:5,color:'#566666',padding:6},
  options:{alignItems:'center',justifyContent:'center',flexDirection:'row'},
  singleoption:{width:"25%",alignItems:'center',justifyContent:'center',borderColor:'#566666',borderWidth:1,height:55},
  marginContainer:{marginLeft:5,marginRight:5},
});
