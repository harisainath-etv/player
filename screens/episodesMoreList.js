import * as React from "react";
import { useState, useEffect, useRef } from "react";
import {
  View,
  FlatList,
  StyleSheet,
  Text,
  ActivityIndicator,
  Image,
  TouchableOpacity,
} from "react-native";
import FastImage from "react-native-fast-image";
import {
  BACKGROUND_COLOR,
  TAB_COLOR,
  HEADING_TEXT_COLOR,
  IMAGE_BORDER_COLOR,
  NORMAL_TEXT_COLOR,
  ACCESS_TOKEN,
  PAGE_WIDTH,
  PAGE_HEIGHT,
  VIDEO_TYPES,
  LAYOUT_TYPES,
  FIRETV_BASE_URL_STAGING,
  AUTH_TOKEN,
} from "../constants";
import { StatusBar } from "expo-status-bar";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Footer from "./footer";
import NormalHeader from "./normalHeader";
import { StackActions } from "@react-navigation/native";

export const ElementsText = {
  AUTOPLAY: "AutoPlay",
};

var page = "featured-1";
var layout_type = LAYOUT_TYPES[0];
var selectedItem = 0;
var parent_id = "";
function EpisodesMoreList({ navigation, route }) {
  const [totalHomeData, settotalHomeData] = useState([]);
  {
    route.params ? (page = route.params.firendlyId) : (page = "");
  }
  {
    route.params
      ? (layout_type = route.params.layoutType)
      : (layout_type = LAYOUT_TYPES[0]);
  }
  {
    route.params ? (parent_id = route.params.parent_id) : (parent_id = "");
  }

  const [pageName, setpageName] = useState(page);
  const dataFetchedRef = useRef(false);
  const paginationLoadCount = 18;
  const [pagenumber, setPagenumber] = useState(0);
  const [displayTitle, setDisplayTitle] = useState("");
  const [loading, setloading] = useState(true);
  const [toload, settoload] = useState(true);
  async function loadData(p) {
    if (toload) {
      setloading(true);
      var All = [];
      var Final = [];
      var definedPageName = "";
      var premiumContent = false;
      var premiumCheckData = "";
      definedPageName = pageName;
      const region = await AsyncStorage.getItem("country_code");
      const url =
        FIRETV_BASE_URL_STAGING +
        "catalog_lists/" +
        pageName +
        ".gzip?item_language=eng&region=" +
        region +
        "&access_token=" +
        ACCESS_TOKEN +
        "&page=" +
        p +
        "&page_size=" +
        paginationLoadCount +
        "&npage_size=10&auth_token=" +
        AUTH_TOKEN +
        "&parent_id=" +
        parent_id;
      const resp = await fetch(url);
      const data = await resp.json();
      setPagenumber(p + 1);
      if (data.data.catalog_list_items.length > 0) {
        for (var i = 0; i < data.data.catalog_list_items.length; i++) {
          if (
            data.data.catalog_list_items[i].hasOwnProperty("access_control")
          ) {
            premiumCheckData = data.data.catalog_list_items[i].access_control;
            if (premiumCheckData != "") {
              if (premiumCheckData["is_free"]) {
                premiumContent = false;
              } else {
                premiumContent = true;
              }
            }
          }
          var displayTitle = data.data.catalog_list_items[i].title;
          if (displayTitle.length > 19)
            displayTitle = displayTitle.substr(0, 19) + "\u2026";

          if (data.data.catalog_list_items[i].media_list_in_list) {
            var splitted = data.data.catalog_list_items[i].seo_url.split("/");
            var friendlyId = splitted[splitted.length - 1];
            All.push({
              uri: data.data.catalog_list_items[i].list_item_object
                .banner_image,
              theme: data.data.catalog_list_items[i].theme,
              premium: premiumContent,
              seoUrl: data.data.catalog_list_items[i].seo_url,
              medialistinlist:
                data.data.catalog_list_items[i].media_list_in_list,
              friendlyId: friendlyId,
              displayTitle: displayTitle,
            });
          } else {
            if (
              data.data.catalog_list_items[i].thumbnails.hasOwnProperty(
                "high_4_3"
              ) ||
              data.data.catalog_list_items[i].thumbnails.hasOwnProperty(
                "high_3_4"
              )
            ) {
              if (layout_type == LAYOUT_TYPES[0])
                All.push({
                  uri: data.data.catalog_list_items[i].thumbnails.high_3_4.url,
                  theme: data.data.catalog_list_items[i].theme,
                  premium: premiumContent,
                  seoUrl: data.data.catalog_list_items[i].seo_url,
                  medialistinlist:
                    data.data.catalog_list_items[i].media_list_in_list,
                  friendlyId: "",
                  displayTitle: displayTitle,
                });
              else if (layout_type == LAYOUT_TYPES[1])
                All.push({
                  uri: data.data.catalog_list_items[i].thumbnails.high_4_3.url,
                  theme: data.data.catalog_list_items[i].theme,
                  premium: premiumContent,
                  seoUrl: data.data.catalog_list_items[i].seo_url,
                  medialistinlist:
                    data.data.catalog_list_items[i].media_list_in_list,
                  friendlyId: "",
                  displayTitle: displayTitle,
                });
            }
          }
        }
        Final.push({
          friendlyId: data.data.friendly_id,
          data: All,
          layoutType: data.data.layout_type,
          displayName: data.data.display_title,
        });
        setDisplayTitle(data.data.display_title);
        All = [];
      }

      if (Final.length <= 0) settoload(false);
      settotalHomeData((totalHomeData) => [...totalHomeData, ...Final]);
      setloading(false);
    }
  }
  const renderItem = ({ item, index }) => {
    return (
      <View style={{ backgroundColor: BACKGROUND_COLOR, flex: 1 }}>
        {layout_type == LAYOUT_TYPES[0] ? (
          <View>
            <FlatList
              data={item.data}
              keyExtractor={(x, i) => i.toString()}
              horizontal={false}
              onEndReached={loadNextData}
              showsHorizontalScrollIndicator={false}
              style={styles.containerMargin}
              numColumns={3}
              ListEmptyComponent={
                <View>
                  <Text
                    style={{
                      fontSize: 20,
                      fontFamily: "bold",
                      color: NORMAL_TEXT_COLOR,
                      //  marginLeft:55
                      alignSelf: "center",
                    }}
                  >
                    No Results Found
                  </Text>
                </View>
              }
              renderItem={({ item, index }) => (
                <View>
                  <TouchableOpacity
                    onPress={() => {
                      {
                        item.medialistinlist
                          ? navigation.navigate("MoreList", {
                              firendlyId: item.friendlyId,
                              layoutType: LAYOUT_TYPES[1],
                            })
                          : VIDEO_TYPES.includes(item.theme)
                          ? navigation.navigate("Episode", {
                              seoUrl: item.seoUrl,
                            })
                          : navigation.navigate("Shows", {
                              seoUrl: item.seoUrl,
                            });
                      }
                    }}
                  >
                    <FastImage
                      resizeMode={FastImage.resizeMode.contain}
                      style={[
                        styles.imageSectionVertical,
                        { resizeMode: "stretch" },
                      ]}
                      source={{
                        uri: item.uri,
                        priority: FastImage.priority.high,
                        cache: FastImage.cacheControl.immutable,
                      }}
                    />
                    {VIDEO_TYPES.includes(item.theme) ? (
                      <Image
                        source={require("../assets/images/play.png")}
                        style={{
                          position: "absolute",
                          width: 30,
                          height: 30,
                          right: 10,
                          bottom: 15,
                        }}
                      ></Image>
                    ) : (
                      ""
                    )}
                    {item.premium ? (
                      <Image
                        source={require("../assets/images/crown.png")}
                        style={styles.crownIcon}
                      ></Image>
                    ) : (
                      ""
                    )}
                  </TouchableOpacity>
                </View>
              )}
            />
          </View>
        ) : (
          ""
        )}

        {layout_type == LAYOUT_TYPES[1] ? (
          <View>
            <FlatList
              data={item.data}
              keyExtractor={(x, i) => i.toString()}
              horizontal={false}
              onEndReached={loadNextData}
              showsHorizontalScrollIndicator={false}
              numColumns={2}
              ListEmptyComponent={
                <View>
                  <Text
                    style={{
                      fontSize: 20,
                      fontFamily: "bold",
                      color: NORMAL_TEXT_COLOR,
                      //  marginLeft:55
                      alignSelf: "center",
                    }}
                  >
                    No Results Found
                  </Text>
                </View>
              }
              style={styles.containerMargin}
              renderItem={({ item, index }) => (
                <View style={{ width: PAGE_WIDTH / 2.06 }}>
                  <TouchableOpacity
                    onPress={() => {
                      {
                        item.medialistinlist
                          ? navigation.navigate("MoreList", {
                              firendlyId: item.friendlyId,
                              layoutType: LAYOUT_TYPES[1],
                            })
                          : VIDEO_TYPES.includes(item.theme)
                          ? navigation.dispatch(
                              StackActions.replace("Episode", {
                                seoUrl: item.seoUrl,
                              })
                            )
                          : navigation.dispatch(
                              StackActions.replace("Shows", {
                                seoUrl: item.seoUrl,
                              })
                            );
                      }
                    }}
                  >
                    <FastImage
                      resizeMode={FastImage.resizeMode.cover}
                      style={[
                        styles.imageSectionHorizontal,
                        { resizeMode: "stretch" },
                      ]}
                      source={{
                        uri: item.uri,
                        priority: FastImage.priority.high,
                        cache: FastImage.cacheControl.immutable,
                      }}
                    />
                    {VIDEO_TYPES.includes(item.theme) ? (
                      <Image
                        source={require("../assets/images/play.png")}
                        style={{
                          position: "absolute",
                          width: 30,
                          height: 30,
                          right: 10,
                          bottom: 15,
                        }}
                      ></Image>
                    ) : (
                      ""
                    )}
                    {item.premium ? (
                      <Image
                        source={require("../assets/images/crown.png")}
                        style={styles.crownIcon}
                      ></Image>
                    ) : (
                      ""
                    )}
                  </TouchableOpacity>
                  <Text
                    style={{
                      color: NORMAL_TEXT_COLOR,
                      alignSelf: "center",
                      marginBottom: 20,
                    }}
                  >
                    {item.displayTitle}
                  </Text>
                </View>
              )}
            />
          </View>
        ) : (
          ""
        )}
      </View>
    );
  };
  const loadNextData = async () => {
    loadData(pagenumber);
  };
  useEffect(() => {
    if (dataFetchedRef.current) return;
    dataFetchedRef.current = true;
    loadData(pagenumber);
    if (selectedItem == "") {
      selectedItem = 0;
    }
  }, []);
  return (
    <View style={{ flex: 1, backgroundColor: BACKGROUND_COLOR }}>
      <View style={styles.sectionHeaderView}>
        <NormalHeader></NormalHeader>
        <Text style={styles.sectionHeader}>{displayTitle}</Text>
      </View>

      {/* body content */}
      {totalHomeData ? (
        <FlatList
          data={totalHomeData}
          keyExtractor={(x, i) => i.toString()}
          horizontal={false}
          contentContainerStyle={{ flexGrow: 1, flexWrap: "nowrap" }}
          style={{ height: PAGE_HEIGHT }}
          ListEmptyComponent={
            <View>
              <Text
                style={{
                  fontSize: 20,
                  fontFamily: "bold",
                  color: NORMAL_TEXT_COLOR,
                  //  marginLeft:55
                  alignSelf: "center",
                }}
              >
                No Results Found
              </Text>
            </View>
          }
          renderItem={renderItem}
        />
      ) : (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <ActivityIndicator size="large" color={NORMAL_TEXT_COLOR} />
        </View>
      )}
      <View style={{ justifyContent: "center", alignItems: "center" }}>
        {loading ? (
          <ActivityIndicator
            size="large"
            color={NORMAL_TEXT_COLOR}
          ></ActivityIndicator>
        ) : (
          ""
        )}
      </View>
      <Footer pageName={page}></Footer>
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
  playIcon: {
    position: "absolute",
    width: 30,
    height: 30,
    right: 10,
    bottom: 15,
  },
  crownIcon: { position: "absolute", width: 25, height: 25, left: 10, top: 10 },
  Container: {
    backgroundColor: BACKGROUND_COLOR,
    textAlign: "center",
    justifyContent: "center",
    height: 60,
    width: "100%",
  },
  textTabActive: {
    textAlign: "center",
    justifyContent: "center",
    backgroundColor: TAB_COLOR,
    height: 43,
    borderRadius: 25,
    width: "100%",
  },
  textTab: {
    textAlign: "center",
    justifyContent: "center",
    height: 43,
    borderRadius: 25,
    width: "100%",
  },
  textStyle: {
    color: NORMAL_TEXT_COLOR,
    textAlign: "center",
    justifyContent: "center",

    fontWeight: "600",
  },
  sectionHeaderView: {
    flexDirection: "row",
    width: "100%",
    alignItems: "center",
    marginBottom: 20,
  },
  sectionHeader: {
    color: HEADING_TEXT_COLOR,
    fontSize: 20,
    fontWeight: "400",
    marginLeft: 20,
    marginTop: 90,
  },
  imageSectionHorizontal: {
    width: PAGE_WIDTH / 2.06,
    height: 117,
    marginHorizontal: 3,
    borderRadius: 10,
    marginBottom: 10,
    borderWidth: 1,
  },
  imageSectionHorizontalSingle: {
    width: PAGE_WIDTH - 20,
    height: 250,
    marginHorizontal: 3,
    borderRadius: 10,
    marginBottom: 10,
    borderWidth: 1,
    resizeMode: "stretch",
  },
  imageSectionVertical: {
    width: PAGE_WIDTH / 3.15,
    height: 170,
    marginHorizontal: 3,
    borderRadius: 10,
    marginBottom: 10,
  },
  imageSectionCircle: {
    marginHorizontal: 0,
    marginBottom: 10,
    width: PAGE_WIDTH / 3 - 10,
    height: PAGE_WIDTH / 3 - 10,
    borderRadius: (PAGE_WIDTH / 3 - 10) / 2,
  },
  imageSectionBig: {
    width: PAGE_WIDTH / 1.1,
    height: 230,
    marginHorizontal: 8,
    borderRadius: 1,
    padding: 20,
    borderColor: IMAGE_BORDER_COLOR,
    borderWidth: 1,
  },
  imageSectionBigSingle: {
    width: PAGE_WIDTH / 1.04,
    height: 230,
    marginHorizontal: 8,
    borderRadius: 7,
    padding: 20,
  },
  imageSectionBigWithBorder: {
    width: PAGE_WIDTH / 1.1,
    height: 230,
    marginHorizontal: 8,
    borderRadius: 1,
    padding: 20,
    borderRadius: 10,
    borderColor: IMAGE_BORDER_COLOR,
    borderWidth: 1,
  },
  image: {
    position: "absolute",
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    resizeMode: "stretch",
    borderRadius: 10,
    height: 470,
  },
  showsbannerimage: {
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    resizeMode: "cover",
    borderRadius: 10,
    height: 250,
  },
});

export default EpisodesMoreList;
