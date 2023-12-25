import { StyleSheet, View, Text, ScrollView, Alert, TouchableOpacity, PermissionsAndroid, BackHandler, ActivityIndicator, Pressable, StatusBar, Platform, FlatList, Image, TouchableWithoutFeedback } from 'react-native';
import React, { useEffect, useState, createRef, useRef } from 'react';
import * as NavigationBar from "expo-navigation-bar";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ACCESS_TOKEN, AUTH_TOKEN, BACKGROUND_COLOR, BACKGROUND_TRANSPARENT_COLOR, COMMON_BASE_URL, DARKED_BORDER_COLOR, DETAILS_TEXT_COLOR, FIRETV_BASE_URL, FIRETV_BASE_URL_STAGING, FOOTER_DEFAULT_TEXT_COLOR, IMAGE_BORDER_COLOR, LAYOUT_TYPES, MORE_LINK_COLOR, NORMAL_TEXT_COLOR, PAGE_HEIGHT, PAGE_WIDTH, SECRET_KEY, TAB_COLOR, VIDEO_AUTH_TOKEN, VIDEO_TYPES, actuatedNormalize, } from '../constants';
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
import GoogleCast, { useRemoteMediaClient, } from 'react-native-google-cast';
import DeviceInfo from 'react-native-device-info';
import FastImage from 'react-native-fast-image';
import SwipeUpDown from 'react-native-swipe-up-down';
var isTablet = DeviceInfo.isTablet();
var relatedShows = [];
export default function Episode({ navigation, route }) {
  const { seoUrl, theme, showname, showcontentId, goto, suburl } = route.params;
  const [seourl, setSeourl] = useState(seoUrl);
  const [passedtheme, setpassedtheme] = useState(theme);
  const filterItems = (stringNeeded, arrayvalues) => {
    let query = stringNeeded.toLowerCase();
    return arrayvalues.filter(item => item.toLowerCase().indexOf(query) >= 0);
  }
  const [title, setTitle] = useState();
  const [channel, setChannel] = useState();
  const [contentRating, setContentRating] = useState();
  const [contentguidelines, setContentguidelines] = useState([]);
  const [displayGenres, setDisplayGenres] = useState([]);
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
  const [isResolutionModalVisible, setResolutionModalVisible] = useState(false);
  const [prefrence, setPreference] = useState([]);
  const [resolutionPreference, setResolutionPreference] = useState([]);
  const [isresumeDownloading, setIsresumeDownloading] = useState(false);
  const [currenttimestamp, setcurrenttimestamp] = useState("00:00:00");
  const [duration, setDuration] = useState("");
  const [currentloadingtime, setcurrentloadingtime] = useState(0);
  const [videoType, setvideoType] = useState('auto');
  const [videoresolution, setvideoresolution] = useState('1280');
  const [subcategoryImages, setsubcategoryImages] = useState([])
  const [seektime, setseektime] = useState();
  const [showsettingsicon, setshowsettingsicon] = useState(true);
  const [introstarttime, setintrostarttime] = useState("");
  const [introendtime, setintroendtime] = useState("");
  const [endcreditsstarttime, setendcreditsstarttime] = useState("");
  const [nextepisode, setnextepisode] = useState("");
  const [fullscreentap, setfullscreentap] = useState(false);
  const [contenttype, setcontenttype] = useState();
  const [contentprovider, setcontentprovider] = useState();
  const [contentvalue, setcontentvalue] = useState();
  const [contentlanguage, setcontentlanguage] = useState();
  const [seriesname, setseriesname] = useState();
  const [seriesid, setseriesid] = useState();
  const [streemexceedlimit, setstreemexceedlimit] = useState(false);
  const [streemexceedlimitmessage, setstreemexceedlimitmessage] = useState("Screen Limit Exceeded");
  const [loginrequired, setloginrequired] = useState(false);
  const [isfree, setisfree] = useState(false);
  const [relatedshows, setRelatedShows] = useState([]);
  const [totalHomeData, settotalHomeData] = useState([]);
  const [currentFriendlyId, setCurrentFriendlyId] = useState("");
  const [displayGuidelines, setDisplayGuidelines] = useState(true);
  const [subcatcurrentTheme, setsubcatcurrentTheme] = useState("");
  const [livetvshowstheme, setlivetvshowstheme] = useState("");
  const [durationsttring, setdurationsttring] = useState("");
  const [relatedMovies, setRelatedMovies] = useState([]);
  const swipeUpDownRef = useRef();

  var client = useRemoteMediaClient();
  const dataFetchedRef = useRef(false);

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };
  const toggleModalResolution = () => {
    setResolutionModalVisible(!isResolutionModalVisible);
  }

  const navigationConfig = async () => {
    // // Just incase it is not hidden
    // NavigationBar.setBackgroundColorAsync('red');
    if (Platform.OS = 'android')
      NavigationBar.setVisibilityAsync("hidden");
  };
  const navigationConfigVisible = async () => {
    if (Platform.OS = 'android')
      NavigationBar.setVisibilityAsync("visible");
  };
  const exitScreen = async () => {
    StatusBar.setHidden(false)
    { 
      !fullscreentap ? handleFullscreen() : checkgoback() 
    }
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
      const checkLive = filterItems('live', splittedData);
      const region = await AsyncStorage.getItem('country_code');
      var urlPath = "";
      var totalData = [];
      var sessionId = await AsyncStorage.getItem('session');
      if (splittedData.length == 4 && checkChannel.length == 0) {
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
      else if ((checkShow.length > 0 || checkEvent.length > 0) && checkLive.length == 0) {
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
      const relatedurl = urlPath + "/related.gzip?&auth_token=" + AUTH_TOKEN + "&region=" + region;
      //  console.log(seourl);
      await axios.get(url).then(response => {
        setTitle(response.data.data.title);
        setOfflineUrl(response.data.data.play_url.saranyu.url);
        setShareUrl(COMMON_BASE_URL + seourl);
        if (response.data.data.hasOwnProperty('channel_object'))
          setChannel(response.data.data.channel_object.name);
        if (response.data.data.hasOwnProperty('cbfc_rating'))
          setContentRating(response.data.data.cbfc_rating);
        if (response.data.data.hasOwnProperty('display_ott_guidelines'))
          setContentguidelines(response.data.data.display_ott_guidelines);
        if (response.data.data.hasOwnProperty('display_genres'))
          setDisplayGenres(response.data.data.display_genres);
        if (response.data.data.hasOwnProperty('description'))
          setDescription(response.data.data.description);
        if (response.data.data.hasOwnProperty('thumbnails'))
          setThumbnailImage(response.data.data.thumbnails.high_4_3.url);
        setContentId(response.data.data.content_id);
        setCatalogId(response.data.data.catalog_id);
        setintrostarttime(response.data.data.intro_start_time_sec);
        setintroendtime(response.data.data.intro_end_time_sec);
        setendcreditsstarttime(response.data.data.end_credits_start_time_sec)
        setnextepisode(response.data.data.next_item)
        setcontenttype(response.data.data.media_type)
        setcontentprovider(response.data.data.content_provider)
        setcontentvalue(response.data.data.content_value)
        setcontentlanguage(response.data.data.language)
        setloginrequired(response.data.data.access_control.login_required)
        setisfree(response.data.data.access_control.is_free)
        setdurationsttring(response.data.data.duration_string)
        if (response.data.data.hasOwnProperty('subcategory_object')) {
          setseriesname(response.data.data.subcategory_object.parentree.sub_name)
          setseriesid(response.data.data.subcategory_object.parentree.sub_id)
        }
        AsyncStorage.getItem("watchLater_" + response.data.data.content_id).then(resp => {
          if (resp != "" && resp != null)
            setwatchlatercontent(true);
        }).catch(erro => { })
        AsyncStorage.getItem("like_" + response.data.data.content_id).then(resp => {
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
          .then(resp => {
            checkOfflineDownload();
            setstreemexceedlimit(resp.data.data.stream_info.is_stream_limit_exceed)
            setstreemexceedlimitmessage(resp.data.data.stream_info.message);
            if (onlineplayUrl == false) {
              if (resp.data.data.stream_info.adaptive_url != "") {
                setPlayUrl(resp.data.data.stream_info.adaptive_url);
                setseektime(resp.data.data.stream_info.play_back_time);
                if (resp.data.data.access_control.login_required == true) {
                  if (sessionId == "" || sessionId == null) {
                    setPlayUrl("");
                  }
                  axios.get(FIRETV_BASE_URL_STAGING + "user/session/" + sessionId + "?auth_token=" + AUTH_TOKEN).then(resp => {
                    if (resp.data.message != 'Valid session id.') {
                      setPlayUrl("");
                    }
                  }).catch(err => {
                    setPlayUrl("");
                  })
                }
              }
              else
                if (resp.data.data.stream_info.preview.adaptive_url != "") {
                  setPlayUrl(resp.data.data.stream_info.preview.adaptive_url);
                  setPreview(true);
                }
            }
            setLoading(false);
          }).catch(error => {
            //console.log(JSON.stringify(error.response.data));
            setLoading(false);
          }
          )
        setCurrentFriendlyId(response.data.data.friendly_id)
        setsubcatcurrentTheme(response.data.data.theme)
        setlivetvshowstheme(passedtheme)
        if (passedtheme == 'live' || passedtheme == 'livetv') {
          axios.post(FIRETV_BASE_URL + "/get_all_shows?auth_token=" + AUTH_TOKEN + "&access_token=" + ACCESS_TOKEN, {
            friendly_id: response.data.data.friendly_id
          }).then(livetvshows => {
            //console.log(JSON.stringify(livetvshows.data.resp));
            if (livetvshows.data.resp.length >= 15)
              var counter = 15;
            else
              var counter = livetvshows.data.resp.length;
            for (var r = 0; r < counter; r++) {
              relatedShows.push({ "catalog_id": livetvshows.data.resp[r].catalog_id, "content_id": livetvshows.data.resp[r].content_id, "title": livetvshows.data.resp[r].title, "image": livetvshows.data.resp[r].high_4_3.url, "desc": livetvshows.data.resp[r].description });
            }
            setRelatedShows(relatedShows);
          }).catch(livetvshowserror => {
            console.log(livetvshowserror);
          })
        }


        setLoading(false);
      }).catch(error => {
        setLoading(false);
      })
      if (passedtheme != 'live' && passedtheme != 'livetv') {
        loadRelatedData(relatedurl);
      }
    }


    //ofline downloads
    let lostTasks = await RNBackgroundDownloader.checkForExistingDownloads();
    if (lostTasks.length > 0)
      setIsresumeDownloading(true);
  }
  const loadRelatedData = async (relatedurl) => {
    axios.get(relatedurl).then(resp => {
      var subcategorydata = [];
      for (var s = 0; s < resp.data.data.items.length; s++) {
        subcategorydata.push({ 'thumbnail': resp.data.data.items[s].thumbnails.medium_3_4.url, 'title': resp.data.data.items[s].title, 'date': resp.data.data.items[s].release_date_uts, 'premium': resp.data.data.items[s].access_control.is_free, 'theme': resp.data.data.items[s].theme, 'seo_url': resp.data.data.items[s].seo_url })
      }
      console.log(JSON.stringify(subcategorydata));
      setRelatedMovies(subcategorydata)
    }).catch(err => {
      console.log("related" + err);
    })
  }
  const getlivetvshows = async () => {
    console.log("hiiiioooooo");
    var relatedShows = [];
    await axios.post(FIRETV_BASE_URL + "/get_all_shows?auth_token=" + AUTH_TOKEN + "&access_token=" + ACCESS_TOKEN, {
      friendly_id: currentFriendlyId
    }).then(livetvshows => {
      //console.log(JSON.stringify(livetvshows.data.resp));
      if (livetvshows.data.resp.length >= 15)
        var counter = 15;
      else
        var counter = livetvshows.data.resp.length;
      for (var r = 0; r < counter; r++) {
        relatedShows.push({ "catalog_id": livetvshows.data.resp[r].catalog_id, "content_id": livetvshows.data.resp[r].content_id, "title": livetvshows.data.resp[r].title, "image": livetvshows.data.resp[r].high_4_3.url, "desc": livetvshows.data.resp[r].description });
      }
      setRelatedShows(relatedShows);
    }).catch(livetvshowserror => {
      console.log(livetvshowserror);
    })

  }
  const getsubcatDetails = async () => {
    console.log("hi");
    var totalData = [];
    const region = await AsyncStorage.getItem('country_code');
    await axios.get(FIRETV_BASE_URL_STAGING + "catalog_lists/movie-videolists?auth_token=" + VIDEO_AUTH_TOKEN + "&access_token=" + ACCESS_TOKEN + "&item_language=eng&region=" + region + "&parent_id=" + contentId).then(resp => {
      if (resp.data.data.catalog_list_items.length > 10)
        var len = 10;
      else
        var len = resp.data.data.catalog_list_items.length;

      for (var o = 0; o < len; o++) {
        var subcategorydata = [];
        if (resp.data.data.catalog_list_items[o].catalog_list_items.length > 10)
          var len1 = 10;
        else
          var len1 = resp.data.data.catalog_list_items[o].catalog_list_items.length;

        for (var s = 0; s < len1; s++) {
          subcategorydata.push({ 'thumbnail': resp.data.data.catalog_list_items[o].catalog_list_items[s].thumbnails.high_4_3.url, 'title': resp.data.data.catalog_list_items[o].catalog_list_items[s].title, 'premium': resp.data.data.catalog_list_items[o].catalog_list_items[s].access_control.is_free, 'theme': resp.data.data.catalog_list_items[o].catalog_list_items[s].theme, 'seo_url': resp.data.data.catalog_list_items[o].catalog_list_items[s].seo_url, 'short_description': resp.data.data.catalog_list_items[o].catalog_list_items[s].description, 'item_type': resp.data.data.catalog_list_items[o].theme })
        }
        totalData.push({ 'display_title': resp.data.data.catalog_list_items[o].display_title, 'item_type': resp.data.data.catalog_list_items[o].theme, 'thumbnails': subcategorydata, 'friendlyId': resp.data.data.catalog_list_items[o].friendly_id, 'parent_id': contentId })
        setsubcategoryImages([...subcategoryImages, totalData])
      }
    }).catch(err => {
      console.log(err);
    })
  }

  async function getLiveTvData() {
    var All = [];
    var Final = [];
    var definedPageName = "live";
    var premiumContent = false;
    var premiumCheckData = "";
    const region = await AsyncStorage.getItem('country_code');
    const url = FIRETV_BASE_URL + "/catalog_lists/" + definedPageName + ".gzip?item_language=eng&region=" + region + "&auth_token=" + AUTH_TOKEN + "&access_token=" + ACCESS_TOKEN + "&page=0&page_size=100&npage_size=100";
    const resp = await fetch(url);
    const data = await resp.json();
    if (data.data.catalog_list_items.length > 0) {
      for (var i = 0; i < data.data.catalog_list_items.length; i++) {
        if (data.data.catalog_list_items[i].hasOwnProperty('access_control')) {
          premiumCheckData = (data.data.catalog_list_items[i].access_control);
          if (premiumCheckData != "") {
            if (premiumCheckData['is_free']) {
              premiumContent = false;
            }
            else {
              premiumContent = true;
            }
          }
        }
        var displayTitle = data.data.catalog_list_items[i].title
        if (displayTitle.length > 19)
          displayTitle = displayTitle.substr(0, 19) + "\u2026";


        if (definedPageName == 'live') {


          if (data.data.catalog_list_items[i].thumbnails.hasOwnProperty('high_4_3') || data.data.catalog_list_items[i].thumbnails.hasOwnProperty('high_3_4') || data.data.catalog_list_items[i].thumbnails.hasOwnProperty('high_16_9')) {
            if (data.data.catalog_list_items[i].layout_type == "top_banner")
              All.push({ "uri": data.data.catalog_list_items[i].thumbnails.high_3_4.url, "theme": data.data.catalog_list_items[i].theme, "premium": premiumContent, "seoUrl": data.data.catalog_list_items[i].seo_url, "medialistinlist": data.data.catalog_list_items[i].media_list_in_list, "friendlyId": data.data.catalog_list_items[i].friendly_id, "displayTitle": "" });
            else
              if (data.data.catalog_list_items[i].layout_type == "tv_shows" || data.data.catalog_list_items[i].layout_type == "show")
                All.push({ "uri": data.data.catalog_list_items[i].thumbnails.high_3_4.url, "theme": data.data.catalog_list_items[i].theme, "premium": premiumContent, "seoUrl": data.data.catalog_list_items[i].seo_url, "medialistinlist": data.data.catalog_list_items[i].media_list_in_list, "friendlyId": data.data.catalog_list_items[i].friendly_id, "displayTitle": "" });
              else
                if (data.data.catalog_list_items[i].layout_type == "tv_shows_banner")
                  All.push({ "uri": data.data.catalog_list_items[i].thumbnails.high_4_3.url, "theme": data.data.catalog_list_items[i].theme, "premium": premiumContent, "seoUrl": data.data.catalog_list_items[i].seo_url, "medialistinlist": data.data.catalog_list_items[i].media_list_in_list, "friendlyId": data.data.catalog_list_items[i].friendly_id, "displayTitle": "" });
                else
                  All.push({ "uri": data.data.catalog_list_items[i].thumbnails.high_3_4.url, "theme": data.data.catalog_list_items[i].theme, "premium": premiumContent, "seoUrl": data.data.catalog_list_items[i].seo_url, "medialistinlist": data.data.catalog_list_items[i].media_list_in_list, "friendlyId": data.data.catalog_list_items[i].friendly_id, "displayTitle": displayTitle });


          }
        }
      }
      Final.push({ "friendlyId": data.data.friendly_id, "data": All, "layoutType": data.data.layout_type, "displayName": data.data.display_title });
      All = [];
    }
    console.log(JSON.stringify(Final));
    settotalHomeData(Final);
  }

  const triggeranalytics = async (name, sec) => {
    var chromeCastConnected = 0;
    GoogleCast.getCastState().then(state => {
      if (state == 'connected') {
        chromeCastConnected = 1;
      }
      else {
        chromeCastConnected = 0;
      }
    })
    const uniqueid = await DeviceInfo.getUniqueId();
    const sessionId = await AsyncStorage.getItem('session');
    const user_id = await AsyncStorage.getItem('user_id');
    sdk.trackEvent(name, {
      content_provider: contentprovider,
      consumption_type: downloadedStatus == 1 ? "Offline" : "Online",
      content_type: contenttype,
      content_value: contentvalue,
      chromecast: chromeCastConnected,
      device_id: uniqueid,
      genre: displayGenres,
      quality: videoresolution,
      source: 'banner',
      show_name: showname,
      show_id: showcontentId,
      series_name: seriesname,
      series_id: seriesid,
      session_id: sessionId,
      tray_name: "",
      u_id: user_id,
      value: sec,
      video_id: contentId,
      video_name: title,
      video_language: contentlanguage,
      subtitles: 'none'
    });
  }
  const triggerOtherAnalytics = async (name, obj) => {
    sdk.trackEvent(name, obj);
  }

  const checkOfflineDownload = async () => {
    var sessionId = await AsyncStorage.getItem('session');
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
        if (downloadpercent == '100' && sessionId != "" && sessionId != null) {
          setDownloadedStatus(1)
          setPlayUrl(downloaddirectory)
          setOnlinePlayUrl(true)
          setshowsettingsicon(false);
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
    if (dataFetchedRef.current) return;
    dataFetchedRef.current = true;
    loadData()
    if (passedtheme == 'live' || passedtheme == 'livetv')
      getLiveTvData()
    if (fullscreen) {
      navigationConfig();
    }
    else {
      navigationConfigVisible();
    }
    setTimeout(function () {
      setDisplayGuidelines(false);
    }, 10000);
  })
  useEffect(() => {
    Orientation.getDeviceOrientation((orientation) => {
      if (orientation === 'LANDSCAPE-LEFT') {
        setFullscreen(true);
        StatusBar.setHidden(true)
        Orientation.lockToLandscapeLeft();
        return true;
      }
      else
        if (orientation === 'LANDSCAPE-RIGHT') {
          setFullscreen(true);
          StatusBar.setHidden(true)
          Orientation.lockToLandscapeRight();
          return true;
        }

      if (!fullscreentap) {
        if (orientation === 'PORTRAIT' || orientation === 'UNKNOWN' || orientation === '') {
          setFullscreen(false);
          StatusBar.setHidden(false)
          Orientation.lockToPortrait();
          return true;
        }
      }
    })
    BackHandler.addEventListener('hardwareBackPress', exitScreen);
  }, [subcatcurrentTheme, livetvshowstheme, relatedMovies])
  function handleFullscreen() {
    setfullscreentap(!fullscreentap);
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
    if (goto != '' && goto != null) {
      navigation.dispatch(StackActions.replace(goto))
    }
    else {
      if (navigation.canGoBack())
        navigation.goBack()
      else
        navigation.dispatch(StackActions.replace('Home', { pageFriendlyId: 'featured-1' }))
    }
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

  const startDownloading = async (playback_url, offlineUrl, downloaddirectory, downloadquality) => {
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
      // console.log(`Going to download ${expectedBytes} bytes!`);
      toggleModal()
    }).progress((percent) => {
      let jsonObj = { "content_type": contenttype, "video_name": title, "genre": displayGenres, "video_language": contentlanguage, "download_quality": downloadquality, "source": "source", "percentage_downloaded": `${percent * 100}` };
      triggerOtherAnalytics('download_video', jsonObj)

      AsyncStorage.setItem('download_' + splittedOfflineUrl[splittedOfflineUrl.length - 1], JSON.stringify(percent * 100));
      // console.log(`Downloaded: ${percent * 100}%`);
    }).done(() => {
      AsyncStorage.setItem('download_' + splittedOfflineUrl[splittedOfflineUrl.length - 1], JSON.stringify(1 * 100));
      setDownloadedStatus(1)
      // console.log('Download is done!');
    }).error((error) => {
      // console.log('Download canceled due to error: ', error);
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
    await toHoursAndMinutes(0);
    await playnextitem();
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
        let jsonObj = { "content_type": contenttype, "video_name": title, "genre": displayGenres, "video_language": contentlanguage };
        triggerOtherAnalytics('watch_later', jsonObj);
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

  const toHoursAndMinutes = async (totalSeconds) => {
    Orientation.getDeviceOrientation((orientation) => {
      if (orientation === 'LANDSCAPE-LEFT') {
        setFullscreen(true);
        StatusBar.setHidden(true)
        Orientation.lockToLandscapeLeft();
      }
      else
        if (orientation === 'LANDSCAPE-RIGHT') {
          setFullscreen(true);
          StatusBar.setHidden(true)
          Orientation.lockToLandscapeRight();
        }

      if (!fullscreentap) {
        if (orientation === 'PORTRAIT' || orientation === 'UNKNOWN' || orientation === '') {
          setFullscreen(false);
          StatusBar.setHidden(false)
          Orientation.lockToPortrait();
        }
      }
    })

    const totalMinutes = Math.floor(totalSeconds / 60);

    var seconds = totalSeconds % 60;
    var hours = Math.floor(totalMinutes / 60);
    var minutes = totalMinutes % 60;
    seconds = String(seconds).padStart(2, '0');
    hours = String(hours).padStart(2, '0');
    minutes = String(minutes).padStart(2, '0');
    var timestamp = hours + ":" + minutes + ":" + seconds;
    if (state.showControls) {
      setcurrenttimestamp(timestamp);
      setcurrentloadingtime(totalSeconds);
    }
    if (totalSeconds % 60 == 0) {
      triggeranalytics("pb_end", totalSeconds);
    }
    if ((totalSeconds % 30) == 0) {
      var sessionId = await AsyncStorage.getItem('session');
      if (sessionId != "" && sessionId != null && timestamp != "" && timestamp != null) {
        const watchhistorybaseurl = await AsyncStorage.getItem('watchhistory_api');
        await axios.post(watchhistorybaseurl + "users/" + sessionId + "/playlists/watchhistory", {
          listitem: {
            catalog_id: catalogId, content_id: contentId, like_count: "true", play_back_status: "playing",
            play_back_time: timestamp
          },
          auth_token: VIDEO_AUTH_TOKEN,
          access_token: ACCESS_TOKEN
        }, {
          headers: {
            'Content-Type': 'application/json',
          }
        }).then(response => {
          console.log(JSON.stringify(response.data));
        }).catch(error => {
          console.log(error);
        })
      }
    }
  }
  const loadResolutionSettings = async () => {
    var resolution = []
    var settingsapi = offlineUrl + "?service_id=6&play_url=yes&protocol=hls&us=745d7e9f1e37ca27fdffbebfe8a99877";
    await axios.get(settingsapi).then(response => {
      for (let o = 0; o < response.data.playback_urls.length; o++) {
        var displayname = response.data.playback_urls[o].display_name.split('-');
        const found = resolution.some(el => el.display_name === displayname[0]);
        if (!found) {
          resolution.push({ "display_name": displayname[0], "vwidth": response.data.playback_urls[o].vwidth, "vheight": response.data.playback_urls[o].vheight })
        }
      }
      setResolutionPreference(resolution);
      toggleModalResolution()
    }).catch(error => { })
  }
  const setVideoResolution = async (type, resolution) => {
    setvideoType(type);
    setvideoresolution(resolution);
    toggleModalResolution();
  }

  function renderSubcat({ item }) {

    return (
      <View style={{ textAlign: 'left', justifyContent: 'flex-start', alignItems: 'flex-start' }}>
        {item.map((subcat, i) => {
          return (
            <View style={{ textAlign: 'left', justifyContent: 'flex-start', alignItems: 'flex-start', width: "100%", marginBottom: 20 }} key={'main' + i}>
              {subcat.thumbnails.length > 0 ?
                <View style={{ textAlign: 'left', justifyContent: 'flex-start', alignItems: 'flex-start' }}>
                  <Text style={{ color: NORMAL_TEXT_COLOR, marginLeft: 5, fontSize: 18, marginBottom: 10, textAlign: 'left', justifyContent: 'flex-start', alignItems: 'flex-start', fontWeight: '600' }} key={'heading' + i}>{subcat.display_title}</Text>
                </View> : ""}

              <FlatList
                data={subcat.thumbnails}
                keyExtractor={(x, i) => i.toString()}
                renderItem={(items, index) => {
                  return (
                    <View style={{ marginBottom: 20 }} key={'innerkey' + index}>
                      <View>
                        {VIDEO_TYPES.includes(items.item.theme) ?
                          <Pressable onPress={() => navigation.navigate({ name: 'Episode', params: { seoUrl: items.item.seo_url, theme: "videolist", suburl: seourl }, key: { index } })}>
                            <FastImage resizeMode={FastImage.resizeMode.contain} key={'image' + index} style={styles.imageSectionHorizontal} source={{ uri: items.item.thumbnail, priority: FastImage.priority.high, cache: FastImage.cacheControl.immutable, }} />

                            <View style={{ width: "100%", backgroundColor: DARKED_BORDER_COLOR, position: 'absolute', bottom: 0, borderRadius: 8, alignItems: 'flex-start', justifyContent: 'center', padding: 5 }}>
                              <Text style={{ color: NORMAL_TEXT_COLOR, fontSize: 15, fontWeight: '500' }}>{items.item.title}</Text>
                              <ReadMore numberOfLines={2} style={{ color: FOOTER_DEFAULT_TEXT_COLOR, fontSize: 12, fontWeight: '500' }} seeMoreText="" seeMoreStyle={{ color: FOOTER_DEFAULT_TEXT_COLOR, fontWeight: 'bold' }} seeLessStyle={{ color: FOOTER_DEFAULT_TEXT_COLOR, fontWeight: 'bold' }}>
                                <Text style={{}}>{items.item.short_description}</Text>
                              </ReadMore>
                            </View>

                          </Pressable>
                          :
                          <Pressable onPress={() => navigation.navigate({ name: 'Shows', params: { seoUrl: items.item.seo_url, theme: "videolist", suburl: seourl }, key: { index } })}><FastImage resizeMode={FastImage.resizeMode.contain} key={'image' + index} style={styles.imageSectionHorizontal} source={{ uri: items.item.thumbnail, priority: FastImage.priority.high, cache: FastImage.cacheControl.immutable, }} />

                            <View style={{ width: "100%", backgroundColor: DARKED_BORDER_COLOR, position: 'absolute', bottom: 0, borderRadius: 8, alignItems: 'flex-start', justifyContent: 'center', padding: 5 }}>
                              <Text style={{ color: NORMAL_TEXT_COLOR, fontSize: 15, fontWeight: '500' }}>{items.item.title}</Text>
                              <ReadMore numberOfLines={2} style={{ color: FOOTER_DEFAULT_TEXT_COLOR, fontSize: 12, fontWeight: '500' }} seeMoreText="" seeMoreStyle={{ color: FOOTER_DEFAULT_TEXT_COLOR, fontWeight: 'bold' }} seeLessStyle={{ color: FOOTER_DEFAULT_TEXT_COLOR, fontWeight: 'bold' }}>
                                <Text style={{}}>{items.item.short_description}</Text>
                              </ReadMore>
                            </View>


                          </Pressable>
                        }
                      </View>
                      <View style={VIDEO_TYPES.includes(items.item.theme) ? { width: PAGE_WIDTH / 2.06 } : ""}>
                        {subcat.display_title == 'Episodes' ?
                          <View style={{ justifyContent: 'center', }}><Text style={{ color: NORMAL_TEXT_COLOR, marginLeft: 5, fontSize: 12 }}>{items.item.title} </Text></View> : ""
                        }
                      </View>
                    </View>
                  )
                }}
              ></FlatList>

              {subcat.name != 'related' ?
                <Pressable style={{ width: "100%", justifyContent: 'center', alignItems: 'center', backgroundColor: DARKED_BORDER_COLOR, padding: 10, marginTop: -20 }} onPress={() => navigation.navigate('EpisodesMoreList', { firendlyId: subcat.friendlyId, layoutType: LAYOUT_TYPES[1], parent_id: subcat.parent_id })}>
                  <Text style={styles.sectionHeaderMore}>Load more ...</Text>
                </Pressable> : ""}
            </View>
          )
        })}
      </View>
    )
  }

  const playnextitem = async () => {
    const session = await AsyncStorage.getItem('session');
    const region = await AsyncStorage.getItem('country_code');
    var nextitem = FIRETV_BASE_URL_STAGING + "/catalogs/" + catalogId + "/items/" + contentId + "/next_item?auth_token=" + AUTH_TOKEN + "&access_token=" + ACCESS_TOKEN + "&region=" + region + "&item_language=eng";
    axios.get(nextitem).then(response => {
      navigation.replace('Episode', { seoUrl: response.data.data.seo_url, theme: 'episode' });
    }).catch(error => { })
  }
  const gotoPage = async (full_catalog_id, full_content_id) => {
    const region = await AsyncStorage.getItem('country_code');
    var urlPath = FIRETV_BASE_URL + "catalogs/" + full_catalog_id + "/items/" + full_content_id + ".gzip?&auth_token=" + AUTH_TOKEN + "&region=" + region;
    // console.log(urlPath);
    axios.get(urlPath).then(response => {
      navigation.dispatch(StackActions.replace('Shows', { seoUrl: response.data.data.seo_url, theme: response.data.data.theme }))
    }).catch(error => {
      console.log(error);
    })
  }
  const renderShows = (item, index) => {
    return (
      <TouchableOpacity onPress={() => gotoPage(item.item.catalog_id, item.item.content_id)} key={"RealtedShows" + index} style={{ justifyContent: 'center', alignItems: 'center', marginBottom: 30, width: "100%" }}>
        <FastImage source={{ uri: item.item.image, priority: FastImage.priority.high, cache: FastImage.cacheControl.immutable, }} style={isTablet ? styles.imageSectionVerticalTab : styles.imageSectionHorizontal} resizeMode={FastImage.resizeMode.contain} />
        {!isTablet ?
          <View style={{ width: "100%", backgroundColor: DARKED_BORDER_COLOR, position: 'absolute', bottom: 0, borderRadius: 8, alignItems: 'flex-start', justifyContent: 'center', padding: 5 }}>
            <Text style={{ color: NORMAL_TEXT_COLOR, fontSize: 15, fontWeight: '500' }}>{item.item.title}</Text>
            <ReadMore numberOfLines={2} style={{ color: FOOTER_DEFAULT_TEXT_COLOR, fontSize: 12, fontWeight: '500' }} seeMoreText="" seeMoreStyle={{ color: FOOTER_DEFAULT_TEXT_COLOR, fontWeight: 'bold' }} seeLessStyle={{ color: FOOTER_DEFAULT_TEXT_COLOR, fontWeight: 'bold' }}>
              <Text style={{}}>{item.item.desc}</Text>
            </ReadMore>
          </View>
          :
          ""}
      </TouchableOpacity>
    )
  }


  const renderItem = ({ item, index }) => {
    return (
      <View style={{ backgroundColor: BACKGROUND_COLOR, }}>
        {item.layoutType == 'live' && item.data.length != 0 ?
          <View>
            <FlatList
              data={item.data}
              keyExtractor={(x, i) => i.toString()}
              horizontal={true}
              showsHorizontalScrollIndicator={false}
              style={styles.containerMargin}
              renderItem={
                ({ item, index }) =>
                  <Pressable onPress={() => {
                    VIDEO_TYPES.includes(item.theme) ?
                      navigation.dispatch(StackActions.replace('Episode', { seoUrl: item.seoUrl, theme: item.theme })) : navigation.dispatch(StackActions.replace('Shows', { seoUrl: item.seoUrl }))
                  }}>
                    {currentFriendlyId != item.friendlyId ?
                      <>
                        <FastImage
                          style={[styles.imageSectionVertical,]}
                          resizeMode={FastImage.resizeMode.contain}
                          source={{ uri: item.uri, priority: FastImage.priority.high, cache: FastImage.cacheControl.immutable, }} />
                        {VIDEO_TYPES.includes(item.theme) ? <Image source={require('../assets/images/play.png')} style={{ position: 'absolute', width: 25, height: 25, right: 15, bottom: 15 }}></Image> : ""}
                        {item.premium ? <Image source={require('../assets/images/crown.png')} style={styles.crownIcon}></Image> : ""}
                      </>
                      : ""}
                  </Pressable>
              }
            />
          </View>
          : ""}
      </View>
    );
  }

  const renderRelatedMovies = ({ item, index }) => {
    return (
      <>
        <Pressable style={{ width: "33%", marginBottom: 20 }} onPress={() =>
          VIDEO_TYPES.includes(item.theme) ?
            navigation.navigate({ name: 'Episode', params: { seoUrl: item.seo_url }, key: { index } })
            :
            navigation.navigate({ name: 'Shows', params: { seoUrl: item.seo_url }, key: { index } })

        }>
          <FastImage resizeMode={FastImage.resizeMode.contain} key={'image' + index} style={styles.imageSectionVertical} source={{ uri: item.thumbnail, priority: FastImage.priority.high, cache: FastImage.cacheControl.immutable, }} />
        </Pressable>
      </>
    )
  }


  return (
    <View style={styles.mainContainer}>
      <ScrollView style={{ flex: 1, flexGrow: 1, }} nestedScrollEnabled={true} horizontal={false}>
        <View style={styles.container}>
          {playUrl != "" && playUrl != null && streemexceedlimit == false && !showupgrade ?

            <Pressable onPress={showControls} >
              <Video
                ref={videoRef}
                source={{ uri: playUrl }}
                controls={false}
                paused={!play}
                playInBackground={false}
                volume={1}
                selectedVideoTrack={{
                  type: videoType,
                  value: videoresolution
                }}
                bufferConfig={{
                  minBufferMs: 1000000,
                  maxBufferMs: 2000000,
                  bufferForPlaybackMs: 7000
                }}
                rate={1.0}
                resizeMode={fullscreen ? 'contain' : 'none'}
                style={fullscreen ? styles.fullscreenVideo :
                  isTablet ?
                    styles.videoTab
                    :
                    styles.video
                }
                onEnd={checkpreviewContent}
                playWhenInactive={false}
                progressUpdateInterval={1000}
                onProgress={play => {
                  var milliseconds = play.currentTime;
                  toHoursAndMinutes(Math.floor(milliseconds));
                }}
                onLoad={(data) => {
                  setDuration(data.duration)
                  triggeranalytics("pb_start", 1);
                  if (seektime != "" && seektime != null && data != '' && data != null) {
                    var splittedtime = seektime.split(":");
                    videoRef.current.seek(+(splittedtime[0] * 3600) + +(splittedtime[1] * 60) + +(splittedtime[2]));
                  }

                  GoogleCast.getCastState().then(state => {
                    if (state == 'connected' && playUrl != "") {

                      if (!client) {
                        GoogleCast.getDiscoveryManager()
                      }
                      console.log('client changed ', client)
                      const started = client?.onMediaPlaybackStarted(() =>
                        console.log("playback started")
                      );
                      const ended = client?.onMediaPlaybackEnded(() =>
                        console.log("playback ended")
                      );
                      if (client && playUrl != "" && playUrl != null) {
                        client?.loadMedia({
                          mediaInfo: {
                            contentUrl:
                              playUrl,
                          },
                        })
                      }

                    }
                  })


                }}
              />
              {state.showControls && (
                <View style={{ width: "100%", position: 'absolute', backgroundColor: BACKGROUND_TRANSPARENT_COLOR, height: 60 }}>
                  {preview ?
                    <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: 35 }}><Text style={{ color: NORMAL_TEXT_COLOR }}>You are watching Trailer</Text></View>
                    :
                    ""}
                  <TouchableOpacity
                    onPress={() => { fullscreen ? handleFullscreen() : checkgoback() }}
                    hitSlop={{ top: 35, bottom: 10, left: 10, right: 10 }}
                    style={styles.navigationBack}>
                    <MaterialCommunityIcons name="keyboard-backspace" size={25} color={NORMAL_TEXT_COLOR}></MaterialCommunityIcons>
                  </TouchableOpacity>

                  {displayGuidelines && (
                    <>
                      <Text style={{ color: NORMAL_TEXT_COLOR, fontSize: 15, fontWeight: 'bold', position: 'absolute', top: 60, left: 20 }}>Rated : {contentRating}</Text>
                      <View style={{ flexDirection: 'row', position: 'absolute', top: 85, left: 20 }}>
                        {
                          contentguidelines.map((sub, ind) => {
                            return (
                              <Text key={ind} style={{ color: NORMAL_TEXT_COLOR, fontSize: 10, fontWeight: 'bold', }}>{sub},</Text>
                            )
                          })
                        }
                      </View>
                    </>)}

                  {showsettingsicon ?
                    <TouchableOpacity
                      onPress={loadResolutionSettings}
                      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                      style={styles.settingsicon}>
                      <Ionicons name="settings" size={25} color={NORMAL_TEXT_COLOR}></Ionicons>
                    </TouchableOpacity>
                    :
                    ""}

                  <TouchableOpacity
                    onPress={handleFullscreen}
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                    style={styles.fullscreenButton}>
                    {fullscreen ? <Feather name="minimize-2" size={25} color={NORMAL_TEXT_COLOR}></Feather> : <Feather name="maximize-2" size={25} color={NORMAL_TEXT_COLOR}></Feather>}
                  </TouchableOpacity>
                </View>
              )}

              <View style={{ position: 'absolute', right: 20, bottom: 80 }}>
                {introstarttime != "" && introstarttime != null && !preview && introstarttime <= currentloadingtime && introendtime >= currentloadingtime ?
                  <TouchableOpacity onPress={() => { videoRef.current.seek(introendtime) }} style={{ backgroundColor: DETAILS_TEXT_COLOR, padding: 5, borderRadius: 10 }}>
                    <Text style={{ fontWeight: 'bold' }}>Skip Intro</Text>
                  </TouchableOpacity>
                  :
                  ""}
              </View>

              <View style={{ position: 'absolute', right: 20, bottom: 80 }}>
                {endcreditsstarttime != "" && endcreditsstarttime != null && !preview && endcreditsstarttime <= currentloadingtime ?
                  <TouchableOpacity onPress={playnextitem} style={{ backgroundColor: DETAILS_TEXT_COLOR, padding: 5, borderRadius: 10 }}>
                    <Text style={{ fontWeight: 'bold' }}>Play Next</Text>
                  </TouchableOpacity>
                  :
                  ""}
              </View>

              {state.showControls && (
                <View style={{ width: "100%", position: 'absolute', top: "40%", flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                  {passedtheme != 'live' && passedtheme != 'livetv' ?
                    <>
                      <TouchableOpacity
                        onPress={() => {
                          videoRef.current.seek(currentloadingtime - 10)
                          setState({ ...state, showControls: true });
                        }}
                        style={{ marginRight: 50 }}>
                        <Ionicons name="md-caret-back-circle-sharp" size={40} color={NORMAL_TEXT_COLOR}></Ionicons>
                      </TouchableOpacity>

                      <TouchableOpacity
                        onPress={() => { setPlay(!play); setState({ ...state, showControls: true }); }}
                        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                        style={{ right: 10, left: 10, width: "10%" }}>
                        {play ?
                          <MaterialCommunityIcons name="pause-circle" size={35} color={NORMAL_TEXT_COLOR} />
                          :
                          <MaterialCommunityIcons name="play-circle" size={35} color={NORMAL_TEXT_COLOR} />
                        }
                      </TouchableOpacity>

                      <TouchableOpacity
                        onPress={() => {
                          console.log(currentloadingtime);
                          videoRef.current.seek(currentloadingtime + 10)
                          setState({ ...state, showControls: true });
                        }}
                        style={{ marginLeft: 50 }}>
                        <Ionicons name="md-caret-forward-circle-sharp" size={40} color={NORMAL_TEXT_COLOR}></Ionicons>
                      </TouchableOpacity>
                    </>
                    :
                    ""}
                </View>
              )}
              {/* {thumbImage ? */}
              {/* <View style={{ width: 64, height: 64, overflow: 'hidden' }}>
                <Image
                  // source={{uri:thumbImage}}
                  source={{ uri: "https://etvwin-s3.akamaized.net/6529227449882c24b7c3d508/myvideofile/myvideofile_sprite.png" }}
                  style={{
                    width: "100%",
                    height:50
                        }}
                  resizeMode='contain'
                />
              </View> */}

              {/* :
                    ""} */}
              {state.showControls && (
                <>

                  <View style={{ width: "100%", position: 'absolute', backgroundColor: BACKGROUND_TRANSPARENT_COLOR, height: 60, bottom: 0, flexDirection: 'row' }}>
                    <View style={passedtheme != 'live' && passedtheme != 'livetv' ? { width: "85%", top: 20 } : { width: "100%", top: 20 }}>
                      <Slider
                        style={{ width: "100%", height: 40 }}
                        minimumValue={0}
                        maximumValue={Math.floor(duration)}
                        minimumTrackTintColor={TAB_COLOR}
                        maximumTrackTintColor={NORMAL_TEXT_COLOR}
                        tapToSeek={true}
                        value={currentloadingtime}
                        onSlidingComplete={val => {
                          videoRef.current.seek(Math.floor(val))
                        }}
                        onValueChange={val => {
                          //getThumbnailImage(Math.round(val));
                        }}
                        animateTransitions={true}
                        disabled={passedtheme != 'live' && passedtheme != 'livetv' ? false : true}
                      />
                    </View>
                    {passedtheme != 'live' && passedtheme != 'livetv' ?
                      <View style={{ top: 30, width: "15%", right: 5 }}>
                        <Text style={{ color: "#ffffff", fontSize: 11 }}>
                          {currenttimestamp}
                        </Text>
                      </View>
                      : ""}
                  </View>
                </>
              )}
            </Pressable>


            :

            <View style={{ width: PAGE_WIDTH, height: 270, backgroundColor: "#000000", justifyContent: 'center', alignItems: 'center', flexDirection: 'row' }}>

              <TouchableOpacity
                onPress={() => { fullscreen ? handleFullscreen() : checkgoback() }}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                style={styles.navigationBack}>
                <MaterialCommunityIcons name="keyboard-backspace" size={25} color={NORMAL_TEXT_COLOR}></MaterialCommunityIcons>
              </TouchableOpacity>
              {loading ? <ActivityIndicator size={'large'} color={"#ffffff"}></ActivityIndicator> :

                streemexceedlimit == true ?
                  <TouchableOpacity style={[styles.button, { width: 200 }]}><Text style={{ color: NORMAL_TEXT_COLOR, fontSize: 16 }}>{streemexceedlimitmessage}</Text></TouchableOpacity>
                  :
                  loggedin ? <TouchableOpacity onPress={() => navigation.navigate('Subscribe')} style={[styles.button, { width: 200 }]}><Text style={{ color: NORMAL_TEXT_COLOR, fontSize: 16 }}>Upgrade / Subscribe</Text></TouchableOpacity>
                    :
                    <View style={{ justifyContent: 'center', alignItems: 'center', flexDirection: 'row' }}>
                      <TouchableOpacity onPress={() => navigation.navigate('Login')} style={styles.button}><Text style={{ color: NORMAL_TEXT_COLOR, fontSize: 16 }}>LOGIN</Text></TouchableOpacity>

                      <TouchableOpacity onPress={() => navigation.navigate('Signup')} style={styles.button}><Text style={{ color: NORMAL_TEXT_COLOR, fontSize: 16 }}>SIGN UP</Text></TouchableOpacity>
                    </View>

              }
            </View>

          }

          {!fullscreen ?
            <View style={styles.bodyContent}>
              <View style={styles.marginContainer}>
                <Text style={styles.headingLabel}>
                  <Text style={[{ color: TAB_COLOR, fontWeight: 'bold', }]}>| </Text>
                  {title}</Text>
                <View style={{ flexDirection: 'row' }}>
                  {channel ? <Text style={styles.detailsText}>{channel} - {contentRating}</Text> : ""}
                  {displayGenres.map((resp, index) => {

                    return (
                      <View key={index} style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginLeft: 5 }}>
                        <FontAwesome5 name='dot-circle' size={10} color={TAB_COLOR} />
                        <Text key={index} style={[styles.detailsText, { color: TAB_COLOR, fontWeight: 'bold', }]}>{resp}</Text>
                      </View>
                    )

                  })}
                  {durationsttring ? <Text style={styles.detailsText}> - {' '} {durationsttring}</Text> : ""}
                </View>
                <ReadMore numberOfLines={5} style={styles.detailsText} seeMoreText="Read More" seeMoreStyle={{ color: TAB_COLOR, fontWeight: 'bold' }} seeLessStyle={{ color: TAB_COLOR, fontWeight: 'bold' }}>
                  <Text style={styles.detailsText}>{description}</Text>
                </ReadMore>
              </View>

              {!loading ?
                <View style={styles.options}>
                  <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginRight: 8 }}>
                    <View style={styles.singleoption}>
                      {!likecontent ?
                        <Pressable onPress={likeContent}><MaterialIcons name="thumb-up-off-alt" size={18} color={NORMAL_TEXT_COLOR} /></Pressable>
                        :
                        <Pressable onPress={() => deleteLike(catalogId, contentId)}><MaterialIcons name="thumb-up" size={18} color={NORMAL_TEXT_COLOR} /></Pressable>
                      }
                    </View>
                    <Text style={{ color: NORMAL_TEXT_COLOR, fontSize: 12 }}>Like</Text>
                  </View>
                  <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginRight: 8 }}>
                    <View style={styles.singleoption}>
                      <TouchableOpacity onPress={shareOptions}><MaterialCommunityIcons name="share-variant" size={18} color={NORMAL_TEXT_COLOR} /></TouchableOpacity>
                    </View>
                    <Text style={{ color: NORMAL_TEXT_COLOR, fontSize: 12 }}>Share</Text>
                  </View>
                  <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginRight: 8 }}>
                    {passedtheme != 'live' && passedtheme != 'livetv' && !preview ?
                      <View style={styles.singleoption}>
                        {downloadedStatus == 0 ? <TouchableOpacity onPress={downloadFile}><MaterialCommunityIcons name="download" size={18} color={NORMAL_TEXT_COLOR} /></TouchableOpacity> : ""}
                        {downloadedStatus == 1 ? <TouchableOpacity onPress={deleteDownload}><MaterialCommunityIcons name="check-circle" size={18} color={NORMAL_TEXT_COLOR} /></TouchableOpacity> : ""}
                        {downloadedStatus == 2 ?

                          pauseDownload ?
                            isresumeDownloading ?
                              <TouchableOpacity onPress={() => navigation.dispatch(StackActions.replace('Offline'))}><MaterialCommunityIcons name="download" size={18} color={NORMAL_TEXT_COLOR} /></TouchableOpacity>
                              :
                              <TouchableOpacity onPress={resumeDownloadAction}><MaterialCommunityIcons name="motion-pause" size={18} color={NORMAL_TEXT_COLOR} /></TouchableOpacity>
                            :
                            isresumeDownloading ?
                              <TouchableOpacity onPress={() => navigation.dispatch(StackActions.replace('Offline'))}><MaterialCommunityIcons name="download" size={18} color={NORMAL_TEXT_COLOR} /></TouchableOpacity>
                              :
                              <TouchableOpacity onPress={pauseDownloadAction}><MaterialCommunityIcons name="progress-download" size={18} color={NORMAL_TEXT_COLOR} /></TouchableOpacity>

                          : ""}
                      </View>
                      :
                      <View style={styles.singleoption}>
                        <MaterialCommunityIcons name="download" size={18} color={DARKED_BORDER_COLOR} />
                      </View>
                    }
                    <Text style={{ color: NORMAL_TEXT_COLOR, fontSize: 12 }}>Download</Text>
                  </View>
                  <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                    <View style={styles.singleoption}>

                      {!watchlatercontent ?
                        <Pressable onPress={watchLater}><MaterialIcons name="watch-later" size={18} color={NORMAL_TEXT_COLOR} /></Pressable>
                        :
                        <Pressable onPress={() => { navigation.dispatch(StackActions.replace('WatchLater')) }}><MaterialIcons name="watch-later" size={18} color={DARKED_BORDER_COLOR} /></Pressable>
                      }
                    </View>
                    <Text style={{ color: NORMAL_TEXT_COLOR, fontSize: 12 }}>Watch Later</Text>
                  </View>
                </View>
                : ""}
            </View> : ""}
          {
            (passedtheme == 'live' || passedtheme == 'livetv') && !fullscreen && totalHomeData ?
              <FlatList
                data={totalHomeData}
                keyExtractor={(x, i) => i.toString()}
                horizontal={false}
                contentContainerStyle={{ flexGrow: 1, flexWrap: 'nowrap' }}
                style={{ marginTop: 20, marginBottom: 20 }}
                renderItem={renderItem}
              /> : ""
          }

          {(passedtheme == 'live' || passedtheme == 'livetv') && relatedshows.length > 0 && !fullscreen ?

            <>
              <View style={{ marginTop: 20, padding: 6, flex: 1, width: "100%" }}>
                <Text style={{ color: NORMAL_TEXT_COLOR, fontSize: 18, fontWeight: '500', marginBottom: 20, justifyContent: 'flex-start', alignItems: 'flex-start' }}>Related Shows</Text>
                {isTablet ?
                  <FlatList
                    data={relatedshows}
                    renderItem={renderShows}
                    horizontal={true}
                    nestedScrollEnabled
                  />
                  :
                  <FlatList
                    data={relatedshows}
                    renderItem={renderShows}
                    horizontal={false}
                    nestedScrollEnabled
                  />
                }
              </View>
            </>
            :
            ""}
          {passedtheme != 'live' && passedtheme != 'livetv' && relatedMovies.length > 0 ?
            <View style={{ justifyContent: 'flex-start', alignItems: 'flex-start', width: "100%", marginTop: 30, padding: 2 }}>
              <Text style={{ color: NORMAL_TEXT_COLOR, fontSize: 18, fontWeight: '500', marginBottom: 20, marginLeft: 20 }}>Related</Text>
              <FlatList
                data={relatedMovies}
                renderItem={renderRelatedMovies}
                keyExtractor={(x, i) => i.toString()}
                contentContainerStyle={{ marginBottom: 50 }}
                numColumns={3}
              />
            </View>
            : ""

          }

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
                    <TouchableOpacity key={'pref' + ind} onPress={() => { startDownloading(pref.playback_url, pref.offlineUrl, pref.downloaddirectory, pref.display_name) }}>
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


          <Modal
            isVisible={isResolutionModalVisible}
            testID={'modal'}
            animationIn="slideInDown"
            animationOut="slideOutDown"
            onBackdropPress={toggleModalResolution}
            backdropColor={"black"}
            backdropOpacity={0.40}
          >
            <View style={{ backgroundColor: NORMAL_TEXT_COLOR, width: '100%', backgroundColor: BACKGROUND_COLOR }}>
              <TouchableOpacity key={'pref'} onPress={() => { setVideoResolution('auto', '1280') }}>
                <View style={{ padding: 13, borderBottomColor: IMAGE_BORDER_COLOR, borderBottomWidth: 0.5, flexDirection: 'row' }}>
                  <Text style={{ color: NORMAL_TEXT_COLOR, marginRight: 10 }}>Auto</Text>
                  {videoType == 'auto' ? <MaterialCommunityIcons name="check-bold" size={18} color={NORMAL_TEXT_COLOR} /> : ""}
                </View>
              </TouchableOpacity>
              {resolutionPreference.map((pref, ind) => {
                return (
                  pref.display_name != "" ?
                    <TouchableOpacity key={'pref' + ind} onPress={() => { setVideoResolution('resolution', pref.vheight) }}>
                      <View style={{ padding: 13, borderBottomColor: IMAGE_BORDER_COLOR, borderBottomWidth: 0.5, flexDirection: 'row' }}>
                        <Text style={{ color: NORMAL_TEXT_COLOR, marginRight: 10 }}>{pref.display_name}</Text>
                        {videoType == 'resolution' && videoresolution == pref.vheight ? <MaterialCommunityIcons name="check-bold" size={18} color={NORMAL_TEXT_COLOR} /> : ""}
                      </View>
                    </TouchableOpacity>
                    :
                    ""
                )
              })}
            </View>
          </Modal>


          <StatusBar
            animated
            backgroundColor="transparent"
            barStyle="dark-content"
            translucent={true}
          />
        </View>
      </ScrollView>
      {subcatcurrentTheme == 'movie' ?
        <SwipeUpDown
          ref={swipeUpDownRef}
          itemMini={(show) => (
            <View
              style={{
                alignItems: "center",
              }}
            >
              <Text onPress={show} style={{
                color: NORMAL_TEXT_COLOR, fontWeight: '500'
                , fontSize: 20
              }}>Load More...</Text>
            </View>
          )}
          itemFull={(close) => (
            <TouchableWithoutFeedback>
              {
                (passedtheme != 'live' && passedtheme != 'livetv' && subcategoryImages && !fullscreen) ?
                  <FlatList
                    data={subcategoryImages}
                    renderItem={renderSubcat}
                    keyExtractor={(x, i) => i.toString()}
                    contentContainerStyle={{ marginTop: 30 }}
                  />
                  :
                  ""}
            </TouchableWithoutFeedback>
          )}
          onShowMini={() => {
            setsubcategoryImages([])
          }}
          onShowFull={() => {
            if (subcatcurrentTheme == 'movie') {
              getsubcatDetails()
            }
          }}
          animation="spring"
          extraMarginTop={25}
          style={{ backgroundColor: DARKED_BORDER_COLOR, flex: 1 }}
          iconColor={TAB_COLOR}
        />
        : ""}


    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: BACKGROUND_COLOR,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1
  },
  video: {
    height: 270,
    width: PAGE_WIDTH,
    backgroundColor: 'black',
  },
  videoTab: {
    height: 450,
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
  settingsicon: {
    position: 'absolute',
    right: 60,
    top: 30,
    paddingRight: 10,
  },
  navigationBack: {
    position: 'absolute',
    left: 15,
    top: 35,
    paddingLeft: 10,
  },
  mainContainer: { flex: 1, backgroundColor: BACKGROUND_COLOR },
  bodyContent: { backgroundColor: BACKGROUND_COLOR, padding: 10 },
  headingLabel: { fontSize: 20, color: NORMAL_TEXT_COLOR, padding: 4, justifyContent: 'center', alignItems: 'center', width: "100%", borderBottomColor: FOOTER_DEFAULT_TEXT_COLOR, borderBottomWidth: 1, },
  detailsText: { fontSize: 11, marginBottom: 5, color: DETAILS_TEXT_COLOR, padding: 4 },
  options: { alignItems: 'center', justifyContent: 'center', flexDirection: 'row', },
  singleoption: { width: 30, height: 30, borderRadius: 15, alignItems: 'center', justifyContent: 'center', borderColor: TAB_COLOR, borderWidth: 1, marginRight: 3 },
  marginContainer: { marginLeft: 5, marginRight: 5 },
  button: { justifyContent: 'center', alignItems: 'center', backgroundColor: TAB_COLOR, color: NORMAL_TEXT_COLOR, width: 100, padding: 10, borderRadius: 20, marginRight: 10 },
  imageSectionHorizontal: {
    width: PAGE_WIDTH,
    height: actuatedNormalize(280),
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 1
  },
  sectionHeaderMore: {
    color: MORE_LINK_COLOR,
    fontSize: 13,
    fontWeight: '600'
  },
  imageSectionVertical: {
    width: PAGE_WIDTH / 3.1,
    height: actuatedNormalize(155),
    borderRadius: 18,
    marginBottom: 10,
    marginHorizontal: 1
  },
  imageSectionVerticalTab: {
    width: 135,
    height: 150,
    marginHorizontal: 4,
    borderRadius: 10,
    marginBottom: 10,
  },
  playIcon: { position: 'absolute', width: 25, height: 25, right: 6, bottom: 12 },
  crownIcon: { position: 'absolute', width: 25, height: 25, left: 8, top: 5 },
});
