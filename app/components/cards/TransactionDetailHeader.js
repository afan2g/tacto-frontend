import React from "react";
import { View, StyleSheet, TextInput, Pressable } from "react-native";
import { ArrowBigDown, ArrowBigUp } from "lucide-react-native";

import { AppText } from "../primitives";
import { AvatarList, TransactionCard } from "../cards";
import formatRelativeTime from "../../utils/formatRelativeTime";
import { fonts, colors } from "../../config";

function TransactionDetailScreen({ navigation, route, transaction, ...props }) {
  const { from, to, amount, memo, score, comments, commentCount, txid, time } =
    transaction;

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <AppText style={styles.header}>
          {from.full_name} paid {to.full_name}{" "}
          <AppText style={styles.amount}>${amount}</AppText>
        </AppText>
        <AvatarList
          avatars={[from.avatar_url, to.avatar_url]}
          style={styles.avatars}
        />
        <View style={styles.textContainer}>
          <AppText style={styles.text}>{memo}</AppText>
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
              <AppText style={styles.comments}>
                {commentCount} comment{commentCount != 1 ? "s" : ""}
              </AppText>
            </View>
            <AppText style={styles.time}>
              {formatRelativeTime(time)} ago
            </AppText>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
  },
  headerContainer: {
    borderBottomColor: colors.lightGray,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    fontSize: 24,
    color: colors.lightGray,
  },
  amount: {
    color: colors.yellow,
  },
  avatars: {
    marginVertical: 20,
  },
  textContainer: {
    width: "100%",
  },
  text: {
    color: colors.grayOpacity50,
    fontFamily: fonts.regular,
    fontSize: 16,
    textAlign: "justify",
  },
  bottomContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    marginTop: 10,
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
    color: colors.yellow,
    fontFamily: fonts.bold,
    fontSize: 16,
    marginHorizontal: 5,
  },
  comments: {
    color: colors.lightGray,
    fontFamily: fonts.medium,
    fontSize: 16,
    marginLeft: 5,
  },
  time: {
    color: colors.black,
    fontFamily: fonts.medium,
    fontSize: 16,
  },
});

export default TransactionDetailScreen;
