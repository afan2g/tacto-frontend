import React, { useEffect } from "react";
import { View, StyleSheet, Image, Pressable } from "react-native";

import { AppText } from "../primitives";
import { colors, fonts } from "../../config";
import AppAvatar from "../AppAvatar";
function CollapsedHeader({ user, onPress }) {
  return (
    <Pressable style={styles.container} onPress={onPress}>
      <AppAvatar user={user} scale={0.75} />
      <View style={styles.textContainer}>
        <AppText style={styles.fullName}>{user.full_name}</AppText>
        <AppText style={styles.username}>@{user.username}</AppText>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    paddingLeft: 20,
  },
  fullName: {
    color: colors.lightGray,
    fontSize: 20,
    fontFamily: fonts.bold,
  },
  username: {
    color: colors.lightGray,
    fontSize: 16,
    fontFamily: fonts.medium,
  },
  textContainer: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "flex-start", // ⬆️ aligns text to the top
    alignItems: "flex-start",
    height: "100%",
    marginLeft: 10,
    textAlignVertical: "top",
  },
});

export default CollapsedHeader;
