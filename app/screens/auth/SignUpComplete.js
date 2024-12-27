import React from "react";
import { View, StyleSheet, Text } from "react-native";
import { Screen } from "../../components/primitives";
import { colors } from "../../config";

function SignUpComplete(props) {
  return (
    <Screen style={styles.container}>
      <Text style={styles.text}>Sign Up Complete</Text>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontSize: 20,
    color: colors.lightGray,
  },
});

export default SignUpComplete;
