import React from "react";
import { View, StyleSheet } from "react-native";
import colors from "../../config/colors";

function SignInWith() {
  return (
    <View style={styles.container}>
      <View style={styles.circle} />
      <View style={styles.circle} />
      <View style={styles.circle} />
      <View style={styles.circle} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%*",
  },
  circle: {
    backgroundColor: colors.lightGray,
    borderColor: colors.black,
    borderRadius: 30,
    borderWidth: 1,
    height: 60,
    width: 60,
  },
});

export default SignInWith;
