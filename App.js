// App.js
import React, { useEffect } from "react";
import { StyleSheet } from "react-native";
import * as SplashScreen from "expo-splash-screen";
import { useFonts } from "expo-font";

import { Screen } from "./app/components/primitives";
import OtherUserHeader from "./app/components/cards/OtherUserHeader";
import { FAKE_OTHER_USERS } from "./app/data/fakeData";

SplashScreen.preventAutoHideAsync();

export default function App() {
  const [loaded, error] = useFonts({
    "Satoshi-Black": require("./app/assets/fonts/Satoshi-Black.otf"),
    "Satoshi-BlackItalic": require("./app/assets/fonts/Satoshi-BlackItalic.otf"),
    "Satoshi-Bold": require("./app/assets/fonts/Satoshi-Bold.otf"),
    "Satoshi-BoldItalic": require("./app/assets/fonts/Satoshi-BoldItalic.otf"),
    "Satoshi-Italic": require("./app/assets/fonts/Satoshi-Italic.otf"),
    "Satoshi-Light": require("./app/assets/fonts/Satoshi-Light.otf"),
    "Satoshi-LightItalic": require("./app/assets/fonts/Satoshi-LightItalic.otf"),
    "Satoshi-Medium": require("./app/assets/fonts/Satoshi-Medium.otf"),
    "Satoshi-MediumItalic": require("./app/assets/fonts/Satoshi-MediumItalic.otf"),
    "Satoshi-Regular": require("./app/assets/fonts/Satoshi-Regular.otf"),
  });

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  if (!loaded && !error) {
    return null;
  }
  const user = FAKE_OTHER_USERS[2];
  const status = user.friendStatus;
  return (
    <Screen style={styles.container}>
      <OtherUserHeader user={user} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 0,
  },
});
