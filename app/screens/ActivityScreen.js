import React from "react";
import { View, StyleSheet } from "react-native";

import AppText from "../components/AppText";
import Screen from "../components/Screen";
import colors from "../config/colors";
function ActivityScreen(props) {
  return (
    <Screen style={styles.screen}>
      <AppText style={styles.text}>Activity Screen</AppText>
    </Screen>
  );
}

const styles = StyleSheet.create({
  screen: {
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontSize: 60,
    color: colors.lightGray,
  },
});

export default ActivityScreen;
