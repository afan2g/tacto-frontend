import React from "react";
import {
  View,
  StyleSheet,
  Pressable,
  Keyboard,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  FlatList,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Vibration } from "react-native";

import { AppText } from "../components/primitives";
import TransactionDetailHeader from "../components/cards/TransactionDetailHeader";
import TransactionDetailReply from "../components/cards/TransactionDetailReply";
import { FAKE_TRANSACTION_POST } from "../data/fakeData";
import { SendHorizonal, X } from "lucide-react-native";
import { colors, fonts } from "../config";
import { ScrollView } from "react-native-gesture-handler";
import { AppCardSeparator } from "../components/cards";

function TransactionDetailScreen({ transactionPost }) {
  const [reply, setReply] = React.useState("");
  const handleInputChange = (value) => {
    setReply(value);
  };

  const handleSubmit = () => {
    console.log("Reply submitted:", reply);
    setReply("");
  };
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const { post, replies } = FAKE_TRANSACTION_POST;

  const handleClose = () => {
    console.log("Close Transaction Detail Screen");
    navigation.goBack();
  };

  const handleFocus = () => {
    Vibration.vibrate(1);
  };

  return (
    <KeyboardAvoidingView
      style={[
        styles.screen,
        { paddingTop: insets.top, paddingBottom: insets.bottom },
      ]}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
    >
      <View style={styles.contentContainer}>
        <View style={styles.headerContainer}>
          <X
            color={colors.lightGray}
            size={30}
            style={[styles.closeIcon]}
            onPress={handleClose}
          />
          <TransactionDetailHeader transaction={post} />
        </View>
        <FlatList
          contentContainerStyle={styles.scrollViewContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          data={replies}
          keyExtractor={(reply) => reply.id.toString()}
          renderItem={({ item }) => <TransactionDetailReply reply={item} />}
          ItemSeparatorComponent={AppCardSeparator}
        />
      </View>
      <View style={styles.replyContainer}>
        <View style={[styles.inputContainer]}>
          <TextInput
            autoCapitalize="sentences"
            autoCorrect={true}
            name="reply"
            onChangeText={(value) => handleInputChange(value)}
            onFocus={handleFocus}
            onSubmitEditing={handleSubmit}
            placeholder="Reply to this post..."
            placeholderTextColor={colors.softGray}
            returnKeyType="done"
            selectionColor={colors.lightGray}
            scrollEnabled={true}
            multiline={true}
            numberOfLines={3}
            textAlignVertical="top"
            style={[
              styles.input,
              {
                fontFamily: reply ? fonts.medium : fonts.italic,
              },
            ]}
            value={reply}
          />
          <SendHorizonal color={colors.yellow} size={24} style={styles.send} />
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 10,
  },
  headerContainer: {},
  scrollViewContent: {
    minHeight: "100%",
  },
  replyContainer: {
    paddingHorizontal: 5,
    paddingVertical: 5,
    backgroundColor: colors.blue,
    borderTopWidth: 1,
    borderTopColor: colors.lightGray,
  },
  closeIcon: {
    position: "absolute",
    top: 0,
    left: 0,
    marginLeft: 10,
    zIndex: 10,
  },
  replies: {
    marginTop: 20,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    paddingVertical: 5,
    borderWidth: 1,
    borderColor: colors.lightGray,
    borderRadius: 5,
    paddingHorizontal: 15,
    backgroundColor: colors.blueGray.shade30,
    paddingVertical: 10,
  },
  input: {
    paddingLeft: 10,
    color: colors.lightGray,
    fontSize: 16,
    lineHeight: 22,
    overflow: "scroll",
    // padding: 10,
    flex: 1,
  },
  send: {
    marginLeft: 10,
  },
});

export default TransactionDetailScreen;
