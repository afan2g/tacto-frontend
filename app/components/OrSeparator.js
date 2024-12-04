import React from "react";
import { View, StyleSheet } from "react-native";
import AppText from "./AppText";
import colors from "../config/colors";

function OrSeparator() {
  return (
    <View style={styles.container}>
      <View style={styles.line} />
      <AppText style={styles.orText}>OR</AppText>
      <View style={styles.line} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 20,
    width: "100%",
  },
  line: {
    width: 145,
    height: 1,
    backgroundColor: colors.lightGray,
  },
  orText: {
    fontFamily: "Satoshi-Black",
    fontSize: 20,
    color: colors.lightGray,
  },
});

export default OrSeparator;
