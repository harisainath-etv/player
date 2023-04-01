import { StyleSheet, View, Text, ScrollView, Platform, TouchableOpacity, PermissionsAndroid, TouchableWithoutFeedback, BackHandler, ActivityIndicator, Pressable, StatusBar } from 'react-native';
import React, { useEffect, useState, createRef } from 'react';
import * as NavigationBar from "expo-navigation-bar";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Feather from 'react-native-vector-icons/Feather';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ACCESS_TOKEN, AUTH_TOKEN, BACKGROUND_COLOR, BACKGROUND_TRANSPARENT_COLOR, DARKED_BORDER_COLOR, DETAILS_TEXT_COLOR, FIRETV_BASE_URL, NORMAL_TEXT_COLOR, PAGE_HEIGHT, PAGE_WIDTH, SECRET_KEY, TAB_COLOR, VIDEO_AUTH_TOKEN, } from '../constants';
import axios from 'axios';
import ReadMore from '@fawazahmed/react-native-read-more';
import { stringMd5 } from 'react-native-quick-md5';
import Orientation from 'react-native-orientation-locker';
import Video from 'react-native-video';

var currentTimestamp = Math.floor(Date.now() / 1000).toString();
var sessionId = Math.random().toString(20).slice(2);

export default function Episode({ navigation, route }) {
  const { seoUrl, theme } = route.params;
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
  const [playUrl, setPlayUrl] = useState("");
  const [fullscreen, setFullscreen] = useState(false);
  const [play, setPlay] = useState(true);
  const [loading, setLoading] = useState(false);

  const videoRef = createRef();
  const [state, setState] = useState({ showControls: true });

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
      // console.log(seourl);
      // console.log(url);
      await axios.get(url).then(response => {
        setTitle(response.data.data.title);
        if (response.data.data.hasOwnProperty('channel_object'))
          setChannel(response.data.data.channel_object.name);
        if (response.data.data.hasOwnProperty('cbfc_rating'))
          setContentRating(response.data.data.cbfc_rating);
        if (response.data.data.hasOwnProperty('display_genres'))
          setDisplayGenres(response.data.data.display_genres.join(","));
        if (response.data.data.hasOwnProperty('description'))
          setDescription(response.data.data.description);
        // setContentId(response.data.data.content_id);
        // setCatalogId(response.data.data.catalog_id);

        var md5String = stringMd5(response.data.data.catalog_id + response.data.data.content_id + "" + currentTimestamp + SECRET_KEY)
        //console.log(response.data.data.content_id);
        axios.post(FIRETV_BASE_URL + "v2/users/get_all_details", {
          catalog_id: response.data.data.catalog_id,
          content_id: response.data.data.content_id,
          category: "",
          region: region,
          auth_token: VIDEO_AUTH_TOKEN,
          access_token: ACCESS_TOKEN,
          id: "",
          ts: currentTimestamp,
          md5: md5String
        }, {
          headers: {
            'Content-Type': 'application/json',
          }
        })
          .then(response => {
            if (response.data.data.stream_info.adaptive_url != "")
              setPlayUrl(response.data.data.stream_info.adaptive_url);
            else
              if (response.data.data.stream_info.preview.adaptive_url != "")
                setPlayUrl(response.data.data.stream_info.preview.adaptive_url);

            setLoading(false);
          }).catch(error => {
            console.log(JSON.stringify(error.response.data));
            setLoading(false);
          }
          )
        setLoading(false);
      }).catch(error => {
        setLoading(false);
      })
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
    setTimeout(function () { setState({ ...state, showControls: false }) }, 5000)
  }
  
  return (
    <View style={styles.mainContainer}>
      <ScrollView style={{ flex: 1 }} nestedScrollEnabled={true}>
        <View style={styles.container}>
          {playUrl ?
            <TouchableWithoutFeedback onPress={showControls}>
              <View>
                <Video
                  ref={videoRef}
                  source={{ uri: playUrl, type: 'm3u8' }}
                  controls={true}
                  paused={!play}
                  playInBackground={false}
                  volume={1}
                  bufferConfig={{
                    minBufferMs:250000,
                    maxBufferMs:500000,
                  }}
                  style={fullscreen ? styles.fullscreenVideo : styles.video}
                />
                {state.showControls && (
                  <View style={{ width: "100%", position: 'absolute', backgroundColor: BACKGROUND_TRANSPARENT_COLOR, height: 50 }}>
                    <TouchableOpacity
                      onPress={() => { fullscreen ? handleFullscreen() : navigation.navigate("Home") }}
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
              </View>
            </TouchableWithoutFeedback>

            :

            <View style={{ width: PAGE_WIDTH, height: 270, backgroundColor: "#000000", justifyContent: 'center', alignItems: 'center', flexDirection: 'row' }}>

              <TouchableOpacity
                onPress={() => { fullscreen ? handleFullscreen() : navigation.goBack() }}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                style={styles.navigationBack}>
                <MaterialCommunityIcons name="keyboard-backspace" size={25} color={NORMAL_TEXT_COLOR}></MaterialCommunityIcons>
              </TouchableOpacity>
              {loading ? <ActivityIndicator size={'large'} color={"#ffffff"}></ActivityIndicator> :

                <View style={{justifyContent: 'center', alignItems: 'center', flexDirection: 'row' }}>
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
    top: 20,
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
