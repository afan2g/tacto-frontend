import React, { useEffect } from "react";
import { View, StyleSheet, Image } from "react-native";

import { AppText } from "../primitives";
import { colors, fonts } from "../../config";
import AppAvatar from "../AppAvatar";
function CollapsedHeader({ user }) {
  return (
    <View style={styles.container}>
      <AppAvatar user={user} />
      <AppText style={styles.text}>{user.full_name}</AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    // borderWidth: 1,
    // borderColor: "red",
    paddingBottom: 10,
    paddingLeft: 56,
  },
  image: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 16,
    borderWidth: 1,
    borderColor: colors.blackTint80,
  },
  text: {
    color: colors.lightGray,
    fontSize: 20,
    fontFamily: fonts.bold,
  },
});

export default CollapsedHeader;
