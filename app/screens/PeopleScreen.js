import React from "react";
import { View, StyleSheet } from "react-native";

import { AppText, Screen } from "../components/primitives";
import { colors } from "../config";

function PeopleScreen(props) {
  return (
    <Screen style={styles.screen}>
      <AppText style={styles.text}>People Screen</AppText>
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

export default PeopleScreen;
