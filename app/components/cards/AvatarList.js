import React from "react";
import { View, StyleSheet, Image } from "react-native";
import { colors } from "../../config";
import AppAvatar from "../AppAvatar";

function AvatarList({ avatars, size = 54, style }) {
  const scaledStyle = {
    avatar: {
      marginRight: -(size * 0.4),
      borderWidth: 2,
      borderColor: colors.redShade20,
      shadowColor: colors.black,
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.3,
      shadowRadius: size * 0.3,
      elevation: 5,
      backgroundColor: colors.black,
    },
  };

  const scale = size / 54; // Assuming 54 is the base size for AppAvatar

  return (
    <View style={[styles.container, style]}>
      <View style={styles.avatarList}>
        {avatars.slice(0, avatars.length - 1).map((avatar, index) => (
          <AppAvatar
            key={index}
            user={avatar}
            scale={scale}
            style={[scaledStyle.avatar, { zIndex: avatars.length - index }]}
          />
        ))}
        <AppAvatar
          user={avatars[avatars.length - 1]}
          scale={scale}
          style={[scaledStyle.avatar, styles.lastAvatar, { zIndex: 0 }]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
  },
  avatarList: {
    flexDirection: "row",
    alignItems: "center",
  },
  lastAvatar: {
    marginRight: 0,
    borderColor: colors.greenShade40,
  },
});

export default AvatarList;
