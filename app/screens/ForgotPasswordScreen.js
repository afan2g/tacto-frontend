import React from "react";
import { View, StyleSheet } from "react-native";
import AppText from "../components/AppText";
import Screen from "../components/Screen";
import Header from "../components/Header";
import { ChevronLeft } from "lucide-react-native";
import colors from "../config/colors";

function ForgotPasswordScreen({ navigation }) {
  return (
    <Screen style={styles.screen}>
      <View style={styles.headerContainer}>
        <ChevronLeft
          color={colors.lightGray}
          size={42}
          onPress={() => navigation.goBack()}
          style={styles.icon}
        />
        <Header style={styles.header}>Forgot Password</Header>
      </View>
      <AppText style={styles.text}>Forgot Password</AppText>
    </Screen>
  );
}

const styles = StyleSheet.create({
  screen: {
    paddingHorizontal: 0,
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "flex-end",
    paddingHorizontal: 0,
    marginHorizontal: 0,
  },
});

export default ForgotPasswordScreen;
