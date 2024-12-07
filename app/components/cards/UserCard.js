import React from "react";
import { View, StyleSheet, Image, Pressable } from "react-native";
import { AppText } from "../primitives";
import fonts from "../../config/fonts";
import colors from "../../config/colors";

function UserCard({
  user,
  subtext,
  onPress,
  onLongPress,
  navigation,
  style,
  scale,
}) {
  const displayText = subtext === null ? null : subtext ?? user.username;

  const scaleStyle = {
    profilePic: {
      height: 54 * (scale ?? 1),
      width: 54 * (scale ?? 1),
      borderRadius: 30 * (scale ?? 1),
    },
    fullName: {
      fontSize: 20 * (scale ?? 1),
    },
    username: {
      fontSize: 15 * (scale ?? 1),
    },
  };

  const flexDirection = StyleSheet.flatten(style)?.flexDirection;
  return (
    <Pressable
      onPress={onPress}
      onLongPress={onLongPress}
      style={[({ pressed }) => (pressed ? styles.pressed : styles.notPressed)]}
    >
      <View style={[styles.container, style]}>
        <Image
          source={{ uri: user.profilePicUrl }}
          resizeMode="contain"
          style={[scaleStyle.profilePic, styles.profilePic]}
        />
        <View
          style={[
            styles.userNameContainer,
            flexDirection === "row-reverse" && { alignItems: "flex-end" },
          ]}
        >
          <AppText style={[scaleStyle.fullName, styles.fullName]}>
            {user.fullName}
          </AppText>
          {displayText && (
            <AppText style={[scaleStyle.username, styles.username]}>
              {displayText}
            </AppText>
          )}
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
  profilePic: {},
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
