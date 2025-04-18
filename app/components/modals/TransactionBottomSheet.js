import React, {
  forwardRef,
  memo,
  useCallback,
  useImperativeHandle,
  useMemo,
  useRef,
} from "react";
import { View, StyleSheet, Pressable, Text } from "react-native";
import BottomSheet, {
  BottomSheetModal,
  BottomSheetView,
  BottomSheetBackdrop,
  TouchableWithoutFeedback,
} from "@gorhom/bottom-sheet";
import { ScrollView } from "react-native-gesture-handler";
import { AppText } from "../primitives";
import { useBottomSheetBackHandler } from "../../hooks/useBottomSheetBackHandler";
import { colors, fonts } from "../../config";
import { DataProvider, useAuthContext } from "../../contexts";
import { UserCard } from "../cards";
import formatRelativeTime from "../../utils/formatRelativeTime";
import { useCalendars, useLocales } from "expo-localization";
import * as Clipboard from "expo-clipboard";
const TransactionBottomSheet = forwardRef(({ transaction, onDismiss }, ref) => {
  const { session } = useAuthContext();
  const { timeZone } = useCalendars()[0];
  const { languageTag } = useLocales()[0];
  const bottomSheetRef = useRef(null);
  const { handleSheetPositionChange } =
    useBottomSheetBackHandler(bottomSheetRef);
  useImperativeHandle(ref, () => ({
    present: () => bottomSheetRef.current?.present(),
    dismiss: () => bottomSheetRef.current?.dismiss(),
  }));

  const snapPoints = useMemo(() => ["55%", "90%"], []);

  const renderBackdrop = useCallback(
    (props) => (
      <BottomSheetBackdrop
        {...props}
        appearsOnIndex={0}
        disappearsOnIndex={-1}
      />
    ),
    []
  );

  const handleCopyToClipboard = async (value) => {
    console.log("Copying to clipboard:", value);
    await Clipboard.setStringAsync(value);
  };

  if (!transaction) return null;

  const { amount, status, method_id } = transaction;
  let time, from_user, to_user, otherUser, action;

  if (method_id === 0 || method_id === 3) {
    ({ updated_at: time, from_user, to_user } = transaction);
    [otherUser, action] =
      session.user.id === from_user.id
        ? [{ ...to_user, address: transaction.to_address }, "send"]
        : [{ ...from_user, adress: transaction.from_address }, "receive"];
  } else if (method_id === 4) {
    ({ created_at: time } = transaction);
    action = "send";
    otherUser = {
      full_name: "External Wallet",
      address: transaction.to_address,
    };
  } else if (method_id === 5) {
    ({ created_at: time } = transaction);
    action = "receive";
    otherUser = {
      full_name: "External Wallet",
      address: transaction.from_address,
    };
  } else if (!method_id) {
    ({
      created_at: time,
      requester: from_user,
      requestee: to_user,
    } = transaction);
    [otherUser, action] =
      session.user.id === from_user.id
        ? [{ ...to_user, address: transaction.to_address }, "send"]
        : [{ ...from_user, adress: transaction.from_address }, "receive"];
  }
  const formattedAmount = amount
    .toFixed(2)
    .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");

  const transactionStyles = {
    confirmed: {
      receive: {
        text: `$${formattedAmount}`,
        style: styles.completedReceiveText,
      },
      send: {
        text: `$${formattedAmount}`,
        style: styles.completedSendText,
      },
    },
  };
  const displayConfig = transactionStyles[status][action];

  const shortId = transaction?.id.slice(0, 8).toUpperCase();

  return (
    <BottomSheetModal
      ref={bottomSheetRef}
      snapPoints={snapPoints}
      onChange={handleSheetPositionChange}
      backdropComponent={renderBackdrop}
      handleIndicatorStyle={{ backgroundColor: colors.lightGray }}
      backgroundStyle={{
        backgroundColor: colors.black,
      }}
    >
      <BottomSheetView style={styles.contentContainer}>
        <AppText style={styles.paymentText}>
          {session.user.id === transaction.from_user?.id
            ? "Payment Sent"
            : "Payment Received"}
        </AppText>
        <View style={styles.cardContainer}>
          <UserCard
            user={otherUser}
            scale={1}
            style={styles.userCard}
            subtext={
              !otherUser.id &&
              `${otherUser.address.slice(0, 6)}...${otherUser.address.slice(
                -6
              )}`
            }
          />
          <View style={styles.amountContainer}>
            <AppText style={styles.amount}>{displayConfig.text}</AppText>
          </View>
        </View>
        {otherUser.id && (
          <>
            <View style={styles.separator} />
            <View style={styles.memoContainer}>
              <AppText
                style={[
                  styles.memoText,
                  !transaction.memo && styles.placeholderMemo,
                ]}
              >
                {transaction.memo || "No memo provided"}
              </AppText>
            </View>
          </>
        )}
        <View style={styles.separator} />
        <View style={styles.detailContainer}>
          <View style={styles.detailRow}>
            <AppText style={[styles.detailText, styles.labelText]}>
              Status:
            </AppText>
            <AppText style={styles.detailValue}>{transaction.status}</AppText>
          </View>
          <View style={styles.detailRow}>
            <AppText style={[styles.detailText, styles.labelText]}>
              Type:
            </AppText>
            <AppText style={styles.detailValue}>
              {transaction.method_id}
            </AppText>
          </View>
          <View style={styles.detailRow}>
            <AppText style={[styles.detailText, styles.labelText]}>
              Completed at:
            </AppText>
            <AppText style={styles.detailValue}>
              {formatRelativeTime(transaction.updated_at, {
                timeZone,
                languageTag,
              })}
            </AppText>
          </View>
          <View style={styles.detailRow}>
            <AppText style={[styles.detailText, styles.labelText]}>
              Identifier:
            </AppText>
            <AppText style={styles.detailValue}>{shortId}</AppText>
          </View>
          <TouchableWithoutFeedback
            style={styles.detailRow}
            onPress={() => handleCopyToClipboard(otherUser.address)}
          >
            <AppText style={[styles.detailText, styles.labelText]}>
              Wallet address:
            </AppText>

            <ScrollView
              horizontal={true}
              showsHorizontalScrollIndicator={true}
              persistentScrollbar={true}
              contentContainerStyle={styles.scrollTextViewContent}
            >
              <AppText style={[styles.scrollText]}>{otherUser.address}</AppText>
            </ScrollView>
          </TouchableWithoutFeedback>
          <TouchableWithoutFeedback
            style={styles.detailRow}
            onPress={() => handleCopyToClipboard(transaction.hash)}
          >
            <AppText style={[styles.detailText, styles.labelText]}>
              Hash:
            </AppText>
            <ScrollView
              horizontal={true}
              showsHorizontalScrollIndicator={true}
              persistentScrollbar={true}
              contentContainerStyle={styles.scrollTextViewContent}
            >
              <AppText style={[styles.scrollText]}>{transaction.hash}</AppText>
            </ScrollView>
          </TouchableWithoutFeedback>
        </View>
      </BottomSheetView>
    </BottomSheetModal>
  );
});

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
  },
  paymentText: {
    fontSize: 20,
    fontWeight: "bold",
    color: colors.lightGray,
    textAlign: "center",
    marginVertical: 10,
    marginHorizontal: 20,
  },
  cardContainer: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    backgroundColor: colors.blackShade10,
    marginHorizontal: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  amountContainer: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.blackShade20,
    padding: 10,
    borderRadius: 10,
  },
  amount: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.lightGray,
  },
  separator: {
    height: 10,
  },
  memoContainer: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    backgroundColor: colors.blackShade10,
    marginHorizontal: 10,
    height: 100,
  },
  memoText: {
    color: colors.lightGray,
    fontFamily: fonts.medium,
    fontSize: 16,
    textAlignVertical: "bottom",
  },
  placeholderMemo: {
    color: colors.gray.shade50,
    fontFamily: fonts.italic,
  },
  detailContainer: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    backgroundColor: colors.blackShade10,
    marginHorizontal: 10,
    justifyContent: "flex-end",
  },
  detailText: {
    color: colors.lightGray,
    fontFamily: fonts.medium,
    fontSize: 16,
    marginBottom: 5,
    textAlignVertical: "bottom",
  },
  labelText: {
    color: colors.grayOpacity50,
    fontFamily: fonts.medium,
    textAlignVertical: "bottom",
    fontSize: 16,
    marginRight: 20,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "baseline",
    borderBottomWidth: 2,
    borderStyle: "dashed",
    borderColor: colors.gray.shade80,
    marginBottom: 16, // Add spacing between rows
  },
  detailValue: {
    color: colors.lightGray,
    fontFamily: fonts.medium,
    fontSize: 16,
    textAlign: "right", // Align values to the right for a cleaner look
    textAlignVertical: "bottom",
  },
  userCard: {
    flex: 1,
    marginRight: 10,
  },
  scrollTextViewContent: {
    paddingVertical: 5,
    borderRadius: 10,
  },

  scrollText: {
    color: colors.lightGray,
    fontFamily: fonts.medium,
    fontSize: 16,
    textAlignVertical: "bottom",
  },
});

export default TransactionBottomSheet;
