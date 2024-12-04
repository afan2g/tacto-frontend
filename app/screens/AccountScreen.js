import React from "react";
import { View, StyleSheet, Image } from "react-native";
import AppText from "../components/AppText";
import Header from "../components/Header";
import Screen from "../components/Screen";
import { Settings } from "lucide-react-native";
import colors from "../config/colors";

const FAKEPROFILE = {
  fullName: "Aaron Fan",
  username: "@afan2k",
  profilePicUrl: "https://api.dicebear.com/9.x/bottts-neutral/png",
  balance: 123456.12,
};
function AccountScreen({ navigation }) {
  return (
    <Screen style={styles.screen}>
      <Header style={styles.header}>Your Account</Header>
      <Settings color={colors.lightGray} size={36} style={styles.settings} />
      <Image
        source={{ uri: FAKEPROFILE.profilePicUrl }}
        style={styles.profilePic}
        bor
      />
      <AppText style={styles.fullName}>Aaron Fan</AppText>
      <AppText style={styles.username}>@afan2k</AppText>
    </Screen>
  );
}

const styles = StyleSheet.create({
  screen: {},
  header: {},
  settings: {},
  profilePic: {
    width: 80,
    height: 80,
  },
  fullName: {},
  username: {},
});

export default AccountScreen;
