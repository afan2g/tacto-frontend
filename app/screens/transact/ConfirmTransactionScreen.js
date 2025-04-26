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
  BackHandler,
} from "react-native";
import { TextInput, useTheme } from "react-native-paper";
import { Wallet, utils, EIP712Signer } from "zksync-ethers";
import { ChevronLeft } from "lucide-react-native";
import * as SecureStore from "expo-secure-store";
import { supabase } from "../../../lib/supabase";
import { AppButton, AppText, Screen } from "../../components/primitives";
import { UserCardVertical } from "../../components/cards";
import ProfileBottomSheet from "../../components/modals/ProfileBottomSheet";
import { colors, fonts } from "../../config";
import AppKeypad from "../../components/forms/AppKeypad";
import { useKeypadInput } from "../../hooks/useKeypadInput";
import routes from "../../navigation/routes";
import { useAuthContext, useData } from "../../contexts";
import {
  fetchTransactionRequest,
  broadcastTransaction,
  createTransactionRequest,
} from "../../api";
import { useAmountFormatter } from "../../hooks/useAmountFormatter";
import { useProfileSheet } from "../../hooks/useProfileSheet";
import RNHapticFeedback from "react-native-haptic-feedback";

const WALLET_STORAGE_KEY = "TACTO_ENCRYPTED_WALLET";
function ConfirmTransactionScreen({ navigation, route }) {
  const {
    action = null,
    amount = null,
    recipientUser = null,
    recipientAddress = null,
    memo = null,
    methodId = null,
  } = route.params || {};
  const [transaction, setTransaction] = useState({
    action,
    amount,
    recipientUser,
    recipientAddress,
    memo,
    methodId,
  });

  const [showKeypad, setShowKeypad] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const theme = useTheme();
  const memoRef = useRef(null);
  const { wallet, profile } = useData();
  const { session } = useAuthContext();

  const {
    bottomSheetRef,
    loading: loadingBottomSheet,
    data,
    presentSheet,
    dismissSheet,
  } = useProfileSheet({
    sessionUserId: session.user.id,
  });

  const { value, handleKeyPress, getDisplayAmount, resetValue } =
    useKeypadInput(transaction.amount || "");
  const { getFormattedAmountWithoutSymbol } = useAmountFormatter();

  useEffect(() => {
    const subscription = BackHandler.addEventListener(
      "hardwareBackPress",
      handleBackPress
    );
    return () => subscription.remove();
  }, []);

  const handleBackPress = () => {
    const prevRoute =
      navigation.getState().routes[navigation.getState().index - 1];
    if (prevRoute.name === routes.TRANSACTSELECTUSER) {
      navigation.navigate(routes.TRANSACTSELECTUSER, {
        ...transaction,
        amount: getFormattedAmountWithoutSymbol(value),
      });
      return true;
    } else {
      navigation.goBack();
      return true;
    }
  };

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

  const handleAmountPress = () => {
    setShowKeypad(true);
    Keyboard.dismiss();
  };

  const handleUserPress = () => {
    presentSheet("profile", {
      user: transaction.recipientUser,
      navigation,
    });
  };

  const dismissInputs = () => {
    dismissKeypad();
    Keyboard.dismiss();
  };

  const dismissKeypad = () => {
    setShowKeypad(false);
    setTransaction((prev) => ({
      ...prev,
      amount: getFormattedAmountWithoutSymbol(value),
    }));
  };

  const performTransaction = async () => {
    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession();
    if (sessionError) {
      console.error("Error getting session data:", sessionError);
      throw new Error("Authentication failed: " + sessionError.message);
    }
    const userJWT = session.access_token;
    try {
      // Prepare transaction
      const [txRequest, securePhrase] = await Promise.all([
        fetchTransactionRequest(
          wallet.address,
          transaction.recipientAddress,
          transaction.amount,
          userJWT
        ),
        SecureStore.getItemAsync(`${WALLET_STORAGE_KEY}_${profile.id}`),
      ]);
      const t0 = performance.now();
      if (!txRequest) {
        throw new Error("Failed to create transaction");
      } else if (!securePhrase) {
        throw new Error("Failed to retrieve wallet");
      }

      console.log(
        "Transaction request received. Current nonce:",
        txRequest.nonce
      );
      const walletData = JSON.parse(securePhrase);
      const secureWallet = Wallet.fromMnemonic(walletData.phrase);

      // Sign transaction
      const signer = new EIP712Signer(secureWallet, txRequest.chainId);
      txRequest.customData.customSignature = await signer.sign(txRequest);
      const signedTx = utils.serializeEip712(txRequest);

      // Important fix: Make sure txInfo is a plain object with primitive values
      // The object with prototype methods might be causing issues during JSON serialization
      const txInfo = {
        toUserId: transaction.recipientUser?.id || "", // Ensure it's never undefined
        methodId: transaction.recipientUser ? "0" : "1", // Make sure methodId is a string
        memo: transaction.memo || null,
      };

      const data = await broadcastTransaction(
        signedTx,
        txRequest,
        txInfo,
        userJWT
      );
      const t1 = performance.now();
      console.log("Transaction time:", t1 - t0, "ms");
      const parsedData = JSON.parse(data);

      resetValue();

      // Check for errors in the response
      if (data.error) {
        throw new Error(`Transaction failed: ${data.error}`);
      }

      // Use the received data for navigation, not parsedData which isn't defined

      setTransaction((prev) => ({
        ...prev,
        txHash: parsedData.transactionHash,
      }));
      navigation.navigate(routes.TRANSACTSUCCESS, { ...transaction });

      return parsedData;
    } catch (err) {
      console.error("Transaction failed:", err);
      throw err;
    }
  };

  const handleConfirm = async () => {
    if (!value || value === "") {
      setError("Please enter an amount");
      RNHapticFeedback.trigger("notificationWarning", {
        ignoreAndroidSystemSettings: true,
      });
      return;
    }
    if (parseFloat(value) > parseFloat(wallet.usdc_balance)) {
      setError("Insufficient balance");
      RNHapticFeedback.trigger("notificationWarning", {
        ignoreAndroidSystemSettings: true,
      });
      return;
    }
    if (!transaction.recipientAddress) {
      setError("Recipient address is missing");
      RNHapticFeedback.trigger("notificationWarning", {
        ignoreAndroidSystemSettings: true,
      });
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await performTransaction();
    } catch (err) {
      setError(err.message || "Transaction failed. Please try again.");
      Alert.alert(
        "Transaction Failed",
        err.message || "An error occurred while processing your transaction"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleRequest = async () => {
    console.log("Requesting transaction:", transaction);
    if (!value || value === "") {
      setError("Please enter an amount");
      RNHapticFeedback.trigger("notificationWarning", {
        ignoreAndroidSystemSettings: true,
      });
      return;
    }

    if (transaction.action === "Requesting" && !transaction.recipientUser) {
      Alert.alert("Invalid Requestee", "Requestee is missing");
      return;
    }

    setLoading(true);
    setError(null);

    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession();
    if (sessionError) {
      console.error("Error getting session data:", sessionError);
      throw new Error("Authentication failed: " + sessionError.message);
    }
    const userJWT = session.access_token;

    try {
      await createTransactionRequest(transaction, userJWT);
      //TODO: update pending transactions

      navigation.navigate(routes.TRANSACTSUCCESS, { ...transaction });
    } catch (err) {
      setError(err.message || "Transaction failed. Please try again.");
      Alert.alert(
        "Transaction Failed",
        err.message || "An error occurred while processing your transaction"
      );
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
            onPress={() =>
              navigation.navigate(routes.TRANSACTSELECTUSER, {
                ...transaction,
                amount: getFormattedAmountWithoutSymbol(value),
              })
            }
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

          <Pressable style={styles.amountContainer} onPress={handleAmountPress}>
            <AppText style={styles.amount}>
              {getDisplayAmount(transaction.amount, styles.placeholderValue)}
            </AppText>
          </Pressable>
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
              label={<Text style={{ fontFamily: fonts.black }}>Memo</Text>}
              render={(innerProps) => (
                <RNTextInput
                  onPress={dismissKeypad}
                  {...innerProps}
                  style={[
                    innerProps.style,
                    {
                      paddingTop: 8,
                      paddingBottom: 8,
                      height: 100,
                    },
                  ]}
                />
              )}
            />
          </View>

          {error && <AppText style={styles.errorText}>{error}</AppText>}
        </ScrollView>

        <View style={styles.bottomContainer}>
          <View style={styles.buttonContainer}>
            <AppButton
              onPress={
                transaction.action === "Sending" ? handleConfirm : handleRequest
              }
              color={colors.yellow}
              title={transaction.action === "Sending" ? "Send" : "Request"}
              loading={loading}
              disabled={
                loading ||
                !transaction.amount ||
                parseFloat(transaction.amount) <= 0 ||
                (!transaction.recipientUser &&
                  transaction.action === "Requesting")
              }
            />
            <AppButton
              onPress={() => {
                navigation.navigate(routes.TRANSACTSUCCESS, {
                  txHash: "0x1234567890abcdef",
                });
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
      <ProfileBottomSheet
        ref={bottomSheetRef}
        user={transaction.recipientUser}
        friendData={data?.friendData}
        sharedTransactions={data?.sharedTransactions}
        loading={loadingBottomSheet}
        navigation={navigation}
        onDismiss={dismissSheet}
      />
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
  amountContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
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
    color: "red",
    marginTop: 10,
    textAlign: "center",
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
