import React from "react";
import { View, StyleSheet, Image, Pressable } from "react-native";
import { AppText } from "../primitives";
import fonts from "../../config/fonts";
import colors from "../../config/colors";

function UserCardVertical({ user, onPress, navigation, scale, style }) {
  const scaleStyle = {
    profilePic: {
      height: 72 * (scale ?? 1),
      width: 72 * (scale ?? 1),
      borderRadius: 36 * (scale ?? 1),
    },
    fullName: {
      fontSize: 26 * (scale ?? 1),
    },
    username: {
      fontSize: 20 * (scale ?? 1),
    },
  };
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.container,
        style,
        pressed ? styles.pressed : styles.notPressed,
      ]}
    >
      <>
        <Image
          source={{ uri: user.profilePicUrl }}
          resizeMode="contain"
          style={scaleStyle.profilePic}
        />
        <View style={styles.userNameContainer}>
          <AppText style={[styles.fullName, scaleStyle.fullName]}>
            {user.fullName}
          </AppText>
          <AppText style={[styles.username, scaleStyle.username]}>
            {user.username}
          </AppText>
        </View>
      </>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 10,
  },
  userNameContainer: {
    justifyContent: "center",
    alignItems: "center",
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

export default UserCardVertical;
