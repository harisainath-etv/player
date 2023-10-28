import React, { useEffect } from "react";
import {
  auth_token,
  access_token,
  FIRETV_BASE_URL_STAGING,
  PAGE_WIDTH,
  PAGE_HEIGHT,
} from "../constants";
import WebView from "react-native-webview";
import axios from "axios";

export default function HTMLRender() {
  const [staticPage, setStaticPage] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    const data = (
      await axios
        .get(
          FIRETV_BASE_URL_STAGING`https://stagingott.etvwin.com/config/static_page/terms_conditions?auth_token=${auth_token}&access_token=${access_token}`
        )
        .catch((error) => {
          console.log(error);
        })
    ).data;
    setStaticPage(data.static_page);
  }

  return (
    <WebView
      title={{ html: staticPage.title }}
      source={{ html: staticPage.description }}
      scalesPageToFit
      originWhitelist={["*"]}
      style={{
        flex: 1,
        width: PAGE_WIDTH,
        height: PAGE_HEIGHT,
        marginBottom: 50,
        marginTop: 45,
      }}
    />
  );
}
