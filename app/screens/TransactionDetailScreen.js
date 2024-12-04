import React from "react";
import { View, StyleSheet } from "react-native";

import { Screen } from "../components/primitives";
import { TransactionCard } from "../components/cards";
import colors from "../config/colors";

function TransactionDetailScreen({ navigation, route }) {
  const { from, to, amount, memo, score, commentCount, time, txid } =
    route.params;
  return (
    <Screen style={styles.screen}>
      <TransactionCard navigation={navigation} transaction={route.params} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  screen: {
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 0,
  },
  text: {
    color: colors.lightGray,
    fontSize: 40,
  },
});

export default TransactionDetailScreen;
