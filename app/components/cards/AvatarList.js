import React from "react";
import { View, StyleSheet, Image } from "react-native";
import { colors } from "../../config";

function AvatarList({ avatars, size = 50, style }) {
  const scaledStyle = {
    avatar: {
      height: size,
      width: size,
      marginRight: -(size * 0.4),
      borderRadius: size / 2,
      borderWidth: 2,
      borderColor: colors.blackTint10,
      shadowColor: colors.black,
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.3,
      shadowRadius: size * 0.3,

      elevation: 5,
      backgroundColor: colors.black,
    },
  };
  return (
    <View style={[styles.container, style]}>
      <View style={styles.avatarList}>
        {avatars.slice(avatars.length - 1).map((avatar, index) => (
          <Image
            key={index}
            source={{ uri: avatar }}
            style={scaledStyle.avatar}
          />
        ))}
        <Image
          source={{ uri: avatars[avatars.length - 1] }}
          style={[scaledStyle.avatar, styles.lastAvatar]}
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
  },
});

export default AvatarList;
