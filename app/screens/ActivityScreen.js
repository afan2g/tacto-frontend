import React from "react";
import { View, StyleSheet, FlatList } from "react-native";

import { AppText, Screen } from "../components/primitives";
import { colors, fonts } from "../config";
import {
  AccountBalanceCard,
  ActivityTransactionCard,
} from "../components/cards";
import {
  FAKE_TRANSACTIONS_COMPLETED,
  FAKE_TRANSACTIONS_PENDING,
} from "../data/fakeData";

function ActivityScreen(props) {
  return (
    <Screen style={styles.screen}>
      <AccountBalanceCard balance={1002.33} style={styles.balanceCard} />
      <FlatList
        ListHeaderComponent={() => (
          <>
            <View style={styles.pendingContainer}>
              <AppText style={styles.header}>Pending</AppText>
              {FAKE_TRANSACTIONS_PENDING.map((item) => (
                <ActivityTransactionCard key={item.id} transaction={item} />
              ))}
            </View>
            <View style={styles.completedContainer}>
              <AppText style={styles.header}>Completed</AppText>
            </View>
          </>
        )}
        data={FAKE_TRANSACTIONS_COMPLETED}
        renderItem={({ item }) => (
          <ActivityTransactionCard transaction={item} />
        )}
        keyExtractor={(item) => item.id.toString()}
        style={styles.flatList}
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
});

export default ActivityScreen;
