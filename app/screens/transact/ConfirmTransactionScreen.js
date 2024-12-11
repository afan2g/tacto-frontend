import React, { useContext, useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  TextInput,
  Keyboard,
  ScrollView,
  Pressable,
} from "react-native";
import { ChevronLeft } from "lucide-react-native";

import { AppButton, AppText, Screen } from "../../components/primitives";
import { UserCardVertical } from "../../components/cards";
import { TransactionContext } from "../../contexts/TransactionContext";
import { colors, fonts } from "../../config";
import AppKeypad from "../../components/forms/AppKeypad";
import { useKeypadInput } from "../../hooks/useKeypadInput";
import routes from "../../navigation/routes";

function ConfirmTransactionScreen({ navigation }) {
  const { transaction, setTransaction } = useContext(TransactionContext);
  const [showKeypad, setShowKeypad] = useState(false);
  const [inputHeight, setInputHeight] = useState(100); // Initial height

  // Initialize useKeypadInput with transaction.amount
  const { value, handleKeyPress } = useKeypadInput(transaction.amount || "", {
    maxDecimalPlaces: 2,
    allowLeadingZero: false,
  });

  // Update transaction.amount whenever value changes
  useEffect(() => {
    setTransaction((prev) => ({
      ...prev,
      amount: value,
    }));
  }, [value]);

  const handleInputChange = (memoValue) => {
    setTransaction((prev) => ({
      ...prev,
      memo: memoValue,
    }));
  };

  const handleContentSizeChange = (event) => {
    setInputHeight(event.nativeEvent.contentSize.height);
  };

  const handleUserPress = () => {
    // Handle the user press here
    console.log("User pressed:", transaction.otherUser);
    navigation.navigate(routes.USERPROFILE, { user: transaction.otherUser });
  };

  const handleAmountPress = () => {
    setShowKeypad(true);

    Keyboard.dismiss(); // Hide the keyboard if it's open
  };

  // Function to dismiss keypad and keyboard
  const dismissInputs = () => {
    if (showKeypad) {
      setShowKeypad(false);
    }
    Keyboard.dismiss();
  };

  const handleConfirm = () => {
    // Handle the confirm action here
    console.log("Transaction confirmed:", transaction);
    // navigation.navigate('NextScreen'); // Uncomment and replace with your screen
  };

  return (
    <Pressable style={styles.container} onPress={dismissInputs}>
      <Screen style={styles.screen}>
        <View style={styles.headerContainer}>
          <ChevronLeft
            size={36}
            color={colors.lightGray}
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          />
          <AppText style={styles.headerText}>{transaction.action}</AppText>
        </View>
        <ScrollView
          contentContainerStyle={styles.contentContainer}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <UserCardVertical
            user={transaction.otherUser}
            onPress={handleUserPress}
          />
          <AppText
            style={[
              styles.amount,
              (!value || value === "") && styles.placeholderValue,
            ]}
            onPress={handleAmountPress}
          >
            ${value === "" ? "0" : value}
          </AppText>
          <TextInput
            onChangeText={handleInputChange}
            placeholder="Memo cannot be blank..."
            placeholderTextColor={colors.softGray}
            style={[
              styles.input,
              transaction.memo ? styles.text : styles.placeholder,
              { height: inputHeight },
            ]}
            value={transaction.memo}
            multiline
            onFocus={() => setShowKeypad(false)}
            maxLength={140}
            onContentSizeChange={handleContentSizeChange}
          />
        </ScrollView>

        <View style={styles.bottomContainer}>
          <View style={styles.buttonContainer}>
            <AppButton
              onPress={() => console.log(transaction)}
              color="yellow"
              title="Confirm"
            />
          </View>
          {showKeypad && <AppKeypad onPress={handleKeyPress} />}
        </View>
      </Screen>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  screen: {
    flex: 1,
  },
  headerContainer: {
    position: "relative",
    alignItems: "center",
    marginVertical: 10,
  },
  backButton: {
    position: "absolute",
    left: 10,
  },
  headerText: {
    fontFamily: fonts.medium,
    fontSize: 28,
    color: colors.yellow,
    textAlign: "center",
  },
  contentContainer: {
    alignItems: "center",
    paddingHorizontal: 20,
    flexGrow: 1,
  },
  placeholderValue: {
    color: colors.softGray,
  },
  amount: {
    fontFamily: fonts.black,
    fontSize: 48,
    color: colors.lightGray,
    marginVertical: 15,
  },
  input: {
    borderColor: colors.fadedGray,
    borderWidth: 1,
    borderRadius: 5,
    fontSize: 15,
    lineHeight: 22,
    overflow: "hidden",
    padding: 10,
    textAlignVertical: "top",
    width: "100%",
  },
  placeholder: {
    fontFamily: fonts.italic,
  },
  text: {
    fontFamily: fonts.medium,
    color: colors.lightGray,
  },
  keypadContainer: {
    width: "100%",
    bottom: 0,
    alignSelf: "center",
    backgroundColor: colors.blue,
  },
  buttonContainer: {
    padding: 20,
    backgroundColor: colors.white,
  },
  bottomContainer: {
    justifyContent: "center",
    width: "100%",
  },
});

export default ConfirmTransactionScreen;
