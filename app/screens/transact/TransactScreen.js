import React, { useContext, useEffect, useState } from "react";
import RNHapticFeedback from "react-native-haptic-feedback";
import { View, StyleSheet, Text } from "react-native";
import { AppButton, AppText, Screen } from "../../components/primitives";
import AppKeypad from "../../components/forms/AppKeypad";
import { TransactionContext } from "../../contexts/TransactionContext";
import { colors, fonts } from "../../config";
import { useKeypadInput } from "../../hooks/useKeypadInput";
import routes from "../../navigation/routes";
import { useData } from "../../contexts";
import { useAmountFormatter } from "../../hooks/useAmountFormatter";
import { set } from "zod";

function TransactScreen({ navigation, route }) {
  const { action = null, amount = null, recipientUser = null, recipientAddress = null, memo = null, methodId = null } = route.params || {};
  const [transaction, setTransaction] = useState({ action, amount, recipientUser, recipientAddress, memo, methodId });
  const [error, setError] = useState(null);
  const { wallet } = useData();

  // Use the custom hook with initial value and options
  const { value, setValue, handleKeyPress, getDisplayAmount } = useKeypadInput(transaction.amount || "");
  const { getFormattedAmountWithoutSymbol } = useAmountFormatter();
  // Update transaction.amount whenever value changes
  useEffect(() => {
    setError(null);
    setTransaction((prev) => ({
      ...prev,
      amount: getFormattedAmountWithoutSymbol(value),
    }));
  }, [value, setTransaction]);

  useEffect(() => {
    if (!transaction.amount) {
      setValue("");
    }
  }, [transaction.amount, setValue]);


  useEffect(() => {
    const unsubscribe = navigation.addListener("blur", () => {
      setTransaction({});
    });
    return unsubscribe;
  }, [navigation]);

  const handleSend = () => {
    if (!value || value === "") {
      setError("Please enter an amount");
      RNHapticFeedback.trigger("notificationWarning", {
        ignoreAndroidSystemSettings: true,
      });
      return;
    } else if (parseFloat(value) > parseFloat(wallet.usdc_balance)) {
      setError("Insufficient balance");
      RNHapticFeedback.trigger("notificationWarning", {
        ignoreAndroidSystemSettings: true,
      });
      return;
    }

    const updatedTransaction = {
      ...transaction,
      action: "Sending",
    };
    setTransaction(updatedTransaction);
    navigation.navigate(routes.TRANSACTSELECTUSER, { ...updatedTransaction });
  };

  const handleRequest = () => {
    if (!value || value === "") {
      setError("Please enter an amount");
      RNHapticFeedback.trigger("notificationWarning", {
        ignoreAndroidSystemSettings: true,
      })
      return;
    }
    setTransaction((prev) => ({
      ...prev,
      action: "Requesting",
    }));
    navigation.navigate(routes.TRANSACTSELECTUSER, { ...transaction });
  };

  return (
    <Screen style={styles.screen}>
      <View style={styles.amountContainer}>
        <AppText style={styles.text}>
          {getDisplayAmount(value, styles.placeholder)}
        </AppText>
      </View>
      <AppText style={styles.error}>{error}</AppText>
      <View style={styles.input}>
        <View style={styles.sendReceiveContainer}>
          <AppButton
            color={colors.yellow}
            title="Send"
            onPress={handleSend}
            style={styles.button}
            textStyle={styles.buttonText}
          />
          <AppButton
            color={colors.lightGray}
            title="Request"
            onPress={handleRequest}
            style={styles.button}
            textStyle={styles.buttonText}
          />
        </View>
        <AppKeypad onPress={handleKeyPress} />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  screen: {
    paddingHorizontal: 0,
    alignItems: "center",
    justifyContent: "space-between",
  },
  amountContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 140,
  },
  dollarSign: {
    fontFamily: fonts.black,
    fontSize: 50,
    color: colors.lightGray,
  },
  text: {
    fontFamily: fonts.black,
    fontSize: 50,
    color: colors.lightGray,
    textAlign: "center",
  },
  placeholder: {
    fontFamily: fonts.black,
    fontSize: 50,
    color: colors.softGray,
  },
  input: {
    width: "100%",
    alignItems: "center",
  },
  sendReceiveContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    paddingVertical: 20,
    paddingHorizontal: 5,
  },
  button: {
    width: "40%",
    padding: 15,
  },
  buttonText: {
    fontFamily: fonts.bold,
    fontSize: 24,
  },
  error: {
    color: colors.red,
    fontSize: 16,
  },
});

export default TransactScreen;