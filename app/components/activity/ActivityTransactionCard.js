import React from "react";
import { View, StyleSheet } from "react-native";
import UserCard from "../users/UserCard";
import AppText from "../AppText";
import formatRelativeTime from "../../utils/formatRelativeTime";
import fonts from "../../config/fonts";
import colors from "../../config/colors";

function ActivityTransactionCard({ transaction }) {
  const { timestamp, amount, status, otherUser, action } = transaction;

  // Mapping for different transaction display configurations
  const transactionStyles = {
    completed: {
      receive: {
        text: `+${amount}`,
        style: styles.completedReceiveText,
      },
      send: {
        text: `-${amount}`,
        style: styles.completedSendText,
      },
    },
    pending: {
      receive: {
        text: `${amount}`,
        style: styles.pendingReceiveText,
      },
      send: {
        text: `${amount}`,
        style: styles.pendingSendText,
      },
    },
  };

  const displayConfig = transactionStyles[status][action];
  const timestampDisplay =
    status === "pending"
      ? `${formatRelativeTime(timestamp)} ago`
      : timestamp.toLocaleString("default", {
          month: "short",
          day: "numeric",
        });

  return (
    <View style={styles.container}>
      <UserCard user={otherUser} subtext={timestampDisplay} />
      <AppText style={[styles.amountText, displayConfig.style]}>
        {displayConfig.text}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  amountText: {
    fontFamily: fonts.bold,
    fontSize: 20,
  },
  completedReceiveText: {
    color: colors.green,
  },
  completedSendText: {
    color: colors.red,
  },
  pendingSendText: {
    color: colors.softRed,
  },
  pendingReceiveText: {
    color: colors.softGreen,
  },
});

export default ActivityTransactionCard;
