import { StyleSheet, View, Text, ScrollView, Alert, TouchableOpacity, PermissionsAndroid, TouchableWithoutFeedback, BackHandler, ActivityIndicator, Pressable, StatusBar, Platform } from 'react-native';
import React, { useEffect, useState, createRef } from 'react';
import * as NavigationBar from "expo-navigation-bar";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ACCESS_TOKEN, AUTH_TOKEN, BACKGROUND_COLOR, BACKGROUND_TRANSPARENT_COLOR, DARKED_BORDER_COLOR, DETAILS_TEXT_COLOR, FIRETV_BASE_URL, IMAGE_BORDER_COLOR, NORMAL_TEXT_COLOR, PAGE_HEIGHT, PAGE_WIDTH, SECRET_KEY, TAB_COLOR, VIDEO_AUTH_TOKEN, } from '../constants';
import axios from 'axios';
import ReadMore from '@fawazahmed/react-native-read-more';
import { stringMd5 } from 'react-native-quick-md5';
import Orientation from 'react-native-orientation-locker';
import Video from 'react-native-video';
import { StackActions } from '@react-navigation/native';
import RNFS from 'react-native-fs';
import RNBackgroundDownloader from 'react-native-background-downloader';
import Share from 'react-native-share';
import Modal from "react-native-modal";
import Slider from '@react-native-community/slider';
// import VideoViewAndroid from '../components/VideoViewAndroid';
// import VideoViewIos from '../components/VideoViewIos';

