import React, { useState, useEffect } from "react";
import { View, StyleSheet } from "react-native";
import { AppText } from "./primitives";
import { colors, fonts } from "../config";
import { SvgUri } from "react-native-svg";
import { Image } from "react-native";

function AppAvatar({ user, scale = 1 }) {
  const [url, setUrl] = useState(null);

  useEffect(() => {
    if (user.avatar_url) {
      setUrl(user.avatar_url);
    }
  }, [user.avatar_url]);
  const isSvg = url?.toLowerCase().endsWith(".svg");
  const size = 54 * scale;

  const scaleStyle = {
    height: size,
    width: size,
    borderRadius: size / 2,
  };
  if (!url) {
    return (
      <View style={[scaleStyle, styles.profilePic, styles.placeholderAvatar]}>
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
      <View style={[scaleStyle, styles.svgContainer]}>
        <SvgUri uri={url} width={size} height={size} viewBox="0 0 80 80" />
      </View>
    );
  } else {
    return (
      <Image
        source={{ uri: url }}
        resizeMode="cover"
        style={[scaleStyle, styles.profilePic]}
      />
    );
  }
}

const styles = StyleSheet.create({
  profilePic: {
    overflow: "hidden",
  },
  svgContainer: {
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "transparent",
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

export default AppAvatar;
