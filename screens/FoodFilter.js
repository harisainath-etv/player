import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import Ionicons from "react-native-vector-icons/Ionicons";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import {
  ACCESS_TOKEN,
  BACKGROUND_COLOR,
  FIRETV_BASE_URL_STAGING,
  NORMAL_TEXT_COLOR,
  SLIDER_PAGINATION_UNSELECTED_COLOR,
  TAB_COLOR,
  VIDEO_AUTH_TOKEN,
} from "../constants";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { StackActions } from "@react-navigation/native";

const FoodFilter = ({ navigation }) => {
  var All = [];
  var selectedval = [];
  const [selected, setSelected] = useState("both");
  const dataFetchedRef = useRef(false);
  const [filters, setFilters] = useState([]);
  const [selectedValues, setSelectedValues] = useState([]);
  const loadData = async (type) => {
    setSelected(type);
    setFilters([]);
    setSelectedValues([]);
    const region = await AsyncStorage.getItem("country_code");
    if (type == "both") {
      var url =
        FIRETV_BASE_URL_STAGING +
        "catalogs/recipes/genres.gzip?region=" +
        region +
        "&auth_token=" +
        VIDEO_AUTH_TOKEN +
        "&access_token=" +
        ACCESS_TOKEN;
    } else {
      var url =
        FIRETV_BASE_URL_STAGING +
        "catalogs/recipes/genres.gzip?region=" +
        region +
        "&auth_token=" +
        VIDEO_AUTH_TOKEN +
        "&access_token=" +
        ACCESS_TOKEN +
        "&tags=" +
        type;
    }

    axios
      .get(url)
      .then((response) => {
        for (var i = 0; i < response.data.data.items.length; i++) {
          if (type == "both") {
            All.push({
              display_title: response.data.data.items[i].display_title,
              name: response.data.data.items[i].name,
              count: response.data.data.items[i].count,
            });
          } else if (type == "non_veg") {
            All.push({
              display_title: response.data.data.items[i].display_title,
              name: response.data.data.items[i].name,
              count: response.data.data.items[i].non_veg,
            });
          } else if (type == "veg") {
            All.push({
              display_title: response.data.data.items[i].display_title,
              name: response.data.data.items[i].name,
              count: response.data.data.items[i].veg,
            });
          }
        }
        setFilters(All);
      })
      .catch((error) => {});
  };
  useEffect(() => {
    if (dataFetchedRef.current) return;
    dataFetchedRef.current = true;
    loadData("both");
  });
  const setFilterName = async (name) => {
    selectedval.push({ name });
    let hasMagenicVendor = selectedValues.some(
      (selectedValue) => selectedValue["name"] === name
    );
    if (hasMagenicVendor) {
      setSelectedValues(selectedValues.filter((item) => item.name !== name));
    } else {
      setSelectedValues((selectedValues) => [
        ...selectedValues,
        ...selectedval,
      ]);
    }
  };
  const renderitem = ({ item }) => {
    return (
      <View
        style={{
          padding: 15,
          marginLeft: 15,
          borderBottomColor: SLIDER_PAGINATION_UNSELECTED_COLOR,
          borderBottomWidth: 1,
          marginRight: 15,
        }}
      >
        <Text style={{ color: NORMAL_TEXT_COLOR, fontSize: 18 }}>
          {item.display_title}
        </Text>
        <Text style={{ color: NORMAL_TEXT_COLOR, fontSize: 14 }}>
          {item.count} Videos
        </Text>
        <View style={{ position: "absolute", right: 0, top: 20 }}>
          <TouchableOpacity onPress={() => setFilterName(item.name)}>
            {selectedValues.some(
              (selectedValue) => selectedValue["name"] === item.name
            ) ? (
              <MaterialIcons
                name="check-box"
                style={{ color: NORMAL_TEXT_COLOR }}
                size={30}
              ></MaterialIcons>
            ) : (
              <MaterialIcons
                name="check-box-outline-blank"
                style={{ color: NORMAL_TEXT_COLOR }}
                size={30}
              ></MaterialIcons>
            )}
          </TouchableOpacity>
        </View>
      </View>
    );
  };
  const loadFilterData = async () => {
    var string = "";
    for (var f = 0; f < selectedValues.length; f++) {
      string += selectedValues[f].name + ",";
    }
    navigation.dispatch(
      StackActions.replace("FilterData", {
        selectedValues: string,
        type: selected,
      })
    );
  };
  return (
    <View style={{ backgroundColor: BACKGROUND_COLOR, flex: 1 }}>
      <TouchableOpacity
        onPress={() => {
          if (navigation.canGoBack()) navigation.goBack();
          else
            navigation.dispatch(
              StackActions.replace("Home", { pageFriendlyId: "featured-1" })
            );
        }}
      >
        <Ionicons
          name="arrow-back"
          size={30}
          color="#ffffff"
          style={{ marginTop: 10 }}
        />
      </TouchableOpacity>
      <View style={{ justifyContent: "center", alignItems: "center" }}>
        <Text style={{ color: NORMAL_TEXT_COLOR, fontSize: 25 }}>Filter</Text>
      </View>
      <View
        style={{
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "row",
          marginTop: 10,
        }}
      >
        <TouchableOpacity
          onPress={() => loadData("veg")}
          style={{ flexDirection: "row", marginRight: 10 }}
        >
          {selected == "veg" ? (
            <Ionicons
              name="radio-button-on"
              size={25}
              color={NORMAL_TEXT_COLOR}
            />
          ) : (
            <Ionicons
              name="radio-button-off-sharp"
              size={25}
              color={NORMAL_TEXT_COLOR}
            />
          )}
          <Text style={{ color: NORMAL_TEXT_COLOR, fontSize: 20 }}> Veg </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => loadData("non_veg")}
          style={{ flexDirection: "row", marginRight: 10 }}
        >
          {selected == "non_veg" ? (
            <Ionicons
              name="radio-button-on"
              size={25}
              color={NORMAL_TEXT_COLOR}
            />
          ) : (
            <Ionicons
              name="radio-button-off-sharp"
              size={25}
              color={NORMAL_TEXT_COLOR}
            />
          )}
          <Text style={{ color: NORMAL_TEXT_COLOR, fontSize: 20 }}>
            {" "}
            Non-Veg{" "}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => loadData("both")}
          style={{ flexDirection: "row", marginRight: 10 }}
        >
          {selected == "both" ? (
            <Ionicons
              name="radio-button-on"
              size={25}
              color={NORMAL_TEXT_COLOR}
            />
          ) : (
            <Ionicons
              name="radio-button-off-sharp"
              size={25}
              color={NORMAL_TEXT_COLOR}
            />
          )}
          <Text style={{ color: NORMAL_TEXT_COLOR, fontSize: 20 }}> Both </Text>
        </TouchableOpacity>
      </View>
      {filters.length > 0 ? (
        <FlatList
          data={filters}
          renderItem={renderitem}
          keyExtractor={(x, i) => i.toString()}
        ></FlatList>
      ) : (
        ""
      )}
      <View
        style={{
          justifyContent: "center",
          alignItems: "center",
          marginTop: 15,
        }}
      >
        <TouchableOpacity
          onPress={loadFilterData}
          style={{
            backgroundColor: TAB_COLOR,
            paddingTop: 10,
            paddingBottom: 10,
            paddingLeft: 18,
            paddingRight: 18,
            borderRadius: 15,
          }}
        >
          <Text style={{ color: NORMAL_TEXT_COLOR, fontWeight: "bold" }}>
            Apply
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  textinput: {
    borderBottomColor: SLIDER_PAGINATION_UNSELECTED_COLOR,
    borderBottomWidth: 1,
    marginTop: 40,
    fontSize: 18,
    color: NORMAL_TEXT_COLOR,
    padding: 10,
    width: "50%",
  },
  button: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: TAB_COLOR,
    color: NORMAL_TEXT_COLOR,
    marginTop: 50,
    width: 150,
    padding: 10,
    borderRadius: 20,
  },
});

export default FoodFilter;
