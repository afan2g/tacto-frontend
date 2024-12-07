import { ArrowBigDown, ArrowBigUp } from "lucide-react-native";
import React from "react";
import { View, StyleSheet, Pressable } from "react-native";

import { AppText } from "../primitives";
import { colors, fonts } from "../../config";
import AvatarList from "./AvatarList";

function TransactionCard({ transaction, style, navigation }) {
  const { from, to, amount, memo, score, commentCount, time, txid } =
    transaction;
  const handlePress = () => {
    console.log("TransactionCardTest pressed");
  };
  const handleLongPress = () => {
    console.log("TransactionCardTest long pressed");
  };
  const handleUpVotePress = () => {
    console.log("TransactionCardTest upvoted");
  };
  const handleDownVotePress = () => {
    console.log("TransactionCardTest downvoted");
  };

  return (
    <Pressable
      style={({ pressed }) => [
        styles.container,
        style,
        pressed ? styles.pressed : styles.notPressed,
      ]}
      onPress={handlePress}
      onLongPress={handleLongPress}
      unstable_pressDelay={750}
    >
      <View style={styles.topContainer}>
        <View style={styles.actionContainer}>
          <AvatarList
            avatars={[from.profilePicUrl, to.profilePicUrl]}
            size={32}
            style={styles.avatarList}
          />
          <View style={styles.usersContainer}>
            <AppText style={styles.users} onPress={handlePress}>
              {from.fullName}
            </AppText>
            <AppText style={styles.sent}> paid </AppText>
            <AppText style={styles.users} onPress={handlePress}>
              {to.fullName}
            </AppText>
          </View>
        </View>
        <AppText style={styles.amount}>${amount.toFixed(2)}</AppText>
      </View>
      <AppText style={styles.memo}>{memo}</AppText>
      <View style={styles.bottomContainer}>
        <View style={styles.scoreContainer}>
          <View style={styles.voteContainer}>
            <ArrowBigUp
              color={colors.lightGray}
              size={24}
              style={styles.vote}
              onPress={handleUpVotePress}
            />
            <AppText style={styles.score}>{score}</AppText>
            <ArrowBigDown
              color={colors.lightGray}
              size={24}
              style={styles.vote}
              onPress={handleDownVotePress}
            />
          </View>
          <AppText style={styles.comments}>
            {commentCount} comment{commentCount != 1 ? "s" : ""}
          </AppText>
        </View>
        <AppText style={styles.time}>{time} ago</AppText>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    padding: 10,
    backgroundColor: colors.blue,
  },
  pressed: {
    backgroundColor: colors.blueShade40,
  },
  notPressed: {
    backgroundColor: "transparent",
  },
  topContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  actionContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatarList: {
    marginRight: 10,
  },
  usersContainer: {
    flexDirection: "row",
  },
  users: {
    color: colors.lightGray,
    fontFamily: fonts.medium,
    fontSize: 16,
  },
  sent: {
    color: colors.lightGray,
    fontFamily: fonts.medium,
    fontSize: 16,
  },
  amount: {
    fontFamily: fonts.bold,
    fontSize: 16,
    color: colors.lightGray,
  },
  memo: {
    color: colors.blackShade10,
    textAlign: "justify",
    fontFamily: fonts.regular,
    fontSize: 16,
    marginVertical: 5,
  },
  bottomContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  scoreContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  voteContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 10,
  },
  vote: {},
  score: {
    color: colors.lightGray,
    fontFamily: fonts.medium,
    marginHorizontal: 5,
  },
  comments: {
    color: colors.lightGray,
    fontFamily: fonts.medium,
  },
  time: {
    color: colors.blackShade10,
    fontFamily: fonts.medium,
  },
});

export default TransactionCard;
