import React from "react";
import { View, StyleSheet } from "react-native";

import { AppText, Screen } from "../components/primitives";
import TransactionDetailHeader from "../components/cards/TransactionDetailHeader";
import TransactionDetailReply from "../components/cards/TransactionDetailReply";
function TransactionDetailScreen({ transactionPost }) {
  const { post, replies } = transactionPost;
  return (
    <Screen style={styles.screen}>
      <TransactionDetailHeader transaction={post} />
      <View style={styles.replies}>
        {replies.map((reply) => (
          <TransactionDetailReply key={reply.id} reply={reply} />
        ))}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  screen: {},
  replies: {
    marginTop: 20,
  },
});

export default TransactionDetailScreen;
