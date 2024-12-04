import React from "react";
import { View, StyleSheet } from "react-native";
import AppText from "./AppText";
import colors from "../../config/colors";

function Header({ children, style }) {
  return (
    <View style={[styles.container, style]}>
      <AppText style={styles.title}>{children}</AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderBottomColor: colors.softGray,
    alignSelf: "center",
    width: "100%",
  },
  title: {
    fontFamily: "Satoshi-Bold",
    fontSize: 32,
    color: colors.lightGray,
    textAlign: "left",
  },
});

export default Header;
