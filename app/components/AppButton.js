import React from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import AppText from "./AppText";
import colors from "../config/colors";

function AppButton({ color, onPress, style, textStyle, title }) {
  return (
    <TouchableOpacity
      style={[styles.button, { backgroundColor: colors[color] }, style]}
      onPress={onPress}
    >
      <AppText style={[styles.text, textStyle]}>{title}</AppText>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: "center",
    alignSelf: "center",
    backgroundColor: colors.yellow,
    borderColor: colors.black,
    borderWidth: 1,
    borderRadius: 5,
    justifyContent: "center",
    padding: 10,
    width: "100%",
  },
  text: {
    fontSize: 20,
  },
});

export default AppButton;
