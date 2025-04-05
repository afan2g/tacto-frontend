import React, { useState, useEffect } from "react";
import { View, StyleSheet, Image, Pressable } from "react-native";
import Svg, { SvgUri } from "react-native-svg";
import { AppText } from "../primitives";
import fonts from "../../config/fonts";
import colors from "../../config/colors";
import AppAvatar from "../AppAvatar";
import { Skeleton } from "moti/skeleton";
import UserCardSkeletonLoader from "../skeletons/UserCardSkeletonLoader";
import TextSkeletonLoader from "../skeletons/SkeletonLoader";
function UserCard({
  user,
  subtext,
  onPress,
  onLongPress,
  navigation,
  style,
  disabled,
  scale = 1,
}) {
  const scaleStyle = {
    fullName: {
      fontSize: 20 * scale,
    },
    username: {
      fontSize: 15 * scale,
    },
  };
  if (!user) {
    return <UserCardSkeletonLoader />;
  }

  return (
    <Pressable
      onPress={onPress}
      onLongPress={onLongPress}
      disabled={disabled}
      style={({ pressed }) => [pressed ? styles.pressed : styles.notPressed]}
      unstable_pressDelay={200}
    >
      <View style={[styles.container, style]}>
        <AppAvatar user={user} scale={scale} />
        <View style={styles.userNameContainer}>
          <AppText style={[scaleStyle.fullName, styles.fullName]}>
            {user.full_name}
          </AppText>

          <AppText style={[scaleStyle.username, styles.username]}>
            {subtext || user.username}
          </AppText>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  pressed: {
    backgroundColor: colors.blueShade40,
  },
  notPressed: {
    backgroundColor: "transparent",
  },
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    justifyContent: "flex-start",
  },
  userNameContainer: {
    alignItems: "flex-start",
    paddingHorizontal: 10,
  },
  fullName: {
    fontFamily: fonts.medium,
    color: colors.lightGray,
  },
  username: {
    fontFamily: fonts.light,
    color: colors.lightGray,
  },
});

export default UserCard;
