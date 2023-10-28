import {
  View,
  Text,
  FlatList,
  Pressable,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Image,
} from "react-native";
import React, { useEffect, useState, useRef } from "react";
import NormalHeader from "./normalHeader";
import {
  ACCESS_TOKEN,
  BACKGROUND_COLOR,
  DETAILS_TEXT_COLOR,
  FIRETV_BASE_URL_STAGING,
  NORMAL_TEXT_COLOR,
  SLIDER_PAGINATION_SELECTED_COLOR,
  SLIDER_PAGINATION_UNSELECTED_COLOR,
  TAB_COLOR,
  VIDEO_AUTH_TOKEN,
  BUTTON_COLOR,
} from "../constants";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import Ionicons from "react-native-vector-icons/Ionicons";
import { StatusBar } from "react-native";
import LinearGradient from "react-native-linear-gradient";

export default function Subscribe({ navigation }) {
  const [subscribeplans, setsubscribeplans] = useState([]);
  const dataFetchedRef = useRef(false);
  const [selectedplan, setSelectedPlan] = useState("");
  const [selectedplandetails, setselectedplandetails] = useState([]);
  const [selectedprice, setselectedprice] = useState();
  const [packdetails, setpackdetails] = useState([]);
  const [selectedname, setselectedname] = useState("");
  const [selectedcategoryid, setselectedcategoryid] = useState("");
  const [selectedpriceforpayment, setselectedpriceforpayment] = useState("");
  const [selectedpriceforduration, setselectedpriceforduration] = useState("");
  const [selectedpricecurrency, setselectedpricecurrency] = useState("");
  const [currency, setcurrency] = useState("");
  const [category, setcategory] = useState("all_access_pack");
  const [catalogid, setcatalogid] = useState("");
  const [planid, setplanid] = useState("");
  const [description, setdescription] = useState("");
  const [currentplan, setcurrentplan] = useState("");
  const loadData = async () => {
    var currentplan = await AsyncStorage.getItem("plan_id");
    setcurrentplan(currentplan);
    var items = [];
    AsyncStorage.setItem("selectedplan", selectedplan);
    const region = await AsyncStorage.getItem("country_code");
    axios
      .get(
        FIRETV_BASE_URL_STAGING +
          "catalogs/subscription/items.gzip?region=" +
          region +
          "&auth_token=" +
          VIDEO_AUTH_TOKEN +
          "&access_token=" +
          ACCESS_TOKEN
      )
      .then((resp) => {
        for (var i = 0; i < resp.data.data.items.length; i++) {
          items.push({
            display_title: resp.data.data.items[i].display_title,
            plan_id: resp.data.data.items[i].plan_id,
            category_id: resp.data.data.items[i].category_id,
            category: resp.data.data.items[i].category,
            status: resp.data.data.items[i].status,
            catalog_id: resp.data.data.items[i].catalog_id,
            pack_details: resp.data.data.items[i].pack_details,
          });
        }
        setsubscribeplans(items);
      })
      .catch((error) => {});
  };
  async function loadpackdetails() {
    var plans = [];
    const region = await AsyncStorage.getItem("country_code");
    const selectedPlan = await AsyncStorage.getItem("selectedplan");
    axios
      .get(
        FIRETV_BASE_URL_STAGING +
          "catalogs/subscription/items.gzip?region=" +
          region +
          "&auth_token=" +
          VIDEO_AUTH_TOKEN +
          "&access_token=" +
          ACCESS_TOKEN
      )
      .then((resp) => {
        for (var i = 0; i < resp.data.data.items.length; i++) {
          if (resp.data.data.items[i].plan_id == selectedPlan) {
            setpackdetails(resp.data.data.items[i].pack_details);
            setselectedname(resp.data.data.items[i].display_title);
            setselectedcategoryid(resp.data.data.items[i].category_id);
          }
          for (var p = 0; p < resp.data.data.items[i].plans.length; p++) {
            if (resp.data.data.items[i].plan_id == selectedPlan) {
              plans.push({
                id: resp.data.data.items[i].plans[p].id,
                title: resp.data.data.items[i].plans[p].title,
                ext_plan_id: resp.data.data.items[i].plans[p].ext_plan_id,
                region: resp.data.data.items[i].plans[p].region,
                price: resp.data.data.items[i].plans[p].price,
                currency: resp.data.data.items[i].plans[p].currency,
                currency_symbol:
                  resp.data.data.items[i].plans[p].currency_symbol,
                currency_notation:
                  resp.data.data.items[i].plans[p].currency_notation,
                striked_price: resp.data.data.items[i].plans[p].striked_price,
                duration: resp.data.data.items[i].plans[p].duration,
                period: resp.data.data.items[i].plans[p].period,
                display_period: resp.data.data.items[i].plans[p].display_period,
                offer_description:
                  resp.data.data.items[i].plans[p].offer_description,
                description: resp.data.data.items[i].plans[p].description,
                apple_product_id:
                  resp.data.data.items[i].plans[p].apple_product_id,
                google_product_id:
                  resp.data.data.items[i].plans[p].google_product_id,
                renewable_type: resp.data.data.items[i].plans[p].renewable_type,
                screen_limit: resp.data.data.items[i].plans[p].screen_limit,
                pack_order: resp.data.data.items[i].plans[p].pack_order,
                planlength: resp.data.data.items[i].plans.length,
              });
            }
          }
        }
        setselectedplandetails(plans);
      })
      .catch((error) => {});
  }
  const rendersubscriptionplans = (item, index) => {
    const styles = StyleSheet.create({
      container: {
        width: "90%",
        backgroundColor: "white",
        alignSelf: "center",
        marginTop: 20,
        marginBottom: 20,
        borderColor: TAB_COLOR,
        borderWidth: 0.5,
        elevation: 15,
        borderTopLeftRadius: 12,
        borderTopRightRadius: 12,
        borderBottomLeftRadius: 10,
        borderBottomRightRadius: 10,
      },
      image: {
        width: "100%",
        height: 170,
        borderTopLeftRadius: 11,
        borderTopRightRadius: 11,
      },
      content: {
        marginTop: 16,
        marginLeft: 20,
      },
      pressable: {
        width: "100%",
        display: "flex",
        alignSelf: "flex-end",
        alignItems: "center",
        justifyContent: "center",
      },
      gradirentButton: {
        width: "100%",
        display: "flex",
        alignSelf: "flex-end",
        alignItems: "center",
        justifyContent: "center",
        height: 30,
        borderBottomLeftRadius: 10,
        borderBottomRightRadius: 10,
      },
    });
    return (
      <View>
        <View style={styles.container} key={index}>
          <Pressable
            style={styles.pressable}
            onPress={() => {
              setSelectedPlan(item.item.plan_id);
              setselectedprice("");
              AsyncStorage.setItem("selectedplan", item.item.plan_id);
              loadpackdetails();
              setselectedname(item.item.display_title);
              setselectedcategoryid(item.item.category_id);
              setcategory(item.item.category);
              setcatalogid(item.item.catalog_id);
            }}
          >
            <Image
              style={styles.image}
              source={require("../assets/images/subscription_bg.jpg")}
            />

            <LinearGradient
              useAngle={true}
              angle={125}
              angleCenter={{ x: 0.5, y: 0.5 }}
              colors={[BUTTON_COLOR, TAB_COLOR, BUTTON_COLOR]}
              style={styles.gradirentButton}
            >
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Text
                  style={{
                    color: NORMAL_TEXT_COLOR,
                    fontSize: 15,
                    fontWeight: "bold",
                  }}
                >
                  {item.item.display_title.toUpperCase()}
                </Text>
              </View>
            </LinearGradient>
          </Pressable>
        </View>
      </View>
    );
  };
  const proceedtopay = async () => {
    var session = await AsyncStorage.getItem("session");
    var region = await AsyncStorage.getItem("country_code");
    if (session == "" || session == null) {
      navigation.navigate("Login");
    } else {
      if (selectedprice != "" && selectedprice != null) {
        axios
          .get(
            FIRETV_BASE_URL_STAGING +
              "users/" +
              session +
              "/user_plans/upgrade_plan?region=" +
              region +
              "&auth_token=" +
              VIDEO_AUTH_TOKEN +
              "&access_token=" +
              ACCESS_TOKEN +
              "&sub_theme_id=" +
              selectedcategoryid +
              "&to_plan=" +
              selectedprice
          )
          .then((resp) => {
            AsyncStorage.setItem(
              "actual_price",
              resp.data.data.payable.actual_price
            );
            AsyncStorage.setItem(
              "payable_amount",
              resp.data.data.payable.payable_amount
            );
            AsyncStorage.setItem(
              "payable_currency_symbol",
              resp.data.data.payable.currency_symbol
            );
            AsyncStorage.setItem("payable_selected_name", selectedname);
            AsyncStorage.setItem(
              "payable_selected_duration",
              selectedpriceforduration
            );
            AsyncStorage.setItem(
              "payable_currency",
              resp.data.data.payable.currency
            );
            AsyncStorage.setItem("payable_category", category);
            AsyncStorage.setItem(
              "payable_category_id",
              resp.data.data.payable.category_pack_id
            );
            AsyncStorage.setItem(
              "payable_catalog_id",
              resp.data.data.payable.subscription_catalog_id
            );
            AsyncStorage.setItem("payable_plan_id", planid);
            AsyncStorage.setItem("payable_description", description);
            if (resp.data.data.payable.allow_coupon == true)
              AsyncStorage.setItem("payable_coupon_display", "yes");
            else AsyncStorage.setItem("payable_coupon_display", "no");
            if (
              resp.data.data.existing_plan == null ||
              resp.data.data.existing_plan == ""
            ) {
              AsyncStorage.setItem("payable_upgrade", "no");
            } else {
              AsyncStorage.setItem("payable_upgrade", "yes");
            }
            navigation.navigate("Confirmation");
          })
          .catch((error) => {
            alert(error.response.data.error);
          });
      } else {
        alert("Please select a plan to proceed.");
      }
    }
  };
  useEffect(() => {
    if (dataFetchedRef.current) return;
    dataFetchedRef.current = true;
    loadData();
    loadpackdetails();
  });
  function renderProcessSection(val) {
    const styles = StyleSheet.create({
      container: {
        justifyContent: "center",
        alignItems: "center",
        display: "flex",
      },
      number: {
        color: "white",
        fontSize: 14,
      },
      horizontalLine: {
        width: 35,
        height: 1,
        backgroundColor: NORMAL_TEXT_COLOR,
        marginTop: -10,
        alignItems: "center",
        justifyContent: "center",
      },
    });
    return (
      <View
        style={{
          display: "flex",
          justifyContent: "space-evenly",
          flexDirection: "row",
          padding: 10,
        }}
      >
        <View
          style={{
            alignItems: "center",
          }}
        >
          {val == 1 ? (
            <>
              <MaterialCommunityIcons
                name="check-circle"
                size={20}
                color={TAB_COLOR}
              />
              <Text
                style={{
                  fontSize: 12,
                  paddingTop: 6,
                  color: TAB_COLOR,
                  fontWeight: "500",
                }}
              >
                Package
              </Text>
            </>
          ) : (
            <>
              <MaterialCommunityIcons
                name="check-circle"
                size={20}
                color={NORMAL_TEXT_COLOR}
              />
              <Text
                style={{
                  fontSize: 12,
                  paddingTop: 6,
                  color: NORMAL_TEXT_COLOR,
                  fontWeight: "500",
                }}
              >
                Package
              </Text>
            </>
          )}
        </View>
        <View style={styles.container}>
          <View style={styles.horizontalLine} />
        </View>
        <View
          style={{
            alignItems: "center",
          }}
        >
          {val == 2 ? (
            <>
              <MaterialCommunityIcons
                name="check-circle"
                size={20}
                color={TAB_COLOR}
              />
              <Text
                style={{
                  fontSize: 12,
                  paddingTop: 6,
                  color: TAB_COLOR,
                  fontWeight: "500",
                }}
              >
                Plan
              </Text>
            </>
          ) : (
            <>
              <MaterialCommunityIcons
                name="check-circle"
                size={20}
                color={NORMAL_TEXT_COLOR}
              />
              <Text
                style={{
                  fontSize: 12,
                  paddingTop: 6,
                  color: NORMAL_TEXT_COLOR,
                  fontWeight: "500",
                }}
              >
                Plan
              </Text>
            </>
          )}
        </View>
        <View style={styles.container}>
          <View style={styles.horizontalLine} />
        </View>
        <View
          style={{
            display: "flex",
            alignItems: "center",
          }}
        >
          {val == 3 ? (
            <>
              <MaterialCommunityIcons
                name="check-circle"
                size={20}
                color={TAB_COLOR}
              />
              <Text
                style={{
                  fontSize: 12,
                  paddingTop: 6,
                  color: TAB_COLOR,
                  fontWeight: "500",
                }}
              >
                Payment
              </Text>
            </>
          ) : (
            <>
              <MaterialCommunityIcons
                name="check-circle"
                size={20}
                color={NORMAL_TEXT_COLOR}
              />
              <Text
                style={{
                  fontSize: 12,
                  paddingTop: 6,
                  color: NORMAL_TEXT_COLOR,
                  fontWeight: "500",
                }}
              >
                Payment
              </Text>
            </>
          )}
        </View>
      </View>
    );
  }
  return (
    <ScrollView style={{ flex: 1, backgroundColor: BACKGROUND_COLOR }}>
      <TouchableOpacity
        onPress={() => {
          if (selectedplan != "") setSelectedPlan("");
          else if (navigation.canGoBack()) navigation.goBack();
          else
            navigation.dispatch(
              StackActions.replace("Home", { pageFriendlyId: "featured-1" })
            );
        }}
      >
        <Ionicons
          name="arrow-back"
          size={30}
          color={NORMAL_TEXT_COLOR}
          style={{ marginTop: 60, marginLeft: 10 }}
        />
      </TouchableOpacity>

      <View style={{ padding: 2 }}>
        {/* <Text style={{ color: NORMAL_TEXT_COLOR, fontSize: 20 }}>Subscription</Text> */}

        {subscribeplans && selectedplan == "" ? (
          <>
            {renderProcessSection(1)}
            <FlatList
              data={subscribeplans}
              keyExtractor={(x, i) => i.toString()}
              renderItem={rendersubscriptionplans}
            />
          </>
        ) : (
          ""
        )}

        {selectedplan != "" ? (
          <>
            {renderProcessSection(2)}
            <View style={{ justifyContent: "space-evenly" }}>
              {/* <Text style={{ fontSize: 22, fontWeight: "bold", margin: 10 }}>
                                Choose Your Plan
                            </Text> */}
              {selectedplandetails.map((resp, index) => {
                const styles = StyleSheet.create({
                  container: {
                    justifyContent: "space-between",
                    alignItems: "center",
                  },
                  box: {
                    borderRadius: 30,
                    width: "70%",
                    borderWidth: 2,
                    alignItems: "center",
                    borderColor:
                      selectedprice == resp.id && currentplan != resp.id
                        ? TAB_COLOR
                        : DETAILS_TEXT_COLOR,
                    backgroundColor: "white",
                  },
                  horizontalLine: {
                    marginTop: 5,
                    width: 70,
                    height: 1.5,
                    backgroundColor: DETAILS_TEXT_COLOR,
                  },
                  price: {
                    fontWeight: "bold",
                    fontSize: 22,
                  },
                  flexBox: {
                    marginTop: 10,
                    width: "100%",
                    justifyContent: "space-between",
                    padding: 5,
                    alignItems: "center",
                  },
                  button: {
                    paddingHorizontal: 22,
                    paddingVertical: 2,
                    borderRadius: 10,
                    // borderWidth: 1,
                    // borderColor: "green",
                  },
                  savingText: {
                    borderColor: "red",
                    color: "red",
                    padding: 2,
                    fontWeight: "bold",
                    fontSize: 16,
                    borderWidth: 1.5,
                    paddingHorizontal: 10,
                    borderRadius: 8,
                    marginTop: 10,
                  },
                });

                return (
                  <>
                    <TouchableOpacity
                      key={resp.id}
                      style={{}}
                      onPress={() => {
                        setselectedprice(resp.id);
                        setselectedpriceforpayment(resp.price);
                        setselectedpriceforduration(resp.display_period);
                        setselectedpricecurrency(resp.currency_symbol);
                        setcurrency(resp.currency);
                        setplanid(resp.id);
                        setdescription(resp.description);
                      }}
                    >
                      <View style={styles.container}>
                        <View
                          style={{ ...styles.box, marginBottom: 20 }}
                          key={index}
                        >
                          {currentplan == resp.id ? (
                            <Text
                              style={{
                                color: TAB_COLOR,
                                position: "absolute",
                                right: 15,
                                top: 5,
                                fontWeight: "700",
                                fontSize: 13,
                              }}
                            >
                              Active
                            </Text>
                          ) : (
                            ""
                          )}
                          <Text style={{ marginTop: 14, fontWeight: "bold" }}>
                            {resp.title} Plan
                          </Text>
                          <View style={styles.horizontalLine} />
                          {resp.striked_price && (
                            <Text style={styles.savingText}>
                              Save{" "}
                              {Math.round(
                                ((resp.striked_price - resp.price) /
                                  resp.striked_price) *
                                  100
                              )}
                              %
                            </Text>
                          )}

                          <View
                            style={{ marginTop: resp.striked_price ? 10 : 20 }}
                          >
                            <Text style={styles.price}>
                              {resp.currency_symbol} {resp.price}/{resp.period}
                            </Text>
                          </View>
                          <Text style={{ color: "gray", marginTop: 10 }}>
                            billed every {resp.period}
                          </Text>
                          <View style={styles.flexBox}>
                            <View
                              style={{
                                display: "flex",
                                flexDirection: "row",
                                justifyContent: "flex-start",
                                alignItems: "center",
                              }}
                            ></View>
                          </View>
                        </View>
                      </View>

                      {/* {currentplan == resp.id ?
                                                <Text style={{ color: SLIDER_PAGINATION_SELECTED_COLOR, position: 'absolute', right: 15, top: 5 }}>Active</Text>
                                                :
                                                ""} */}
                    </TouchableOpacity>
                  </>
                );
              })}
            </View>
            <View style={{ justifyContent: "center", alignItems: "center" }}>
              <View
                style={{
                  borderWidth: 1,
                  borderColor: DETAILS_TEXT_COLOR,
                  width: "90%",
                  padding: 7,
                  borderTopRightRadius: 10,
                  borderTopLeftRadius: 10,
                  backgroundColor: NORMAL_TEXT_COLOR,
                }}
              >
                <Text
                  style={{
                    color: BACKGROUND_COLOR,
                    fontSize: 13,
                    fontWeight: "500",
                  }}
                >
                  Avalibale Features
                </Text>
              </View>
              <View
                style={{
                  borderWidth: 1,
                  borderColor: DETAILS_TEXT_COLOR,
                  padding: 7,
                  width: "90%",
                  backgroundColor: NORMAL_TEXT_COLOR,
                  borderBottomLeftRadius: 10,
                  borderBottomRightRadius: 10,
                }}
              >
                {packdetails.map((resp) => {
                  return (
                    <View
                      style={{ alignItems: "center", flexDirection: "row" }}
                    >
                      <View
                        style={{ justifyContent: "flex-start", width: "60%" }}
                      >
                        <Text style={{ color: BACKGROUND_COLOR, fontSize: 11 }}>
                          {resp.info}
                        </Text>
                      </View>
                      <Text style={{ color: BACKGROUND_COLOR, fontSize: 11 }}>
                        {resp.value}
                      </Text>
                    </View>
                  );
                })}
              </View>

              <View
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                  marginTop: 10,
                  marginBottom: 10,
                  width: "90%",
                }}
              >
                <Text
                  style={{
                    color: NORMAL_TEXT_COLOR,
                    fontSize: 11,
                    fontWeight: "500",
                  }}
                >
                  HD, Full HD, 4K (2160p) Video Qualities are available only
                  when content is supported in their respective resolutions
                </Text>
              </View>

              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  width: "90%",
                  marginBottom: 15,
                }}
              >
                <View style={{ width: "100%" }}>
                  <View
                    style={{
                      justifyContent: "center",
                      alignItems: "center",
                      width: "100%",
                    }}
                  >
                    <TouchableOpacity
                      onPress={proceedtopay}
                      style={{ width: "100%" }}
                    >
                      <LinearGradient
                        useAngle={true}
                        angle={125}
                        angleCenter={{ x: 0.5, y: 0.5 }}
                        colors={[BUTTON_COLOR, TAB_COLOR, BUTTON_COLOR]}
                        style={{
                          justifyContent: "center",
                          alignItems: "center",
                          backgroundColor: TAB_COLOR,
                          color: NORMAL_TEXT_COLOR,
                          width: "100%",
                          padding: 12,
                          borderRadius: 10,
                          marginRight: 20,
                          borderColor: TAB_COLOR,
                          borderWidth: 0.5,
                        }}
                      >
                        <View
                          style={{ flexDirection: "row", alignItems: "center" }}
                        >
                          <Text
                            style={{
                              color: NORMAL_TEXT_COLOR,
                              fontSize: 13,
                              fontWeight: "bold",
                            }}
                          >
                            Subscribe
                          </Text>
                        </View>
                      </LinearGradient>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </View>
          </>
        ) : (
          ""
        )}
      </View>
      <StatusBar
        animated
        backgroundColor="transparent"
        barStyle="dark-content"
        translucent={true}
      />
    </ScrollView>
  );
}
