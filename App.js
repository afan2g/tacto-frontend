// App.js
import React, { useState, useEffect } from "react";
import { StyleSheet } from "react-native";
import * as SplashScreen from "expo-splash-screen";
import { useFonts } from "expo-font";
import SignUpNavigator from "./app/navigation/SignUpNavigator";
import colors from "./app/config/colors";
import fonts from "./app/config/fonts";
import { FormProvider } from "./app/contexts/FormContext";
import { NavigationContainer } from "@react-navigation/native";
import AuthNavigator from "./app/navigation/AuthNavigator";
import AppTabNavigator from "./app/navigation/AppTabNavigator";
import HomeScreen from "./app/screens/HomeScreen";
import HomeNavigator from "./app/navigation/HomeNavigator";
import navigationTheme from "./app/navigation/navigationTheme";
import AppNavigator from "./app/navigation/AppNavigator";
import TransactScreen from "./app/screens/transact/TransactScreen";
import FindUserBar from "./app/components/users/FindUserBar";
import Screen from "./app/components/Screen";
import SelectUserScreen from "./app/screens/transact/SelectUserScreen";
import TransactNavigator from "./app/navigation/TransactNavigator";
import ConfirmTransactionScreen from "./app/screens/transact/ConfirmTransactionScreen";
import { Pressable } from "react-native";
import formatRelativeTime from "./app/utils/formatRelativeTime";
import getRandomDate from "./app/utils/getRandomDate";
import UserCard from "./app/components/users/UserCard";
SplashScreen.preventAutoHideAsync();

const USER = {
  fullName: "Kyle Li",
  username: "@wheresme2010",
  profilePicUrl: "https://i.pravatar.cc/80",
};

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
    // <NavigationContainer theme={navigationTheme}>
    //   <AppTabNavigator />
    // </NavigationContainer>
    <Screen style={styles.screen}>
      <UserCard
        user={USER}
        time={formatRelativeTime(getRandomDate("week"))}
        onPress={() => console.log()}
      />
    </Screen>
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
