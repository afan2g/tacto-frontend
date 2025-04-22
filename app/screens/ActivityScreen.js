import React, { useEffect, useCallback, useState } from "react";
import {
  View,
  StyleSheet,
  RefreshControl,
  SectionList,
  Button,
} from "react-native";
import * as Haptics from "expo-haptics";
import { FlashList } from "@shopify/flash-list";

import { AppText, Screen } from "../components/primitives";
import { colors, fonts } from "../config";
import {
  AccountBalanceCard,
  ActivityTransactionCard,
} from "../components/cards";

import useModal from "../hooks/useModal";
import TransactionModal from "../components/modals/TransactionModal";
import { useAuthContext, useData, useModalContext } from "../contexts";
import { ActivityIndicator } from "react-native-paper";
import TransactionBottomSheet from "../components/modals/TransactionBottomSheet";
import { supabase } from "../../lib/supabase";
import { useProfileSheet } from "../hooks/useProfileSheet";
import ProfileBottomSheet from "../components/modals/ProfileBottomSheet";
import { set } from "zod";
import { useFocusEffect } from "@react-navigation/native";
import FriendRequestCard from "../components/cards/FriendRequestCard";
function ActivityScreen({ navigation }) {
  const { closeModal, openModal, modalVisible, selectedItem } = useModal();
  const {
    wallet,
    completedTransactions,
    transactionsHasMore,
    isLoadingTransactions,
    paymentRequests,
    transactionsPage,
    loadMoreTransactions,
    pullToRefreshTransactions,
    refreshPaymentRequests,
    friendRequests,
  } = useData();
  const { session } = useAuthContext();
  const [refreshing, setRefreshing] = useState(false);
  const [transactions, setTransactions] = useState([
    {
      title: "Friend Requests",
      data: friendRequests,
    },
    {
      title: "Requests",
      data: paymentRequests,
    },
    {
      title: "Completed",
      data: completedTransactions,
    },
  ]);
  const isInitialLoading = !completedTransactions || !paymentRequests;
  // const { bottomSheetRef, loading, data, presentSheet, dismissSheet } =
  //   useProfileSheet({
  //     sessionUserId: session.user.id,
  //   });

  const { presentSheet } = useModalContext();
  useEffect(() => {
    if (completedTransactions && paymentRequests && friendRequests) {
      setTransactions([
        { title: "Friend Requests", data: friendRequests },
        { title: "Requests", data: paymentRequests },
        { title: "Completed", data: completedTransactions },
      ]);
    }
  }, [completedTransactions, paymentRequests, friendRequests]);

  useEffect(() => {}, [completedTransactions]);

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

  const handlePress = (transaction) => {
    console.log("Transaction pressed", transaction);
    presentSheet("transaction", { transaction: transaction });
  };

  const handleUserPress = (user) => {
    console.log("User pressed", user);
    presentSheet("profile", { user: user });
  };

  const handleDismissBottomSheet = () => {
    dismissSheet();
  };
  const renderItem = ({ item, section }) => {
    if (section.title === "Friend Requests") {
      return <FriendRequestCard request={item} />;
    } else {
      return (
        <ActivityTransactionCard
          transaction={item}
          onPress={() => handlePress(item)}
          // onLongPress={() => handleLongPress(item)}
          navigation={navigation}
          onDelete={() => handleRemove(item)}
          onUserPress={handleUserPress}
        />
      );
    }
  };

  const renderSectionHeader = ({ section }) => {
    if (section.data?.length === 0) {
      return null; // Don't show header for Friend Requests
    }

    return (
      <View style={{ backgroundColor: colors.blue, zIndex: 1 }}>
        <AppText style={styles.header}>{section.title}</AppText>
      </View>
    );
  };

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
        balance={wallet?.usdc_balance || 0}
        style={styles.balanceCard}
      />
      <SectionList
        sections={transactions}
        keyExtractor={(item, index) => item.id + index}
        renderItem={renderItem}
        renderSectionHeader={renderSectionHeader}
        stickySectionHeadersEnabled={true}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            style={{ zIndex: 999999 }}
          />
        }
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
      {/* <ProfileBottomSheet
        ref={bottomSheetRef}
        user={data?.user}
        friendData={data?.friendData}
        sharedTransactions={data?.sharedTransactions}
        loading={loading}
        navigation={navigation}
        onDismiss={handleDismissBottomSheet}
      /> */}
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
    backgroundColor: colors.blueGray.shade10,
  },
  header: {
    paddingBottom: 10,
    fontSize: 24,
    fontFamily: fonts.bold,
    color: colors.lightGray,
    paddingHorizontal: 10,
    zIndex: 1,
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
