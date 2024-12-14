import React from "react";
import { View, StyleSheet, Pressable, Keyboard } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Screen } from "../components/primitives";
import TransactionDetailHeader from "../components/cards/TransactionDetailHeader";
import TransactionDetailReply from "../components/cards/TransactionDetailReply";
import { FAKE_TRANSACTION_POST } from "../data/fakeData";
import { X } from "lucide-react-native";
import { colors } from "../config";
function TransactionDetailScreen({ transactionPost }) {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  // const { post, replies } = transactionPost;
  const { post, replies } = FAKE_TRANSACTION_POST;
  const handleClose = () => {
    console.log("Close Transaction Detail Screen");
    navigation.goBack();
  };
  return (
    <Screen style={styles.screen}>
      <Pressable onPress={Keyboard.dismiss}>
        <X
          color={colors.lightGray}
          size={30}
          style={[styles.closeIcon]}
          onPress={handleClose}
        />
        <TransactionDetailHeader transaction={post} />
        <View style={styles.replies}>
          {replies.map((reply) => (
            <TransactionDetailReply key={reply.id} reply={reply} />
          ))}
        </View>
      </Pressable>
    </Screen>
  );
}

const styles = StyleSheet.create({
  closeIcon: {
    position: "absolute",
    top: 0,
    left: 0,
    marginLeft: 10,
  },
  replies: {
    marginTop: 20,
  },
});

export default TransactionDetailScreen;
