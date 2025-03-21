import React from "react";
import { View, StyleSheet, FlatList, SectionList, RefreshControl } from "react-native";
import * as Haptics from "expo-haptics";

import { AppText, Screen } from "../components/primitives";
import { colors, fonts } from "../config";
import routes from "../navigation/routes";
import {
  AccountBalanceCard,
  ActivityTransactionCard,
} from "../components/cards";
import {
  FAKE_TRANSACTIONS_COMPLETED,
  FAKE_TRANSACTIONS_FULL,
  FAKE_TRANSACTIONS_PENDING,
} from "../data/fakeData";
import useModal from "../hooks/useModal";
import TransactionModal from "../components/modals/TransactionModal";
import { useData } from "../contexts";
import { FlashList } from "@shopify/flash-list";
import { ActivityIndicator } from "react-native-paper";

const DATA = [
  {
    title: "Pending",
    data: FAKE_TRANSACTIONS_PENDING,
  },
  {
    title: "Completed",
    data: FAKE_TRANSACTIONS_COMPLETED,
  },
];
function ActivityScreen({ navigation }) {
  const { closeModal, openModal, modalVisible, selectedItem } = useModal();
  const { profile, wallet, completedTransactions, transactionsHasMore, loadMoreTransactions, isLoadingTransactions, pullToRefreshTransactions, paymentRequests, isLoadingPaymentRequests, refreshPaymentRequests } = useData();
  const [refreshing, setRefreshing] = React.useState(false);
  const handlePress = (transaction) => {
    navigation.navigate(routes.TRANSACTIONDETAIL, { transaction });
  };
  const handleLongPress = (transaction) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    openModal(FAKE_TRANSACTIONS_FULL[0]);
  };
  return (
    <Screen style={styles.screen}>
      <AccountBalanceCard balance={wallet.usdc_balance} style={styles.balanceCard} />

      {/* <SectionList
        sections={completedTransactions}
        keyExtractor={(item, index) => item + index}
        renderItem={({ item }) => (
          <ActivityTransactionCard
            transaction={item}
            onPress={() => handlePress(item)}
            onLongPress={() => handleLongPress(item)}
            navigation={navigation}
          />
        )}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        renderSectionHeader={({ section: { title } }) => (
          <AppText style={styles.header}>{title}</AppText>
        )}
      />
      <TransactionModal
        transaction={selectedItem}
        visible={modalVisible}
        close={closeModal}
      /> */}
      <FlashList
        data={completedTransactions}
        renderItem={({ item }) => (
          <ActivityTransactionCard
            transaction={{ ...item, }}
            onPress={() => handlePress(item)}
            onLongPress={() => handleLongPress(item)}
            navigation={navigation}
          />
        )}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        keyExtractor={(item) => item.id}
        estimatedItemSize={96}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={async () => {
          setRefreshing(true);
          await pullToRefreshTransactions();
          setRefreshing(false);
        }} />}
        onEndReached={() => {
          console.log("End reached");
          if (transactionsHasMore && !isLoadingTransactions) {
            loadMoreTransactions();
          }
        }}
        onEndReachedThreshold={0.5}
        ListFooterComponent={isLoadingTransactions ? <ActivityIndicator animating={isLoadingTransactions} color={colors.purplePop} /> : (!transactionsHasMore && <AppText style={styles.activityEndText}>End of transactions</AppText>)}
        ListFooterComponentStyle={styles.activityEnd}
      />
      {/* <FlashList
        data={paymentRequests}
        renderItem={({ item }) => (
          <ActivityTransactionCard
            transaction={{ ...item }}
            onPress={() => handlePress(item)}
            onLongPress={() => handleLongPress(item)}
            navigation={navigation}
          />
        )}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        keyExtractor={(item) => item.id}
        estimatedItemSize={96}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={async () => {
          setRefreshing(true);
          await refreshPaymentRequests();
          setRefreshing(false);
        }} />}

        ListFooterComponent={<AppText style={styles.activityEndText}>End of requests</AppText>}
        ListFooterComponentStyle={styles.activityEnd}
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
  separator: {
    height: 2,
    marginHorizontal: 10,
    backgroundColor: colors.blueShade10,
  },
  header: {
    borderBottomColor: colors.lightGray,
    borderBottomWidth: 1,
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
