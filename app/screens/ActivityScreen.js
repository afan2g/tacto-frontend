import React, { useEffect } from "react";
import { View, StyleSheet, RefreshControl } from "react-native";
import * as Haptics from "expo-haptics";
import { FlashList } from "@shopify/flash-list";

import { AppText, Screen } from "../components/primitives";
import { colors, fonts } from "../config";
import routes from "../navigation/routes";
import {
  AccountBalanceCard,
  ActivityTransactionCard,
} from "../components/cards";

import useModal from "../hooks/useModal";
import TransactionModal from "../components/modals/TransactionModal";
import { useAuthContext, useData } from "../contexts";
import { ActivityIndicator } from "react-native-paper";
import TransactionBottomSheet from "../components/modals/TransactionBottomSheet";
import ProfileBottomSheet from "../components/modals/ProfileBottomSheet";
import { supabase } from "../../lib/supabase";
function ActivityScreen({ navigation }) {
  const { closeModal, openModal, modalVisible, selectedItem } = useModal();
  const {
    profile,
    wallet,
    completedTransactions,
    transactionsHasMore,
    loadMoreTransactions,
    isLoadingTransactions,
    pullToRefreshTransactions,
    paymentRequests,
    isLoadingPaymentRequests,
    refreshPaymentRequests,
    transactionsPage,
  } = useData();
  const { session } = useAuthContext();
  const [refreshing, setRefreshing] = React.useState(false);
  const [stickyHeaderIndices, setStickyHeaderIndices] = React.useState([
    0,
    paymentRequests.length + 1,
  ]);
  const [transactions, setTransactions] = React.useState([]);
  const isInitialLoading = !completedTransactions || !paymentRequests;
  const [bottomSheetItem, setBottomSheetItem] = React.useState(null);
  const [bottomSheetVisible, setBottomSheetVisible] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState(null);
  const transactionSheetRef = React.useRef(null);
  const profileSheetRef = React.useRef(null);
  useEffect(() => {
    if (completedTransactions && paymentRequests) {
      setTransactions([
        "Requests",
        ...paymentRequests,
        "Completed",
        ...completedTransactions,
      ]);
      setStickyHeaderIndices([0, paymentRequests.length + 1]);
    }
  }, [completedTransactions, paymentRequests]);
  const handlePress = (transaction) => {
    // navigation.navigate(routes.TRANSACTIONDETAIL, { transaction });
    setBottomSheetItem(transaction);
    handleBottomSheet();
  };
  const handleLongPress = (transaction) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    openModal(transaction);
  };

  const handleRemove = (transaction) => {
    const updatedTransactions = transactions.filter(
      (t) => t.id !== transaction.id
    );
    setTransactions(updatedTransactions);
  };

  const handleRefresh = async () => {
    if (refreshing) return; // Prevent double refresh

    setRefreshing(true);
    try {
      // Execute these in parallel
      await Promise.all([
        refreshPaymentRequests(),
        pullToRefreshTransactions(),
      ]);
    } catch (error) {
      console.error("Error refreshing data:", error);
    } finally {
      setRefreshing(false);
    }
  };

  const handleEndReached = () => {
    console.log("End reached", {
      transactionsHasMore,
      isLoadingTransactions,
      refreshing,
      currentPage: transactionsPage, // Add this line to debug
    });

    if (transactionsHasMore && !isLoadingTransactions && !refreshing) {
      loadMoreTransactions();
    }
  };

  const handleBottomSheet = () => {
    if (bottomSheetVisible) {
      transactionSheetRef.current?.dismiss();
    } else {
      transactionSheetRef.current?.present();
    }
  };
  const handleUserPress = async (user) => {
    console.log("User pressed in activity screen. Other user:", user);
    if (isLoading) return; // Prevent navigation if loading
    try {
      setIsLoading(true);
      setError(null);
      console.log("current user id: ", session.user.id);
      console.log("other user id: ", user.id);
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
      console.log("friend data fetched: ", data.friendData);
      console.log("shared transactions: ", data.sharedTransactions);
      console.log("other user: ", user);
      console.log("friend data: ", data.friendData);
      console.log("mutual friend count: ", data.mutualFriendsCount);
      console.log("friend count: ", data.targetUserFriendsCount);
      setBottomSheetItem({
        user,
        friendData: {
          ...data.friendData,
          mutualFriendCount: data.mutualFriendsCount,
          friendCount: data.targetUserFriendsCount,
        },
        sharedTransactions: data.sharedTransactions,
      });
      profileSheetRef.current?.present();
    } catch (error) {
      console.error("Error navigating to user profile:", error);
      setError("Failed to load recipient wallet information");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    console.log("Bottom sheet item changed:", bottomSheetItem);
  }, [bottomSheetItem]);

  if (isInitialLoading) {
    return (
      <Screen style={styles.screen}>
        <AccountBalanceCard
          balance={wallet?.usdc_balance || 0}
          style={styles.balanceCard}
        />
        <View style={styles.loadingContainer}>
          <ActivityIndicator
            animating={true}
            color={colors.purplePop}
            size="large"
          />
          <AppText style={styles.loadingText}>Loading transactions...</AppText>
        </View>
      </Screen>
    );
  }
  return (
    <Screen style={styles.screen}>
      <AccountBalanceCard
        balance={wallet.usdc_balance}
        style={styles.balanceCard}
      />
      <FlashList
        data={transactions}
        renderItem={({ item }) => {
          if (typeof item === "string") {
            // Rendering header
            return (
              <View style={{ backgroundColor: colors.blue, zIndex: 1 }}>
                <AppText style={styles.header}>{item}</AppText>
              </View>
            );
          } else {
            // Render item
            return (
              <ActivityTransactionCard
                transaction={item}
                onPress={() => handlePress(item)}
                onLongPress={() => handleLongPress(item)}
                navigation={navigation}
                onDelete={() => handleRemove(item)}
                onUserPress={handleUserPress}
              />
            );
          }
        }}
        stickyHeaderIndices={stickyHeaderIndices}
        getItemType={(item) => {
          // To achieve better performance, specify the type based on the item
          return typeof item === "string" ? "sectionHeader" : "row";
        }}
        estimatedItemSize={100}
        keyExtractor={(item) => (typeof item === "string" ? item : item.id)}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
        stickyHeaderHiddenOnScroll={false}
        onEndReached={handleEndReached}
        onEndReachedThreshold={0.2}
        ListFooterComponent={
          isLoadingTransactions ? (
            <ActivityIndicator
              animating={isLoadingTransactions}
              color={colors.purplePop}
            />
          ) : (
            !transactionsHasMore && (
              <AppText style={styles.activityEndText}>
                End of transactions
              </AppText>
            )
          )
        }
        ListFooterComponentStyle={styles.activityEnd}
      />

      <TransactionModal
        transaction={selectedItem}
        visible={modalVisible}
        close={closeModal}
      />
      <TransactionBottomSheet
        ref={transactionSheetRef}
        transaction={bottomSheetItem}
      />

      <ProfileBottomSheet
        ref={profileSheetRef}
        user={bottomSheetItem?.user}
        friendData={bottomSheetItem?.friendData}
        sharedTransactions={bottomSheetItem?.sharedTransactions}
        navigation={navigation}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  screen: {
    paddingHorizontal: 0,
  },
  balanceCard: {
    borderBottomColor: colors.fadedGray,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 10,
    color: colors.lightGray,
    fontFamily: fonts.medium,
  },
  separator: {
    height: 2,
    marginHorizontal: 10,
    backgroundColor: colors.blueShade10,
  },
  header: {
    paddingBottom: 10,
    fontSize: 24,
    fontFamily: fonts.bold,
    color: colors.lightGray,
    paddingHorizontal: 10,
  },
  pendingContainer: {},
  completedContainer: {
    marginBottom: 10,
  },
  flatList: {
    paddingTop: 10,
  },
  activityEnd: {
    alignItems: "center",
    paddingBottom: 20,
  },
  activityEndText: {
    color: colors.lightGray,
    fontFamily: fonts.medium,
    fontSize: 24,
  },
});

export default ActivityScreen;
