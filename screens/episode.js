import { StatusBar, setStatusBarHidden } from 'expo-status-bar';
import { StyleSheet, View, Text, ScrollView, Platform, TouchableOpacity, PermissionsAndroid, BackHandler } from 'react-native';
import React, { useEffect, useState, useRef } from 'react';
import { ResizeMode } from 'expo-av'
import VideoPlayer from 'expo-video-player'
import * as ScreenOrientation from 'expo-screen-orientation'
import Ionicons from 'react-native-vector-icons/Ionicons';
import * as NavigationBar from "expo-navigation-bar";
import RNFS from 'react-native-fs';
import ReactNativeBlobUtil from 'react-native-blob-util';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ACCESS_TOKEN, AUTH_TOKEN, BACKGROUND_COLOR, DARKED_BORDER_COLOR, DETAILS_TEXT_COLOR, FIRETV_BASE_URL, NORMAL_TEXT_COLOR, PAGE_HEIGHT, PAGE_WIDTH, SECRET_KEY, TAB_COLOR } from '../constants';
import axios from 'axios';
import ReadMore from '@fawazahmed/react-native-read-more';
import { stringMd5 } from 'react-native-quick-md5';

export default function Episode({ navigation, route }) {
  const { seoUrl } = route.params;
  const [seourl, setSeourl] = useState(seoUrl);
  const filterItems = (stringNeeded, arrayvalues) => {
    let query = stringNeeded.toLowerCase();
    return arrayvalues.filter(item => item.toLowerCase().indexOf(query) >= 0);
  }
  const [title, setTitle] = useState();
  const [channel, setChannel] = useState();
  const [contentRating, setContentRating] = useState();
  const [displayGenres, setDisplayGenres] = useState();
  const [description, setDescription] = useState();
  const [contentId, setContentId] = useState();
  const [catalogId, setCatalogId] = useState();


  const [barVisibility, setBarVisibility] = useState();
  const [state, setState] = useState({ downloadProgress: 0 });
  const [isAndroid, setisAndroid] = useState(true);
  const [startTime, setstartTime] = useState();
  const [inFullscreen, setInFullsreen] = useState(false)
  const [inFullscreen2, setInFullsreen2] = useState(false)
  const refVideo2 = useRef(0)
  const [curtime, setcurtime] = useState();
  const [prevcurtime, setprevcurtime] = useState();

  NavigationBar.addVisibilityListener(({ visibility }) => {
    if (visibility === "visible") {
      setBarVisibility(visibility);
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
  const exitScreen = async () => {
    setStatusBarHidden(false, 'fade')
    setInFullsreen2(!inFullscreen2)
    await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.DEFAULT)
  }
  const forward = () => {
    refVideo2.current.playFromPositionAsync(+curtime.positionMillis + +10000)
  }

  const backward = () => {
    refVideo2.current.playFromPositionAsync(+curtime.positionMillis - +10000)
  }
  const loadData = async () => {
    const baseUrl = FIRETV_BASE_URL;
    var splittedData = seourl.split("/");
    splittedData = splittedData.filter(function (e) { return e });
    const checkShow = filterItems('show', splittedData);
    const checkSeason = filterItems('season', splittedData);
    const region = await AsyncStorage.getItem('country_code');
    var urlPath = "";

    if (splittedData.length == 4 && checkSeason.length > 0) {
      urlPath = baseUrl + "catalogs/" + splittedData[0] + "/items/" + splittedData[1] + "/subcategories/" + splittedData[2] + "/episodes/" + splittedData[3];
    }
    else if (splittedData[0] == 'tv-shows') {
      if (splittedData[3] == "" || splittedData[3] == null || splittedData[3] == 'undefined')
        urlPath = baseUrl + "catalogs/" + splittedData[0] + "/episodes/" + splittedData[1];
      else
        urlPath = baseUrl + "catalogs/" + splittedData[0] + "/episodes/" + splittedData[4];
    }
    else if (splittedData[0] == 'news') {
      urlPath = baseUrl + "catalogs/" + splittedData[0] + "/items/" + splittedData[1] + "/episodes/" + splittedData[2];
    }
    else if (checkShow.length > 0 && splittedData.length == 3) {
      urlPath = baseUrl + "catalogs/" + splittedData[0] + "/items/" + splittedData[1] + "/episodes/" + splittedData[2];
    }
    else {
      if (splittedData.length == 2)
        urlPath = baseUrl + "catalogs/" + splittedData[0] + "/items/" + splittedData[1];
      if (splittedData.length == 3)
        urlPath = baseUrl + "catalogs/" + splittedData[0] + "/items/" + splittedData[1] + "/" + splittedData[2];
      if (splittedData.length == 4)
        urlPath = baseUrl + "catalogs/" + splittedData[0] + "/items/" + splittedData[1] + "/" + splittedData[2] + "/" + splittedData[3];
    }
    const url = urlPath + ".gzip?&auth_token=" + AUTH_TOKEN + "&region=" + region;
    await axios.get(url).then(response => {
      setTitle(response.data.data.title);
      setChannel(response.data.data.channel_object.name);
      setChannel(response.data.data.channel_object.name);
      setContentRating(response.data.data.cbfc_rating);
      setDisplayGenres(response.data.data.display_genres.join(","));
      setDescription(response.data.data.description);
      setContentId(response.data.data.content_id);
      setCatalogId(response.data.data.catalog_id);
    }).catch(error => { })

    var currentTimestamp = Math.floor(Date.now() / 1000);
    var sessionId = Math.random().toString(36).slice(2);
    var md5String = stringMd5(catalogId+contentId+sessionId+currentTimestamp+SECRET_KEY);
    await axios.post(FIRETV_BASE_URL + "v2/users/get_all_details", {
      catalog_id: catalogId,
      content_id: contentId,
      category: "",
      region: region,
      auth_token: AUTH_TOKEN,
      access_token: ACCESS_TOKEN,
      id: sessionId,
      ts: currentTimestamp,
      md5: md5String
  }, {
      headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
      }
  })
      .then(response => {
          console.log(response.data.data);
          console.log(response.data.data.play_url.saranyu.url);
      }).catch(error => {
          
      }
      );

  }
  useEffect(() => {
    loadData()
    if (inFullscreen2) {
      navigationConfig();
    }
    else {
      navigationConfigVisible();
    }
    BackHandler.addEventListener('hardwareBackPress', exitScreen);
  })
  const url="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4";
  return (
    <View style={styles.mainContainer}>
      <ScrollView style={{ flex: 1 }} nestedScrollEnabled={true}>
        <View style={styles.container}>
          <VideoPlayer
            videoProps={{
              shouldPlay: true,
              defaultControlsVisible: false,
              resizeMode: ResizeMode.CONTAIN,
              source: {
                uri: url,
              },
              ref: refVideo2,
              isLooping: true,
              isMuted: false,
              audioPan: 1
            }}
            activityIndicator={true}
            header={<View style={{
              width: "100%",
            }}>

              {inFullscreen2 ?
                <TouchableOpacity onPress={exitScreen}>
                  <Ionicons name="arrow-back" size={30} color="#ffffff" style={{ marginTop: 10 }} />
                </TouchableOpacity> :
                <TouchableOpacity onPress={() => navigation.goBack()}>
                  <Ionicons name="arrow-back" size={30} color="#ffffff" style={{ marginTop: 10 }} />
                </TouchableOpacity>
              }

              <View style={{ width: '100%', flexDirection: 'row' }}>

                <View style={{
                  position: 'absolute',
                  left: inFullscreen2 ? ((PAGE_WIDTH / 2) - 20) : 50,
                  top: inFullscreen2 ? ((PAGE_WIDTH / 2) - 70) : 65
                }}>
                  <TouchableOpacity onPress={backward}><Ionicons name="ios-play-back-circle" size={40} color="" style={{ color: "#ffffff" }} /></TouchableOpacity>
                </View>
                <View style={{
                  position: 'absolute',
                  right: inFullscreen2 ? ((PAGE_WIDTH / 2) - 20) : 50,
                  top: inFullscreen2 ? ((PAGE_WIDTH / 2) - 70) : 65
                }}>
                  <TouchableOpacity onPress={forward}><Ionicons name="play-forward-circle" size={40} color="" style={{ color: "#ffffff" }} /></TouchableOpacity>
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
              height: inFullscreen2 ? PAGE_WIDTH : 250,
              width: inFullscreen2 ? PAGE_HEIGHT : PAGE_WIDTH,
            }}
            playbackCallback={(playbackStatus) => {
              setcurtime(playbackStatus)
              if (inFullscreen2)
                setInFullsreen2(inFullscreen2)
            }}
          />

          {!inFullscreen2 ? <View style={styles.bodyContent}>
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
              <View style={styles.singleoption}><MaterialCommunityIcons name="thumb-up" size={30} color={NORMAL_TEXT_COLOR} /></View>
              <View style={styles.singleoption}><MaterialCommunityIcons name="share-variant" size={30} color={NORMAL_TEXT_COLOR} /></View>
              <View style={styles.singleoption}><MaterialCommunityIcons name="download" size={30} color={NORMAL_TEXT_COLOR} /></View>
              <View style={styles.singleoption}><MaterialIcons name="watch-later" size={30} color={NORMAL_TEXT_COLOR} /></View>
            </View>
          </View> : ""}

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
  mainContainer: { flex: 1, backgroundColor: BACKGROUND_COLOR },
  bodyContent: { backgroundColor: BACKGROUND_COLOR },
  headingLabel: { fontSize: 25, marginBottom: 5, color: NORMAL_TEXT_COLOR, padding: 6 },
  detailsText: { fontSize: 13, marginBottom: 5, color: DETAILS_TEXT_COLOR, padding: 6 },
  options: { alignItems: 'center', justifyContent: 'center', flexDirection: 'row' },
  singleoption: { width: "25%", alignItems: 'center', justifyContent: 'center', borderColor: DARKED_BORDER_COLOR, borderWidth: 1, height: 55 },
  marginContainer: { marginLeft: 5, marginRight: 5 },
});
