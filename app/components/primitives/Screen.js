import Constants from "expo-constants";
import React from "react";
import { SafeAreaView, StyleSheet, View } from "react-native";
import colors from "../../config/colors";

export default function Screen({ style, children }) {
  return (
    <View style={[styles.container, { paddingTop: Constants.statusBarHeight }]}>
      <View style={[styles.content, style]}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.blue,
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 10,
  },
});
