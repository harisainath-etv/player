import {
  View,
  FlatList,
  Text,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import {
  ACCESS_TOKEN,
  AUTH_TOKEN,
  BACKGROUND_COLOR,
  BUTTON_COLOR,
  COMMON_BASE_URL,
  FIRETV_BASE_URL,
  FIRETV_BASE_URL_STAGING,
  NORMAL_TEXT_COLOR,
  PAGE_HEIGHT,
  PAGE_WIDTH,
  SECRET_KEY,
  TAB_COLOR,
  VIDEO_AUTH_TOKEN,
} from "../constants";
import TransparentHeader from "./transparentHeader";
import Video from "react-native-video";
import axios from "axios";
import AntDesign from "react-native-vector-icons/AntDesign";
import Ionicons from "react-native-vector-icons/Ionicons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Footer from "./footer";
import { stringMd5 } from "react-native-quick-md5";
import Share from "react-native-share";
import { StackActions } from "@react-navigation/native";
import JioAdView from "../JioAdView";
import { DeviceEventEmitter } from "react-native";
import { log } from "react-native-reanimated";
import { Image } from "react-native";
import normalize from "../Utils/Helpers/Dimen";
import Entypo from "react-native-vector-icons/Entypo";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import LinearGradient from "react-native-linear-gradient";
export default function Shorts({ navigation }) {
  const [startindex, setstartindex] = useState(0);
  var limit = 100;
  const [Videos, setVideos] = useState([]);
  const flatListRef = useRef();
  const videoRef = useRef();
  const [currentIndexValue, setcurrentIndexValue] = useState(0);
  const [stoploading, setstoploading] = useState(false);
  const [likecontent, setlikecontent] = useState(false);
  const [loggedin, setloggedin] = useState(false);
  const [scrollvideoid, setscrollvideoid] = useState();
  const [currentVideoIndex, setCurrentVideoIndex] = useState(-1);
  const handleVideoComplete = () => {
    console.log("hello");
    const nextIndex = currentVideoIndex + 1;
    if (nextIndex < Videos.length) {
      flatListRef.current.scrollToIndex({ index: nextIndex });
      setCurrentVideoIndex(nextIndex);
    }
  };
  const filterItems = (stringNeeded, arrayvalues) => {
    let query = stringNeeded.toLowerCase();
    return arrayvalues.filter((item) => item.toLowerCase().indexOf(query) >= 0);
  };
  const loginValidation = async () => {
    const session = await AsyncStorage.getItem("session");
    if (session != "" && session != null) {
      await axios
        .get(
          FIRETV_BASE_URL_STAGING +
            "user/session/" +
            session +
            "?auth_token=" +
            AUTH_TOKEN
        )
        .then((resp) => {
          if (resp.data.message == "Valid session id.") {
            setloggedin(true);
          }
        })
        .catch((err) => {
          console.log(err);
          setloggedin(false);
        });
    }
  };
  const getData = async () => {
    const region = await AsyncStorage.getItem("country_code");
    var sessionId = await AsyncStorage.getItem("session");
    const shortContent = await AsyncStorage.getItem("shortContent");
    if (shortContent != "" && shortContent != null) {
      const url =
        shortContent + ".gzip?&auth_token=" + AUTH_TOKEN + "&region=" + region;
      console.log(url);
      await AsyncStorage.removeItem("shortContent");

      axios
        .get(url)
        .then((response) => {
          var currentTimestamp = Math.floor(Date.now() / 1000).toString();
          if (sessionId == null) sessionId = "";
          var md5String = stringMd5(
            response.data.data.catalog_id +
              response.data.data.content_id +
              sessionId +
              currentTimestamp +
              SECRET_KEY
          );
          var likecontent = false;
          setlikecontent(false);
          getDetails(
            response.data.data.catalog_id,
            response.data.data.content_id,
            currentTimestamp,
            md5String,
            COMMON_BASE_URL + response.data.data.seo_url,
            response.data.data.title,
            likecontent,
            response.data.data.shorts_full_video_details.catalog_id,
            response.data.data.shorts_full_video_details.content_id
          );
        })
        .catch((error) => {
          console.log("forloop" + error);
        });
    }

    axios
      .get(
        FIRETV_BASE_URL_STAGING +
          "catalog_lists/shorts-data?item_language=eng&region=" +
          region +
          "&auth_token=" +
          AUTH_TOKEN +
          "&page=" +
          startindex +
          "&page_size=" +
          limit
      )
      .then((resp) => {
        for (var s = 0; s < resp.data.data.catalog_list_items.length; s++) {
          var removequeryStrings =
            resp.data.data.catalog_list_items[s].seo_url.split("?");
          var splittedData = removequeryStrings[0].split("/");
          splittedData = splittedData.filter(function (e) {
            return e;
          });
          const checkNews = filterItems("news", splittedData);
          const checkShow = filterItems("show", splittedData);
          const checkSeason = filterItems("season", splittedData);
          const checkChannel = filterItems("channel", splittedData);
          const checkEvent = filterItems("event", splittedData);
          const checkLive = filterItems("live", splittedData);
          var urlPath = "";
          if (splittedData.length == 4 && checkChannel == 0) {
            urlPath =
              FIRETV_BASE_URL +
              "catalogs/" +
              splittedData[0] +
              "/items/" +
              splittedData[1] +
              "/subcategories/" +
              splittedData[2] +
              "/episodes/" +
              splittedData[3];
          } else if (splittedData[0] == "tv-shows") {
            urlPath =
              FIRETV_BASE_URL +
              "catalogs/" +
              splittedData[0] +
              "/episodes/" +
              splittedData[splittedData.length - 1];
          } else if (splittedData[0] == "news" || checkNews.length > 0) {
            urlPath =
              FIRETV_BASE_URL +
              "catalogs/" +
              splittedData[splittedData.length - 3] +
              "/items/" +
              splittedData[splittedData.length - 2] +
              "/episodes/" +
              splittedData[splittedData.length - 1];
          } else if (
            (checkShow.length > 0 || checkEvent.length > 0) &&
            checkLive.length == 0
          ) {
            urlPath =
              FIRETV_BASE_URL +
              "catalogs/" +
              splittedData[0] +
              "/items/" +
              splittedData[splittedData.length - 2] +
              "/episodes/" +
              splittedData[splittedData.length - 1];
          } else if (checkChannel.length > 0) {
            urlPath =
              FIRETV_BASE_URL +
              "catalogs/" +
              splittedData[1] +
              "/items/" +
              splittedData[splittedData.length - 1];
          } else {
            urlPath =
              FIRETV_BASE_URL +
              "catalogs/" +
              splittedData[0] +
              "/items/" +
              splittedData[splittedData.length - 1];
          }
          const url =
            urlPath + ".gzip?&auth_token=" + AUTH_TOKEN + "&region=" + region;
          loadGenereratedApiDetails(url);
        }
        setstartindex(startindex + 1);
        if (resp.data.data.catalog_list_items.length == 0) setstoploading(true);
      })
      .catch((err) => {
        console.log("main error" + err);
      });

    const loadGenereratedApiDetails = async (url) => {
      axios
        .get(url)
        .then((response) => {
          var currentTimestamp = Math.floor(Date.now() / 1000).toString();
          if (sessionId == null) sessionId = "";
          var md5String = stringMd5(
            response.data.data.catalog_id +
              response.data.data.content_id +
              sessionId +
              currentTimestamp +
              SECRET_KEY
          );
          var likecontent = false;
          setlikecontent(false);
          getDetails(
            response.data.data.catalog_id,
            response.data.data.content_id,
            currentTimestamp,
            md5String,
            COMMON_BASE_URL + response.data.data.seo_url,
            response.data.data.title,
            likecontent,
            response.data.data.shorts_full_video_details.catalog_id,
            response.data.data.shorts_full_video_details.content_id
          );
        })
        .catch((error) => {
          console.log("forloop" + error);
        });
    };
    const getDetails = async (
      catalog_id,
      content_id,
      currentTimestamp,
      md5String,
      shareUrl,
      title,
      likecontent,
      full_catalog_id,
      full_content_id
    ) => {
      axios
        .post(
          FIRETV_BASE_URL + "v2/users/get_all_details",
          {
            catalog_id: catalog_id,
            content_id: content_id,
            category: "",
            region: region,
            auth_token: VIDEO_AUTH_TOKEN,
            access_token: ACCESS_TOKEN,
            id: sessionId,
            ts: currentTimestamp,
            md5: md5String,
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        )
        .then((res) => {
          console.log(title + "," + res.data.data.stream_info.adaptive_url);
          if (res.data.data.stream_info.adaptive_url != "") {
            setVideos((Videos) => [
              ...Videos,
              ...[
                {
                  video: res.data.data.stream_info.adaptive_url,
                  catalog_id: catalog_id,
                  content_id: content_id,
                  shareUrl: shareUrl,
                  title: title,
                  likecontent: likecontent,
                  full_catalog_id: full_catalog_id,
                  full_content_id: full_content_id,
                },
              ],
            ]);
          }
        })
        .catch((er) => {
          console.log("getall" + er);
        });
    };
  };
  useEffect(() => {
    loginValidation();
    getData();
  }, [currentIndexValue]);

  const likevideo = async (catalogId, contentId) => {
    if (!loggedin) {
      navigation.dispatch(StackActions.replace("Login"));
    } else {
      var sessionId = await AsyncStorage.getItem("session");
      await axios
        .post(
          FIRETV_BASE_URL + "users/" + sessionId + "/playlists/like",
          {
            listitem: {
              catalog_id: catalogId,
              content_id: contentId,
              like_count: "true",
            },
            auth_token: VIDEO_AUTH_TOKEN,
            access_token: ACCESS_TOKEN,
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        )
        .then((response) => {
          AsyncStorage.setItem("like_" + contentId, contentId);
          setlikecontent(true);
        })
        .catch((error) => {
          alert("Unable to like the content. Please try again later.");
        });
    }
  };
  const deleteLike = async (catalog_id, contentId) => {
    var sessionId = await AsyncStorage.getItem("session");
    var region = await AsyncStorage.getItem("country_code");
    await axios
      .get(
        FIRETV_BASE_URL +
          "/users/" +
          sessionId +
          "/playlists/like/listitems?auth_token=" +
          VIDEO_AUTH_TOKEN +
          "&access_token=" +
          ACCESS_TOKEN +
          "&region=" +
          region +
          "&content_id=" +
          contentId +
          "&catalog_id=" +
          catalog_id
      )
      .then((response) => {
        axios
          .delete(
            FIRETV_BASE_URL +
              "/users/" +
              sessionId +
              "/playlists/like/listitems/" +
              response.data.data.items[0].listitem_id +
              "?auth_token=" +
              VIDEO_AUTH_TOKEN +
              "&access_token=" +
              ACCESS_TOKEN +
              "&region=" +
              region
          )
          .then((resp) => {
            AsyncStorage.removeItem("like_" + contentId);
          })
          .catch((err) => {
            console.log("hihih");
            console.log(err);
          });
      })
      .catch((error) => {
        console.log("hellooooo");
        console.log(JSON.stringify(error));
      });

    setlikecontent(false);
  };

  const shareOptions = async (shareUrl, title) => {
    const shareOptions = {
      title: title,
      failOnCancel: false,
      urls: [shareUrl],
    };
    const ShareResponse = await Share.open(shareOptions);
  };
  const getlikes = async (val) => {
    var videoslist = JSON.parse(JSON.stringify(Videos));
    var currentvideo = JSON.parse(JSON.stringify(videoslist[val]));
    var sessionId = await AsyncStorage.getItem("session");
    var region = await AsyncStorage.getItem("country_code");

    if (sessionId != null) {
      axios
        .get(
          FIRETV_BASE_URL +
            "users/" +
            sessionId +
            "/playlists/like/listitems?auth_token=" +
            VIDEO_AUTH_TOKEN +
            "&access_token=" +
            ACCESS_TOKEN +
            "&region=" +
            region +
            "&content_id=" +
            currentvideo.content_id +
            "&catalog_id=" +
            currentvideo.catalog_id
        )
        .then((likeresp) => {
          console.log(likeresp.data.data.items[0].content_id);
          console.log(currentvideo.content_id);
          if (
            likeresp.data.data.items[0].content_id == currentvideo.content_id
          ) {
            setlikecontent(true);
          } else {
            setlikecontent(true);
          }
        })
        .catch((likeerror) => {
          console.log(likeerror);
          setlikecontent(false);
        });
    }

    setscrollvideoid(val);
  };
  const fullEpisode = async (full_catalog_id, full_content_id) => {
    const region = await AsyncStorage.getItem("country_code");
    var urlPath =
      FIRETV_BASE_URL +
      "catalogs/" +
      full_catalog_id +
      "/items/" +
      full_content_id +
      ".gzip?&auth_token=" +
      AUTH_TOKEN +
      "&region=" +
      region;
    axios
      .get(urlPath)
      .then((response) => {
        navigation.dispatch(
          StackActions.replace("Episode", {
            seoUrl: response.data.data.seo_url,
            theme: response.data.data.theme,
            goto: "Shorts",
          })
        );
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    const adClosedSubscription = DeviceEventEmitter.addListener(
      "onAdClosed",
      (isVideoCompleted) => {
        console.log(isVideoCompleted, "isVideoCompleted===================");
        if (!isVideoCompleted) {
          handleVideoComplete();
        }
      }
    );

    return () => {
      adClosedSubscription.remove();
    };
  }, [currentVideoIndex]);
  const renderItem = ({ item, index }) => {
    const isAdItem = (index + 1) % 2 === 0;
    return (
      <View
        style={{
          width: PAGE_WIDTH,
          height: Math.round(PAGE_HEIGHT),
          flex: 1,
          flexGrow: 1,
        }}
      >
        {isAdItem ? (
          <View
            style={{
              justifyContent: "center",
              alignItems: "center",
              marginTop: normalize(280),
            }}
          >
            <JioAdView
              adType={4}
              adspotKey={"fkh9qm1i"}
              adHeight={200}
              adWidth={300}
            />
            {/* <Image source={{uri:"https://etv-win-image.akamaized.net/etvwin/telugumovies/goonda/82793/goonda-Goonda_Movie-270x360.jpg"}} style={{resizeMode:'contain',height:200,width:'100%'}}/> */}
          </View>
        ) : (
          <>
            <Video
              ref={videoRef}
              source={{ uri: item.video }}
              controls={false}
              paused={currentIndexValue === index ? false : true}
              playInBackground={false}
              repeat={true}
              volume={1}
              rate={1.0}
              useTextureView={false}
              resizeMode={"stretch"}
              style={{
                width: PAGE_WIDTH,
                height: Math.round(PAGE_HEIGHT),
                flexGrow: 1,
                flex: 1,
              }}
              playWhenInactive={false}
              onEnd={handleVideoComplete}
            />
            <TouchableOpacity
              style={{
                width: PAGE_WIDTH,
                height: Math.round(PAGE_HEIGHT),
                position: "absolute",
                top: 0,
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: "rgba(0,0,0,0.1)",
              }}
              onPress={() => {
                if (currentIndexValue == -1) {
                  setcurrentIndexValue(index);
                } else {
                  setcurrentIndexValue(-1);
                }
              }}
            >
              {currentIndexValue == -1 ? (
                <AntDesign
                  name="pausecircle"
                  color={NORMAL_TEXT_COLOR}
                  size={40}
                ></AntDesign>
              ) : (
                ""
              )}

              <Text
                style={{
                  color: NORMAL_TEXT_COLOR,
                  fontSize: 16,
                  fontWeight: "bold",
                  position: "absolute",
                  bottom: 105,
                  left: 6,
                  padding: 5,
                  width: "60%",
                }}
              >
                # {item.title}
              </Text>
            </TouchableOpacity>

            <View style={{ position: "absolute", right: 15, top: "50%" }}>
              {item.likecontent ? (
                <TouchableOpacity
                  onPress={() => deleteLike(item.catalog_id, item.content_id)}
                  style={{ justifyContent: "center", alignItems: "center" }}
                >
                  <FontAwesome
                    name="heart"
                    size={24}
                    color="red"
                    style={{
                      backgroundColor: TAB_COLOR,
                      borderColor: TAB_COLOR,
                      borderWidth: 0.5,
                      borderRadius: 35 / 2,
                      width: 35,
                      height: 35,
                    }}
                  />
                </TouchableOpacity>
              ) : likecontent ? (
                <TouchableOpacity
                  onPress={() => deleteLike(item.catalog_id, item.content_id)}
                  style={{ justifyContent: "center", alignItems: "center" }}
                >
                  <FontAwesome
                    name="heart"
                    size={24}
                    color={NORMAL_TEXT_COLOR}
                    style={{
                      backgroundColor: TAB_COLOR,
                      borderColor: TAB_COLOR,
                      borderWidth: 0.5,
                      borderRadius: 35 / 2,
                      width: 35,
                      height: 35,
                      padding: 6,
                    }}
                  />
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  onPress={() => likevideo(item.catalog_id, item.content_id)}
                  style={{ justifyContent: "center", alignItems: "center" }}
                >
                  <Entypo
                    name="heart-outlined"
                    size={24}
                    color={NORMAL_TEXT_COLOR}
                    style={{
                      backgroundColor: TAB_COLOR,
                      borderColor: TAB_COLOR,
                      borderWidth: 0.5,
                      borderRadius: 35 / 2,
                      width: 35,
                      height: 35,
                      padding: 6,
                    }}
                  />
                </TouchableOpacity>
              )}

              <TouchableOpacity
                onPress={() => shareOptions(item.shareUrl, item.title)}
              >
                <MaterialCommunityIcons
                  name="share"
                  size={24}
                  color={NORMAL_TEXT_COLOR}
                  style={{
                    marginTop: 50,
                    backgroundColor: TAB_COLOR,
                    borderColor: TAB_COLOR,
                    borderWidth: 0.5,
                    borderRadius: 35 / 2,
                    width: 35,
                    height: 35,
                    padding: 2,
                    paddingHorizontal: 6,
                  }}
                />
              </TouchableOpacity>
            </View>
          </>
        )}

        {item.full_catalog_id && item.full_content_id && !isAdItem ? (
          <TouchableOpacity
            onPress={() =>
              fullEpisode(item.full_catalog_id, item.full_content_id)
            }
            style={{
              bottom: 50,
              borderRadius: 10,
              flexDirection: "row",
              borderColor: NORMAL_TEXT_COLOR,
              borderWidth: 0.5,
              padding: 7,
              width: "40%",
              backgroundColor: NORMAL_TEXT_COLOR,
              marginLeft: 8,
            }}
          >
            <Ionicons name="navigate-circle" size={30} color={TAB_COLOR} />
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
              style={{
                borderRadius: 10,
                left: 8,
                width: "65%",
              }}
            >
              <Text
                style={{
                  textAlign: "center",
                  fontSize: 12,
                  fontWeight: "bold",
                  color: NORMAL_TEXT_COLOR,
                  top: 8,
                }}
              >
                Watch Now
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        ) : (
          ""
        )}
      </View>
    );
  };
  return (
    <View
      style={{
        height: PAGE_HEIGHT,
        width: PAGE_WIDTH,
        backgroundColor: BACKGROUND_COLOR,
      }}
    >
      <TransparentHeader></TransparentHeader>
      <FlatList
        ref={flatListRef}
        data={Videos}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        keyExtractor={(x, i) => i.toString()}
        onScroll={(e) => {
          var val = Math.round(
            e.nativeEvent.contentOffset.y.toFixed(0) / PAGE_HEIGHT
          );
          setcurrentIndexValue(
            Math.round(e.nativeEvent.contentOffset.y.toFixed(0) / PAGE_HEIGHT)
          );
          if (
            Math.round(
              e.nativeEvent.contentOffset.y.toFixed(0) / PAGE_HEIGHT
            ) !=
              Math.round(
                e.nativeEvent.contentOffset.y.toFixed(0) / PAGE_HEIGHT
              ) &&
            stoploading == false
          ) {
            if (
              Math.round(
                e.nativeEvent.contentOffset.y.toFixed(0) / PAGE_HEIGHT
              ) %
                2 ==
              0
            ) {
              getData();
            }
          }
          if (val != scrollvideoid) {
            getlikes(val);
          }
        }}
        contentContainerStyle={{ minHeight: Math.round(PAGE_HEIGHT) }}
        renderItem={renderItem}
        pagingEnabled
      />
      <StatusBar
        animated
        backgroundColor="transparent"
        barStyle="dark-content"
        translucent={true}
      />
      {/* <Footer pageName="SHORTS" /> */}
    </View>
  );
}

const styles = StyleSheet.create({
  activityIndicator: {
    position: "absolute",
    top: 70,
    left: 70,
    right: 70,
    height: 50,
  },
});
