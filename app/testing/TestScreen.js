import React from "react";
import { View, StyleSheet, Text, Button } from "react-native";
import { AppText } from "../components/primitives";

function TestScreen(props) {
  return (
    <View style={styles.container}>
      <AppText style={styles.text}>TestScreen</AppText>
      <Button title="Go Back" onPress={() => props.navigation.goBack()} />
      <Button
        title="Go to TestScreen2"
        onPress={() => props.navigation.navigate("pg2")}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "blue",
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    color: "white",
    fontSize: 24,
  },
});

export default TestScreen;
