import React, { useContext, useEffect, useRef, useState } from "react";
import {
  View,
  StyleSheet,
  TextInput as RNTextInput,
  Keyboard,
  ScrollView,
  Pressable,
  Text,
} from "react-native";
import { ChevronLeft } from "lucide-react-native";
import { TextInput, useTheme } from "react-native-paper";
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
  const theme = useTheme();
  const memoRef = useRef(null);
  // Initialize useKeypadInput with transaction.amount
  const { value, handleKeyPress } = useKeypadInput(transaction.amount || "", {
    maxDecimalPlaces: 2,
    allowLeadingZero: false,
    maxValue: 999999.99,
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
            scale={0.8}
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
          <View style={styles.inputContainer}>
            <TextInput
              {...theme.formInput}
              theme={{
                colors: {
                  onSurfaceVariant: colors.softGray,
                },
              }}
              ref={memoRef}
              value={transaction.memo}
              onChangeText={handleInputChange}
              autoCorrect={true}
              onFocus={() => setShowKeypad(false)}
              maxLength={80}
              multiline
              accessibilityLabel="Memo input"
              contentStyle={{ alignItems: "flex-start" }}
              textAlignVertical="top"
              label={
                <Text style={{ fontFamily: fonts.black }}>Memo</Text>
              }
              render={(innerProps) => (
                <RNTextInput
                  {...innerProps}
                  style={[
                    innerProps.style,
                    {
                      paddingTop: 8,
                      paddingBottom: 8,
                      height: 100,
                    }
                  ]}
                />
              )}
            />
          </View>
        </ScrollView>

        <View style={styles.bottomContainer}>
          <View style={styles.buttonContainer}>
            <AppButton
              onPress={handleConfirm}
              color={colors.yellow}
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
    paddingHorizontal: 5,
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
    padding: 5,
    backgroundColor: colors.white,
    paddingBottom: 30,
  },
  bottomContainer: {
    width: "100%",
    position: "absolute",
    bottom: 0,
    alignSelf: "center",
  },
  inputContainer: {
    width: "100%",
  },
});

export default ConfirmTransactionScreen;
