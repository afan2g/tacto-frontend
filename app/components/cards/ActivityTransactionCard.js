import React from "react";
import { View, StyleSheet, Pressable } from "react-native";
import UserCard from "./UserCard";
import { AppText, AppButton } from "../primitives";
import formatRelativeTime from "../../utils/formatRelativeTime";
import fonts from "../../config/fonts";
import colors from "../../config/colors";
import { useAuthContext, useData } from "../../contexts";
import {
  fetchTransactionRequest,
  declinePaymentRequest,
  fulfillPaymentRequest,
  cancelPaymentRequest,
  remindPaymentRequest,
} from "../../api";
import * as SecureStore from "expo-secure-store";
import { EIP712Signer, Wallet, utils } from "zksync-ethers";
import routes from "../../navigation/routes";
import { supabase } from "../../../lib/supabase";
import { canSendReminder } from "../../utils/TransactionHelpers";
const WALLET_STORAGE_KEY = "TACTO_ENCRYPTED_WALLET";

function ActivityTransactionCard({
  transaction,
  onPress,
  onLongPress,
  onUserPress,
  navigation,
  onDelete,
}) {
  const { profile, wallet } = useData();
  const { amount, status, method_id } = transaction;
  const { session } = useAuthContext();
  let time, from_user, to_user, otherUser, action;

  if (method_id === 0 || method_id === 3) {
    ({ updated_at: time, from_user, to_user } = transaction);
    [otherUser, action] =
      profile.id === from_user.id ? [to_user, "send"] : [from_user, "receive"];
  } else if (method_id === 4) {
    ({ created_at: time } = transaction);
    action = "send";
    otherUser = { full_name: "External Wallet" };
  } else if (method_id === 5) {
    ({ created_at: time } = transaction);
    action = "receive";
    otherUser = { full_name: "External Wallet" };
  } else if (!method_id) {
    ({
      created_at: time,
      requester: from_user,
      requestee: to_user,
    } = transaction);
    [otherUser, action] =
      profile.id === from_user.id ? [to_user, "send"] : [from_user, "receive"];
  }
  const formattedAmount = amount % 1 === 0 ? amount : amount.toFixed(2);
  const [isReminding, setIsReminding] = React.useState(false);
  const [isCancelling, setIsCancelling] = React.useState(false);
  const [isPaying, setIsPaying] = React.useState(false);
  const [isDeclining, setIsDeclining] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState(null);
  const performTransaction = async () => {
    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession();
    if (sessionError) {
      console.error("Error getting session data:", sessionError);
      throw new Error("Authentication failed: " + sessionError.message);
    }
    const userJWT = session.access_token;

    console.log(
      "Performing transaction. Amount: ",
      amount,
      "Recipient:",
      otherUser.wallets[0].address
    );
    try {
      // Prepare transaction
      const [txRequest, securePhrase] = await Promise.all([
        fetchTransactionRequest(
          wallet.address,
          otherUser.wallets[0].address,
          amount,
          userJWT
        ),
        SecureStore.getItemAsync(`${WALLET_STORAGE_KEY}_${profile.id}`),
      ]);
      const t0 = performance.now();
      if (!txRequest) {
        throw new Error("Failed to create transaction");
      } else if (!securePhrase) {
        throw new Error("Failed to retrieve wallet");
      }

      console.log(
        "Transaction request received. Current nonce:",
        txRequest.nonce
      );
      const walletData = JSON.parse(securePhrase);
      const secureWallet = Wallet.fromMnemonic(walletData.phrase);

      // Sign transaction
      const signer = new EIP712Signer(secureWallet, txRequest.chainId);
      txRequest.customData.customSignature = await signer.sign(txRequest);
      const signedTx = utils.serializeEip712(txRequest);

      const data = await fulfillPaymentRequest(
        transaction.id,
        txRequest,
        signedTx,
        userJWT
      );
      const t1 = performance.now();
      console.log("Transaction time:", t1 - t0, "ms");
      const parsedData = JSON.parse(data);

      // Check for errors in the response
      if (data.error) {
        throw new Error(`Transaction failed: ${data.error}`);
      }

      navigation.navigate(routes.TRANSACTSUCCESS, {
        action: "fulfill request",
        amount,
        recipientUser: otherUser,
        recipientAddress: otherUser.wallets[0].address,
        memo: transaction.message,
        methodId: 3,
        txHash: parsedData.txHash,
      });

      return parsedData;
    } catch (err) {
      console.error("Transaction failed:", err);
      throw err;
    }
  };
  const handleRemind = async () => {
    console.log("Remind pressed");
    if (isReminding) return;
    setIsReminding(true);
    try {
      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();
      if (sessionError) {
        console.error("Error getting session data:", sessionError);
        throw new Error("Authentication failed: " + sessionError.message);
      }
      const userJWT = session.access_token;
      const data = await remindPaymentRequest(transaction.id, userJWT);
      if (data.error) {
        throw new Error(`Transaction failed: ${data.error}`);
      }
      console.log("Reminder sent:", data);
    } catch (error) {
      console.error("Error in handleRemind:", error);
    } finally {
      setIsReminding(false);
    }
  };

  const handleCancel = async () => {
    console.log("Cancel pressed");
    if (isCancelling) return;
    setIsCancelling(true);
    try {
      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();
      if (sessionError) {
        console.error("Error getting session data:", sessionError);
        throw new Error("Authentication failed: " + sessionError.message);
      }
      const userJWT = session.access_token;
      onDelete();
      const data = await cancelPaymentRequest(transaction.id, userJWT);
      if (data.error) {
        throw new Error(`Transaction failed: ${data.error}`);
      }
      console.log("Transaction cancelled:", data);
    } catch (error) {
      console.error("Error in handleCancel:", error);
    } finally {
      setIsCancelling(false);
    }
  };

  const handlePay = async () => {
    console.log("Pay pressed");
    if (isPaying) return;
    setIsPaying(true);
    try {
      await performTransaction();
    } catch (error) {
      console.error("Error in handlePay:", error);
    } finally {
      setIsPaying(false);
    }
  };
  const handleDecline = async () => {
    console.log("Decline pressed");
    if (isDeclining) return;
    setIsDeclining(true);
    try {
      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();
      if (sessionError) {
        console.error("Error getting session data:", sessionError);
        throw new Error("Authentication failed: " + sessionError.message);
      }
      const userJWT = session.access_token;
      onDelete();
      const data = await declinePaymentRequest(transaction.id, userJWT);
      if (data.error) {
        throw new Error(`Transaction failed: ${data.error}`);
      }
      console.log("Transaction declined:", data);
    } catch (error) {
      console.error("Error in handleDecline:", error);
    } finally {
      setIsDeclining(false);
    }
  };

  const handleUserPress = async (user) => {
    console.log("User pressed:", user);
    if (isLoading) return; // Prevent navigation if loading
    try {
      setIsLoading(true);
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
      console.log("friend data fetched: ", data);
      setBottomSheetItem({
        user,
        friendData: {
          ...data.friendData,
          mutualFriendCount: data.mutualFriendsCount,
          friendCount: data.targetUserFriendsCount,
        },
        sharedTransactions: data.sharedTransactions,
      });
    } catch (error) {
      console.error("Error navigating to user profile:", error);
      setError("Failed to load recipient wallet information");
    } finally {
      setIsLoading(false);
    }
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
        leftButtonDisabled:
          isReminding || !canSendReminder(transaction.last_reminder_sent_at),
        rightButtonDisabled: isCancelling,
      },
      receive: {
        text: `$${formattedAmount}`,
        style: styles.pendingSendText,
        leftButtonText: "Pay",
        rightButtonText: "Decline",
        leftButtonHandler: handlePay,
        rightButtonHandler: handleDecline,
        leftButtonDisabled: isPaying,
        rightButtonDisabled: isDeclining,
      },
    },
  };

  const displayConfig = transactionStyles[status][action];
  const timestampDisplay = formatRelativeTime(time);
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
        {otherUser && (
          <UserCard
            user={otherUser}
            subtext={timestampDisplay}
            onPress={() => onUserPress(otherUser)}
          />
        )}
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
            disabled={displayConfig.leftButtonDisabled}
          />
          <AppButton
            title={displayConfig.rightButtonText}
            style={[styles.button, styles.rightButton]}
            textStyle={styles.buttonText}
            onPress={displayConfig.rightButtonHandler}
            disabled={displayConfig.rightButtonDisabled}
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
