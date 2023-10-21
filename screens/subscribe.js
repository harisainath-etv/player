import {
  View,
  Text,
  Image,
  FlatList,
  Pressable,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import React, { useEffect, useState, useRef } from "react";
import NormalHeader from "./normalHeader";
import {
  ACCESS_TOKEN,
  BACKGROUND_COLOR,
  BACKGROUND_DARK_COLOR,
  BACKGROUND_TRANSPARENT_COLOR,
  BACKGROUND_TRANSPARENT_COLOR_MENU,
  BUTTON_COLOR,
  DARKED_BORDER_COLOR,
  DETAILS_TEXT_COLOR,
  FIRETV_BASE_URL_STAGING,
  NORMAL_TEXT_COLOR,
  SLIDER_PAGINATION_SELECTED_COLOR,
  SLIDER_PAGINATION_UNSELECTED_COLOR,
  TAB_COLOR,
  VIDEO_AUTH_TOKEN,
} from "../constants";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import LinearGradient from "react-native-linear-gradient";
import { Icon } from "react-native-elements";
import FontAwesome5Icon from "react-native-vector-icons/FontAwesome5";

export default function Subscribe({ navigation }) {
  const [subscribeplans, setsubscribeplans] = useState([]);
  const dataFetchedRef = useRef(false);
  const [selectedplan, setSelectedPlan] = useState("premium_plan");
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
    return (
      <View key={index} style={{ width: "50%", height: "100%" }}>
        <ScrollView>
          <View
            style={{
              padding: 20,
              justifyContent: "center",
              alignItems: "center",
              width: "100%",
              height: 100,
              flexDirection: "row",
            }}
          >
            {selectedplan == item.item.plan_id &&
            item.item.status == "published" ? (
              <MaterialCommunityIcons
                name="radiobox-marked"
                color={NORMAL_TEXT_COLOR}
                size={30}
              />
            ) : (
              <Pressable
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
                <MaterialCommunityIcons
                  name="radiobox-blank"
                  color={NORMAL_TEXT_COLOR}
                  size={30}
                />
              </Pressable>
            )}
            <Text style={{ color: NORMAL_TEXT_COLOR, fontSize: 25 }}>
              {item.item.display_title}
            </Text>
          </View>
        </ScrollView>
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

  return (
    <ScrollView style={{ flex: 1, backgroundColor: NORMAL_TEXT_COLOR }}>
      {/* <NormalHeader>Logo</NormalHeader> */}
      <View
        style={{
          display: "flex",
          justifyContent: "space-between",
          flexDirection: "row",
          padding: 30,
          flex: 1,
        }}
      >
        <View
          style={{
            display: "flex",
            alignItems: "center",
          }}
        >
          <Text
            style={{
              // color: NORMAL_TEXT_COLOR,
              fontSize: 14,
              // borderColor: NORMAL_TEXT_COLOR,
            }}
          >
            1
          </Text>
          <Text style={{ fontSize: 12 }}>Package Section</Text>
        </View>
        <View
          style={{
            display: "flex",
            alignItems: "center",
          }}
        >
          <Text
            style={{
              // color: NORMAL_TEXT_COLOR,
              fontSize: 14,
              // borderColor: NORMAL_TEXT_COLOR,
            }}
          >
            2
          </Text>
          <Text style={{ fontSize: 12 }}>Plan Section</Text>
        </View>
        <View
          style={{
            display: "flex",
            alignItems: "center",
          }}
        >
          <Text
            style={{
              // color: NORMAL_TEXT_COLOR,
              fontSize: 14,
              // borderColor: NORMAL_TEXT_COLOR,
            }}
          >
            3
          </Text>
          <Text style={{ fontSize: 12 }}>Payment</Text>
        </View>
      </View>
      <View style={{ display: "flex", alignItems: "center" }}>
        <Text style={{ color: BACKGROUND_DARK_COLOR, fontSize: 20 }}>
          Choose your Package
        </Text>
        <Text
          style={{ color: BACKGROUND_DARK_COLOR, fontSize: 16, marginTop: 5 }}
        >
          No commitment, cancel anytime
        </Text>
      </View>
      <View style={{ display: "flex", alignItems: "center", marginTop: 20 }}>
        <View
          style={{
            width: "85%",
            height: 350,
            backgroundColor: "white",
            borderRadius: 20,
            display: "flex",
          }}
        >
          <Image
            style={{
              width: "100%",
              height: "40%",
              borderTopLeftRadius: 20,
              borderTopRightRadius: 20,
            }}
            source={{
              uri: "https://cdn.mos.cms.futurecdn.net/ZHVbdKkdyKGMY6ooJpiUAb.jpg",
            }}
          />
          <View>
            <View
              style={{ display: "flex", alignItems: "center", marginLeft: 20 }}
            >
              <View
                style={{
                  width: "100%",
                  height: 1.5,
                  backgroundColor: NORMAL_TEXT_COLOR,
                  marginRight: 20,
                }}
              />
              <View
                style={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "space-between",
                  flexDirection: "row",
                }}
              >
                <Text
                  style={{ fontWeight: "600", color: "#89D8D3", fontSize: 16 }}
                >
                  VIP
                </Text>
                <Pressable>
                  <Text
                    style={{
                      fontSize: 14,
                      // padding: 2,
                      color: NORMAL_TEXT_COLOR,
                      backgroundColor: "#AA336A",
                      borderTopLeftRadius: 6,
                      borderBottomLeftRadius: 6,
                      paddingHorizontal: 10,
                    }}
                  >
                    most popular
                  </Text>
                </Pressable>
              </View>
              <View style={{ width: "100%", marginTop: 8 }}>
                <Text>
                  Enjoy ETV, Bal Bharat, Originals, exclusive series, movies,
                  premieres Live TV and more
                </Text>
                {/** TODO  replace with icon */}
                <Text style={{ marginTop: 4 }}>Discover features {">"}</Text>
              </View>
              <View
                style={{
                  display: "flex",
                  width: "100%",
                  flexDirection: "row",
                  marginTop: 4,
                  //   alignItems: "flex-start",
                  //   justifyContent: "flex-start",
                }}
              >
                <View
                  style={{ width: 2, height: 36, backgroundColor: "green" }}
                />
                <View style={{ marginLeft: 10 }}>
                  <Text>Starting from</Text>
                  <Text style={{ fontWeight: "700" }}>Rs.499 Per Year </Text>
                </View>
              </View>
            </View>
          </View>
          <TouchableOpacity
            style={{
              width: "100%",
              display: "flex",
              // backgroundColor: "#40e0d0",
              alignSelf: "flex-end",
              alignItems: "center",
              height: 22,
              borderBottomStartRadius: 10,
              borderBottomEndRadius: 10,
              marginTop: 15,
            }}
          >
            <LinearGradient
              useAngle={true}
              angle={125}
              angleCenter={{ x: 0.5, y: 0.5 }}
              colors={[BUTTON_COLOR, TAB_COLOR, BUTTON_COLOR]}
              style={[{ borderRadius: 40 }]}
            >
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                {/* <FontAwesome5Icon
                  name="Subscribe"
                  size={13}
                  color={NORMAL_TEXT_COLOR}
                  style={{ marginRight: 10 }}
                /> */}
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
            {/* <Text
              style={{ color: NORMAL_TEXT_COLOR, textTransform: "capitalize" }}
            >
              subscribe
            </Text> */}
          </TouchableOpacity>
        </View>
      </View>
      <View style={{ display: "flex", alignItems: "center", marginTop: 20 }}>
        <View
          style={{
            width: "85%",
            height: 350,
            backgroundColor: NORMAL_TEXT_COLOR,
            borderRadius: 20,
            display: "flex",
          }}
        >
          <Image
            style={{
              width: "100%",
              height: "40%",
              borderTopLeftRadius: 20,
              borderTopRightRadius: 20,
            }}
            source={{
              uri: "https://cdn.mos.cms.futurecdn.net/ZHVbdKkdyKGMY6ooJpiUAb.jpg",
            }}
          />
          <View style={{ marginTop: 14 }}>
            <View
              style={{ display: "flex", alignItems: "center", marginLeft: 20 }}
            >
              <View
                style={{
                  width: "100%",
                  display: "flex",
                  flexDirection: "row",
                }}
              >
                <Text
                  style={{ fontWeight: "600", color: "#89D8D3", fontSize: 16 }}
                >
                  Premium
                </Text>
                <View
                  style={{
                    width: 2,
                    height: 20,
                    backgroundColor: "blue",
                    marginLeft: 6,
                    marginRight: 6,
                  }}
                />
                <Text
                  style={{ fontWeight: "600", color: "#89D8D3", fontSize: 16 }}
                >
                  Imagine{" "}
                </Text>
              </View>

              <View style={{ width: "100%", marginTop: 8 }}>
                <Text>
                  Enjoy ETV, Bal Bharat, Originals, exclusive series, movies,
                  premieres Live TV and more
                </Text>
                {/** TODO  replace with icon */}
                <Text style={{ marginTop: 4 }}>Discover features {">"}</Text>
              </View>
              <View
                style={{
                  display: "flex",
                  width: "100%",
                  flexDirection: "row",
                  marginTop: 8,
                  marginBottom: 2,
                }}
              >
                <View
                  style={{ width: 2, height: 36, backgroundColor: "green" }}
                />
                <View style={{ marginLeft: 10 }}>
                  <Text>Starting from</Text>
                  <Text
                    style={{ fontWeight: "700", textTransform: "capitalize" }}
                  >
                    Rs. 499 Per Year
                  </Text>
                </View>
              </View>
            </View>
          </View>
          <TouchableOpacity
            style={{
              marginTop: 10,
              width: "100%",
              display: "flex",
              backgroundColor: "#40e0d0",
              alignSelf: "flex-end",
              alignItems: "center",
              height: 22,
              borderBottomStartRadius: 10,
              borderBottomEndRadius: 10,
            }}
          >
            <Text
              style={{
                color: NORMAL_TEXT_COLOR,
                fontSize: 16,
                textTransform: "capitalize",
              }}
            >
              Subscribe
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );

  //   return (
  //     <ScrollView style={{ flex: 1, backgroundColor: BACKGROUND_COLOR }}>
  //       <NormalHeader></NormalHeader>
  //       <View style={{ padding: 20 }}>
  //         <Text style={{ color: NORMAL_TEXT_COLOR, fontSize: 20 }}>
  //           Subscription
  //         </Text>
  //         <View
  //           style={{
  //             backgroundColor: SLIDER_PAGINATION_UNSELECTED_COLOR,
  //             height: 100,
  //             borderRadius: 10,
  //             marginTop: 10,
  //             width: "100%",
  //           }}
  //         >
  //           {subscribeplans ? (
  //             <FlatList
  //               data={subscribeplans}
  //               keyExtractor={(x, i) => i.toString()}
  //               renderItem={rendersubscriptionplans}
  //               numColumns={2}
  //             />
  //           ) : (
  //             ""
  //           )}
  //         </View>

  //         <View style={{ flexDirection: "row", justifyContent: "space-evenly" }}>
  //           {selectedplandetails.map((resp) => {
  //             return (
  //               <View
  //                 key={resp.id}
  //                 style={{
  //                   paddingTop: 20,
  //                   paddingBottom: 20,
  //                   backgroundColor: TAB_COLOR,
  //                   borderWidth: 1,
  //                   borderStyle: "dashed",
  //                   borderColor: DETAILS_TEXT_COLOR,
  //                   marginTop: 20,
  //                   borderRadius: 10,
  //                   justifyContent: "center",
  //                   alignItems: "center",
  //                   width: 100 / resp.planlength - 5 + "%",
  //                 }}
  //               >
  //                 {selectedprice == resp.id ? (
  //                   currentplan == resp.id ? (
  //                     ""
  //                   ) : (
  //                     <MaterialCommunityIcons
  //                       name="radiobox-marked"
  //                       size={30}
  //                       color={NORMAL_TEXT_COLOR}
  //                       style={{ position: "absolute", left: 0, top: 0 }}
  //                     />
  //                   )
  //                 ) : currentplan == resp.id ? (
  //                   ""
  //                 ) : (
  //                   <Pressable
  //                     style={{ position: "absolute", left: 0, top: 0 }}
  //                     onPress={() => {
  //                       setselectedprice(resp.id);
  //                       setselectedpriceforpayment(resp.price);
  //                       setselectedpriceforduration(resp.display_period);
  //                       setselectedpricecurrency(resp.currency_symbol);
  //                       setcurrency(resp.currency);
  //                       setplanid(resp.id);
  //                       setdescription(resp.description);
  //                     }}
  //                   >
  //                     <MaterialCommunityIcons
  //                       name="radiobox-blank"
  //                       size={30}
  //                       color={NORMAL_TEXT_COLOR}
  //                     />
  //                   </Pressable>
  //                 )}
  //                 {currentplan == resp.id ? (
  //                   <Text
  //                     style={{
  //                       color: SLIDER_PAGINATION_SELECTED_COLOR,
  //                       position: "absolute",
  //                       right: 15,
  //                       top: 5,
  //                     }}
  //                   >
  //                     Active
  //                   </Text>
  //                 ) : (
  //                   ""
  //                 )}
  //                 <View
  //                   style={{ justifyContent: "center", alignItems: "center" }}
  //                 >
  //                   <Text
  //                     style={{
  //                       color: NORMAL_TEXT_COLOR,
  //                       fontSize: 25,
  //                       marginRight: 10,
  //                       marginTop: 10,
  //                     }}
  //                   >
  //                     {resp.currency_symbol} {resp.price}
  //                   </Text>
  //                   {resp.striked_price ? (
  //                     <Text
  //                       style={{
  //                         color: NORMAL_TEXT_COLOR,
  //                         fontSize: 16,
  //                         textDecorationLine: "line-through",
  //                         textDecorationStyle: "solid",
  //                       }}
  //                     >
  //                       {resp.striked_price}
  //                     </Text>
  //                   ) : (
  //                     ""
  //                   )}
  //                 </View>
  //                 <Text style={{ color: NORMAL_TEXT_COLOR, fontSize: 12 }}>
  //                   Per {resp.display_period}
  //                 </Text>
  //                 <Text style={{ color: NORMAL_TEXT_COLOR, fontSize: 12 }}>
  //                   {resp.offer_description}
  //                 </Text>
  //               </View>
  //             );
  //           })}
  //         </View>
  //         <View
  //           style={{
  //             justifyContent: "center",
  //             alignItems: "center",
  //             marginTop: 20,
  //           }}
  //         >
  //           <View
  //             style={{
  //               borderWidth: 1,
  //               borderColor: DETAILS_TEXT_COLOR,
  //               width: "100%",
  //               padding: 15,
  //               borderTopRightRadius: 10,
  //               borderTopLeftRadius: 10,
  //               flexDirection: "row",
  //               justifyContent: "flex-start",
  //             }}
  //           >
  //             <Text style={{ color: NORMAL_TEXT_COLOR }}>Discover Feautures</Text>
  //             <MaterialCommunityIcons
  //               name="zodiac-pisces"
  //               size={20}
  //               color={NORMAL_TEXT_COLOR}
  //             />
  //           </View>
  //           <View
  //             style={{
  //               borderWidth: 1,
  //               borderColor: DETAILS_TEXT_COLOR,
  //               width: "100%",
  //               padding: 15,
  //             }}
  //           >
  //             {packdetails.map((resp) => {
  //               return (
  //                 <View style={{ alignItems: "center", flexDirection: "row" }}>
  //                   <View style={{ justifyContent: "flex-start", width: "60%" }}>
  //                     <Text style={{ color: NORMAL_TEXT_COLOR, fontSize: 18 }}>
  //                       {/* {resp.info} */}
  //                     </Text>
  //                   </View>
  //                   <Text style={{ color: NORMAL_TEXT_COLOR, fontSize: 18 }}>
  //                     {/* {resp.value} */}
  //                   </Text>
  //                 </View>
  //               );
  //             })}
  //           </View>
  //         </View>

  //         <View
  //           style={{
  //             justifyContent: "center",
  //             alignItems: "center",
  //             marginTop: 20,
  //             marginBottom: 20,
  //           }}
  //         >
  //           <Text style={{ color: NORMAL_TEXT_COLOR, fontSize: 16 }}>
  //             Enjoy Etv Bal Bharat,Originals,exclusive series,movie premiers,Live
  //             Tv and More
  //           </Text>
  //         </View>

  //         <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
  //           {selectedpricecurrency ? (
  //             <View>
  //               <Text style={{ color: DETAILS_TEXT_COLOR, fontSize: 20 }}>
  //                 {selectedname}
  //               </Text>
  //               <Text style={{ color: NORMAL_TEXT_COLOR, fontSize: 25 }}>
  //                 {selectedpricecurrency} {selectedpriceforpayment}{" "}
  //                 <Text style={{ fontSize: 15 }}>
  //                   / {selectedpriceforduration}
  //                 </Text>
  //               </Text>
  //             </View>
  //           ) : (
  //             <View></View>
  //           )}
  //           <View>
  //             <View style={{ justifyContent: "center", alignItems: "center" }}>
  //               <TouchableOpacity
  //                 onPress={proceedtopay}
  //                 style={{
  //                   justifyContent: "center",
  //                   alignItems: "center",
  //                   backgroundColor: TAB_COLOR,
  //                   color: NORMAL_TEXT_COLOR,
  //                   width: 150,
  //                   padding: 18,
  //                   borderRadius: 10,
  //                   marginRight: 20,
  //                 }}
  //               >
  //                 <Text style={{ color: NORMAL_TEXT_COLOR, fontSize: 16 }}>
  //                   Pay
  //                 </Text>
  //               </TouchableOpacity>
  //             </View>
  //           </View>
  //         </View>
  //       </View>
  //     </ScrollView>
  //   );
}
