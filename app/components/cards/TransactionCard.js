import { ArrowBigDown, ArrowBigUp } from "lucide-react-native";
import React from "react";
import { View, StyleSheet, Pressable } from "react-native";
import { useNavigation } from "@react-navigation/native"; // Import useNavigation

import { useAuthContext } from "../../contexts/AuthContext";
import { supabase } from "../../../lib/supabase";
import { AppText } from "../primitives";
import { colors, fonts } from "../../config";
import AvatarList from "./AvatarList";
import routes from "../../navigation/routes";
import SkeletonLoader from "../skeletons/SkeletonLoader";
import TransactionCardSkeletonLoader from "../skeletons/TransactionCardSkeletonLoader";
import AppAvatar from "../AppAvatar";
function TransactionCard({ transaction, style, onLongPress, avatar }) {
  const navigation = useNavigation();

  const { from, to, amount, memo, score, commentCount, time } = transaction;
  const [userLoading, setUserLoading] = React.useState(false);
  const [error, setError] = React.useState(false);
  const { session } = useAuthContext();
  const handlePress = () => {
    console.log("Transaction Card pressed. Transaction:", transaction);
    navigation.navigate(routes.TRANSACTIONDETAIL, { transaction });
  };

  const handleUserPress = async (user) => {
    console.log("User pressed:", user);
    if (userLoading) return; // Prevent navigation if loading
    try {
      setUserLoading(true);
      setError(null);
      const { data, error } = await supabase.rpc("get_friend_data", {
        current_user_id: session.user.id,
        target_user_id: user.id,
      });
      if (error) {
        console.error("Error fetching friend data:", error);
        throw new Error("Failed to fetch friend data");
      }
      if (!data || data.length === 0) {
        console.error("user not found: ", user.id);
        throw new Error("User not found");
      }
      console.log("friend data: ", data);
      navigation.navigate(routes.USERPROFILE, {
        user,
        friendData: {
          ...data.friendData,
          mutualFriendCount: data.mutualFriendCount,
          friendCount: data.friendCount,
        },
        sharedTransactions: data.sharedTransactions,
      });
    } catch (error) {
      console.error("Error navigating to user profile:", error);
      setError("Failed to load recipient wallet information");
    } finally {
      setUserLoading(false);
    }
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
        // pressed ? styles.pressed : styles.notPressed,
        styles.notPressed,
      ]}
      onPress={handlePress}
      onLongPress={onLongPress}
    >
      <View style={styles.topContainer}>
        <View style={styles.actionContainer}>
          <AvatarList
            avatars={[from, to]}
            size={32}
            style={styles.avatarList}
          />
          <View style={styles.usersContainer}>
            <AppText style={styles.users} onPress={() => handleUserPress(from)}>
              {session.user.id === from.id ? "You" : from.full_name}
            </AppText>
            <AppText style={styles.sent}> paid </AppText>
            <AppText style={styles.users} onPress={() => handleUserPress(to)}>
              {session.user.id === to.id ? "you" : to.full_name}
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
        <AppText style={styles.time}>{time}</AppText>
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
    backgroundColor: colors.blueGray.shade40,
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
    color: colors.blackTint40,
    fontFamily: fonts.medium,
  },
});

export default TransactionCard;
