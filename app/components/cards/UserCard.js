import React, { useState, useEffect } from "react";
import { View, StyleSheet, Image, Pressable } from "react-native";
import Svg, { SvgUri } from "react-native-svg";
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
  scale = 1,
}) {
  const [avatarUrl, setAvatarUrl] = useState(null);
  const displayText = subtext === null ? null : subtext ?? user.username;
  const size = 54 * scale;

  const scaleStyle = {
    profilePic: {
      height: size,
      width: size,
      borderRadius: size / 2,
    },
    fullName: {
      fontSize: 20 * scale,
    },
    username: {
      fontSize: 15 * scale,
    },
  };

  useEffect(() => {
    if (user.profilePicUrl) {
      setAvatarUrl(user.profilePicUrl);
    }
  }, [user.profilePicUrl]);

  const renderAvatar = () => {
    const url = user.profilePicUrl;
    const isSvg = url?.toLowerCase().endsWith(".svg");

    if (!url) {
      return (
        <View
          style={[
            scaleStyle.profilePic,
            styles.profilePic,
            styles.placeholderAvatar,
          ]}
        >
          <AppText style={styles.placeholderText}>
            {user.full_name
              ?.split(" ")
              .map((name) => name?.[0] || "")
              .join("") ||
              user.fullName
                ?.split(" ")
                .map((name) => name?.[0] || "")
                .join("")}
          </AppText>
        </View>
      );
    }

    if (isSvg) {
      return (
        <View style={[scaleStyle.profilePic, styles.svgContainer]}>
          <SvgUri uri={url} width={size} height={size} viewBox="0 0 80 80" />
        </View>
      );
    } else {
      return (
        <Image
          source={{ uri: url }}
          resizeMode="cover"
          style={[scaleStyle.profilePic, styles.profilePic]}
        />
      );
    }
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
            {user.full_name || user.fullName}
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
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "transparent",
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
