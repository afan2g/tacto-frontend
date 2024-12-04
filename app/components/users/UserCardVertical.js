import React from "react";
import { View, StyleSheet, Image, TouchableHighlight } from "react-native";
import AppText from "../AppText";
import fonts from "../../config/fonts";
import colors from "../../config/colors";

function UserCardVertical({ user, onPress, navigation }) {
  return (
    <TouchableHighlight style={styles.container} onPress={onPress}>
      <>
        <Image
          source={{ uri: user.profilePicUrl }}
          resizeMode="contain"
          style={styles.profilePic}
        />
        <View style={styles.userNameContainer}>
          <AppText style={styles.fullName}>{user.fullName}</AppText>
          <AppText style={styles.username}>{user.username}</AppText>
        </View>
      </>
    </TouchableHighlight>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 10,
  },
  profilePic: {
    height: 72,
    width: 72,
    borderRadius: 36,
    marginBottom: 10,
  },
  userNameContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  fullName: {
    fontFamily: fonts.medium,
    fontSize: 26,
    color: colors.lightGray,
  },
  username: {
    fontFamily: fonts.light,
    fontSize: 20,
    color: colors.lightGray,
  },
});

export default UserCardVertical;
