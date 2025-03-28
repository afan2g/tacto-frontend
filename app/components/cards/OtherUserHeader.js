import React from "react";
import { View, StyleSheet, Pressable } from "react-native";

import { AppText } from "../primitives";
import UserCardVertical from "./UserCardVertical";
import { colors, fonts } from "../../config";
import { X } from "lucide-react-native";

function OtherUserHeader({ user, friendData, style, handleClose }) {
  const {
    friendStatus,
    mutualFriendsCount,
    targetUserFriendsCount: friendCount,
  } = friendData;
  const status = friendStatus ?? "none"; //pending, accpeted, declined, canceled

  const handleFriendPress = async () => {
    console.log("Friend button pressed. Status:", status);
    // Handle friend button press logic here
  };

  const handleSend = async () => {
    console.log("Send button pressed.");
    // Handle send button press logic here
  };

  const handleRequest = async () => {
    console.log("Request button pressed.");
    // Handle request button press logic here
  };

  return (
    <View style={[styles.headerContainer, style]}>
      {handleClose && (
        <X
          size={24}
          color={colors.lightGray}
          style={styles.closeModal}
          onPress={handleClose}
        />
      )}
      <UserCardVertical user={user} scale={0.8} />
      <View style={styles.userStats}>
        <Pressable style={styles.stat}>
          <AppText style={styles.statNumber}>{friendCount ?? 0}</AppText>
          <AppText style={styles.statLabel}>friends</AppText>
        </Pressable>
        <Pressable style={styles.stat}>
          <AppText style={styles.statNumber}>{mutualFriendsCount ?? 0}</AppText>
          <AppText style={styles.statLabel}>mutuals</AppText>
        </Pressable>
      </View>
      <View style={styles.friendButtonContainer}>
        <Pressable
          style={({ pressed }) => [
            styles.button,
            status === "none" && styles.buttonNotFriends,
            status === "pending" && styles.buttonPending,
            status === "accepted" && styles.buttonAccepted,
            pressed && { opacity: 0.7 },
          ]}
          onPress={() => console.log(status)}
        >
          {status === "none" && (
            <AppText style={[styles.text, styles.notFriends]}>
              Add Friend
            </AppText>
          )}
          {status === "pending" && (
            <AppText style={[styles.text, styles.pending]}>Pending</AppText>
          )}
          {status === "accepted" && (
            <AppText style={[styles.text, styles.friends]}>
              You are friends!
            </AppText>
          )}
        </Pressable>
      </View>
      <View style={styles.transactButtons}>
        <Pressable style={styles.send}>
          <AppText style={styles.text}>Send</AppText>
        </Pressable>
        <Pressable style={styles.request}>
          <AppText style={styles.text}>Request</AppText>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  closeModal: {
    position: "absolute",
    top: 0,
    right: 10,
  },
  headerContainer: {
    alignItems: "center",
    width: "100%",
    backgroundColor: colors.blue,
    paddingBottom: 20,
  },

  userStats: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 60,
  },
  stat: {
    margin: 10,
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },
  statNumber: {
    color: colors.lightGray,
    fontFamily: fonts.bold,
    fontSize: 16,
  },
  statLabel: {
    color: colors.blackTint40,
    fontFamily: fonts.medium,
    fontSize: 14,
  },
  friendButtonContainer: {
    width: "100%",
    alignItems: "center",
    paddingHorizontal: 10,
  },
  button: {
    borderWidth: 1,
    borderColor: colors.black,
    borderRadius: 5,
    padding: 10,
    margin: 10,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  buttonPending: {
    backgroundColor: colors.grayOpacity40,
  },
  buttonNotFriends: {
    backgroundColor: colors.bluePop,
  },
  buttonAccepted: {
    borderWidth: 0,
    padding: 0,
  },
  friends: {
    color: colors.yellow,
    fontSize: 18,
  },
  pending: {
    color: colors.blackTint10,
  },
  notFriends: {
    color: colors.black,
  },
  text: {
    color: colors.black,
    fontFamily: fonts.bold,
    fontSize: 14,
    padding: 0,
    margin: 0,
  },
  transactButtons: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  send: {
    backgroundColor: colors.yellow,
    padding: 10,
    marginHorizontal: 10,
    marginRight: 5,

    borderRadius: 5,
    flex: 1,
    alignItems: "center",
  },
  request: {
    backgroundColor: colors.lightGray,
    padding: 10,
    marginHorizontal: 10,
    marginLeft: 5,
    borderRadius: 5,
    flex: 1,
    alignItems: "center",
  },
});

export default OtherUserHeader;
