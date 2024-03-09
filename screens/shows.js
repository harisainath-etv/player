import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  FlatList,
  Image,
  LogBox,
  Alert,
  ActivityIndicator,
  PermissionsAndroid,
} from "react-native";
import React, { useEffect, useState, useRef, useCallback } from "react";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import FastImage from "react-native-fast-image";
import ReadMore from "@fawazahmed/react-native-read-more";
import { StackActions, useFocusEffect } from "@react-navigation/native";
import Modal from "react-native-modal";
import Share from "react-native-share";
import NormalHeader from "./normalHeader";
import {
  AUTH_TOKEN,
  BACKGROUND_COLOR,
  FIRETV_BASE_URL,
  NORMAL_TEXT_COLOR,
  TAB_COLOR,
  PAGE_WIDTH,
  VIDEO_TYPES,
  MORE_LINK_COLOR,
  LAYOUT_TYPES,
  IMAGE_BORDER_COLOR,
  DETAILS_TEXT_COLOR,
  DARKED_BORDER_COLOR,
  VIDEO_AUTH_TOKEN,
  ACCESS_TOKEN,
  BUTTON_COLOR,
  FOOTER_DEFAULT_TEXT_COLOR,
  actuatedNormalize,
  PAGE_HEIGHT,
  FIRETV_BASE_URL_STAGING,
  COMMON_BASE_URL,
} from "../constants";
import DeviceInfo from "react-native-device-info";
import LinearGradient from "react-native-linear-gradient";
// import { OptimizedFlatList } from 'react-native-optimized-flatlist'
import RNBackgroundDownloader from "react-native-background-downloader";
import { normalize } from "react-native-elements";
// import RNFS from 'react-native-fs';
var indexValue = 0;
var isTablet = DeviceInfo.isTablet();
var internaltabs = [];
export default function Shows({ navigation, route }) {
  var { seoUrl, selectTitle, ind } = route.params;
  const [isShow, setIsShow] = useState(false);
  const [toggle, setToggle] = useState(false);
  const [title, setTitle] = useState();
  const [thumbnail, setThumbnail] = useState();
  const [userRating, setUserRating] = useState();
  const [channel, setChannel] = useState();
  const [contentRating, setContentRating] = useState();
  const [displayGenres, setDisplayGenres] = useState([]);
  const [description, setDescription] = useState();
  {
    ind ? (indexValue = ind) : (indexValue = 0);
  }
  const [subcategorySeoUrl, setSubcategorySeoUrl] = useState(indexValue);
  const [relatedUrl, setRelatedUrl] = useState();
  const [subcategoryList, setSubcategoryList] = useState([]);
  const [subcategoryImages, setsubcategoryImages] = useState([]);
  const [seasons, setSeasons] = useState([]);
  const [isModalVisible, setModalVisible] = useState(false);
  const [episodeSeoUrl, setEpisodeSeoUrl] = useState();
  const [contentId, setContentId] = useState();
  const [catalogId, setCatalogId] = useState();
  const [shareUrl, setShareUrl] = useState();
  const [ratingdone, setratingdone] = useState(false);
  const [loading, setLoading] = useState(true);
  const [episodeUrl, setEpisodeUrl] = useState("");
  const [currentTab, setCurrentTab] = useState("");
  const [itemType, setItemType] = useState("");
  const [subcategoryDefaultName, setSubcategoryDefaultName] = useState("");
  const [subcategoryDefaultTitle, setSubcategoryDefaultTitle] = useState("");
  const [subcategoryDefaultItemType, setSubcategoryDefaultItemType] =
    useState("");
  const [subcategoryDefaultUrl, setSubcategoryDefaultUrl] = useState("");
  const [subcatLoading, setSubcatLoading] = useState(false);
  const [subCategoryMediaList, setSubCategoryMediaList] = useState();
  const [internalTabs, setInternalTabs] = useState([]);
  const [defaultTabDisplayTitle, setDefaultTabDisplayTitle] = useState("");
  const [defaultTabSeoUrl, setDefaultTabSeoUrl] = useState("");
  const [defaultTabLayoutType, setDefaultTabLayoutType] = useState("");
  const [subTabImages, setsubTabImages] = useState([]);
  const [selectedTab, setSelectedTab] = useState("");
  const [prefrence, setPreference] = useState([]);
  const [downloadedStatus, setDownloadedStatus] = useState(0);
  const [taskdownloading, settaskdownloading] = useState();
  const [tabDataLoading, setTabDataLoading] = useState(false);
  const showMoreLess = () => {
    setIsShow(!isShow);
  };
  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };
  var totalData = [];
  const [seourl, setSeourl] = useState(seoUrl);
  const filterItems = (stringNeeded, arrayvalues) => {
    let query = stringNeeded.toLowerCase();
    return arrayvalues.filter((item) => item.toLowerCase().indexOf(query) >= 0);
  };
  const setAsyncData = async (key, value, seo_url) => {
    const loaded = await AsyncStorage.getItem("loaded");
    if (loaded != 1) {
      await AsyncStorage.setItem(key, value);
      movetoscreen(seo_url, 0, "");
    }
  };
  const loadData = async () => {
    setLoading(true);
    setSubcategoryList([]);
    setInternalTabs([]);
    setsubTabImages([]);
    setsubcategoryImages([]);
    const baseUrl = FIRETV_BASE_URL;
    var splittedData = seourl.split("/");
    splittedData = splittedData.filter(function (e) {
      return e;
    });
    const checkSeason = filterItems("season", splittedData);
    const checkTvShow = filterItems("tv-shows", splittedData);
    const checkNews = filterItems("news", splittedData);
    const checkShow = filterItems("show", splittedData);
    const region = await AsyncStorage.getItem("country_code");
    const sessionId = await AsyncStorage.getItem("session");
    var urlPath = "";
    var urlPath1 = "";
    if (
      splittedData.length == 4 &&
      checkSeason.length > 0 &&
      checkShow.length == 0
    ) {
      urlPath =
        baseUrl +
        "catalogs/" +
        splittedData[0] +
        "/items/" +
        splittedData[1] +
        "/subcategories/" +
        splittedData[2] +
        "/episodes/" +
        splittedData[3];
      urlPath1 =
        baseUrl +
        "catalogs/" +
        splittedData[0] +
        "/items/" +
        splittedData[1] +
        "/" +
        splittedData[2] +
        "/" +
        splittedData[3];
    } else if (splittedData[0] == "tv-shows") {
      if (
        splittedData[3] == "" ||
        splittedData[3] == null ||
        splittedData[3] == "undefined"
      )
        urlPath =
          baseUrl +
          "catalogs/" +
          splittedData[0] +
          "/episodes/" +
          splittedData[1];
      else
        urlPath =
          baseUrl +
          "catalogs/" +
          splittedData[0] +
          "/episodes/" +
          splittedData[4];
    } else if (splittedData[0] == "news" || splittedData.length == 3) {
      urlPath =
        baseUrl +
        "catalogs/" +
        splittedData[0] +
        "/items/" +
        splittedData[1] +
        "/episodes/" +
        splittedData[2];
    }
    // else if (checkShow.length > 0 && splittedData.length == 3) {
    //   urlPath = baseUrl + "catalogs/" + splittedData[0] + "/items/" + splittedData[1] + "/episodes/" + splittedData[2];
    // }
    else {
      if (splittedData.length == 2)
        urlPath =
          baseUrl + "catalogs/" + splittedData[0] + "/items/" + splittedData[1];
      if (splittedData.length == 3)
        urlPath =
          baseUrl +
          "catalogs/" +
          splittedData[0] +
          "/items/" +
          splittedData[1] +
          "/" +
          splittedData[2];
      if (splittedData.length == 4)
        urlPath =
          baseUrl +
          "catalogs/" +
          splittedData[0] +
          "/items/" +
          splittedData[1] +
          "/" +
          splittedData[2] +
          "/" +
          splittedData[3];
    }

    var relatedurlPath =
      baseUrl +
      "catalogs/" +
      splittedData[0] +
      "/items/" +
      splittedData[1] +
      "/related.gzip?&auth_token=" +
      AUTH_TOKEN +
      "&region=" +
      region;

    const url =
      urlPath + ".gzip?&auth_token=" + AUTH_TOKEN + "&region=" + region;
    await axios
      .get(url)
      .then((response) => {
        if (
          response.data.data.title != "" &&
          response.data.data.title != null
        ) {
          setTitle(response.data.data.title);
          setThumbnail(response.data.data.last_episode.thumbnails.high_3_4.url);
          setEpisodeSeoUrl(response.data.data.last_episode.seo_url);
          setUserRating(Math.round(response.data.data.average_user_rating));
          setChannel(response.data.data.channel_object.name);
          setContentRating(response.data.data.cbfc_rating);
          setDisplayGenres(response.data.data.display_genres);
          setDescription(response.data.data.description);
          setRelatedUrl(relatedurlPath);
          setSeasons(response.data.data.subcategories);
          setContentId(response.data.data.content_id);
          setCatalogId(response.data.data.catalog_id);
          setShareUrl(COMMON_BASE_URL + seourl);

          if (sessionId != "" && sessionId != null) {
            axios
              .get(
                FIRETV_BASE_URL +
                  "users/" +
                  sessionId +
                  "/playlists/favourite/listitems.gzip?catalog_id=" +
                  response.data.data.catalog_id +
                  "&content_id=" +
                  response.data.data.content_id +
                  "&auth_token=" +
                  AUTH_TOKEN +
                  "&region=" +
                  region
              )
              .then((followresp) => {
                setToggle(true);
              })
              .catch((followerror) => {
                setToggle(false);
              });

            axios
              .get(
                FIRETV_BASE_URL +
                  "users/" +
                  sessionId +
                  "/playlists/user_ratings/listitems.gzip?catalog_id=" +
                  response.data.data.catalog_id +
                  "&content_id=" +
                  response.data.data.content_id +
                  "&auth_token=" +
                  AUTH_TOKEN +
                  "&region=" +
                  region
              )
              .then((followresp) => {
                setratingdone(true);
              })
              .catch((followerror) => {
                setratingdone(false);
              });
          }

          var mainArr = [];
          var episodesAvailable = 0;
          console.log(selectTitle);
          if (selectTitle == "" || selectTitle == null) {
            for (
              var e = 0;
              e <
              response.data.data.subcategories[subcategorySeoUrl]
                .episodetype_tags.length;
              e++
            ) {
              var subcategorySplit = "";
              var subcategoryurlPath = "";
              var subcategoryurl = "";
              subcategorySplit =
                response.data.data.subcategories[
                  subcategorySeoUrl
                ].seo_url.split("/");
              subcategorySplit = subcategorySplit.filter(function (e) {
                return e;
              });

              subcategoryurlPath =
                baseUrl +
                "catalogs/" +
                subcategorySplit[0] +
                "/items/" +
                subcategorySplit[1] +
                "/subcategories/" +
                subcategorySplit[3] +
                "/episodes";
              subcategoryurl =
                subcategoryurlPath +
                ".gzip?&auth_token=" +
                AUTH_TOKEN +
                "&region=" +
                region +
                "&episode_type=" +
                response.data.data.subcategories[subcategorySeoUrl]
                  .episodetype_tags[e].name +
                "&page_size=10";
              if (
                response.data.data.subcategories[subcategorySeoUrl]
                  .episodetype_tags[e].name == "episode"
              ) {
                setEpisodeUrl(
                  baseUrl +
                    "catalogs/" +
                    subcategorySplit[0] +
                    "/items/" +
                    subcategorySplit[1] +
                    "/episodes.gzip"
                );
              }
              if (episodesAvailable == 0) {
                setSubcategoryDefaultName(
                  response.data.data.subcategories[subcategorySeoUrl]
                    .episodetype_tags[e].name
                );
                setSubcategoryDefaultTitle(
                  response.data.data.subcategories[subcategorySeoUrl]
                    .episodetype_tags[e].display_title
                );
                setSubcategoryDefaultItemType(
                  response.data.data.subcategories[subcategorySeoUrl]
                    .episodetype_tags[e].item_type
                );
                setSubcategoryDefaultUrl(subcategoryurl);
                setSubCategoryMediaList(
                  response.data.data.subcategories[subcategorySeoUrl]
                    .episodetype_tags[e].media_list
                );
              }
              mainArr.push({
                name: response.data.data.subcategories[subcategorySeoUrl]
                  .episodetype_tags[e].name,
                display_title:
                  response.data.data.subcategories[subcategorySeoUrl]
                    .episodetype_tags[e].display_title,
                item_type:
                  response.data.data.subcategories[subcategorySeoUrl]
                    .episodetype_tags[e].item_type,
                subcategoryurl: subcategoryurl,
                media_list:
                  response.data.data.subcategories[subcategorySeoUrl]
                    .episodetype_tags[e].media_list,
              });
              episodesAvailable++;
            }
          } else {
            for (
              var e = 0;
              e < response.data.data.episodetype_tags.length;
              e++
            ) {
              var subcategorySplit = "";
              var subcategoryurlPath = "";
              var subcategoryurl = "";
              subcategorySplit = response.data.data.seo_url.split("/");
              subcategorySplit = subcategorySplit.filter(function (e) {
                return e;
              });

              subcategoryurlPath =
                baseUrl +
                "catalogs/" +
                subcategorySplit[0] +
                "/items/" +
                subcategorySplit[1] +
                "/subcategories/" +
                subcategorySplit[3] +
                "/episodes";
              subcategoryurl =
                subcategoryurlPath +
                ".gzip?&auth_token=" +
                AUTH_TOKEN +
                "&region=" +
                region +
                "&episode_type=" +
                response.data.data.episodetype_tags[e].name +
                "&page_size=10";
              if (response.data.data.episodetype_tags[e].name == "episode") {
                setEpisodeUrl(
                  baseUrl +
                    "catalogs/" +
                    subcategorySplit[0] +
                    "/items/" +
                    subcategorySplit[1] +
                    "/episodes.gzip"
                );
              }
              if (episodesAvailable == 0) {
                setSubcategoryDefaultName(
                  response.data.data.episodetype_tags[e].name
                );
                setSubcategoryDefaultTitle(
                  response.data.data.episodetype_tags[e].display_title
                );
                setSubcategoryDefaultItemType(
                  response.data.data.episodetype_tags[e].item_type
                );
                setSubcategoryDefaultUrl(subcategoryurl);
                setSubCategoryMediaList(
                  response.data.data.episodetype_tags[e].media_list
                );
              }
              mainArr.push({
                name: response.data.data.episodetype_tags[e].name,
                display_title:
                  response.data.data.episodetype_tags[e].display_title,
                item_type: response.data.data.episodetype_tags[e].item_type,
                subcategoryurl: subcategoryurl,
                media_list: response.data.data.episodetype_tags[e].media_list,
              });
              episodesAvailable++;
            }
          }
          mainArr.push({
            name: "related",
            display_title: "Related Shows",
            item_type: "show",
            subcategoryurl: relatedurlPath,
          });
          setSubcategoryList(mainArr);
        } else {
          alternativeUrl(urlPath1, relatedurlPath, sessionId, region, baseUrl);
        }
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        alternativeUrl(
          urlPath1 + ".gzip?&auth_token=" + AUTH_TOKEN + "&region=" + region,
          relatedurlPath,
          sessionId,
          region,
          baseUrl
        );
      });
  };

  async function alternativeUrl(
    url,
    relatedurlPath,
    sessionId,
    region,
    baseUrl
  ) {
    console.log(url);
    setLoading(true);
    await axios
      .get(url)
      .then((response) => {
        setTitle(response.data.data.title);
        setThumbnail(response.data.data.last_episode.thumbnails.high_3_4.url);
        setEpisodeSeoUrl(response.data.data.last_episode.seo_url);
        setUserRating(Math.round(response.data.data.average_user_rating));
        setChannel(response.data.data.channel_object.name);
        setContentRating(response.data.data.cbfc_rating);
        setDisplayGenres(response.data.data.display_genres);
        setDescription(response.data.data.description);
        setRelatedUrl(relatedurlPath);
        setSeasons(response.data.data.subcategories);
        setContentId(response.data.data.content_id);
        setCatalogId(response.data.data.catalog_id);
        setShareUrl(COMMON_BASE_URL + seourl);

        if (sessionId != "" && sessionId != null) {
          axios
            .get(
              FIRETV_BASE_URL +
                "users/" +
                sessionId +
                "/playlists/favourite/listitems.gzip?catalog_id=" +
                response.data.data.catalog_id +
                "&content_id=" +
                response.data.data.content_id +
                "&auth_token=" +
                AUTH_TOKEN +
                "&region=" +
                region
            )
            .then((followresp) => {
              setToggle(true);
            })
            .catch((followerror) => {
              setToggle(false);
            });

          axios
            .get(
              FIRETV_BASE_URL +
                "users/" +
                sessionId +
                "/playlists/user_ratings/listitems.gzip?catalog_id=" +
                response.data.data.catalog_id +
                "&content_id=" +
                response.data.data.content_id +
                "&auth_token=" +
                AUTH_TOKEN +
                "&region=" +
                region
            )
            .then((followresp) => {
              setratingdone(true);
            })
            .catch((followerror) => {
              setratingdone(false);
            });
        }

        var mainArr = [];
        var episodesAvailable = 0;
        console.log(selectTitle);
        if (selectTitle == "" || selectTitle == null) {
          for (
            var e = 0;
            e <
            response.data.data.subcategories[subcategorySeoUrl].episodetype_tags
              .length;
            e++
          ) {
            var subcategorySplit = "";
            var subcategoryurlPath = "";
            var subcategoryurl = "";
            subcategorySplit =
              response.data.data.subcategories[subcategorySeoUrl].seo_url.split(
                "/"
              );
            subcategorySplit = subcategorySplit.filter(function (e) {
              return e;
            });

            subcategoryurlPath =
              baseUrl +
              "catalogs/" +
              subcategorySplit[0] +
              "/items/" +
              subcategorySplit[1] +
              "/subcategories/" +
              subcategorySplit[3] +
              "/episodes";
            subcategoryurl =
              subcategoryurlPath +
              ".gzip?&auth_token=" +
              AUTH_TOKEN +
              "&region=" +
              region +
              "&episode_type=" +
              response.data.data.subcategories[subcategorySeoUrl]
                .episodetype_tags[e].name +
              "&page_size=10";
            if (
              response.data.data.subcategories[subcategorySeoUrl]
                .episodetype_tags[e].name == "episode"
            ) {
              setEpisodeUrl(
                baseUrl +
                  "catalogs/" +
                  subcategorySplit[0] +
                  "/items/" +
                  subcategorySplit[1] +
                  "/episodes.gzip"
              );
            }
            if (episodesAvailable == 0) {
              setSubcategoryDefaultName(
                response.data.data.subcategories[subcategorySeoUrl]
                  .episodetype_tags[e].name
              );
              setSubcategoryDefaultTitle(
                response.data.data.subcategories[subcategorySeoUrl]
                  .episodetype_tags[e].display_title
              );
              setSubcategoryDefaultItemType(
                response.data.data.subcategories[subcategorySeoUrl]
                  .episodetype_tags[e].item_type
              );
              setSubcategoryDefaultUrl(subcategoryurl);
              setSubCategoryMediaList(
                response.data.data.subcategories[subcategorySeoUrl]
                  .episodetype_tags[e].media_list
              );
            }
            mainArr.push({
              name: response.data.data.subcategories[subcategorySeoUrl]
                .episodetype_tags[e].name,
              display_title:
                response.data.data.subcategories[subcategorySeoUrl]
                  .episodetype_tags[e].display_title,
              item_type:
                response.data.data.subcategories[subcategorySeoUrl]
                  .episodetype_tags[e].item_type,
              subcategoryurl: subcategoryurl,
              media_list:
                response.data.data.subcategories[subcategorySeoUrl]
                  .episodetype_tags[e].media_list,
            });
            episodesAvailable++;
          }
        } else {
          for (var e = 0; e < response.data.data.episodetype_tags.length; e++) {
            var subcategorySplit = "";
            var subcategoryurlPath = "";
            var subcategoryurl = "";
            subcategorySplit = response.data.data.seo_url.split("/");
            subcategorySplit = subcategorySplit.filter(function (e) {
              return e;
            });

            subcategoryurlPath =
              baseUrl +
              "catalogs/" +
              subcategorySplit[0] +
              "/items/" +
              subcategorySplit[1] +
              "/subcategories/" +
              subcategorySplit[3] +
              "/episodes";
            subcategoryurl =
              subcategoryurlPath +
              ".gzip?&auth_token=" +
              AUTH_TOKEN +
              "&region=" +
              region +
              "&episode_type=" +
              response.data.data.episodetype_tags[e].name +
              "&page_size=10";
            if (response.data.data.episodetype_tags[e].name == "episode") {
              setEpisodeUrl(
                baseUrl +
                  "catalogs/" +
                  subcategorySplit[0] +
                  "/items/" +
                  subcategorySplit[1] +
                  "/episodes.gzip"
              );
            }
            if (episodesAvailable == 0) {
              setSubcategoryDefaultName(
                response.data.data.episodetype_tags[e].name
              );
              setSubcategoryDefaultTitle(
                response.data.data.episodetype_tags[e].display_title
              );
              setSubcategoryDefaultItemType(
                response.data.data.episodetype_tags[e].item_type
              );
              setSubcategoryDefaultUrl(subcategoryurl);
              setSubCategoryMediaList(
                response.data.data.episodetype_tags[e].media_list
              );
            }
            mainArr.push({
              name: response.data.data.episodetype_tags[e].name,
              display_title:
                response.data.data.episodetype_tags[e].display_title,
              item_type: response.data.data.episodetype_tags[e].item_type,
              subcategoryurl: subcategoryurl,
              media_list: response.data.data.episodetype_tags[e].media_list,
            });
            episodesAvailable++;
          }
        }
        mainArr.push({
          name: "related",
          display_title: "Related Shows",
          item_type: "show",
          subcategoryurl: relatedurlPath,
        });
        setSubcategoryList(mainArr);
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
      });
  }

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [])
  );

  useEffect(() => {
    if (
      subcategoryDefaultName != "" &&
      subcategoryDefaultTitle != "" &&
      subcategoryDefaultItemType != "" &&
      subcategoryDefaultUrl != ""
    ) {
      getThumbnailImages(
        subcategoryDefaultUrl,
        subcategoryDefaultItemType,
        subcategoryDefaultName,
        subcategoryDefaultTitle,
        subCategoryMediaList,
        0
      );
    }
    LogBox.ignoreLogs(["VirtualizedLists should never be nested"]);
    LogBox.ignoreLogs(["Encountered two children with the same key"]);
  }, [
    subcategoryDefaultUrl,
    subcategoryDefaultItemType,
    subcategoryDefaultName,
    subcategoryDefaultTitle,
    subCategoryMediaList,
    defaultTabDisplayTitle,
    defaultTabSeoUrl,
    defaultTabLayoutType,
  ]);

  const getThumbnailImages = async (
    subcategoryurl,
    item_type,
    name,
    display_title,
    media_list,
    empty_data
  ) => {
    setSubcatLoading(true);
    setCurrentTab(name);
    setItemType(item_type);
    if (empty_data == 1) {
      setInternalTabs([]);
      setsubTabImages([]);
    }
    var subcategorydata = [];
    if (item_type != "list-2d") {
      const thumnailData = await fetch(subcategoryurl);
      const subcatDataDetails = await thumnailData.json();
      for (var s = 0; s < subcatDataDetails.data.items.length; s++) {
        {
          VIDEO_TYPES.includes(item_type)
            ? subcategorydata.push({
                thumbnail:
                  subcatDataDetails.data.items[s].thumbnails.high_4_3.url,
                title: subcatDataDetails.data.items[s].title,
                date: subcatDataDetails.data.items[s].release_date_uts,
                premium: subcatDataDetails.data.items[s].access_control.is_free,
                theme: subcatDataDetails.data.items[s].theme,
                seo_url: subcatDataDetails.data.items[s].seo_url,
                short_description:
                  subcatDataDetails.data.items[s].short_description,
                item_type: item_type,
              })
            : subcategorydata.push({
                thumbnail:
                  subcatDataDetails.data.items[s].thumbnails.medium_3_4.url,
                title: subcatDataDetails.data.items[s].title,
                date: subcatDataDetails.data.items[s].release_date_uts,
                premium: subcatDataDetails.data.items[s].access_control.is_free,
                theme: subcatDataDetails.data.items[s].theme,
                seo_url: subcatDataDetails.data.items[s].seo_url,
                short_description:
                  subcatDataDetails.data.items[s].short_description,
                item_type: item_type,
              });
        }
      }
      totalData.push({
        name: name,
        display_title: display_title,
        item_type: item_type,
        thumbnails: subcategorydata,
        friendlyId: subcategoryurl,
      });
      setsubcategoryImages([totalData]);
      setSubcatLoading(false);
    } else {
      const region = await AsyncStorage.getItem("country_code");
      let url1 =
        FIRETV_BASE_URL_STAGING +
        "catalog_lists/" +
        media_list +
        ".gzip?item_language=eng&region=" +
        region +
        "&nested_list_items=false&auth_token=" +
        AUTH_TOKEN +
        "&access_token=" +
        ACCESS_TOKEN;
      await axios
        .get(url1)
        .then((resp) => {
          for (var t = 0; t < resp.data.data.catalog_list_items.length; t++) {
            internaltabs.push({
              display_title: resp.data.data.catalog_list_items[t].display_title,
              seo_url: resp.data.data.catalog_list_items[t].seo_url,
              layout_type: resp.data.data.catalog_list_items[t].layout_type,
            });
            if (t == 0) {
              setDefaultTabDisplayTitle(
                resp.data.data.catalog_list_items[t].display_title
              );
              setDefaultTabSeoUrl(resp.data.data.catalog_list_items[t].seo_url);
              setDefaultTabLayoutType(
                resp.data.data.catalog_list_items[t].layout_type
              );
              setInternalTabs([]);
              getTabData(
                resp.data.data.catalog_list_items[t].display_title,
                resp.data.data.catalog_list_items[t].seo_url,
                resp.data.data.catalog_list_items[t].layout_type
              );
            }
          }
          setsubcategoryImages([]);
          setInternalTabs(internaltabs);
          setSubcatLoading(false);
        })
        .catch((err) => {
          console.log(err.response.data);
          setSubcatLoading(false);
        });
    }
  };
  const getTabData = async (
    defaultTabDisplayTitle,
    defaultTabSeoUrl,
    defaultTabLayoutType
  ) => {
    setTabDataLoading(true);
    setsubTabImages([]);
    const region = await AsyncStorage.getItem("country_code");
    var subcategorydata = [];
    let url2 =
      FIRETV_BASE_URL_STAGING +
      "/" +
      defaultTabSeoUrl +
      ".gzip?item_language=eng&region=" +
      region +
      "&auth_token=" +
      AUTH_TOKEN +
      "&access_token=" +
      ACCESS_TOKEN;
    axios
      .get(url2)
      .then((resp) => {
        totalData = [];
        for (var d = 0; d < resp.data.data.catalog_list_items.length; d++) {
          subcategorydata.push({
            thumbnail:
              resp.data.data.catalog_list_items[d].thumbnails.medium_4_3.url,
            title: resp.data.data.catalog_list_items[d].title,
            date: resp.data.data.catalog_list_items[d].release_date_uts,
            premium:
              resp.data.data.catalog_list_items[d].access_control.is_free,
            theme: resp.data.data.catalog_list_items[d].theme,
            seo_url: resp.data.data.catalog_list_items[d].seo_url,
            short_description:
              resp.data.data.catalog_list_items[d].short_description,
            item_type: defaultTabLayoutType,
            play_url: resp.data.data.catalog_list_items[d].play_url.url,
            dynamic_url: resp.data.data.catalog_list_items[d].dynamic_url,
          });
        }
        setSelectedTab(defaultTabDisplayTitle);
        setsubTabImages([subcategorydata]);
        setSubcatLoading(false);
        setTabDataLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setSubcatLoading(false);
        setTabDataLoading(false);
      });
  };

  const startDownloading = async (
    playback_url,
    offlineUrl,
    downloaddirectory,
    downloadquality
  ) => {
    var splittedOfflineUrl = offlineUrl.split("/");
    AsyncStorage.setItem(
      "download_url" + splittedOfflineUrl[splittedOfflineUrl.length - 1],
      playback_url
    );
    AsyncStorage.setItem(
      "download_path" + splittedOfflineUrl[splittedOfflineUrl.length - 1],
      `${downloaddirectory}/${
        splittedOfflineUrl[splittedOfflineUrl.length - 1]
      }.ts.download`
    );
    AsyncStorage.setItem(
      "download_title" + splittedOfflineUrl[splittedOfflineUrl.length - 1],
      title
    );
    AsyncStorage.setItem(
      "download_thumbnail" + splittedOfflineUrl[splittedOfflineUrl.length - 1],
      thumbnailImage
    );
    AsyncStorage.setItem(
      "download_seourl" + splittedOfflineUrl[splittedOfflineUrl.length - 1],
      seourl
    );

    let tasks = RNBackgroundDownloader.download({
      id: splittedOfflineUrl[splittedOfflineUrl.length - 1],
      url: playback_url,
      destination: `${downloaddirectory}/${
        splittedOfflineUrl[splittedOfflineUrl.length - 1]
      }.ts.download`,
    })
      .begin((expectedBytes) => {
        setDownloadedStatus(2);
        // console.log(`Going to download ${expectedBytes} bytes!`);
        toggleModal();
      })
      .progress((percent) => {
        let jsonObj = {
          content_type: contenttype,
          video_name: title,
          genre: displayGenres,
          video_language: contentlanguage,
          download_quality: downloadquality,
          source: "source",
          percentage_downloaded: `${percent * 100}`,
          event_time: new Date(),
          event_id: "09",
        };
        triggerOtherAnalytics("download_video", jsonObj);

        AsyncStorage.setItem(
          "download_" + splittedOfflineUrl[splittedOfflineUrl.length - 1],
          JSON.stringify(percent * 100)
        );
        // console.log(`Downloaded: ${percent * 100}%`);
      })
      .done(() => {
        AsyncStorage.setItem(
          "download_" + splittedOfflineUrl[splittedOfflineUrl.length - 1],
          JSON.stringify(1 * 100)
        );
        setDownloadedStatus(1);
        // console.log('Download is done!');
      })
      .error((error) => {
        // console.log('Download canceled due to error: ', error);
      });
    settaskdownloading(tasks);
    AsyncStorage.setItem(
      "download_task" + splittedOfflineUrl[splittedOfflineUrl.length - 1],
      JSON.stringify(tasks)
    );
    navigation.navigate("Offline");
  };

  const triggerOtherAnalytics = async (name, obj) => {
    sdk.trackEvent(name, obj);
  };

  const movetoscreen = (seo_url, ind, title) => {
    navigation.navigate({
      name: "Shows",
      params: { seoUrl: seo_url, selectTitle: title, ind: ind },
      key: { ind },
    });
  };
  function renderSubcat({ item }) {
    return (
      <View
        style={
          currentTab == item.name
            ? {
                flexDirection: "row",
                color: "yellow",
              }
            : { flexDirection: "row" }
        }
      >
        <TouchableOpacity
          style={{
            padding: 6,
            marginLeft: normalize(8),
            alignItems: "center",
            justifyContent: "space-evenly",
            color: TAB_COLOR,
          }}
          onPress={() =>
            getThumbnailImages(
              item.subcategoryurl,
              item.item_type,
              item.name,
              item.display_title,
              item.media_list,
              1
            )
          }
        >
          <Text
            style={
              currentTab == item.name
                ? {
                    color: TAB_COLOR,
                    fontSize: 14,
                    fontWeight: "600",
                  }
                : { color: NORMAL_TEXT_COLOR }
            }
          >
            {item.display_title}
          </Text>
          {/* <Text>
          //   style={{
          //     color: NORMAL_TEXT_COLOR,
          //     fontWeight: "500",
          //     textAlign: "center",
          //   }}
          
          //   fffff {item.display_title}
          </Text> */}
        </TouchableOpacity>
      </View>
    );
  }

  const shareOptions = async () => {
    const shareOptions = {
      title: title,
      failOnCancel: false,
      urls: [shareUrl],
    };
    const ShareResponse = await Share.open(shareOptions);
  };

  const subcatrender = ({ item, index }) => {
    return (
      <>
        <TouchableOpacity
          style={
            VIDEO_TYPES.includes(item.item_type)
              ? { width: "100%", marginBottom: 20 }
              : { width: "33%", marginBottom: 20 }
          }
          onPress={() =>
            VIDEO_TYPES.includes(item.item_type)
              ? navigation.navigate({
                  name: "Episode",
                  params: { seoUrl: item.seo_url },
                  key: { index },
                })
              : navigation.navigate({
                  name: "Shows",
                  params: { seoUrl: item.seo_url },
                  key: { index },
                })
          }
        >
          {VIDEO_TYPES.includes(item.item_type) ? (
            <>
              <FastImage
                resizeMode={FastImage.resizeMode.contain}
                key={"image" + index}
                style={styles.imageSectionHorizontal}
                source={{
                  uri: item.thumbnail,
                  priority: FastImage.priority.high,
                  cache: FastImage.cacheControl.immutable,
                }}
              />
              <View
                style={{
                  width: "100%",
                  backgroundColor: DARKED_BORDER_COLOR,
                  position: "absolute",
                  bottom: 0,
                  borderRadius: 8,
                  alignItems: "flex-start",
                  justifyContent: "center",
                  padding: 5,
                }}
              >
                <Text
                  style={{
                    color: NORMAL_TEXT_COLOR,
                    fontSize: 15,
                    fontWeight: "500",
                  }}
                >
                  {item.title}
                </Text>
                <ReadMore
                  numberOfLines={2}
                  style={{
                    color: FOOTER_DEFAULT_TEXT_COLOR,
                    fontSize: 12,
                    fontWeight: "500",
                  }}
                  seeMoreText=""
                  seeMoreStyle={{
                    color: FOOTER_DEFAULT_TEXT_COLOR,
                    fontWeight: "bold",
                  }}
                  seeLessStyle={{
                    color: FOOTER_DEFAULT_TEXT_COLOR,
                    fontWeight: "bold",
                  }}
                >
                  <Text style={{}}>{item.short_description}</Text>
                </ReadMore>
              </View>
            </>
          ) : (
            <>
              <FastImage
                resizeMode={FastImage.resizeMode.contain}
                key={"image" + index}
                style={styles.imageSectionVertical}
                source={{
                  uri: item.thumbnail,
                  priority: FastImage.priority.high,
                  cache: FastImage.cacheControl.immutable,
                }}
              />
            </>
          )}
        </TouchableOpacity>
        {subcategoryImages.length > 0 &&
        subcategoryImages[0][0].name != "related" ? (
          index == subcategoryImages[0][0].thumbnails.length - 1 &&
          subcategoryImages[0][0].hasOwnProperty("friendlyId") ? (
            <TouchableOpacity
              style={{
                justifyContent: "center",
                alignItems: "center",
                marginTop: -20,
                marginBottom: 20,
                backgroundColor: BACKGROUND_COLOR,
                padding: 20,
              }}
              onPress={() =>
                navigation.navigate("EpisodesMoreListUrl", {
                  firendlyId: subcategoryImages[0][0].friendlyId,
                  layoutType: LAYOUT_TYPES[1],
                })
              }
            >
              <Text style={styles.sectionHeaderMore}>Load more...</Text>
            </TouchableOpacity>
          ) : (
            ""
          )
        ) : (
          ""
        )}
      </>
    );
  };

  return (
    <View style={styles.mainContainer}>
      {loading ? (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <ActivityIndicator
            color={NORMAL_TEXT_COLOR}
            size={"large"}
          ></ActivityIndicator>
        </View>
      ) : (
        <View style={{ flex: 1 }}>
          <NormalHeader></NormalHeader>
          <ScrollView style={{ flex: 1 }}>
            <View style={styles.container}>
              <View
                style={
                  isTablet
                    ? { height: (PAGE_HEIGHT / 100) * 76, width: PAGE_WIDTH }
                    : { height: (PAGE_HEIGHT / 100) * 76, width: PAGE_WIDTH }
                }
              >
                <TouchableOpacity
                  style={{
                    justifyContent: "center",
                    alignItems: "center",
                    width: "100%",
                  }}
                  onPress={() =>
                    navigation.navigate("Episode", {
                      seoUrl: episodeSeoUrl,
                      theme: "video",
                      showname: title,
                      showcontentId: contentId,
                    })
                  }
                >
                  <FastImage
                    resizeMode={FastImage.resizeMode.contain}
                    source={{
                      uri: thumbnail,
                      priority: FastImage.priority.high,
                      cache: FastImage.cacheControl.immutable,
                    }}
                    style={
                      isTablet
                        ? {
                            width: PAGE_WIDTH,
                            height: (PAGE_HEIGHT / 100) * 76,
                          }
                        : {
                            width: PAGE_WIDTH,
                            height: (PAGE_HEIGHT / 100) * 76,
                          }
                    }
                  ></FastImage>

                  <LinearGradient
                    useAngle={true}
                    angle={125}
                    angleCenter={{ x: 0.5, y: 0.5 }}
                    colors={[
                      BUTTON_COLOR,
                      TAB_COLOR,
                      TAB_COLOR,
                      TAB_COLOR,
                      BUTTON_COLOR,
                    ]}
                    style={[styles.button]}
                  >
                    <View
                      style={{ flexDirection: "row", alignItems: "center" }}
                    >
                      <FontAwesome5
                        name="play"
                        size={13}
                        color={NORMAL_TEXT_COLOR}
                        style={{ marginRight: 10 }}
                      />
                      <Text
                        style={{
                          color: NORMAL_TEXT_COLOR,
                          fontSize: 13,
                          fontWeight: "bold",
                        }}
                      >
                        Watch Now
                      </Text>
                    </View>
                  </LinearGradient>
                </TouchableOpacity>
              </View>

              <View style={styles.bodyContent}>
                <View style={styles.marginContainer}>
                  <Text style={styles.headingLabel}>
                    <Text style={[{ color: TAB_COLOR, fontWeight: "bold" }]}>
                      |{" "}
                    </Text>
                    {title}
                  </Text>
                  <View style={{ flexDirection: "row", marginTop: 5 }}>
                    <Text style={styles.detailsText}>{channel}</Text>

                    {displayGenres.map((resp, index) => {
                      return (
                        <View
                          key={index}
                          style={{
                            flexDirection: "row",
                            justifyContent: "center",
                            alignItems: "center",
                            marginLeft: 5,
                          }}
                        >
                          <FontAwesome5
                            name="dot-circle"
                            size={10}
                            style={{ bottom: 2 }}
                            color={TAB_COLOR}
                          />
                          <Text
                            key={index}
                            style={[
                              styles.detailsText,
                              { color: TAB_COLOR, fontWeight: "bold" },
                            ]}
                          >
                            {resp}
                          </Text>
                        </View>
                      );
                    })}
                  </View>
                  <>
                    <Text
                      ellipsizeMode="tail"
                      numberOfLines={isShow ? undefined : 2}
                      style={styles.detailsText}
                    >
                      {description}
                    </Text>

                    <TouchableOpacity
                      onPress={showMoreLess}
                      style={styles.detailsText}
                    >
                      {isShow ? (
                        <Text style={{ color: TAB_COLOR, fontWeight: "bold" }}>
                          {"Read Less"}
                        </Text>
                      ) : (
                        <Text style={{ color: TAB_COLOR, fontWeight: "bold" }}>
                          {"Read More"}
                        </Text>
                      )}
                    </TouchableOpacity>
                  </>
                  {/* <ReadMore numberOfLines={3} style={styles.detailsText} seeMoreText="Read More" seeMoreStyle={{ color: TAB_COLOR, fontWeight: 'bold' }} seeLessStyle={{ color: TAB_COLOR, fontWeight: 'bold' }}>
                                        <Text style={styles.detailsText}>{description}</Text>
                                    </ReadMore> */}
                </View>
              </View>

              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "flex-start",
                  alignItems: "flex-start",
                  width: "100%",
                  padding: 10,
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "center",
                    alignItems: "center",
                    marginRight: 50,
                  }}
                >
                  <TouchableOpacity
                    onPress={shareOptions}
                    style={{
                      justifyContent: "center",
                      alignItems: "center",
                      flexDirection: "row",
                      width: 34,
                      height: 34,
                      borderRadius: 17,
                      borderWidth: 2,
                      borderColor: TAB_COLOR,
                    }}
                  >
                    <MaterialCommunityIcons
                      name="share-variant"
                      size={20}
                      color={NORMAL_TEXT_COLOR}
                    />
                  </TouchableOpacity>
                  <Text style={{ color: NORMAL_TEXT_COLOR, marginLeft: 10 }}>
                    Share
                  </Text>
                </View>

                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <TouchableOpacity
                    onPress={() =>
                      navigation.navigate("Calendarscreen", {
                        episodeUrl: episodeUrl,
                      })
                    }
                    style={{
                      justifyContent: "center",
                      alignItems: "center",
                      flexDirection: "row",
                      width: 34,
                      height: 34,
                      borderRadius: 17,
                      borderWidth: 2,
                      borderColor: TAB_COLOR,
                    }}
                  >
                    <MaterialCommunityIcons
                      name="calendar-month"
                      size={20}
                      color={NORMAL_TEXT_COLOR}
                    />
                  </TouchableOpacity>
                  <Text style={{ color: NORMAL_TEXT_COLOR, marginLeft: 10 }}>
                    Filter By Date
                  </Text>
                </View>
              </View>
              <View style={{ width: "100%" }}>
                {seasons.length > 1 ? (
                  <>
                    <View
                      style={{
                        justifyContent: "center",
                        alignItems: "center",
                        marginTop: 10,
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 18,
                          fontWeight: "500",
                          color: NORMAL_TEXT_COLOR,
                        }}
                      >
                        SELECT SEASON
                      </Text>
                    </View>
                    <FlatList
                      data={seasons}
                      horizontal={true}
                      renderItem={(item, index) => {
                        return (
                          <>
                            {selectTitle != item.item.title ? (
                              <TouchableOpacity
                                key={"seasons" + index}
                                onPress={() =>
                                  movetoscreen(
                                    item.item.seo_url,
                                    index,
                                    item.item.title
                                  )
                                }
                              >
                                <View
                                  style={{
                                    borderBottomColor: IMAGE_BORDER_COLOR,
                                    borderBottomWidth: 0.5,
                                    padding: 15,
                                  }}
                                >
                                  <Text
                                    style={{
                                      color: NORMAL_TEXT_COLOR,
                                      fontWeight: "500",
                                    }}
                                  >
                                    {item.item.title}
                                  </Text>
                                </View>
                              </TouchableOpacity>
                            ) : (
                              <TouchableOpacity
                                key={"seasons" + index}
                                onPress={() =>
                                  movetoscreen(
                                    item.item.seo_url,
                                    index,
                                    item.item.title
                                  )
                                }
                              >
                                <View
                                  style={{
                                    borderBottomColor: IMAGE_BORDER_COLOR,
                                    borderBottomWidth: 0.5,
                                    padding: 15,
                                  }}
                                >
                                  <Text
                                    style={{
                                      color: TAB_COLOR,
                                      fontWeight: "500",
                                    }}
                                  >
                                    {item.item.title}
                                  </Text>
                                </View>
                              </TouchableOpacity>
                            )}
                          </>
                        );
                      }}
                    />
                  </>
                ) : (
                  ""
                )}
              </View>
              <View
                style={{
                  justifyContent: "flex-start",
                  alignItems: "flex-start",
                  alignContent: "flex-start",
                  width: "100%",
                }}
              >
                {subcategoryList ? (
                  <FlatList
                    data={subcategoryList}
                    renderItem={renderSubcat}
                    horizontal={true}
                    keyExtractor={(x, i) => i.toString()}
                    contentContainerStyle={{}}
                  />
                ) : (
                  ""
                )}
                <View
                  style={{
                    borderBottomColor: FOOTER_DEFAULT_TEXT_COLOR,
                    borderBottomWidth: 1,
                    height: 5,
                    width: "100%",
                  }}
                ></View>
                {!subcatLoading ? (
                  <View style={{ width: "100%" }}>
                    {!tabDataLoading ? (
                      <FlatList
                        keyExtractor={(x, i) => i.toString()}
                        contentContainerStyle={{}}
                        data={internalTabs}
                        horizontal={true}
                        renderItem={(item, index) => {
                          return (
                            <TouchableOpacity
                              style={{ padding: 15 }}
                              onPress={() =>
                                getTabData(
                                  item.item.display_title,
                                  item.item.seo_url,
                                  item.item.layout_type
                                )
                              }
                            >
                              <Text
                                style={
                                  selectedTab == item.item.display_title
                                    ? {
                                        color: TAB_COLOR,
                                        fontSize: 14,
                                        fontWeight: "600",
                                      }
                                    : { color: NORMAL_TEXT_COLOR }
                                }
                              >
                                {item.item.display_title}
                              </Text>
                            </TouchableOpacity>
                          );
                        }}
                      />
                    ) : (
                      <View
                        style={{
                          justifyContent: "center",
                          alignItems: "center",
                          width: "100%",
                          padding: 20,
                        }}
                      >
                        <ActivityIndicator
                          size={"large"}
                          color={NORMAL_TEXT_COLOR}
                        />
                      </View>
                    )}
                    {/* <Text style={{color:NORMAL_TEXT_COLOR}}>{JSON.stringify(subTabImages[0])}</Text> */}
                    <FlatList
                      data={subTabImages[0]}
                      keyExtractor={(x, i) => i.toString()}
                      contentContainerStyle={{ width: "100%" }}
                      renderItem={subcatrender}
                    />
                    {subcategoryImages.map((cat, i) => {
                      return (
                        <View
                          key={{ i }}
                          style={{ width: "100%", marginTop: 20 }}
                        >
                          {cat[0] ? (
                            <FlatList
                              data={cat[0].thumbnails}
                              contentContainerStyle={
                                VIDEO_TYPES.includes(itemType)
                                  ? { width: "100%" }
                                  : {
                                      width: "100%",
                                      flexDirection: "row",
                                      flexWrap: "wrap",
                                    }
                              }
                              keyExtractor={(x, i) => i.toString()}
                              renderItem={subcatrender}
                              initialNumToRender={2}
                              maxToRenderPerBatch={3}
                              windowSize={5}
                            />
                          ) : (
                            <View
                              style={{
                                justifyContent: "center",
                                alignItems: "center",
                                padding: 10,
                              }}
                            >
                              <Text
                                style={{
                                  color: NORMAL_TEXT_COLOR,
                                  fontSize: 20,
                                }}
                              >
                                NO DATA AVAILABLE
                              </Text>
                            </View>
                          )}
                        </View>
                      );
                    })}
                  </View>
                ) : (
                  <View
                    style={{
                      justifyContent: "center",
                      alignItems: "center",
                      width: "100%",
                      padding: 20,
                    }}
                  >
                    <ActivityIndicator
                      size={"large"}
                      color={NORMAL_TEXT_COLOR}
                    />
                  </View>
                )}
              </View>
            </View>
          </ScrollView>

          <Modal
            isVisible={isModalVisible}
            testID={"modal"}
            animationIn="slideInDown"
            animationOut="slideOutDown"
            onBackdropPress={toggleModal}
            backdropColor={"black"}
            backdropOpacity={0.4}
          >
            <View
              style={{
                backgroundColor: NORMAL_TEXT_COLOR,
                width: "100%",
                backgroundColor: BACKGROUND_COLOR,
              }}
            >
              {prefrence.map((pref, ind) => {
                return pref.display_name != "" ? (
                  <TouchableOpacity
                    key={"pref" + ind}
                    onPress={() => {
                      startDownloading(
                        pref.playback_url,
                        pref.offlineUrl,
                        pref.downloaddirectory,
                        pref.display_name
                      );
                    }}
                  >
                    <View
                      style={{
                        padding: 13,
                        borderBottomColor: IMAGE_BORDER_COLOR,
                        borderBottomWidth: 0.5,
                      }}
                    >
                      <Text style={{ color: NORMAL_TEXT_COLOR }}>
                        {pref.display_name}
                      </Text>
                    </View>
                  </TouchableOpacity>
                ) : (
                  ""
                );
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
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingLeft: 35,
    paddingRight: 35,
    paddingBottom: 7,
    paddingTop: 7,
    borderRadius: 40,
    width: "98%",
    position: "absolute",
    bottom: 40,
    justifyContent: "center",
    alignItems: "center",
    borderColor: FOOTER_DEFAULT_TEXT_COLOR,
    borderWidth: 0.5,
  },
  playIcon: {
    position: "absolute",
    width: 30,
    height: 30,
    right: 10,
    bottom: 15,
  },
  crownIcon: { position: "absolute", width: 25, height: 25, left: 10, top: 10 },
  container: {
    backgroundColor: BACKGROUND_COLOR,
    alignItems: "center",
    justifyContent: "center",
  },
  mainContainer: { flex: 1, backgroundColor: BACKGROUND_COLOR },
  bodyContent: { backgroundColor: BACKGROUND_COLOR, width: PAGE_WIDTH },
  headingLabel: {
    fontSize: 20,
    color: NORMAL_TEXT_COLOR,
    padding: 4,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    borderBottomColor: FOOTER_DEFAULT_TEXT_COLOR,
    borderBottomWidth: 1,
  },
  detailsText: {
    fontSize: 12,
    marginBottom: 5,
    color: DETAILS_TEXT_COLOR,
    padding: 4,
  },
  options: {
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    padding: 4,
  },
  singleoption: {
    width: "33.33%",
    alignItems: "center",
    justifyContent: "center",
    borderColor: DARKED_BORDER_COLOR,
    borderWidth: 1,
    height: 45,
  },
  marginContainer: { marginLeft: 5, marginRight: 5 },
  imageSectionHorizontal: {
    width: "100%",
    height: actuatedNormalize(280),
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 1,
  },
  sectionHeaderMore: {
    color: NORMAL_TEXT_COLOR,
    fontSize: 15,
    textAlign: "right",
    fontWeight: "500",
  },
  imageSectionVertical: {
    width: PAGE_WIDTH / 3.1,
    height: actuatedNormalize(155),
    borderRadius: 5,
    marginBottom: 10,
    marginHorizontal: 1,
  },
  imageSectionVerticalTab: {
    width: 150,
    height: 170,
    marginHorizontal: 3,
    borderRadius: 5,
    marginBottom: 10,
  },
  imageSectionHorizontalTab: {
    width: 190,
    height: 117,
    marginHorizontal: 3,
    borderRadius: 10,
    marginBottom: 10,
    borderWidth: 1,
  },
});
