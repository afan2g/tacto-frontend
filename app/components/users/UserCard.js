import React from "react";
import { View, StyleSheet, Image, TouchableHighlight } from "react-native";
import AppText from "../AppText";
import fonts from "../../config/fonts";
import colors from "../../config/colors";

function UserCard({ user, onPress, navigation }) {
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
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
  },
  profilePic: {
    height: 54,
    width: 54,
    borderRadius: 30,
  },
  userNameContainer: {
    paddingLeft: 10,
  },
  fullName: {
    fontFamily: fonts.medium,
    fontSize: 20,
    color: colors.lightGray,
  },
  username: {
    fontFamily: fonts.light,
    fontSize: 15,
    color: colors.lightGray,
  },
});

export default UserCard;
