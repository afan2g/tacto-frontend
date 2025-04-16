import React from "react";
import { View, StyleSheet, Image } from "react-native";
import { AppText } from "../primitives";
import { ArrowBigDown, ArrowBigUp } from "lucide-react-native";
import colors from "../../config/colors";
import fonts from "../../config/fonts";
import formatRelativeTime from "../../utils/formatRelativeTime";

function TransactionDetailReply({ reply }) {
  const { user, text, time, score } = reply;
  return (
    <View style={styles.container}>
      <View style={styles.replyHeader}>
        <Image source={{ uri: user.avatar_url }} style={styles.avatar} />
        <AppText style={styles.user}>{user.full_name}</AppText>
      </View>
      <AppText style={styles.replyText}>{text}</AppText>
      <View style={styles.bottomContainer}>
        <View style={styles.scoreContainer}>
          <View style={styles.voteContainer}>
            <ArrowBigUp
              color={colors.lightGray}
              size={32}
              style={styles.vote}
            />
            <AppText style={styles.score}>{score}</AppText>
            <ArrowBigDown
              color={colors.lightGray}
              size={32}
              style={styles.vote}
            />
          </View>
        </View>
        <AppText style={styles.time}>{formatRelativeTime(time)} ago</AppText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
  },
  replyHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    height: 32,
    width: 32,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: colors.lightGray,
  },
  user: {
    marginLeft: 10,
    fontFamily: fonts.medium,
    fontSize: 16,
    color: colors.lightGray,
  },
  replyText: {
    color: colors.lightGray,
    fontFamily: fonts.regular,
    fontSize: 16,
    marginVertical: 10,
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
  },
  vote: {},
  score: {
    color: colors.yellow,
    fontFamily: fonts.bold,
    fontSize: 16,
    marginHorizontal: 5,
  },
  time: {
    color: colors.black,
    fontFamily: fonts.medium,
    fontSize: 16,
  },
});

export default TransactionDetailReply;
