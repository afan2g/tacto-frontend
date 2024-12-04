import Constants from "expo-constants";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import React from "react";
import { SafeAreaView, StyleSheet, View } from "react-native";

import colors from "../config/colors";
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function Screen({ style, children }) {
  return (
    <SafeAreaView style={styles.container}>
      <View style={[styles.content, style]}>{children}</View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.blue,
    flex: 1,
    paddingTop: Constants.statusBarHeight,
  },
  content: {
    flex: 1,
    paddingHorizontal: 10,
  },
});
