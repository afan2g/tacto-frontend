import React, {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useMemo,
  useRef,
  useEffect,
  useState,
} from "react";
import { View, StyleSheet } from "react-native";
import {
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
import { useModalContext } from "../../contexts";

const TransactionBottomSheet = forwardRef(
  ({ id = "transaction", onDismiss }, ref) => {
    const [transactionData, setTransactionData] = useState(null);
    const { session } = useAuthContext();
    const { timeZone } = useCalendars()[0] || { timeZone: "UTC" };
    const { languageTag } = useLocales()[0] || { languageTag: "en-US" };
    const bottomSheetRef = useRef(null);
    const { handleSheetPositionChange } = useBottomSheetBackHandler(
      bottomSheetRef,
      onDismiss
    );

    // Get modal context
    const {
      registerSheet,
      unregisterSheet,
      presentSheet: openSheet,
    } = useModalContext();

    // Register this sheet with the context
    useEffect(() => {
      console.log("Registering transaction sheet:", id);
      registerSheet(id, {
        present: presentSheet,
        dismiss: dismissSheet,
      });

      return () => {
        unregisterSheet(id);
      };
    }, [id, registerSheet, unregisterSheet]);

    // Present the sheet with transaction data
    const presentSheet = useCallback(
      (data) => {
        console.log("Presenting transaction sheet with data:", data);
        if (data && data.transaction) {
          setTransactionData(data.transaction);
        } else {
          // If no transaction data is provided, set a default placeholder
          console.warn(
            "No transaction data provided to TransactionBottomSheet"
          );
          setTransactionData({
            id: "placeholder",
            amount: 0,
            status: "confirmed",
            method_id: 0,
            updated_at: new Date().toISOString(),
            from_user: { id: session?.user?.id || "unknown" },
            to_user: { id: "placeholder" },
            from_address: "0x0000000000000000000000000000000000000000",
            to_address: "0x0000000000000000000000000000000000000000",
            hash: "0x0000000000000000000000000000000000000000000000000000000000000000",
          });
        }
        bottomSheetRef.current?.present();
      },
      [session?.user?.id]
    );

    // Dismiss the sheet
    const dismissSheet = useCallback(() => {
      bottomSheetRef.current?.dismiss();
    }, []);

    useImperativeHandle(ref, () => ({
      present: presentSheet,
      dismiss: dismissSheet,
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
      if (value) {
        console.log("Copying to clipboard:", value);
        await Clipboard.setStringAsync(value);
      }
    };

    // Function to open profile sheet when clicking on a user
    const handleUserPress = useCallback(
      (user) => {
        if (user && (user.id || user.address)) {
          console.log("Opening profile sheet for user:", user);
          openSheet("profile", { user, navigation: null });
        }
      },
      [openSheet]
    );

    // If no transaction data is available, don't render anything
    if (!transactionData) return null;

    // Extract data with null checks
    const amount = transactionData.amount || 0;
    const status = transactionData.status || "confirmed";
    const method_id = transactionData.method_id || 0;

    let time, from_user, to_user, otherUser, action;

    // Handle different transaction types with proper null checks
    if (method_id === 0 || method_id === 3) {
      from_user = transactionData.from_user || {};
      to_user = transactionData.to_user || {};
      time = transactionData.updated_at;

      const isCurrentUserSender = session?.user?.id === from_user.id;
      otherUser = isCurrentUserSender
        ? { ...to_user, address: transactionData.to_address }
        : { ...from_user, address: transactionData.from_address };
      action = isCurrentUserSender ? "send" : "receive";
    } else if (method_id === 4) {
      time = transactionData.created_at;
      action = "send";
      otherUser = {
        full_name: "External Wallet",
        address: transactionData.to_address,
      };
    } else if (method_id === 5) {
      time = transactionData.created_at;
      action = "receive";
      otherUser = {
        full_name: "External Wallet",
        address: transactionData.from_address,
      };
    } else {
      // Default case for method_id undefined
      from_user = transactionData.requester || {};
      to_user = transactionData.requestee || {};
      time = transactionData.created_at;

      const isCurrentUserSender = session?.user?.id === from_user.id;
      otherUser = isCurrentUserSender
        ? { ...to_user, address: transactionData.to_address }
        : { ...from_user, address: transactionData.from_address };
      action = isCurrentUserSender ? "send" : "receive";
    }

    // Ensure otherUser always has an address
    if (!otherUser.address) {
      otherUser.address = "0x0000000000000000000000000000000000000000";
    }

    // Format amount with proper checks
    const formattedAmount = (amount || 0)
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

    // Use default style if the specific style isn't found
    const displayConfig = (transactionStyles[status] &&
      transactionStyles[status][action]) || {
      text: `$${formattedAmount}`,
      style: {},
    };

    const shortId = transactionData?.id
      ? transactionData.id.slice(0, 8).toUpperCase()
      : "N/A";

    // Safely determine payment direction
    const isPaymentSent =
      session?.user?.id === (transactionData.from_user?.id || "");

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
        // Make sure this gets rendered on top of other sheets
        stackBehavior="push"
      >
        <BottomSheetView style={styles.contentContainer}>
          <AppText style={styles.paymentText}>
            {isPaymentSent ? "Payment Sent" : "Payment Received"}
          </AppText>
          {otherUser && (
            <TouchableWithoutFeedback
              onPress={() => handleUserPress(otherUser)}
            >
              <View style={styles.cardContainer}>
                <UserCard
                  user={otherUser}
                  scale={1}
                  style={styles.userCard}
                  subtext={
                    !otherUser.id &&
                    otherUser.address &&
                    `${otherUser.address.slice(
                      0,
                      6
                    )}...${otherUser.address.slice(-6)}`
                  }
                />
                <View style={styles.amountContainer}>
                  <AppText style={[styles.amount, displayConfig.style]}>
                    {displayConfig.text}
                  </AppText>
                </View>
              </View>
            </TouchableWithoutFeedback>
          )}
          {otherUser?.id && (
            <>
              <View style={styles.separator} />
              <View style={styles.memoContainer}>
                <AppText
                  style={[
                    styles.memoText,
                    !transactionData.memo && styles.placeholderMemo,
                  ]}
                >
                  {transactionData.memo || "No memo provided"}
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
              <AppText style={styles.detailValue}>
                {transactionData.status || "N/A"}
              </AppText>
            </View>
            <View style={styles.detailRow}>
              <AppText style={[styles.detailText, styles.labelText]}>
                Type:
              </AppText>
              <AppText style={styles.detailValue}>
                {transactionData.method_id || "N/A"}
              </AppText>
            </View>
            <View style={styles.detailRow}>
              <AppText style={[styles.detailText, styles.labelText]}>
                Completed at:
              </AppText>
              <AppText style={styles.detailValue}>
                {time
                  ? formatRelativeTime(time, {
                      timeZone,
                      languageTag,
                    })
                  : "N/A"}
              </AppText>
            </View>
            <View style={styles.detailRow}>
              <AppText style={[styles.detailText, styles.labelText]}>
                Identifier:
              </AppText>
              <AppText style={styles.detailValue}>{shortId}</AppText>
            </View>
            <TouchableWithoutFeedback
              onPress={() => handleCopyToClipboard(otherUser?.address)}
            >
              <View style={styles.detailRow}>
                <AppText style={[styles.detailText, styles.labelText]}>
                  Wallet address:
                </AppText>
                <ScrollView
                  horizontal={true}
                  showsHorizontalScrollIndicator={true}
                  persistentScrollbar={true}
                  contentContainerStyle={styles.scrollTextViewContent}
                >
                  <AppText style={[styles.scrollText]}>
                    {otherUser?.address || "N/A"}
                  </AppText>
                </ScrollView>
              </View>
            </TouchableWithoutFeedback>
            <TouchableWithoutFeedback
              onPress={() => handleCopyToClipboard(transactionData.hash)}
            >
              <View style={styles.detailRow}>
                <AppText style={[styles.detailText, styles.labelText]}>
                  Hash:
                </AppText>
                <ScrollView
                  horizontal={true}
                  showsHorizontalScrollIndicator={true}
                  persistentScrollbar={true}
                  contentContainerStyle={styles.scrollTextViewContent}
                >
                  <AppText style={[styles.scrollText]}>
                    {transactionData.hash || "N/A"}
                  </AppText>
                </ScrollView>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </BottomSheetView>
      </BottomSheetModal>
    );
  }
);

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
    marginBottom: 16,
  },
  detailValue: {
    color: colors.lightGray,
    fontFamily: fonts.medium,
    fontSize: 16,
    textAlign: "right",
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
  completedReceiveText: {
    color: colors.green,
  },
  completedSendText: {
    color: colors.yellow,
  },
});

export default TransactionBottomSheet;
