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

import { AppText } from "../components/primitives";
import TransactionDetailHeader from "../components/cards/TransactionDetailHeader";
import TransactionDetailReply from "../components/cards/TransactionDetailReply";
import { FAKE_TRANSACTION_POST } from "../data/fakeData";
import { X } from "lucide-react-native";
import { colors, fonts } from "../config";
import { ScrollView } from "react-native-gesture-handler";

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
  console.log("rerender");
  return (
    <KeyboardAvoidingView
      style={[styles.screen, { paddingTop: insets.top }]}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
    >
      <Pressable onPress={Keyboard.dismiss} style={styles.pressableContainer}>
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
        />
      </Pressable>

      <View style={styles.inputContainer}>
        <TextInput
          autoCapitalize="sentences"
          autoCorrect={true}
          name="reply"
          onChangeText={(value) => handleInputChange(value)}
          onSubmitEditing={handleSubmit}
          placeholder="Reply to this post..."
          placeholderTextColor={colors.softGray}
          returnKeyType="done"
          selectionColor={colors.lightGray}
          style={[
            styles.input,
            {
              fontFamily: reply ? fonts.medium : fonts.italic,
            },
          ]}
          value={reply}
        />
        <Pressable style={styles.button} onPress={handleSubmit}>
          <AppText style={styles.buttonText}>Reply</AppText>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.blue,
    paddingHorizontal: 10,
  },
  pressableContainer: {
    flex: 1, // Make pressable container flex to fill space
  },
  headerContainer: {},
  scrollViewContent: {
    paddingBottom: 20, // Add some padding at the bottom
    minHeight: "100%",
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
    width: "100%",
    padding: 0,
    backgroundColor: "transparent", // Add background color if needed
  },
  input: {
    borderColor: colors.fadedGray,
    borderWidth: 1,
    borderRadius: 5,
    paddingLeft: 10,
    color: colors.lightGray,
    fontSize: 16,
    lineHeight: 22,
    // marginBottom: 10,
    overflow: "hidden",
    // padding: 10,
    width: "100%",
    textAlignVertical: "bottom",
  },
  button: {
    backgroundColor: colors.yellow,
    padding: 10,
    borderRadius: 5,
    width: "100%",
  },
  buttonText: {
    color: colors.black,
    fontSize: 18,
    fontFamily: fonts.bold,
    textAlign: "center",
  },
});

export default TransactionDetailScreen;
