import React from "react";
import { View, StyleSheet, Image, Pressable } from "react-native";
import { SvgXml } from "react-native-svg";
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
  disabled,
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

  const renderAvatar = () => {
    const isSvg = user.profilePicUrl?.toLowerCase().endsWith(".svg");

    if (!user.profilePicUrl) {
      // Render a placeholder or default avatar
      return (
        <View
          style={[
            scaleStyle.profilePic,
            styles.profilePic,
            styles.placeholderAvatar,
          ]}
        >
          <AppText style={styles.placeholderText}>
            {user.fullName
              ?.split(" ")
              .map((name) => name[0])
              .join("")}
          </AppText>
        </View>
      );
    }

    if (isSvg) {
      return (
        <View style={[scaleStyle.profilePic, styles.svgContainer]}>
          <SvgXml
            xml={user.profilePicUrl}
            width={54 * (scale ?? 1)}
            height={54 * (scale ?? 1)}
          />
        </View>
      );
    }

    return (
      <Image
        source={{ uri: user.profilePicUrl }}
        resizeMode="cover"
        style={[scaleStyle.profilePic, styles.profilePic]}
      />
    );
  };

  return (
    <Pressable
      onPress={onPress}
      onLongPress={onLongPress}
      disabled={disabled}
      style={({ pressed }) => [pressed ? styles.pressed : styles.notPressed]}
      unstable_pressDelay={200}
    >
      <View style={[styles.container, style]}>
        {renderAvatar()}
        <View style={styles.userNameContainer}>
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
  profilePic: {
    overflow: "hidden",
  },
  svgContainer: {
    overflow: "hidden",
    borderRadius: 30,
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
  placeholderAvatar: {
    backgroundColor: colors.blackShade10,
    justifyContent: "center",
    alignItems: "center",
  },
  placeholderText: {
    color: colors.lightGray,
    fontSize: 20,
    fontFamily: fonts.medium,
  },
});

export default UserCard;
