import axios from "axios";
import React, { useEffect, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  StatusBar,
  View,
  LogBox,
  useWindowDimensions,
  Dimensions,
} from "react-native";
import { WebView } from "react-native-webview";

import {
  ACCESS_TOKEN,
  AUTH_TOKEN,
  BACKGROUND_COLOR,
  FIRETV_BASE_URL,
  NORMAL_TEXT_COLOR,
  PAGE_HEIGHT,
  PAGE_WIDTH,
} from "../constants";
import NormalHeader from "./normalHeader";
import { BackHandler } from "react-native";
import { StackActions, useIsFocused } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import RenderHTML from "react-native-render-html";
var pagename = "";
const HTMLRender = ({ navigation, route }) => {
  const [staticPage, setStaticPage] = useState({
    display_title: "",
    description: "",
  });
  {
    route.params ? (pagename = route.params.pagename) : (pagename = "");
  }

  useEffect(() => {
    fetchData();
  }, []);
  const isfocued = useIsFocused();
  useEffect(() => {
    const finalSes = async () => {
      try {
        BackHandler.addEventListener("hardwareBackPress", Back);
        LogBox.ignoreLogs([
          "`new NativeEventEmitter()` was called with a non-null",
        ]);
      } catch (error) {
        console.log(error);
      }
    };
    finalSes();
  }, [isfocued]);
  const Back = async () => {
    try {
      if (navigation.canGoBack()) {
        navigation.goBack();
      } else {
        const sessionlo = await AsyncStorage.getItem("session");
        const login = JSON.parse(sessionlo); // Parse the session data if needed

        if (login) {
          navigation.dispatch(
            StackActions.replace("Menu", { pageFriendlyId: "Menu" })
          );
        } else {
          navigation.dispatch(StackActions.replace("Signup"));
        }
      }
    } catch (error) {
      console.error("Error occurred while navigating:", error);
      // Handle the error as per your requirement
    }
  };

  async function fetchData() {
    await axios
      .get(
        FIRETV_BASE_URL +
          "config/static_page/" +
          pagename +
          "?auth_token=" +
          AUTH_TOKEN +
          "&access_token=" +
          ACCESS_TOKEN
      )
      .then((response) => {
        setStaticPage(response.data.static_page);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  return (
    <View style={styles.mainContainer}>
      <NormalHeader></NormalHeader>
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {/* <RenderHTML
          source={{ html: staticPage.description }}
          contentWidth={100}
          systemFonts={systemfonts}
          tagsStyles={{
            p: { fontFamily: "PoppinsBold", color: "red" },
          }}
        /> */}
        <WebView
          source={{
            html:
              '<html><head><meta name="viewport" content="width=device-width, initial-scale=1.0"></head><body><p>' +
              staticPage.description +
              "</p></body></html>",
          }}
          scalesPageToFit
          scrollEnabled
          showsVerticalScrollIndicator
          originWhitelist={["*"]}
          style={{
            alignItems: "center",
            backgroundColor: BACKGROUND_COLOR,
            width: PAGE_WIDTH,
            height: PAGE_HEIGHT,
            marginTop: 100,
          }}
        />
      </View>
      <StatusBar
        animated
        backgroundColor="transparent"
        barStyle="dark-content"
        translucent={true}
      />
    </View>
  );
};

export default HTMLRender;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: BACKGROUND_COLOR,
    color: NORMAL_TEXT_COLOR,
  },
});
