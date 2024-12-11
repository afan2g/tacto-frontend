// App.js
import React, { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import * as SplashScreen from "expo-splash-screen";
import { useFonts } from "expo-font";

import Profile from "./app/screens/UserProfileScreen";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import { SafeAreaProvider } from "react-native-safe-area-context";
import ActivityList from "./app/testing/ActivityList";
import { FAKE_HOME_SCREEN_DATA } from "./app/data/fakeData";
import { colors } from "./app/config";
import { Navigation } from "lucide-react-native";
import { NavigationContainer } from "@react-navigation/native";
import UserProfileScreen from "./app/screens/UserProfileScreen";
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
  return (
    <NavigationContainer>
      <SafeAreaProvider>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <UserProfileScreen />
        </GestureHandlerRootView>
      </SafeAreaProvider>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 0,
    backgroundColor: colors.blue,
    flex: 1,
  },
});
