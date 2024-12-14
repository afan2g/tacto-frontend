// App.js
import React, { useEffect } from "react";
import { StyleSheet, View, Easing, Button } from "react-native";
import * as SplashScreen from "expo-splash-screen";
import { useFonts } from "expo-font";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Profile from "./app/screens/UserProfileScreen";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import ActivityList from "./app/testing/ActivityList";
import {
  FAKE_HOME_SCREEN_DATA,
  FAKE_OTHER_USERS,
  FAKE_TRANSACTION_POST,
  FAKEUSERS,
} from "./app/data/fakeData";
import { colors } from "./app/config";
import { Navigation } from "lucide-react-native";
import { NavigationContainer } from "@react-navigation/native";
import UserProfileScreen from "./app/screens/UserProfileScreen";
import navigationTheme from "./app/navigation/navigationTheme";
import AppTabNavigator from "./app/navigation/AppTabNavigator";
import TempNavigator from "./app/navigation/TempNavigator";
import routes from "./app/navigation/routes";
import HomeScreen from "./app/screens/HomeScreen";
import TestScreen from "./app/testing/TestScreen";
import TestScreen2 from "./app/testing/TestScreen2";
import HomeNavigator from "./app/navigation/HomeNavigator";
import TransactionDetailScreen from "./app/screens/TransactionDetailScreen";
import UserModal from "./app/components/modals/UserModal";
import { Screen } from "./app/components/primitives";
import PeopleFriendsScreen from "./app/screens/people/PeopleFriendsScreen";
import useUserModal from "./app/hooks/useUserModal";
SplashScreen.preventAutoHideAsync();

const Stack = createNativeStackNavigator();
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
      <SafeAreaProvider>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <TempNavigator />
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
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    width: 100,
    height: 50,
  },
});
