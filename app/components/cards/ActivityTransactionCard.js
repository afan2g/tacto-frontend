import React from "react";
import { View, StyleSheet, Pressable } from "react-native";
import UserCard from "./UserCard";
import { AppText, AppButton } from "../primitives";
import formatRelativeTime from "../../utils/formatRelativeTime";
import fonts from "../../config/fonts";
import colors from "../../config/colors";

function ActivityTransactionCard({
  transaction,
  onRemind,
  onCancel,
  onPay,
  onDecline,
  onPress,
  onLongPress,
}) {
  const { timestamp, amount, status, otherUser, action } = transaction;

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
        leftButtonText: "Remind",
        rightButtonText: "Cancel",
        leftButtonHandler: onRemind,
        rightButtonHandler: onCancel,
      },
      send: {
        text: `${amount}`,
        style: styles.pendingSendText,
        leftButtonText: "Pay",
        rightButtonText: "Decline",
        leftButtonHandler: onPay,
        rightButtonHandler: onDecline,
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
    <Pressable
      style={({ pressed }) => [
        styles.container,
        pressed ? styles.pressed : styles.notPressed,
      ]}
      onPress={onPress}
      onLongPress={onLongPress}
      unstable_pressDelay={240}
    >
      <View style={styles.textContainer}>
        <UserCard user={otherUser} subtext={timestampDisplay} />
        <AppText style={[styles.amountText, displayConfig.style]}>
          {displayConfig.text}
        </AppText>
      </View>
      {status === "pending" && (
        <View style={styles.buttonContainer}>
          <AppButton
            title={displayConfig.leftButtonText}
            style={[styles.button, styles.leftButton]}
            textStyle={styles.buttonText}
            onPress={displayConfig.leftButtonHandler}
          />
          <AppButton
            title={displayConfig.rightButtonText}
            style={[styles.button, styles.rightButton]}
            textStyle={styles.buttonText}
            onPress={displayConfig.rightButtonHandler}
          />
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  pressed: {
    backgroundColor: colors.blueShade40,
  },
  notPressed: {
    backgroundColor: "transparent",
  },
  textContainer: {
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
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    paddingBottom: 10,
  },
  button: {
    width: "49%",
  },
  leftButton: {
    backgroundColor: colors.yellow,
  },
  rightButton: {
    backgroundColor: colors.lightGray,
  },
  buttonText: {
    fontSize: 14,
    fontFamily: fonts.bold,
  },
});

export default ActivityTransactionCard;