export default function Episode({ navigation, route }) {
  const { seoUrl, theme } = route.params;
  const [seourl, setSeourl] = useState(seoUrl);
  const [passedtheme, setpassedtheme] = useState(theme);
  const filterItems = (stringNeeded, arrayvalues) => {
    let query = stringNeeded.toLowerCase();
    return arrayvalues.filter(item => item.toLowerCase().indexOf(query) >= 0);
  }
  const [title, setTitle] = useState();
  const [channel, setChannel] = useState();
  const [contentRating, setContentRating] = useState();
  const [displayGenres, setDisplayGenres] = useState();
  const [description, setDescription] = useState();
  const [playUrl, setPlayUrl] = useState("");
  const [onlineplayUrl, setOnlinePlayUrl] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const [play, setPlay] = useState(true);
  const [loading, setLoading] = useState(false);
  const [offlineUrl, setOfflineUrl] = useState("");
  //0 - not downloaded, 1-downloaded, 2-downloading
  const [downloadedStatus, setDownloadedStatus] = useState(0)
  const [taskdownloading, settaskdownloading] = useState();
  const [pauseDownload, setPauseDownload] = useState(false);
  const [thumbnailImage, setThumbnailImage] = useState("");
  const [preview, setPreview] = useState(false);
  const [loggedin, setloggedin] = useState(false);
  const [showupgrade, setshowupgrade] = useState(false);
  const videoRef = createRef();
  const [state, setState] = useState({ showControls: true, progress: 0, isPaused: false, });
  const [contentId, setContentId] = useState();
  const [catalogId, setCatalogId] = useState();
  const [watchlatercontent, setwatchlatercontent] = useState();
  const [likecontent, setlikecontent] = useState();
  const [shareUrl, setShareUrl] = useState()
  const [isModalVisible, setModalVisible] = useState(false);
  const [prefrence, setPreference] = useState([]);
  const [isresumeDownloading, setIsresumeDownloading] = useState(false);
  const [currenttimestamp, setcurrenttimestamp] = useState("00:00:00");
  const [duration, setDuration] = useState("");
  const [currentloadingtime, setcurrentloadingtime] = useState(0);
  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };


  const navigationConfig = async () => {
    // // Just incase it is not hidden
    // NavigationBar.setBackgroundColorAsync('red');
    NavigationBar.setVisibilityAsync("hidden");
  };
  const navigationConfigVisible = async () => {
    NavigationBar.setVisibilityAsync("visible");
  };
  const exitScreen = async () => {
    StatusBar.setHidden(false)
    { fullscreen ? handleFullscreen() : navigation.goBack() }
  }

  const loadData = async () => {
    if (playUrl == "") {
      setLoading(true);
      const baseUrl = FIRETV_BASE_URL;
      var removequeryStrings = seourl.split("?");
      var splittedData = removequeryStrings[0].split("/");
      splittedData = splittedData.filter(function (e) { return e });
      const checkNews = filterItems('news', splittedData);
      const checkShow = filterItems('show', splittedData);
      const checkSeason = filterItems('season', splittedData);
      const checkChannel = filterItems('channel', splittedData);
      const checkEvent = filterItems('event', splittedData);
      const region = await AsyncStorage.getItem('country_code');
      var urlPath = "";
      var sessionId = await AsyncStorage.getItem('session');
      if (splittedData.length == 4 && checkChannel == 0) {
        urlPath = baseUrl + "catalogs/" + splittedData[0] + "/items/" + splittedData[1] + "/subcategories/" + splittedData[2] + "/episodes/" + splittedData[3];
      }
      else if (splittedData[0] == 'tv-shows') {
        // if (splittedData[3] == "" || splittedData[3] == null || splittedData[3] == 'undefined')
        //   urlPath = baseUrl + "catalogs/" + splittedData[0] + "/episodes/" + splittedData[1];
        // else
        urlPath = baseUrl + "catalogs/" + splittedData[0] + "/episodes/" + splittedData[splittedData.length - 1];
      }
      else if (splittedData[0] == 'news' || checkNews.length > 0) {
        urlPath = baseUrl + "catalogs/" + splittedData[splittedData.length - 3] + "/items/" + splittedData[splittedData.length - 2] + "/episodes/" + splittedData[splittedData.length - 1];
      }
      else if (checkShow.length > 0 || checkEvent.length > 0) {
        urlPath = baseUrl + "catalogs/" + splittedData[0] + "/items/" + splittedData[splittedData.length - 2] + "/episodes/" + splittedData[splittedData.length - 1];
      }
      else if (checkChannel.length > 0) {
        urlPath = baseUrl + "catalogs/" + splittedData[1] + "/items/" + splittedData[splittedData.length - 1];
      }
      else if (theme == "videolist") {
        urlPath = baseUrl + "catalogs/" + splittedData[0] + "/items/" + splittedData[1] + "/videolists/" + splittedData[2];
      }
      else {
        //if (splittedData.length == 2)
        urlPath = baseUrl + "catalogs/" + splittedData[0] + "/items/" + splittedData[splittedData.length - 1];
        // if (splittedData.length == 3)
        //   urlPath = baseUrl + "catalogs/" + splittedData[0] + "/items/" + splittedData[1] + "/" + splittedData[2];
        // if (splittedData.length == 4)
        //   urlPath = baseUrl + "catalogs/" + splittedData[0] + "/items/" + splittedData[1] + "/" + splittedData[2] + "/" + splittedData[3];
      }
      const url = urlPath + ".gzip?&auth_token=" + AUTH_TOKEN + "&region=" + region;
      //  console.log(seourl);
      //  console.log(url);
      await axios.get(url).then(response => {
        setTitle(response.data.data.title);
        setOfflineUrl(response.data.data.play_url.saranyu.url);
        setShareUrl(response.data.data.dynamic_url);
        if (response.data.data.hasOwnProperty('channel_object'))
          setChannel(response.data.data.channel_object.name);
        if (response.data.data.hasOwnProperty('cbfc_rating'))
          setContentRating(response.data.data.cbfc_rating);
        if (response.data.data.hasOwnProperty('display_genres'))
          setDisplayGenres(response.data.data.display_genres.join(","));
        if (response.data.data.hasOwnProperty('description'))
          setDescription(response.data.data.description);
        if (response.data.data.hasOwnProperty('thumbnails'))
          setThumbnailImage(response.data.data.thumbnails.high_4_3.url);
        setContentId(response.data.data.content_id);
        setCatalogId(response.data.data.catalog_id);
        AsyncStorage.getItem("watchLater_" + contentId).then(resp => {
          if (resp != "" && resp != null)
            setwatchlatercontent(true);
        }).catch(erro => { })
        AsyncStorage.getItem("like_" + contentId).then(resp => {
          //console.log(resp);
          if (resp != "" && resp != null)
            setlikecontent(true);
        }).catch(erro => { })
        var currentTimestamp = Math.floor(Date.now() / 1000).toString();
        //console.log(sessionId);
        if (sessionId != null)
          setloggedin(true);
        if (sessionId == null)
          sessionId = "";
        var md5String = stringMd5(response.data.data.catalog_id + response.data.data.content_id + sessionId + currentTimestamp + SECRET_KEY)
        axios.post(FIRETV_BASE_URL + "v2/users/get_all_details", {
          catalog_id: response.data.data.catalog_id,
          content_id: response.data.data.content_id,
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
        })
          .then(response => {
            checkOfflineDownload();
            if (onlineplayUrl == false) {
              if (response.data.data.stream_info.adaptive_url != "") {
                setPlayUrl(response.data.data.stream_info.adaptive_url);
              }
              else
                if (response.data.data.stream_info.preview.adaptive_url != "") {
                  setPlayUrl(response.data.data.stream_info.preview.adaptive_url);
                  setPreview(true);
                }
            }
            setLoading(false);
          }).catch(error => {
            //console.log(JSON.stringify(error.response.data));
            setLoading(false);
          }
          )
        setLoading(false);
      }).catch(error => {
        setLoading(false);
      })
    }

    //ofline downloads
    let lostTasks = await RNBackgroundDownloader.checkForExistingDownloads();
    if (lostTasks.length > 0)
      setIsresumeDownloading(true);
  }
  const checkOfflineDownload = async () => {

    if (offlineUrl != "") {
      var splittedOfflineUrl = offlineUrl.split("/");
      var downloaddirectory = RNBackgroundDownloader.directories.documents + '/offlinedownload/' + splittedOfflineUrl[splittedOfflineUrl.length - 1] + ".ts.download";
      if (await RNFS.exists(downloaddirectory)) {
        //console.log(downloadpercent);
        var downloadpercent = await AsyncStorage.getItem('download_' + splittedOfflineUrl[splittedOfflineUrl.length - 1]);
        var downloadtask = await AsyncStorage.getItem('download_task' + splittedOfflineUrl[splittedOfflineUrl.length - 1]);
        //console.log(downloadtask);
        if (downloadtask != "" || downloadtask != null)
          settaskdownloading(downloadtask);
        if (downloadpercent == '100') {
          setDownloadedStatus(1)
          setPlayUrl(downloaddirectory)
          setOnlinePlayUrl(true)
        }
        else if (downloadpercent != "" || downloadpercent != null) {
          setDownloadedStatus(2)
          setOnlinePlayUrl(false)
          setPauseDownload(true);
        }
        else {
          setDownloadedStatus(0)
          setOnlinePlayUrl(false)
          setPauseDownload(false);
        }
      }
    }

  }
  useEffect(() => {
    loadData()
    if (fullscreen) {
      navigationConfig();
    }
    else {
      navigationConfigVisible();
    }
    BackHandler.addEventListener('hardwareBackPress', exitScreen);
  })
  function handleFullscreen() {
    Orientation.getOrientation((orientation) => {
      if (orientation === 'LANDSCAPE-LEFT' || orientation === 'LANDSCAPE-RIGHT') {
        setFullscreen(false);
        StatusBar.setHidden(false)
        Orientation.lockToPortrait();
        return true;
      }
      else
        if (orientation === 'PORTRAIT' || orientation === 'UNKNOWN' || orientation === '') {
          setFullscreen(true);
          StatusBar.setHidden(true)
          Orientation.lockToLandscapeLeft();
          return true;
        }
    })
  }
  function showControls() {
    state.showControls
      ? setState({ ...state, showControls: false })
      : setState({ ...state, showControls: true });
    setTimeout(function () { setState({ ...state, showControls: false }) }, 10000)
  }
  const checkgoback = () => {
    if (navigation.canGoBack())
      navigation.goBack()
    else
      navigation.dispatch(StackActions.replace('Home', { pageFriendlyId: 'featured-1' }))
  }
  const downloadFile = async () => {
    if (!loggedin) {
      navigation.dispatch(StackActions.replace("Login"));
    }
    else {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        {
          title: 'Download File',
          message:
            'Need App Access To Download Files',
          buttonPositive: 'OK',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        // if (offlineUrl != "") {
        var downloaddirectory = RNBackgroundDownloader.directories.documents + '/offlinedownload/';
        var offlineprefrences = [];
        if (await RNFS.exists(downloaddirectory)) {
          //setDownloadedStatus(1)
        }
        else {
          RNFS.mkdir(downloaddirectory);
        }
        var offlinedownloadapi = offlineUrl + "?service_id=6&play_url=yes&protocol=http_pd&us=745d7e9f1e37ca27fdffbebfe8a99877";
        await axios.get(offlinedownloadapi).then(response => {
          for (let o = 0; o < response.data.playback_urls.length; o++) {
            offlineprefrences.push({ "display_name": response.data.playback_urls[o].display_name, "playback_url": response.data.playback_urls[o].playback_url, "offlineUrl": offlineUrl, "downloaddirectory": downloaddirectory })
          }
          setPreference(offlineprefrences);
          toggleModal()
        }).catch(error => { })

        // }

      }
      else {
        alert("Please give access to download files.");
      }
    }
  }

  const startDownloading = async (playback_url, offlineUrl, downloaddirectory) => {
    var splittedOfflineUrl = offlineUrl.split("/");
    AsyncStorage.setItem('download_url' + splittedOfflineUrl[splittedOfflineUrl.length - 1], playback_url);
    AsyncStorage.setItem('download_path' + splittedOfflineUrl[splittedOfflineUrl.length - 1], `${downloaddirectory}/${splittedOfflineUrl[splittedOfflineUrl.length - 1]}.ts.download`);
    AsyncStorage.setItem('download_title' + splittedOfflineUrl[splittedOfflineUrl.length - 1], title);
    AsyncStorage.setItem('download_thumbnail' + splittedOfflineUrl[splittedOfflineUrl.length - 1], thumbnailImage);
    AsyncStorage.setItem('download_seourl' + splittedOfflineUrl[splittedOfflineUrl.length - 1], seourl)

    let tasks = RNBackgroundDownloader.download({
      id: splittedOfflineUrl[splittedOfflineUrl.length - 1],
      url: playback_url,
      destination: `${downloaddirectory}/${splittedOfflineUrl[splittedOfflineUrl.length - 1]}.ts.download`
    }).begin((expectedBytes) => {
      setDownloadedStatus(2)
      console.log(`Going to download ${expectedBytes} bytes!`);
      toggleModal()
    }).progress((percent) => {
      AsyncStorage.setItem('download_' + splittedOfflineUrl[splittedOfflineUrl.length - 1], JSON.stringify(percent * 100));
      console.log(`Downloaded: ${percent * 100}%`);
    }).done(() => {
      AsyncStorage.setItem('download_' + splittedOfflineUrl[splittedOfflineUrl.length - 1], JSON.stringify(1 * 100));
      setDownloadedStatus(1)
      console.log('Download is done!');
    }).error((error) => {
      console.log('Download canceled due to error: ', error);
    })
    settaskdownloading(tasks);
    AsyncStorage.setItem('download_task' + splittedOfflineUrl[splittedOfflineUrl.length - 1], JSON.stringify(tasks));
    navigation.dispatch(StackActions.replace('Offline'));
  }

  const deleteDownload = async () => {

    Alert.alert('Delete File', 'Please confirm to delete the file from offline.', [
      {
        text: 'Cancel',
        onPress: () => { },
        style: 'cancel',
      },
      {
        text: 'OK', onPress: async () => {
          //console.log('OK Pressed')

          var splittedOfflineUrl = offlineUrl.split("/");
          var downloaddirectory = RNBackgroundDownloader.directories.documents + '/offlinedownload/' + splittedOfflineUrl[splittedOfflineUrl.length - 1] + ".ts.download";
          if (await RNFS.exists(downloaddirectory)) {
            await RNFS.unlink(downloaddirectory)
            setDownloadedStatus(0)
          }
          navigation.dispatch(StackActions.replace('Home', { pageFriendlyId: 'featured-1' }))
        }
      },
    ]);
  }
  const pauseDownloadAction = async () => {
    taskdownloading.pause();
    setPauseDownload(true);
  }
  const resumeDownloadAction = async () => {
    taskdownloading.resume();
    setPauseDownload(false);
  }
  const checkpreviewContent = async () => {
    if (preview) {
      setshowupgrade(true);
    }
  }
  const watchLater = async () => {
    if (!loggedin) {
      navigation.dispatch(StackActions.replace("Login"));
    }
    else {
      var sessionId = await AsyncStorage.getItem('session');
      await axios.post(FIRETV_BASE_URL + "users/" + sessionId + "/playlists/watchlater", {
        listitem: { catalog_id: catalogId, content_id: contentId },
        auth_token: VIDEO_AUTH_TOKEN,
        access_token: ACCESS_TOKEN,

      }, {
        headers: {
          'Content-Type': 'application/json',
        }
      }).then(response => {
        alert("Added to watchlist");
        AsyncStorage.setItem("watchLater_" + contentId, contentId);
        setwatchlatercontent(true);
      }).catch(error => {
        alert("Unable to add to watchlist. Please try again later.");
      })
    }
  }
  const likeContent = async () => {
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
    const ShareResponse = await Share.open(shareOptions);
  }
  // const onAdsLoaded = () => {
  //   setTimeout(() => {
  //     videoRef.startAds();
  //   }, 10000);
  // }

  // const onAdStarted = () => {
  //   setPlay(true);
  // }

  // const onAdsComplete = () => {
  //   setPlay(false);
  // }
  const toHoursAndMinutes = async (totalSeconds) => {
    const totalMinutes = Math.floor(totalSeconds / 60);

    var seconds = totalSeconds % 60;
    var hours = Math.floor(totalMinutes / 60);
    var minutes = totalMinutes % 60;
    seconds = String(seconds).padStart(2, '0');
    hours = String(hours).padStart(2, '0');
    minutes = String(minutes).padStart(2, '0');
    var timestamp = hours + ":" + minutes + ":" + seconds;
    setcurrenttimestamp(timestamp);
    setcurrentloadingtime(totalSeconds);
    if ((totalSeconds % 30) == 0) {
      var sessionId = await AsyncStorage.getItem('session');
      if (sessionId != "" && sessionId != null && timestamp != "" && timestamp != null) {
        await axios.post(FIRETV_BASE_URL + "users/" + sessionId + "/playlists/watchhistory", {
          listitem: { catalog_id: catalogId, content_id: contentId, like_count: "true" },
          auth_token: VIDEO_AUTH_TOKEN,
          access_token: ACCESS_TOKEN,
          play_back_status: "playing",
          play_back_time: timestamp
        }, {
          headers: {
            'Content-Type': 'application/json',
          }
        }).then(response => {
          console.log(JSON.stringify(response.data));
        }).catch(error => {
        })
      }
    }
  }

  return (
    <View style={styles.mainContainer}>
      <ScrollView style={{ flex: 1 }} nestedScrollEnabled={true}>
        <View style={styles.container}>
          {playUrl != "" && playUrl != null && !showupgrade ?
            <TouchableWithoutFeedback onPress={showControls}>
              <View style={{ flex: 1 }}>
                <Video
                  ref={videoRef}
                  source={{ uri: playUrl }}
                  controls={false}
                  paused={!play}
                  playInBackground={false}
                  volume={1}
                  bufferConfig={{
                    minBufferMs: 1000000,
                    maxBufferMs: 2000000,
                    bufferForPlaybackMs: 7000
                  }}
                  rate={1.0}
                  resizeMode={fullscreen ? 'cover' : 'none'}
                  style={fullscreen ? styles.fullscreenVideo : styles.video}
                  onEnd={checkpreviewContent}
                  playWhenInactive={false}
                  progressUpdateInterval={1000}
                  onProgress={play => {
                    var milliseconds = play.currentTime;
                    toHoursAndMinutes(Math.floor(milliseconds));
                  }}
                  onLoad={(data) => {
                    setDuration(data.duration)
                  }}
                />
                {state.showControls && (
                  <View style={{ width: "100%", position: 'absolute', backgroundColor: BACKGROUND_TRANSPARENT_COLOR, height: 50 }}>
                    <TouchableOpacity
                      onPress={() => { fullscreen ? handleFullscreen() : checkgoback() }}
                      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                      style={styles.navigationBack}>
                      <MaterialCommunityIcons name="keyboard-backspace" size={25} color={NORMAL_TEXT_COLOR}></MaterialCommunityIcons>
                    </TouchableOpacity>

                    <TouchableOpacity
                      onPress={handleFullscreen}
                      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                      style={styles.fullscreenButton}>
                      {fullscreen ? <Feather name="minimize-2" size={25} color={NORMAL_TEXT_COLOR}></Feather> : <Feather name="maximize-2" size={25} color={NORMAL_TEXT_COLOR}></Feather>}
                    </TouchableOpacity>
                  </View>
                )}


                {state.showControls && (
                  <View style={{ width: "100%", position: 'absolute', top:"40%", flexDirection:'row',justifyContent:'center',alignItems:'center' }}>
                    <TouchableOpacity
                      onPress={() => { 
                        videoRef.current.seek(currentloadingtime - 10) 
                      }}
                      style={{marginRight:50}}>
                      <Ionicons name="md-caret-back-circle-sharp" size={40} color={NORMAL_TEXT_COLOR}></Ionicons>
                    </TouchableOpacity>

                    <TouchableOpacity
                      onPress={()=> { 
                        videoRef.current.seek(currentloadingtime + 10)
                      }}
                      style={{marginLeft:50}}>
                      <Ionicons name="md-caret-forward-circle-sharp" size={40} color={NORMAL_TEXT_COLOR}></Ionicons>
                    </TouchableOpacity>
                  </View>
                )}

                {state.showControls && (
                  <View style={{ width: "100%", position: 'absolute', backgroundColor: BACKGROUND_TRANSPARENT_COLOR, height: 50, bottom: 10, flexDirection: 'row' }}>
                    <TouchableOpacity
                      onPress={() => { setPlay(!play) }}
                      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                      style={{ top: 20, left: 10, width: "10%" }}>
                      {play ?
                        <MaterialCommunityIcons name="pause-circle" size={35} color={NORMAL_TEXT_COLOR} />
                        :
                        <MaterialCommunityIcons name="play-circle" size={35} color={NORMAL_TEXT_COLOR} />
                      }
                    </TouchableOpacity>
                    <View style={{ width: "78%", top: 20 }}>
                      <Slider
                        style={{ width: "100%", height: 40 }}
                        minimumValue={0}
                        maximumValue={Math.floor(duration)}
                        minimumTrackTintColor="#FF0000 "
                        maximumTrackTintColor="#343A82"
                        tapToSeek={true}
                        value={currentloadingtime}
                        onSlidingComplete={val => {
                          videoRef.current.seek(Math.floor(val))
                        }}
                      />
                    </View>
                    <View style={{ top: 30, width: "12%", right: 5 }}>
                      <Text style={{ color: "#ffffff", fontSize: 11 }}>
                        {currenttimestamp}
                      </Text>
                    </View>
                  </View>
                )}
              </View>
            </TouchableWithoutFeedback>

            :

            <View style={{ width: PAGE_WIDTH, height: 270, backgroundColor: "#000000", justifyContent: 'center', alignItems: 'center', flexDirection: 'row' }}>

              <TouchableOpacity
                onPress={() => { fullscreen ? handleFullscreen() : checkgoback() }}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                style={styles.navigationBack}>
                <MaterialCommunityIcons name="keyboard-backspace" size={25} color={NORMAL_TEXT_COLOR}></MaterialCommunityIcons>
              </TouchableOpacity>
              {loading ? <ActivityIndicator size={'large'} color={"#ffffff"}></ActivityIndicator> :

                loggedin ? <TouchableOpacity onPress={() => navigation.navigate('Subscribe')} style={[styles.button, { width: 200 }]}><Text style={{ color: NORMAL_TEXT_COLOR, fontSize: 16 }}>Upgrade / Subscribe</Text></TouchableOpacity>
                  :
                  <View style={{ justifyContent: 'center', alignItems: 'center', flexDirection: 'row' }}>
                    <TouchableOpacity onPress={() => navigation.navigate('Login')} style={styles.button}><Text style={{ color: NORMAL_TEXT_COLOR, fontSize: 16 }}>LOGIN</Text></TouchableOpacity>

                    <TouchableOpacity onPress={() => navigation.navigate('Signup')} style={styles.button}><Text style={{ color: NORMAL_TEXT_COLOR, fontSize: 16 }}>SIGN UP</Text></TouchableOpacity>
                  </View>

              }
            </View>

          }

          {!fullscreen ? <View style={styles.bodyContent}>
            <View style={styles.marginContainer}>
              <Text style={styles.headingLabel}>{title}</Text>
              {channel ? <Text style={styles.detailsText}>{channel}</Text> : ""}
              <View style={{ flexDirection: 'row' }}>
                <Text style={styles.detailsText}>{contentRating}</Text>
                <Text style={[{ color: TAB_COLOR, fontWeight: 'bold', borderRightColor: TAB_COLOR, borderWidth: 2 }]}></Text>
                <Text style={[styles.detailsText, { borderWidth: 1, borderStyle: 'dashed', borderColor: TAB_COLOR, marginLeft: 10, borderRadius: 10 }]}>{displayGenres}</Text>
              </View>
              <ReadMore numberOfLines={3} style={styles.detailsText} seeMoreText="Read More" seeMoreStyle={{ color: TAB_COLOR, fontWeight: 'bold' }} seeLessStyle={{ color: TAB_COLOR, fontWeight: 'bold' }}>
                <Text style={styles.detailsText}>{description}</Text>
              </ReadMore>
            </View>

            {!loading ?
              <View style={styles.options}>
                <View style={styles.singleoption}>
                  {!likecontent ?
                    <Pressable onPress={likeContent}><MaterialIcons name="thumb-up-off-alt" size={30} color={NORMAL_TEXT_COLOR} /></Pressable>
                    :
                    <Pressable onPress={() => deleteLike(catalogId, contentId)}><MaterialIcons name="thumb-up" size={30} color={NORMAL_TEXT_COLOR} /></Pressable>
                  }
                </View>

                <View style={styles.singleoption}>
                  <Pressable onPress={shareOptions}><MaterialCommunityIcons name="share-variant" size={30} color={NORMAL_TEXT_COLOR} /></Pressable>
                </View>

                {passedtheme != 'live' && passedtheme != 'livetv' ?
                  <View style={styles.singleoption}>
                    {downloadedStatus == 0 ? <Pressable onPress={downloadFile}><MaterialCommunityIcons name="download" size={30} color={NORMAL_TEXT_COLOR} /></Pressable> : ""}
                    {downloadedStatus == 1 ? <Pressable onPress={deleteDownload}><MaterialCommunityIcons name="check-circle" size={30} color={NORMAL_TEXT_COLOR} /></Pressable> : ""}
                    {downloadedStatus == 2 ?

                      pauseDownload ?
                        isresumeDownloading ?
                          <Pressable onPress={() => navigation.dispatch(StackActions.replace('Offline'))}><MaterialCommunityIcons name="download" size={30} color={NORMAL_TEXT_COLOR} /></Pressable>
                          :
                          <Pressable onPress={resumeDownloadAction}><MaterialCommunityIcons name="motion-pause" size={30} color={NORMAL_TEXT_COLOR} /></Pressable>
                        :
                        isresumeDownloading ?
                          <Pressable onPress={() => navigation.dispatch(StackActions.replace('Offline'))}><MaterialCommunityIcons name="download" size={30} color={NORMAL_TEXT_COLOR} /></Pressable>
                          :
                          <Pressable onPress={pauseDownloadAction}><MaterialCommunityIcons name="progress-download" size={30} color={NORMAL_TEXT_COLOR} /></Pressable>

                      : ""}

                  </View>
                  :
                  <View style={styles.singleoption}>
                    <MaterialCommunityIcons name="download" size={30} color={DARKED_BORDER_COLOR} />
                  </View>
                }

                <View style={styles.singleoption}>

                  {!watchlatercontent ?
                    <Pressable onPress={watchLater}><MaterialIcons name="watch-later" size={30} color={NORMAL_TEXT_COLOR} /></Pressable>
                    :
                    <Pressable onPress={() => { navigation.dispatch(StackActions.replace('WatchLater')) }}><MaterialIcons name="watch-later" size={30} color={DARKED_BORDER_COLOR} /></Pressable>
                  }

                </View>
              </View>
              : ""}
          </View> : ""}


          <Modal
            isVisible={isModalVisible}
            testID={'modal'}
            animationIn="slideInDown"
            animationOut="slideOutDown"
            onBackdropPress={toggleModal}
            backdropColor={"black"}
            backdropOpacity={0.40}
          >
            <View style={{ backgroundColor: NORMAL_TEXT_COLOR, width: '100%', backgroundColor: BACKGROUND_COLOR }}>
              {prefrence.map((pref, ind) => {
                return (
                  pref.display_name != "" ?
                    <TouchableOpacity key={'pref' + ind} onPress={() => { startDownloading(pref.playback_url, pref.offlineUrl, pref.downloaddirectory) }}>
                      <View style={{ padding: 13, borderBottomColor: IMAGE_BORDER_COLOR, borderBottomWidth: 0.5 }}>
                        <Text style={{ color: NORMAL_TEXT_COLOR }}>{pref.display_name}</Text>
                      </View>
                    </TouchableOpacity>
                    :
                    ""
                )
              })}
            </View>
          </Modal>


          <StatusBar style="auto" />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: BACKGROUND_COLOR,
    alignItems: 'center',
    justifyContent: 'center',
  },
  video: {
    height: 270,
    width: PAGE_WIDTH,
    backgroundColor: 'black',
  },
  fullscreenVideo: {
    height: PAGE_WIDTH,
    width: PAGE_HEIGHT,
    backgroundColor: 'black',
  },
  fullscreenButton: {
    position: 'absolute',
    right: 20,
    top: 30,
    paddingRight: 10,
  },
  navigationBack: {
    position: 'absolute',
    left: 15,
    top: 20,
    paddingLeft: 10,
  },
  mainContainer: { flex: 1, backgroundColor: BACKGROUND_COLOR },
  bodyContent: { backgroundColor: BACKGROUND_COLOR },
  headingLabel: { fontSize: 25, marginBottom: 5, color: NORMAL_TEXT_COLOR, padding: 6 },
  detailsText: { fontSize: 13, marginBottom: 5, color: DETAILS_TEXT_COLOR, padding: 6 },
  options: { alignItems: 'center', justifyContent: 'center', flexDirection: 'row' },
  singleoption: { width: "25%", alignItems: 'center', justifyContent: 'center', borderColor: DARKED_BORDER_COLOR, borderWidth: 1, height: 55 },
  marginContainer: { marginLeft: 5, marginRight: 5 },
  button: { justifyContent: 'center', alignItems: 'center', backgroundColor: TAB_COLOR, color: NORMAL_TEXT_COLOR, width: 100, padding: 10, borderRadius: 20, marginRight: 10 },
});
