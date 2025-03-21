import React from "react";
import { View, StyleSheet, Pressable } from "react-native";
import UserCard from "./UserCard";
import { AppText, AppButton } from "../primitives";
import formatRelativeTime from "../../utils/formatRelativeTime";
import fonts from "../../config/fonts";
import colors from "../../config/colors";
import { useData } from "../../contexts";

function ActivityTransactionCard({
  transaction,
  onPress,
  onLongPress,
  navigation,
}) {
  const { profile } = useData();
  const { amount, status } = transaction;
  let time, from_user, to_user;
  if (transaction.status === "confirmed") {
    ({ updated_at: time, from_user, to_user } = transaction);
  } else {
    ({ created_at: time, requester: from_user, requestee: to_user } = transaction);
  }
  const [otherUser, action] = profile.id === from_user.id ? [to_user, "send"] : [from_user, "receive"];
  const formattedAmount = amount % 1 === 0 ? amount : amount.toFixed(2);


  const handleRemind = () => {
    console.log("Remind pressed");
  };

  const handleCancel = () => {
    console.log("Cancel pressed");
  };

  const handlePay = () => {
    console.log("Pay pressed");
  };

  const handleDecline = () => {
    console.log("Decline pressed");
  };


  const transactionStyles = {
    confirmed: {
      receive: {
        text: `+$${formattedAmount}`,
        style: styles.completedReceiveText,
      },
      send: {
        text: `-$${formattedAmount}`,
        style: styles.completedSendText,
      },
    },
    pending: {
      send: {
        text: `$${formattedAmount}`,
        style: styles.pendingReceiveText,
        leftButtonText: "Remind",
        rightButtonText: "Cancel",
        leftButtonHandler: handleRemind,
        rightButtonHandler: handleCancel,
      },
      receive: {
        text: `$${formattedAmount}`,
        style: styles.pendingSendText,
        leftButtonText: "Pay",
        rightButtonText: "Decline",
        leftButtonHandler: handlePay,
        rightButtonHandler: handleDecline,
      },
    },
  };


  const displayConfig = transactionStyles[status][action];
  const timestampDisplay = `${formatRelativeTime(time)} ago`;
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
    paddingRight: 20,
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
