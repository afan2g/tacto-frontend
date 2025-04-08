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
import { useAuthContext, useData } from "../contexts";
import { ActivityIndicator } from "react-native-paper";
import TransactionBottomSheet from "../components/modals/TransactionBottomSheet";
import { supabase } from "../../lib/supabase";
import { useProfileSheet } from "../hooks/useProfileSheet";
import ProfileBottomSheet from "../components/modals/ProfileBottomSheet";
import { set } from "zod";
import { useFocusEffect } from "@react-navigation/native";
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
  } = useData();
  const { session } = useAuthContext();
  const [refreshing, setRefreshing] = useState(false);
  const [transactions, setTransactions] = useState([
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
  const [bottomSheetItem, setBottomSheetItem] = useState(null);
  const transactionSheetRef = React.useRef(null);
  const { bottomSheetRef, loading, data, presentSheet, dismissSheet } =
    useProfileSheet({
      sessionUserId: session.user.id,
    });
  useEffect(() => {
    if (completedTransactions && paymentRequests) {
      setTransactions([
        { title: "Requests", data: paymentRequests },
        { title: "Completed", data: completedTransactions },
      ]);
    }
  }, [completedTransactions, paymentRequests]);

  useEffect(() => {
    console.log("new completed transactions", completedTransactions);
  }, [completedTransactions]);

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

  const handleUserPress = (user) => {
    console.log("User pressed", user);
    presentSheet(user);
  };

  const handleDismissBottomSheet = () => {
    dismissSheet();
  };
  const renderItem = ({ item }) => {
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
  };

  const renderSectionHeader = ({ section: { title } }) => {
    return (
      <View style={{ backgroundColor: colors.blue, zIndex: 1 }}>
        <AppText style={styles.header}>{title}</AppText>
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
        balance={wallet.usdc_balance}
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
      <TransactionBottomSheet
        ref={transactionSheetRef}
        transaction={bottomSheetItem}
      />

      <ProfileBottomSheet
        ref={bottomSheetRef}
        user={data?.user}
        friendData={data?.friendData}
        sharedTransactions={data?.sharedTransactions}
        loading={loading}
        navigation={navigation}
        onDismiss={handleDismissBottomSheet}
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
