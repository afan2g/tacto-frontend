import React from "react";
import { View, StyleSheet, FlatList } from "react-native";

import { AppCardSeparator, TransactionCard } from "../../components/cards";
import { colors } from "../../config";
import formatRelativeTime from "../../utils/formatRelativeTime";

function OtherUserActivity({ transactions }) {
  return (
    <View style={styles.container}>
      <FlatList
        data={transactions}
        renderItem={({ item }) => (
          <TransactionCard
            transaction={{ ...item, time: formatRelativeTime(item.time) }}
          />
        )}
        keyExtractor={(item) => item.txid.toString()}
        ItemSeparatorComponent={() => <AppCardSeparator />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.blue,
  },
});

export default OtherUserActivity;
