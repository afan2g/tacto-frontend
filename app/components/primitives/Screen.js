import Constants from "expo-constants";
import React from "react";
import { StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import colors from "../../config/colors";

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
  },
  content: {
    flex: 1,
    paddingHorizontal: 10,
  },
});
