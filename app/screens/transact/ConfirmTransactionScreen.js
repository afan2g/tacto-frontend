import React, { useContext, useEffect, useRef, useState } from "react";
import {
  View,
  StyleSheet,
  TextInput as RNTextInput,
  Keyboard,
  ScrollView,
  Pressable,
  Text,
  Alert,
} from "react-native";
import { Wallet, utils, EIP712Signer } from "zksync-ethers";
import { ethers } from "ethers";
import * as SecureStore from "expo-secure-store";
import { FunctionsHttpError, FunctionsRelayError, FunctionsFetchError } from "@supabase/supabase-js";
import { supabase } from "../../../lib/supabase";
import { ChevronLeft } from "lucide-react-native";
import { TextInput, useTheme } from "react-native-paper";
import { AppButton, AppText, Screen } from "../../components/primitives";
import { UserCardVertical } from "../../components/cards";
import { TransactionContext } from "../../contexts/TransactionContext";
import { colors, fonts } from "../../config";
import AppKeypad from "../../components/forms/AppKeypad";
import { useKeypadInput } from "../../hooks/useKeypadInput";
import routes from "../../navigation/routes";
import { useData } from "../../contexts";

const WALLET_STORAGE_KEY = "TACTO_ENCRYPTED_WALLET";

function ConfirmTransactionScreen({ navigation }) {
  const { transaction, setTransaction } = useContext(TransactionContext);
  const [showKeypad, setShowKeypad] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const theme = useTheme();
  const memoRef = useRef(null);
  const { wallet, profile } = useData();

  // Initialize useKeypadInput with transaction.amount
  const { value, handleKeyPress, resetValue } = useKeypadInput(transaction.amount || "", {
    maxDecimalPlaces: 2,
    allowLeadingZero: false,
    maxValue: 999999.99,
  });

  // Fetch recipient wallet address when recipient user changes
  useEffect(() => {
    if (!transaction.recipientUser) return;

    const fetchWallet = async () => {
      try {
        const { data, error } = await supabase
          .from("wallets")
          .select("address")
          .eq("owner_id", transaction.recipientUser.id)
          .single();

        if (error) throw error;

        setTransaction((prev) => ({
          ...prev,
          recipientAddress: data.address,
          methodId: 0, // 0 for user, 1 for external
        }));
      } catch (err) {
        console.error("Error fetching wallet:", err);
        setError("Failed to load recipient wallet information");
      }
    };

    fetchWallet();
  }, [transaction.recipientUser, setTransaction]);

  // Update transaction amount when value changes
  useEffect(() => {
    setTransaction((prev) => ({
      ...prev,
      amount: value,
    }));
  }, [value, setTransaction]);

  // Handlers
  const handleInputChange = (memoValue) => {
    setTransaction((prev) => ({
      ...prev,
      memo: memoValue,
    }));
  };

  const handleUserPress = () => {
    navigation.navigate(routes.USERPROFILE, { user: transaction.recipientUser });
  };

  const handleAmountPress = () => {
    setShowKeypad(true);
    Keyboard.dismiss();
  };

  const dismissInputs = () => {
    if (showKeypad) {
      setShowKeypad(false);
    }
    Keyboard.dismiss();
  };

  // Transaction helpers
  const populateUSDCTransferZK = async (value, to) => {
    try {
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
        let errorMsg = "Failed to prepare transaction";

        if (error instanceof FunctionsHttpError) {
          const errorDetails = await error.context.json();
          errorMsg = errorDetails.error || errorMsg;
        } else if (error instanceof FunctionsRelayError) {
          errorMsg = `Relay error: ${error.message}`;
        } else if (error instanceof FunctionsFetchError) {
          errorMsg = `Network error: ${error.message}`;
        }

        throw new Error(errorMsg);
      }

      return JSON.parse(tx);
    } catch (err) {
      console.error("Error in populateUSDCTransferZK:", err);
      throw err;
    }
  };

  const performTransaction = async () => {
    try {
      // Get wallet from secure storage
      const securePhrase = await SecureStore.getItemAsync(`${WALLET_STORAGE_KEY}_${profile.id}`);
      if (!securePhrase) throw new Error("Wallet not found");

      const walletData = JSON.parse(securePhrase);
      const secureWallet = Wallet.fromMnemonic(walletData.phrase);

      // Prepare transaction
      const txRequest = await populateUSDCTransferZK(
        transaction.amount,
        transaction.recipientAddress
      );

      if (!txRequest) {
        throw new Error("Failed to create transaction");
      }

      // Sign transaction
      const signer = new EIP712Signer(secureWallet, txRequest.chainId);
      txRequest.customData.customSignature = await signer.sign(txRequest);
      const signedTx = utils.serializeEip712(txRequest);

      // Send transaction
      const txInfo = {
        toUserId: transaction.recipientUser?.id,
        methodId: transaction.recipientUser ? 0 : 1, // 0 for user, 1 for external
        memo: transaction.memo
      };

      const { data, error } = await supabase.functions.invoke(
        "ethereum-zksync",
        {
          body: {
            action: "broadcastTxUSDC",
            signedTransaction: signedTx,
            txRequest: txRequest,
            txInfo: txInfo
          },
        }
      );

      if (error) {
        let errorMsg = "Transaction failed";

        if (error instanceof FunctionsHttpError) {
          const errorDetails = await error.context.json();
          errorMsg = errorDetails.error || errorMsg;
        } else if (error instanceof FunctionsRelayError) {
          errorMsg = `Relay error: ${error.message}`;
        } else if (error instanceof FunctionsFetchError) {
          errorMsg = `Network error: ${error.message}`;
        }

        throw new Error(errorMsg);
      }

      const parsedData = JSON.parse(data);

      resetValue();
      // Handle successful transaction
      navigation.navigate(routes.TRANSACTSUCCESS, {
        txHash: parsedData.transactionHash,
      });

      return data;
    } catch (err) {
      console.error("Transaction failed:", err);
      throw err;
    }
  };

  const handleConfirm = async () => {
    if (!transaction.amount || parseFloat(transaction.amount) <= 0) {
      Alert.alert("Invalid Amount", "Please enter a valid amount greater than zero");
      return;
    }

    if (!transaction.recipientAddress) {
      Alert.alert("Invalid Recipient", "Recipient address is missing");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await performTransaction();
    } catch (err) {
      setError(err.message || "Transaction failed. Please try again.");
      Alert.alert("Transaction Failed", err.message || "An error occurred while processing your transaction");
    } finally {
      setLoading(false);
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
            user={transaction.recipientUser}
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

          {error && (
            <AppText style={styles.errorText}>{error}</AppText>
          )}
        </ScrollView>

        <View style={styles.bottomContainer}>
          <View style={styles.buttonContainer}>
            <AppButton
              onPress={handleConfirm}
              color={colors.yellow}
              title="Confirm"
              loading={loading}
              disabled={loading || !transaction.amount || !transaction.recipientAddress}
            />
            <AppButton
              onPress={() => {
                navigation.navigate(routes.TRANSACTSUCCESS, {
                  txHash: "0x1234567890abcdef"
                })
              }}
              color={colors.red}
              title="Skip"
              loading={loading}
              disabled={loading}
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
  errorText: {
    color: 'red',
    marginTop: 10,
    textAlign: 'center',
    fontFamily: fonts.medium,
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