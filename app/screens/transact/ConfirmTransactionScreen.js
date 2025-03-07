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
import { Wallet, utils, EIP712Signer, Provider, types } from "zksync-ethers";
import { ethers } from "ethers";
import * as SecureStore from "expo-secure-store";
import { supabase } from "../../../lib/supabase";
import { useQuery } from "@tanstack/react-query";
import { fetchWallet } from "../../api";
import { ChevronLeft } from "lucide-react-native";
import { TextInput, useTheme } from "react-native-paper";
import { AppButton, AppText, Screen } from "../../components/primitives";
import { UserCardVertical } from "../../components/cards";
import { TransactionContext } from "../../contexts/TransactionContext";
import { colors, fonts } from "../../config";
import AppKeypad from "../../components/forms/AppKeypad";
import { useKeypadInput } from "../../hooks/useKeypadInput";
import routes from "../../navigation/routes";
import { set } from "zod";

function ConfirmTransactionScreen({ navigation }) {
  const { transaction, setTransaction } = useContext(TransactionContext);
  const [showKeypad, setShowKeypad] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const theme = useTheme();
  const memoRef = useRef(null);
  // Initialize useKeypadInput with transaction.amount
  const { value, handleKeyPress } = useKeypadInput(transaction.amount || "", {
    maxDecimalPlaces: 2,
    allowLeadingZero: false,
    maxValue: 999999.99,
  });
  const otherUserId = transaction.otherUser?.id;
  const { data: wallet, isLoading, error: walletError } = useQuery({
    queryKey: ["wallet", otherUserId],
    queryFn: () => fetchWallet(otherUserId),
    enabled: !!otherUserId,
  });

  if (isLoading) {
    console.log("Loading wallet data");
  }
  if (wallet) {
    console.log("Wallet data loaded", wallet);
  }
  if (walletError) {
    console.log("Error loading wallet data", walletError.message);
  }
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

  const handleConfirm = async () => {
    // Handle the confirm action here
    console.log("Transaction confirmed:", transaction);
    setLoading(true);
    setError(null);
    try {
      // Perform the transaction here
      const result = await performTransaction(transaction);
      console.log("Transaction result:", result);

    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
    // navigation.navigate('NextScreen'); // Uncomment and replace with your screen
  };

  const populateUSDCTransferZK = async (value, to) => {
    const { data: tx, error } = await supabase.functions.invoke(
      "ethereum-zksync",
      {
        body: {
          action: "getCompleteTransferTx",
          txRequest: {
            from: wallet.address,
            to: to,
            value: ethers.parseUnits(value.toString(), 6).toString(),
          },
        },
      }
    );
    if (error) {
      console.error("Error creating transaction:", error);
      return null;
    }

    console.log("tx: ", JSON.parse(tx));
    return JSON.parse(tx);
  };

  const performTransaction = async () => {
    try {
      // Get the wallet from secure storage
      const secureWallet = await SecureStore.getItemAsync("ENCRYPTED_WALLET");
      const walletData = JSON.parse(secureWallet);

      const wallet = Wallet.fromMnemonic(walletData.phrase);
      // Create the transaction
      const txRequest = await populateUSDCTransferZK(
        transaction.amount,
        transaction.otherUserWallet.address
      );

      if (!txRequest) {
        throw new Error("Failed to create transaction");
      }
      console.log("Transaction to sign:", txRequest);
      const signer = new EIP712Signer(wallet, txRequest.chainId);
      txRequest.customData.customSignature = await signer.sign(txRequest);

      const signedTx = utils.serializeEip712(txRequest);
      console.log("Signed transaction:", signedTx);
      // Send the signed transaction
      const { data, error } = await supabase.functions.invoke(
        "ethereum-zksync",
        {
          body: {
            action: "sendTestTransactionUSDC",
            signedTransaction: signedTx,
          },
        }
      );

      if (error) {
        throw new Error(`Error sending transaction: ${error.message}`);
      }

      console.log("Transaction sent successfully:", data);
      return data;
    } catch (error) {
      console.error("Transaction failed:", error);
      throw error;
    }
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
