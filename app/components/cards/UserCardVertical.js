import React from "react";
import { View, StyleSheet, Image, Pressable } from "react-native";
import { AppText } from "../primitives";
import fonts from "../../config/fonts";
import colors from "../../config/colors";
import AppAvatar from "../AppAvatar";
import { Skeleton } from "moti/skeleton";
import { ScrollView } from "react-native-gesture-handler";
function UserCardVertical({
  user,
  onPress = () => {},
  navigation,
  scale = 1,
  style,
}) {
  const scaleStyle = {
    profilePic: {
      height: 72 * scale,
      width: 72 * scale,
      borderRadius: 36 * scale,
    },
    fullName: {
      fontSize: 26 * scale,
    },
    username: {
      fontSize: 20 * scale,
    },
  };

  if (!user.id) {
    return (
      <View style={[styles.container, style]}>
        <AppAvatar user={user} scale={scale * 1.5} />
        <View style={styles.userNameContainer}>
          <AppText style={[styles.fullName, scaleStyle.fullName]}>
            {user.full_name}
          </AppText>
          <View style={styles.scrollContainer}>
            <ScrollView
              contentContainerStyle={styles.scrollView}
              horizontal
              showsHorizontalScrollIndicator
            >
              <AppText style={[styles.fullName, styles.address]}>
                {user.address}
              </AppText>
            </ScrollView>
          </View>
        </View>
      </View>
    );
  }
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.container,
        style,
        pressed ? styles.pressed : styles.notPressed,
      ]}
    >
      <AppAvatar user={user} scale={scale * 1.5} />
      <View style={styles.userNameContainer}>
        <AppText style={[styles.fullName, scaleStyle.fullName]}>
          {user.full_name}
        </AppText>

        <AppText style={[styles.username, scaleStyle.username]}>
          @{user.username}
        </AppText>
      </View>
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
    paddingTop: 10,
  },
  fullName: {
    fontFamily: fonts.medium,
    color: colors.lightGray,
    textAlign: "center",
  },
  username: {
    fontFamily: fonts.light,
    color: colors.lightGray,
    textAlign: "center",
  },
  scrollContainer: {
    width: "100%",
  },
  scrollView: {
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 10,
  },
  address: {
    fontSize: 14,
    fontFamily: fonts.black,
  },
});

export default UserCardVertical;
