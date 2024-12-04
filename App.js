// App.js
import React, { useEffect } from "react";
import { StyleSheet } from "react-native";
import * as SplashScreen from "expo-splash-screen";
import { useFonts } from "expo-font";

import { colors, fonts } from "./app/config";
import { NavigationContainer } from "@react-navigation/native";
import navigationTheme from "./app/navigation/navigationTheme";
import AppTabNavigator from "./app/navigation/AppTabNavigator";
import { Screen } from "./app/components/primitives";
import {
  AccountBalanceCard,
  ActivityTransactionCard,
} from "./app/components/cards";
import getRandomDate from "./app/utils/getRandomDate";
import ActivityScreen from "./app/screens/ActivityScreen";
SplashScreen.preventAutoHideAsync();

const USER = {
  fullName: "Kyle Li",
  username: "@wheresme2010",
  profilePicUrl: "https://i.pravatar.cc/80",
};

const TRANSACTION = [
  {
    timestamp: getRandomDate(),
    amount: 100,
    status: "completed",
    otherUser: {
      fullName: "Kyle Li",
      username: "@wheresme2010",
      profilePicUrl: "https://i.pravatar.cc/80",
    },
    action: "send",
  },
  {
    timestamp: getRandomDate(),
    amount: 100,
    status: "completed",
    otherUser: {
      fullName: "Kyle Li",
      username: "@wheresme2010",
      profilePicUrl: "https://i.pravatar.cc/80",
    },
    action: "receive",
  },
  {
    timestamp: getRandomDate(),
    amount: 100,
    status: "pending",
    otherUser: {
      fullName: "Kyle Li",
      username: "@wheresme2010",
      profilePicUrl: "https://i.pravatar.cc/80",
    },
    action: "send",
  },
  {
    timestamp: getRandomDate(),
    amount: 10,
    status: "pending",
    otherUser: {
      fullName: "Kyle Li",
      username: "@wheresme2010",
      profilePicUrl: "https://i.pravatar.cc/80",
    },
    action: "receive",
  },
];
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
    <NavigationContainer theme={navigationTheme}>
      <AppTabNavigator />
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  screen: {
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    color: colors.gray,
    fontFamily: fonts.regular,
    fontSize: 16,
    padding: 0,
    margin: 0,
  },
});
