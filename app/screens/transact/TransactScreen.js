import React, { useContext, useEffect } from "react";
import { View, StyleSheet } from "react-native";

import { AppButton, AppText, Screen } from "../../components/primitives";
import AppKeypad from "../../components/forms/AppKeypad";
import { TransactionContext } from "../../contexts/TransactionContext";
import { colors, fonts } from "../../config";
import { useKeypadInput } from "../../hooks/useKeypadInput";
import routes from "../../navigation/routes";

function TransactScreen({ navigation }) {
  const { transaction, setTransaction } = useContext(TransactionContext);

  // Use the custom hook with initial value and options
  const { value, handleKeyPress } = useKeypadInput("", {
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

  const handleSend = () => {
    setTransaction((prev) => ({
      ...prev,
      action: "Sending",
    }));
    navigation.navigate(routes.TRANSACTSELECTUSER);
  };

  const handleRequest = () => {
    setTransaction((prev) => ({
      ...prev,
      action: "Requesting",
    }));
    navigation.navigate(routes.TRANSACTSELECTUSER);
  };

  return (
    <Screen style={styles.screen}>
      <AppText
        style={[styles.text, (!value || value === "") && styles.placeholder]}
      >
        ${value === "" ? "0" : value}
      </AppText>
      <View style={styles.input}>
        <View style={styles.sendReceiveContainer}>
          <AppButton
            color="yellow"
            title="Send"
            onPress={handleSend}
            style={styles.button}
            textStyle={styles.buttonText}
          />
          <AppButton
            color="lightGray"
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
  text: {
    fontFamily: fonts.black,
    fontSize: 50,
    color: colors.lightGray,
    textAlign: "center",
    width: "100%",
    marginTop: 140,
  },
  placeholder: {
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
});

export default TransactScreen;
