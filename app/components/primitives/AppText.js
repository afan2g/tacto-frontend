import React from "react";
import { Text, StyleSheet } from "react-native";
import colors from "../../config/colors";
import fonts from "../../config/fonts";

function AppText({ children, onPress = null, style, ...props }) {
  return (
    <Text onPress={onPress} style={[styles.text, style]} {...props}>
      {children}
    </Text>
  );
}

const styles = StyleSheet.create({
  text: {
    color: colors.black,
    fontFamily: fonts.medium,
    padding: 0,
    margin: 0,
  },
});

export default AppText;
