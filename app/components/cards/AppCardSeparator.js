import React from "react";
import { View, StyleSheet } from "react-native";
import colors from "../../config/colors";

function AppCardSeparator() {
  return <View style={styles.container}></View>;
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.invisibleGray,
    width: "100%",
    height: 1,
  },
});

export default AppCardSeparator;
