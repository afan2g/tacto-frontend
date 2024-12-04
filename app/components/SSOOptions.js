import React from "react";
import { View, StyleSheet } from "react-native";
import OrSeparator from "./OrSeparator";
import AppText from "./AppText";
import SignInWith from "./SignInWith";
import colors from "../config/colors";
import fonts from "../config/fonts";
function SSOOptions({ grayText, yellowText, onPress }) {
  return (
    <View style={styles.container}>
      <OrSeparator />
      <SignInWith />
      <View style={styles.textContainer}>
        <AppText style={styles.gray}>{grayText} </AppText>
        <AppText style={styles.yellow} onPress={onPress}>
          {yellowText}
        </AppText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {},
  gray: {
    color: colors.lightGray,
    fontFamily: fonts.light,
    fontSize: 16,
  },
  yellow: {
    color: colors.yellow,
    fontFamily: fonts.bold,
    fontSize: 16,
    fontWeight: "bold",
  },
  textContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 40,
  },
  gray: {
    color: colors.lightGray,
    fontFamily: fonts.light,
    fontSize: 16,
  },
  yellow: {
    color: colors.yellow,
    fontFamily: fonts.bold,
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default SSOOptions;
