import { ArrowBigUp, ArrowBigDown, MoveRight } from "lucide-react-native";
import React from "react";
import {
  View,
  StyleSheet,
  Image,
  TouchableWithoutFeedback,
} from "react-native";
import { AppText } from "../primitives";
import colors from "../../config/colors";
import fonts from "../../config/fonts";
import routes from "../../navigation/routes";

function TransactionCard({ transaction, navigation }) {
  const { from, to, amount, memo, score, commentCount, time, txid } =
    transaction;
  const handleCardPress = () => {
    console.log("Card pressed:", { from, to, amount, memo, txid });
    navigation.navigate(routes.TRANSACTIONDETAIL, transaction);
  };

  const handleFromProfilePress = () => {
    console.log("From profile pressed:", from);
  };

  const handleToProfilePress = () => {
    console.log("To profile pressed:", to);
  };

  const handleUpVotePress = () => {
    console.log("Upvote pressed:", { txid, currentScore: score });
  };

  const handleDownVotePress = () => {
    console.log("Downvote pressed:", { txid, currentScore: score });
  };

  const handleCommentPress = () => {
    console.log("Comments pressed:", { txid, commentCount });
  };

  return (
    <TouchableWithoutFeedback onPress={handleCardPress}>
      <View style={styles.container}>
        <View style={styles.headerBarContainer}>
          <View style={styles.fromToContainer}>
            <TouchableWithoutFeedback onPress={handleFromProfilePress}>
              <View style={styles.profileContainer}>
                <Image
                  style={styles.profilePic}
                  source={{ uri: from.profilePicUrl }}
                />
                <AppText style={styles.nameText}>{from.name}</AppText>
              </View>
            </TouchableWithoutFeedback>
            <MoveRight color={colors.green} size={24} style={styles.arrow} />
            <TouchableWithoutFeedback onPress={handleToProfilePress}>
              <View style={styles.profileContainer}>
                <Image
                  style={styles.profilePic}
                  source={{ uri: to.profilePicUrl }}
                />
                <AppText style={styles.nameText}>{to.name}</AppText>
              </View>
            </TouchableWithoutFeedback>
          </View>
          <AppText style={styles.amount}>${amount.toFixed(2)}</AppText>
        </View>
        <AppText style={styles.memo}>{memo}</AppText>

        <View style={styles.bottomRowContainer}>
          <View style={styles.scoreContainer}>
            <TouchableWithoutFeedback onPress={handleUpVotePress}>
              <View>
                <ArrowBigUp
                  color={colors.lightGray}
                  size={24}
                  style={styles.vote}
                />
              </View>
            </TouchableWithoutFeedback>
            <AppText style={styles.score}>{score}</AppText>
            <TouchableWithoutFeedback onPress={handleDownVotePress}>
              <View>
                <ArrowBigDown
                  color={colors.lightGray}
                  size={24}
                  style={styles.vote}
                />
              </View>
            </TouchableWithoutFeedback>
            <TouchableWithoutFeedback onPress={handleCommentPress}>
              <View>
                <AppText style={styles.comments}>
                  {commentCount} comment{commentCount != 1 ? "s" : ""}
                </AppText>
              </View>
            </TouchableWithoutFeedback>
          </View>
          <AppText style={styles.time}>{time} ago</AppText>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  headerBarContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  fromToContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  profileContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  profilePic: {
    height: 30,
    width: 30,
    borderRadius: 20,
    marginRight: 10,
  },
  nameText: {
    color: colors.lightGray,
    fontFamily: fonts.medium,
    fontSize: 16,
  },
  arrow: {
    marginHorizontal: 5,
  },
  amount: {
    color: colors.lightGray,
    fontFamily: fonts.black,
  },
  memo: {
    paddingVertical: 10,
    color: colors.softGray,
    fontFamily: fonts.regular,
    fontSize: 14,
    textAlign: "left",
  },
  bottomRowContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  scoreContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  vote: {},
  score: {
    color: colors.lightGray,
    paddingHorizontal: 5,
  },
  comments: {
    paddingLeft: 20,
    color: colors.lightGray,
  },
  time: {
    fontFamily: fonts.medium,
    color: colors.softGray,
  },
});

export default TransactionCard;
