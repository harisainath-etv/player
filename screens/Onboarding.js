import { View, Image, TouchableOpacity, Text } from "react-native";
import React, { useEffect, useState } from "react";
import normalize from "../Utils/Helpers/Dimen";
import { StackActions, useIsFocused } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
const Onboarding = ({ navigation }) => {
  const isfocued = useIsFocused();
  const [screens, setScreen] = useState(-1);
  console.log(screens, "hello");
  useEffect(() => {
    if (screens == 0) {
      navigation.dispatch(
        StackActions.replace("Home", { pageFriendlyId: "featured-1" })
      );
    }
    // else {
    //   // navigation.dispatch(StackActions.replace('Home', { pageFriendlyId: 'featured-1' }));
    //   setScreen(-1);
    // }
  }, [isfocued, screens]);
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Image
        source={require("../assets/images/slide0.jpg")}
        style={{
          height: normalize(800),
          width: normalize(320),
          resizeMode: "cover",
        }}
      />
      <TouchableOpacity
        onPress={async () => {
          setScreen(0);
        }}
        style={{ position: "absolute", zIndex: 1000, bottom: normalize(80) }}
      >
        <Text style={{ fontWeight: "bold", fontSize: 20, color: "red" }}>
          Skip
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default Onboarding;
