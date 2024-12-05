import React from "react";
import { View, StyleSheet, Image } from "react-native";
import { Settings } from "lucide-react-native";

import { AppText, Header, Screen } from "../components/primitives";
import { colors } from "../config";
import { FAKEPROFILE } from "../data/fakeData";

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
