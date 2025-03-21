import { ArrowBigDown, ArrowBigUp } from "lucide-react-native";
import React from "react";
import { View, StyleSheet, Pressable } from "react-native";

import { AppText } from "../primitives";
import { colors, fonts } from "../../config";
import AvatarList from "./AvatarList";
import routes from "../../navigation/routes";
import { useNavigation } from "@react-navigation/native"; // Import useNavigation
import { FAKE_OTHER_USERS } from "../../data/fakeData";

function TransactionCard({ transaction, style, onLongPress, origin }) {
  const navigation = useNavigation(); // Use useNavigation here

  const { from, to, amount, memo, score, commentCount, time, txid } =
    transaction;
  const handlePress = () => {
    console.log("Transaction Card pressed. Transaction:", transaction);
    navigation.navigate(routes.TRANSACTIONDETAIL, { transaction });
  };
  const handleUserPress = (user) => {
    console.log(
      "Transaction Card user pressed",
      user,
      "navigation",
      navigation
    );

    navigation.navigate(routes.USERPROFILE, {
      user: FAKE_OTHER_USERS[0],
    });
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
      onLongPress={onLongPress}
      unstable_pressDelay={250}
    >
      <View style={styles.topContainer}>
        <View style={styles.actionContainer}>
          <AvatarList
            avatars={[from.avatar_url, to.avatar_url]}
            size={32}
            style={styles.avatarList}
          />
          <View style={styles.usersContainer}>
            <AppText style={styles.users} onPress={() => handleUserPress(from)}>
              {from.full_name}
            </AppText>
            <AppText style={styles.sent}> paid </AppText>
            <AppText style={styles.users} onPress={() => handleUserPress(to)}>
              {to.full_name}
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
