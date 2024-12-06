import React from "react";
import { View, StyleSheet } from "react-native";
import AppText from "./AppText";
import colors from "../../config/colors";
import { fonts } from "../../config";

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
    fontFamily: fonts.bold,
    fontSize: 28,
    color: colors.lightGray,
    textAlign: "left",
    paddingBottom: 5,
  },
});

export default Header;
