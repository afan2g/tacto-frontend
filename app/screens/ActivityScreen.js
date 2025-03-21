import React, { useEffect } from "react";
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
  const [stickyHeaderIndices, setStickyHeaderIndices] = React.useState([0, paymentRequests.length + 1]);
  const [transactions, setTransactions] = React.useState([
    "Requests",
    ...paymentRequests,
    "Completed",
    ...completedTransactions,
  ]);
  useEffect(() => {
    setTransactions([
      "Requests",
      ...paymentRequests,
      "Completed",
      ...completedTransactions,
    ]);

    setStickyHeaderIndices([0, paymentRequests.length + 1]);
  }, [completedTransactions, paymentRequests]);

  const handlePress = (transaction) => {
    navigation.navigate(routes.TRANSACTIONDETAIL, { transaction });
  };
  const handleLongPress = (transaction) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    openModal({ ...FAKE_TRANSACTIONS_FULL[0], identifier: transaction.id });
  };
  return (
    <Screen style={styles.screen}>
      <AccountBalanceCard balance={wallet.usdc_balance} style={styles.balanceCard} />
      <FlashList
        data={transactions}
        renderItem={({ item }) => {
          if (typeof item === "string") {
            // Rendering header
            return <View style={{ backgroundColor: colors.black, zIndex: 1 }}><AppText style={styles.header}>{item}</AppText></View>;
          } else {
            // Render item
            return (
              <ActivityTransactionCard
                transaction={item}
                onPress={() => handlePress(item)}
                onLongPress={() => handleLongPress(item)}
                navigation={navigation}
              />
            )
          }
        }}
        stickyHeaderIndices={stickyHeaderIndices}
        getItemType={(item) => {
          // To achieve better performance, specify the type based on the item
          return typeof item === "string" ? "sectionHeader" : "row";
        }}
        estimatedItemSize={100}
        keyExtractor={(item) => typeof item === "string" ? item : item.id}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={async () => {
          setRefreshing(true);
          await refreshPaymentRequests();
          await pullToRefreshTransactions();
          setRefreshing(false);
        }}
        />}
        stickyHeaderHiddenOnScroll={false}
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

      <TransactionModal
        transaction={selectedItem}
        visible={modalVisible}
        close={closeModal}
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
