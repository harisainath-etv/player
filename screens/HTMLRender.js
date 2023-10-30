import axios from "axios";
import React, { useEffect, useState } from "react";
import { ScrollView, StyleSheet, View, Button, Dimensions } from "react-native";
import { WebView } from "react-native-webview";

import {
  BACKGROUND_COLOR,
  NORMAL_TEXT_COLOR,
  PAGE_HEIGHT,
  PAGE_WIDTH,
} from "../constants";

const HTMLRender = () => {
  const [staticPage, setStaticPage] = useState({
    display_title: "",
    description: "",
  });

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    try {
      const response = await axios.get(
        `https://stagingott.etvwin.com/config/static_page/terms_conditions?auth_token=q5u8JMWTd2698ncg7q4Q&access_token=Ay6KCkajdBzztJ4bptpW`
      );
      setStaticPage(response.data.static_page);
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <ScrollView horizontal>
      <View style={styles.mainContainer}>
        <WebView
          source={{ html: staticPage.description }}
          scalesPageToFit
          scrollEnabled
          showsVerticalScrollIndicator
          originWhitelist={["*"]}
          style={{
            alignItems: "center",
            backgroundColor: BACKGROUND_COLOR,
            width: PAGE_WIDTH,
            height: PAGE_HEIGHT,
            marginBottom: 50,
            marginTop: 45,
          }}
        />
      </View>
    </ScrollView>
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
