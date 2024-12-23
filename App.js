// App.js
import "react-native-url-polyfill/auto";
import React, { useEffect, useRef, useCallback, useState } from "react";
import { supabase } from "./lib/supabase";
import Auth from "./app/testing/Auth";
import { StyleSheet, View, Easing, Button, Text } from "react-native";
import { Session } from "@supabase/supabase-js";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { colors } from "./app/config";
import { NavigationContainer } from "@react-navigation/native";
import navigationTheme from "./app/navigation/navigationTheme";

import TempNavigator from "./app/navigation/TempNavigator";
import AuthNavigator from "./app/navigation/entry/AuthNavigator";

export default function App() {
  const [session, setSession] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, []);

  return (
    <NavigationContainer theme={navigationTheme}>
      <SafeAreaProvider>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <StatusBar style="auto" />
          <View style={styles.container}>
            {session && session.user ? <TempNavigator /> : <AuthNavigator />}
          </View>
        </GestureHandlerRootView>
      </SafeAreaProvider>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  button: {
    width: 100,
    height: 50,
  },
});
