import React from "react";
import { View, StyleSheet } from "react-native";

import { Screen } from "../components/primitives";
import { TransactionCard } from "../components/cards";
import colors from "../config/colors";
import { FAKE_HOME_SCREEN_DATA } from "../data/fakeData";
import formatRelativeTime from "../utils/formatRelativeTime";

function TransactionDetailScreen({ navigation, route }) {
  const tx = route.params.transaction;
  return (
    <Screen style={styles.screen}>
      <TransactionCard navigation={navigation} transaction={tx} />
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
