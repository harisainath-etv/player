import React from "react";
import { useState, useEffect, useRef, useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
import {
  NORMAL_TEXT_COLOR,
  BACKGROUND_COLOR,
  TAB_COLOR,
  BUTTON_COLOR,
  BACKGROUND_TRANSPARENT_COLOR,
  SLIDER_PAGINATION_SELECTED_COLOR,
  SLIDER_PAGINATION_UNSELECTED_COLOR,
  SIDEBAR_BACKGROUND_COLOR,
  PAGE_HEIGHT,
  PAGE_WIDTH,
  FIRETV_BASE_URL_STAGING,
  VIDEO_AUTH_TOKEN,
  ACCESS_TOKEN,
  DARKED_BORDER_COLOR,
  FOOTER_DEFAULT_TEXT_COLOR,
  ANDROID_PACKAGE_NAME,
  ANDROID_SHARE_MESSAGE,
  ANDROID_SHARE_URL,
  IOS_PACKAGE_NAME,
} from "../constants";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  View,
  TouchableOpacity,
  ImageBackground,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  StatusBar,
  ActivityIndicator,
} from "react-native";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import { Image } from "react-native-elements";
import Footer from "./footer";
import axios from "axios";
import FastImage from "react-native-fast-image";
import LinearGradient from "react-native-linear-gradient";
import Rate, { AndroidMarket } from "react-native-rate";
import Share from "react-native-share";
var watchlaterTasks = [];
export default function Menu() {
  const pageName = "";
  const navigation = useNavigation();
  const [isModalVisible, setModalVisible] = useState(false);
  const [login, setLogin] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [profilePic, setProfilePic] = useState();
  const [subscription_title, setsubscription_title] = useState("");
  const [watchlistVideo, setWatchlistVideo] = useState();
  const dataFetchedRef = useRef(false);
  const [otp, setOtp] = useState();
  const [otpactivatteError, setotpactivatteError] = useState("");

  const loadData = async () => {
    const firstname = await AsyncStorage.getItem("firstname");
    const email = await AsyncStorage.getItem("email_id");
    const mobile_number = await AsyncStorage.getItem("mobile_number");
    const session = await AsyncStorage.getItem("session");
    const profile_pic = await AsyncStorage.getItem("profile_pic");
    const subscriptiontitle = await AsyncStorage.getItem("subscription_title");
    if (session != "" && session != null) {
      setLogin(true);
      setName(firstname);
      setEmail(email);
      setMobile(mobile_number);
      setsubscription_title(subscriptiontitle);
    }
    if (profile_pic != "" && profile_pic != null) setProfilePic(profile_pic);
    await loadWatchLaterData();
  };

  const loadWatchLaterData = async () => {
    var sessionId = await AsyncStorage.getItem("session");
    var region = await AsyncStorage.getItem("country_code");

    axios
      .get(
        FIRETV_BASE_URL_STAGING +
          "/users/" +
          sessionId +
          "/playlists/watchlater/listitems?auth_token=" +
          VIDEO_AUTH_TOKEN +
          "&access_token=" +
          ACCESS_TOKEN +
          "&region=" +
          region
      )
      .then((response) => {
        console.log(JSON.stringify(response.data.data.items.length));
        for (var i = 0; i < response.data.data.items.length; i++) {
          watchlaterTasks.push({
            title: response.data.data.items[i].title,
            thumbnail: response.data.data.items[i].thumbnails.high_4_3.url,
            seo_url: response.data.data.items[i].seo_url,
            theme: response.data.data.items[i].theme,
            listitem_id: response.data.data.items[i].listitem_id,
            contentId: response.data.data.items[i].content_id,
          });
        }
        setWatchlistVideo(watchlaterTasks);
        watchlaterTasks = [];
      })
      .catch((error) => {
        //console.log(JSON.stringify(error.response.data));
      });
  };

  useFocusEffect(
    useCallback(() => {
      if (dataFetchedRef.current) return;
      dataFetchedRef.current = true;
      loadData();
    }, [])
  );
  function validURL(str) {
    var pattern = new RegExp(
      "^(https?:\\/\\/)?" + // protocol
        "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|" + // domain name
        "((\\d{1,3}\\.){3}\\d{1,3}))" + // OR ip (v4) address
        "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" + // port and path
        "(\\?[;&a-z\\d%_.~+=-]*)?" + // query string
        "(\\#[-a-z\\d_]*)?$",
      "i"
    ); // fragment locator
    return !!pattern.test(str);
  }

  const activateTv = async () => {
    var sessionId = await AsyncStorage.getItem("session");
    var region = await AsyncStorage.getItem("country_code");
    axios
      .post(
        FIRETV_BASE_URL_STAGING + "/generate_session_tv",
        {
          auth_token: VIDEO_AUTH_TOKEN,
          access_token: ACCESS_TOKEN,
          region: region,
          user: { session_id: sessionId, token: otp },
        },
        {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        }
      )
      .then((response) => {
        alert("Activated");
        setotpactivatteError("");
      })
      .catch((error) => {
        //console.log(JSON.stringify(error.response.data));
        setotpactivatteError(error.response.data.error.message);
      });
  };
  const loadView = async (key) => {
    var url = await AsyncStorage.getItem(key);
    navigation.navigate("Webview", { uri: url });
  };
  const navigatetopage = async () => {
    navigation.navigate("Feedback");
  };
  const [shareUrl, setShareUrl] = useState(ANDROID_SHARE_URL);
  const shareOptions = async () => {
    const shareOptions = {
      title: "Check out the ETV Win App",
      failOnCancel: false,
      message: ANDROID_SHARE_MESSAGE + shareUrl,
    };
    const ShareResponse = await Share.open(shareOptions);
  };
  const options = {
    AppleAppID: IOS_PACKAGE_NAME,
    GooglePackageName: ANDROID_PACKAGE_NAME,
    preferredAndroidMarket: AndroidMarket.Google,
    preferInApp: false,
    openAppStoreIfInAppFails: true,
  };
  return (
    <View style={{ backgroundColor: BACKGROUND_COLOR, flex: 1 }}>
      <ScrollView style={{ flex: 1 }}>
        <View
          style={{
            width: PAGE_WIDTH,
            flexDirection: "row",
            alignItems: "center",
            marginTop: 30,
          }}
        >
          <View style={[styles.leftItems]}>
            <Image
              source={require("../assets/images/winlogo.png")}
              style={styles.logoImage}
            ></Image>
          </View>
          {/* <View style={{ position: 'absolute', right: 30 }}>
            <TouchableOpacity onPress={() => { navigation.navigate('More') }}>
              <FontAwesome name='support' color={NORMAL_TEXT_COLOR} size={40} />
            </TouchableOpacity>
          </View> */}
        </View>
        <View style={{ marginBottom: 50 }}>
          {!login ? (
            <View style={{ justifyContent: "center", alignItems: "center" }}>
              <ActivityIndicator size={"large"} color={NORMAL_TEXT_COLOR} />
            </View>
          ) : (
            <TouchableOpacity
              onPress={() => {
                navigation.navigate("Profile");
              }}
            >
              <View style={styles.drawerHeaderImage}>
                <View
                  style={{
                    padding: 0,
                    backgroundColor: BACKGROUND_TRANSPARENT_COLOR,
                    width: "100%",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <View
                    style={{
                      justifyContent: "center",
                      alignItems: "center",
                      backgroundColor: SLIDER_PAGINATION_UNSELECTED_COLOR,
                      width: 60,
                      height: 60,
                      borderRadius: 30,
                    }}
                  >
                    <MaterialCommunityIcons
                      name="account-edit"
                      color={NORMAL_TEXT_COLOR}
                      size={25}
                      style={{}}
                    ></MaterialCommunityIcons>
                  </View>
                  <View
                    style={{ bottom: 0, flexDirection: "row", marginTop: 0 }}
                  >
                    <View
                      style={{
                        justifyContent: "center",
                        alignItems: "flex-start",
                      }}
                    >
                      <Text style={styles.drawerHeaderText}>Hi {name}</Text>
                      {email != "" && email != null && email != "null" ? (
                        <Text style={styles.drawerHeaderText}>{email}</Text>
                      ) : (
                        ""
                      )}
                    </View>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          )}
          {/* <Text style={{ color: NORMAL_TEXT_COLOR, fontSize: 18 }}>{subscription_title.split('"').join("")}</Text> */}
          {login ? (
            subscription_title == "" ||
            subscription_title == null ||
            subscription_title == "Free" ? (
              <TouchableOpacity
                onPress={() => navigation.navigate("Subscribe", {})}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                  marginTop: 8,
                }}
              >
                <LinearGradient
                  useAngle={true}
                  angle={125}
                  angleCenter={{ x: 0.5, y: 0.5 }}
                  colors={[BUTTON_COLOR, TAB_COLOR, BUTTON_COLOR]}
                  style={[styles.button, { width: "95%" }]}
                >
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <FontAwesome5
                      name="lock"
                      size={16}
                      color={NORMAL_TEXT_COLOR}
                      style={{ marginRight: 10 }}
                    />
                    <Text style={{ color: NORMAL_TEXT_COLOR, fontSize: 13 }}>
                      Subscribe
                    </Text>
                  </View>
                </LinearGradient>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                onPress={() => navigation.navigate("Subscribe", {})}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                  marginTop: 8,
                }}
              >
                <LinearGradient
                  useAngle={true}
                  angle={125}
                  angleCenter={{ x: 0.5, y: 0.5 }}
                  colors={[BUTTON_COLOR, TAB_COLOR, BUTTON_COLOR]}
                  style={[styles.button, { width: "95%" }]}
                >
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <FontAwesome5
                      name="lock"
                      size={16}
                      color={NORMAL_TEXT_COLOR}
                      style={{ marginRight: 10 }}
                    />
                    <Text style={{ color: NORMAL_TEXT_COLOR, fontSize: 13 }}>
                      Upgrade / Renew
                    </Text>
                  </View>
                </LinearGradient>
              </TouchableOpacity>
            )
          ) : (
            ""
          )}
          {/* {login ?
            <View style={{ padding: 15 }}>
               {watchlistVideo ?

                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 20, marginTop: 10 }}>
                  <Text style={{ color: NORMAL_TEXT_COLOR, fontSize: 22 }}>Watch List</Text>
                  <TouchableOpacity onPress={() => { navigation.navigate('WatchLater') }} style={{ position: 'absolute', right: 20 }}>
                  <MaterialCommunityIcons name='dots-grid' size={25} color={NORMAL_TEXT_COLOR} />
                  </TouchableOpacity>
                </View>
                : ""}
              <ScrollView horizontal={true} style={{ width: '100%' }}>
                {watchlistVideo ?
                  watchlistVideo.map((singleVideo, index) => {
                    return (
                      <View key={index} style={{ borderRadius: 15, borderWidth: 1, marginRight: 5, width: (PAGE_WIDTH / 2) - 17 }}>
                        {singleVideo.thumbnail ?
                          <TouchableOpacity onPress={() => navigation.dispatch(StackActions.replace('Episode', { seoUrl: singleVideo.seo_url, theme: singleVideo.theme }))} style={{ alignItems: 'center', }}>


                            <FastImage
                              style={{ width: "100%", height: 120, left: 0, borderRadius: 15, marginRight: 5 }}
                              source={{ uri: singleVideo.thumbnail, priority: FastImage.priority.high }}
                              resizeMode={FastImage.resizeMode.stretch}
                            />
                            <View style={{ justifyContent: 'center', alignSelf: 'center', width: "100%", marginRight: 2 }}>
                          <Text style={{ color: NORMAL_TEXT_COLOR }}>{singleVideo.title}</Text>
                        </View>
                          </TouchableOpacity>
                          : ""}
                      </View>
                    )
                  })
                  :
                  ""
                }
              </ScrollView>
            </View>
            :
            ""}  */}
          {login ? (
            <View style={{ padding: 10, marginTop: 10 }}>
              <View style={{ alignItems: "center", marginBottom: 20 }}>
                <Text
                  style={{
                    fontWeight: "bold",
                    color: NORMAL_TEXT_COLOR,
                    fontSize: 15,
                  }}
                >
                  Activate ETV WIN on your TV
                </Text>
                <Text style={{ color: NORMAL_TEXT_COLOR, fontSize: 12 }}>
                  Enter the Activation code displayed on your TV screen
                </Text>
                <Text style={{ marginTop: 5, color: TAB_COLOR }}>
                  {otpactivatteError}
                </Text>
                <View style={{ flexDirection: "row", marginTop: 20 }}>
                  <TextInput
                    textAlign="center"
                    style={styles.input}
                    onChangeText={setOtp}
                    value={otp}
                    placeholder="Enter Activation Code"
                    keyboardType="numeric"
                    placeholderTextColor={NORMAL_TEXT_COLOR}
                  />
                  <View
                    style={{ justifyContent: "center", alignItems: "center" }}
                  >
                    <TouchableOpacity onPress={activateTv}>
                      <LinearGradient
                        useAngle={true}
                        angle={125}
                        angleCenter={{ x: 0.5, y: 0.5 }}
                        colors={[BUTTON_COLOR, TAB_COLOR, BUTTON_COLOR]}
                        style={[styles.button]}
                      >
                        <Text
                          style={{ color: NORMAL_TEXT_COLOR, fontSize: 13 }}
                        >
                          Activate
                        </Text>
                      </LinearGradient>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>

              <View style={{}}>
                <Text
                  style={{
                    color: FOOTER_DEFAULT_TEXT_COLOR,
                    fontWeight: "bold",
                    marginBottom: 10,
                  }}
                >
                  PROFILE
                </Text>

                <TouchableOpacity
                  style={styles.tabBlock}
                  onPress={() => navigation.navigate("Offline")}
                >
                  <MaterialCommunityIcons
                    name="download"
                    size={18}
                    color={NORMAL_TEXT_COLOR}
                  />
                  <Text style={styles.listitemsText}>Offline Downloads</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.tabBlock}
                  onPress={() => navigation.navigate("WatchLater")}
                >
                  <MaterialIcons
                    name="watch-later"
                    size={18}
                    color={NORMAL_TEXT_COLOR}
                  />
                  <Text style={styles.listitemsText}>Watch Later</Text>
                </TouchableOpacity>
              </View>

              <View style={{ marginTop: 15 }}>
                <Text
                  style={{
                    color: FOOTER_DEFAULT_TEXT_COLOR,
                    fontWeight: "bold",
                    marginBottom: 10,
                  }}
                >
                  EXTRAS
                </Text>

                <TouchableOpacity
                  style={{ marginBottom: 7 }}
                  onPress={() =>
                    navigation.navigate("HTMLRender", { pagename: "about_us" })
                  }
                >
                  <Text style={styles.listitemsText}>About Us</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={{ marginBottom: 7 }}
                  onPress={() => loadView("contactUs")}
                >
                  <Text style={styles.listitemsText}>Contact Us</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={{ marginBottom: 7 }}
                  onPress={() => loadView("privacy")}
                >
                  <Text style={styles.listitemsText}>Privacy Policy</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={{ marginBottom: 7 }}
                  onPress={() =>
                    navigation.navigate("HTMLRender", {
                      pagename: "terms_conditions",
                    })
                  }
                >
                  <Text style={styles.listitemsText}>Terms of Service</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={{ marginBottom: 7 }}
                  onPress={() => loadView("faq")}
                >
                  <Text style={styles.listitemsText}>FAQ</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={{ marginBottom: 7 }}
                  onPress={navigatetopage}
                >
                  <Text style={styles.listitemsText}>Feedback</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={{ marginBottom: 7 }}
                  onPress={shareOptions}
                >
                  <Text style={styles.listitemsText}>Share the app</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{ marginBottom: 7 }}
                  onPress={() => {
                    Rate.rate(options, (success, errorMessage) => {
                      if (success) {
                      }
                      if (errorMessage) {
                        // errorMessage comes from the native code. Useful for debugging, but probably not for users to view
                        console.error(
                          `Example page Rate.rate() error: ${errorMessage}`
                        );
                      }
                    });
                  }}
                >
                  <Text style={styles.listitemsText}>Rate the app</Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            ""
          )}
        </View>
      </ScrollView>
      <View style={{ position: "absolute", bottom: 0 }}>
        <Footer pageName="MENU" />
      </View>
      <StatusBar
        animated
        backgroundColor="transparent"
        barStyle="dark-content"
        translucent={true}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  listitemsText: {
    color: NORMAL_TEXT_COLOR,
    fontSize: 13,
    fontWeight: "500",
    marginLeft: 8,
  },
  tabBlock: {
    width: "100%",
    backgroundColor: DARKED_BORDER_COLOR,
    height: 35,
    borderRadius: 3,
    justifyContent: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    padding: 3,
    marginBottom: 3,
  },
  menuItem: { flexDirection: "row", alignItems: "center", marginBottom: 30 },
  drawerHeaderText: {
    color: NORMAL_TEXT_COLOR,
    fontSize: 15,
    fontWeight: "bold",
  },
  drawerHeaderImage: { width: "100%" },
  drawerContainer: {
    flex: 1,
    backgroundColor: SIDEBAR_BACKGROUND_COLOR,
    height: PAGE_HEIGHT,
    width: PAGE_WIDTH / 1.3,
    left: -20,
    position: "absolute",
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 5,
  },
  leftItems: {
    width: "50%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
  },
  rightItems: {
    width: "50%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
  },
  logoImage: { width: 100, height: 55, resizeMode: "contain", marginLeft: 5 },
  subscribeImage: { width: 150, height: 80, resizeMode: "contain" },
  input: {
    borderWidth: 1,
    padding: 0,
    width: "70%",
    borderBottomColor: NORMAL_TEXT_COLOR,
    borderTopColor: BACKGROUND_COLOR,
    borderRightColor: BACKGROUND_COLOR,
    borderLeftColor: BACKGROUND_COLOR,
    color: NORMAL_TEXT_COLOR,
    fontSize: 15,
  },
  button: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: TAB_COLOR,
    color: NORMAL_TEXT_COLOR,
    width: 100,
    padding: 5,
    borderRadius: 20,
    borderColor: FOOTER_DEFAULT_TEXT_COLOR,
    borderWidth: 0.5,
  },
});
