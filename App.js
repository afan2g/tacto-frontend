// App.js
import React, { useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
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
import { SafeAreaProvider } from "react-native-safe-area-context";
import PeopleTopTabNavigator from "./app/navigation/PeopleTopTabNavigator";
import TransactionCardTest from "./app/components/cards/TransactionCardTest";
import { FAKE_HOME_SCREEN_DATA } from "./app/data/fakeData";
import formatRelativeTime from "./app/utils/formatRelativeTime";
import { Home } from "lucide-react-native";
import HomeScreen from "./app/screens/HomeScreen";
import AvatarList from "./app/components/cards/AvatarList";
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
    // <SafeAreaProvider>
    //   <NavigationContainer theme={navigationTheme}>
    //     <AppTabNavigator />
    //   </NavigationContainer>
    // </SafeAreaProvider>
    <Screen style={styles.screen}>
      <TransactionCardTest
        transaction={{
          ...FAKE_HOME_SCREEN_DATA[0],
          time: formatRelativeTime(FAKE_HOME_SCREEN_DATA[0].time),
        }}
      />
    </Screen>
    // <HomeScreen />
  );
}

const styles = StyleSheet.create({
  screen: {
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    alignItems: "center",
    flexDirection: "row",
  },
  text: {
    color: colors.gray,
    fontFamily: fonts.regular,
    fontSize: 16,
    padding: 0,
    margin: 0,
  },
});
