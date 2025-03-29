import React, { useEffect } from "react";
import { View, StyleSheet } from "react-native";
import { Button, Text } from "react-native-paper";
import { AppText, Screen } from "../components/primitives";
import { FunctionsHttpError } from "@supabase/functions-js";
import * as SecureStore from "expo-secure-store";
import { ethers } from "ethers";
import { useData } from "../contexts";
import { colors, fonts } from "../config";
import { supabase } from "../../lib/supabase";
import routes from "../navigation/routes";
import { fetchAccountNonce, fetchTransactionRequest } from "../api";
import { useAuthContext } from "../contexts/AuthContext";

const WALLET_STORAGE_KEY = "TACTO_ENCRYPTED_WALLET";

function TestingScreen({ navigation }) {
  const {
    profile,
    wallet,
    completedTransactions,
    clearCompletedTransactions,
    fetchUserData,
  } = useData();
  const { session } = useAuthContext();
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(false);
  const handleViewStorage = () => {
    console.log("Storage pressed!");
    console.log("storage profile: ", profile);
    console.log("storage wallet: ", wallet);
    console.log("storage completedTransactions: ", completedTransactions);
  };

  const handleViewSecureStorage = async () => {
    console.log("Secure storage pressed!");
    const secureData = JSON.parse(
      await SecureStore.getItemAsync(`${WALLET_STORAGE_KEY}_${profile.id}`)
    );
    console.log("Secure data: ", secureData);
    const secureWallet = ethers.HDNodeWallet.fromPhrase(
      secureData.phrase,
      undefined,
      secureData.path
    );
    console.log("Secure wallet: ", secureWallet);
  };

  const handleDataRefresh = async () => {
    console.log("Refreshing data...");
    await fetchUserData();
    console.log("Data refreshed!");
  };

  const retrieveBlockNumber = async () => {
    console.log("Retrieving block number...");
    const { data, error } = await supabase.functions.invoke("ethereum", {
      body: { action: "getBlockNumber" },
    });
    if (error) {
      console.error("Error getting balance:", error);
    } else {
      console.log("Block:", data);
    }
  };

  const retrieveBalance = async () => {
    console.log("Retrieving balance...");
    const { data, error } = await supabase.functions.invoke("ethereum", {
      body: { action: "getBalance", address: wallet.address },
    });
    if (error) {
      console.error("Error getting balance:", error);
    } else {
      console.log("Balance:", ethers.formatEther(data.balance));
    }
  };

  const retrieveNetwork = async () => {
    console.log("Retrieving network...");
    const { data, error } = await supabase.functions.invoke("ethereum", {
      body: { action: "getNetwork" },
    });
    if (error) {
      console.error("Error getting network:", error);
    } else {
      console.log("Network:", data);
    }
  };

  const createTransaction = async (to, amount) => {
    try {
      const wei = ethers.parseUnits(amount.toString(), "ether");

      // Get transaction requirements from server
      const { data, error } = await supabase.functions.invoke("ethereum", {
        body: {
          action: "getTransactionRequirements",
          txRequest: {
            from: wallet.address,
            to: to,
            value: wei.toString(), // Convert BigInt to string for JSON
          },
        },
      });

      if (error)
        throw new Error(
          `Failed to get transaction requirements: ${error.message}`
        );
      if (!data) throw new Error("No data received from server");

      const transactionRequest = {
        from: wallet.address,
        to: to,
        value: wei,
        chainId: 11155111, // Consider making this configurable
        nonce: data.nonce,
        gasLimit: BigInt(data.gasLimit),
        maxFeePerGas: BigInt(data.feeData.maxFeePerGas),
        maxPriorityFeePerGas: BigInt(data.feeData.maxPriorityFeePerGas),
      };

      console.log("Transaction Request Created:", {
        ...transactionRequest,
        value: transactionRequest.value.toString(),
        gasLimit: transactionRequest.gasLimit.toString(),
        maxFeePerGas: transactionRequest.maxFeePerGas.toString(),
        maxPriorityFeePerGas:
          transactionRequest.maxPriorityFeePerGas.toString(),
      });

      return transactionRequest;
    } catch (error) {
      console.error("Error creating transaction:", error);
      throw error;
    }
  };

  const signTransaction = async (transaction) => {
    try {
      const encryptedWallet = await SecureStore.getItemAsync(
        "ENCRYPTED_WALLET"
      );
      if (!encryptedWallet) throw new Error("No wallet found");

      const walletData = JSON.parse(encryptedWallet);
      const signer = ethers.HDNodeWallet.fromPhrase(
        walletData.phrase,
        undefined,
        walletData.path
      );

      const signedTx = await signer.signTransaction(transaction);
      console.log("Transaction signed successfully");
      return signedTx;
    } catch (error) {
      console.error("Error signing transaction:", error);
      throw error;
    }
  };

  const sendTransaction = async (to, amount) => {
    try {
      console.log("Creating transaction...");
      const transactionRequest = await createTransaction(to, amount);

      console.log("Signing transaction...");
      const signedTx = await signTransaction(transactionRequest);

      console.log("Broadcasting transaction...");
      const { data, error } = await supabase.functions.invoke("ethereum", {
        body: {
          action: "sendDirectTransaction",
          signedTransaction: signedTx,
        },
      });

      if (error)
        throw new Error(`Failed to broadcast transaction: ${error.message}`);

      console.log("Transaction broadcast successful:", data);
      return data;
    } catch (error) {
      console.error("Transaction failed:", error);
      throw error;
    }
  };

  const handleSignTransaction = async () => {
    console.log("creating transaction...");
    const transaction = await createTransaction(
      "0x328961a35076fF0610fb65d9e18cEB8f8B358dc6",
      0.001
    );
    console.log("filled transaction: ", transaction);
    console.log("signing transaction...");
    const signedTx = await signTransaction(transaction);
    console.log("signed transaction: ", signedTx);
  };

  const handleSendTransaction = async () => {
    const result = await sendTransaction(
      "0x328961a35076fF0610fb65d9e18cEB8f8B358dc6",
      0.0001
    );
    console.log("result: ", result);
  };

  const handleLogWebhooks = async () => {
    const { data, error } = await supabase.functions.invoke("alchemy-test");
    if (error) {
      console.error("Error logging webhooks:", error);
    } else {
      console.log("Webhooks logged:", data);
    }
  };

  const retrieveBlockNumberZK = async () => {
    console.log("Retrieving zksync block number...");
    const { data, error } = await supabase.functions.invoke("ethereum-zksync", {
      body: { action: "getBlockNumber" },
    });
    if (error) {
      console.error("Error getting balance:", error);
    } else {
      console.log("Block:", data);
    }
  };

  const retrieveBalanceZK = async () => {
    console.log("Retrieving zksync balance...");
    const { data, error } = await supabase.functions.invoke("ethereum-zksync", {
      body: { action: "getBalance", address: wallet.address },
    });
    if (error) {
      console.error("Error getting balance:", error);
    } else {
      console.log("Balance:", data);
    }
  };

  const retrieveNetworkZK = async () => {
    console.log("Retrieving zksync network...");
    const { data, error } = await supabase.functions.invoke("ethereum-zksync", {
      body: { action: "getNetwork" },
    });
    if (error) {
      console.error("Error getting network:", error);
    } else {
      console.log("Network:", data);
    }
  };

  const retrieveUSDCBalanceZK = async () => {
    console.log("Retrieving zksync USDC balance...");
    const { data, error } = await supabase.functions.invoke("ethereum-zksync", {
      body: { action: "getUSDCBalance", address: wallet.address },
    });
    if (error) {
      console.error("Error getting balance:", error);
    } else {
      console.log("Balance:", data);
    }
  };

  const getAccountNonce = async () => {
    const address = wallet.address;
    const {
      data: {
        session: { access_token: userJWT },
      },
      error,
    } = await supabase.auth.getSession();
    if (error) {
      console.error("Error getting session data:", error);
      return;
    }
    console.log(`getting account nonce for ${address}. User JWT: ${userJWT}`);
    const nonce = await fetchAccountNonce(address, userJWT);
    console.log("Nonce:", nonce);
  };

  const handleShowCompletedTransactions = () => {
    console.log("Completed Transactions:", completedTransactions);
  };

  const handleClearCompletedTransactions = () => {
    clearCompletedTransactions();
  };

  const handleRefreshSession = async () => {
    console.log("Refreshing session...");
    const { data, error } = await supabase.auth.refreshSession();
    if (error) {
      console.error("Error refreshing session:", error);
    } else {
      console.log("Session refreshed:", data);
    }
  };

  const handleUserPress = async () => {
    const user = {
      avatar_url:
        "https://xxzucuadafldmamlluvh.supabase.co/storage/v1/object/public/avatars/963f9398-e270-4b14-8f7e-92f2b4c7b1fb/avatar.svg",
      created_at: "2025-03-26T05:48:36.949486+00:00",
      first_name: "Aoana",
      full_name: "Aoana djdn",
      id: "963f9398-e270-4b14-8f7e-92f2b4c7b1fb",
      last_name: "djdn",
      onboarding_complete: true,
      username: "afndk",
    };
    console.log("User pressed:", user.id);
    if (loading) return; // Prevent navigation if loading
    try {
      setLoading(true);
      setError(null);
      const { data, error } = await supabase.rpc("get_friend_data", {
        current_user_id: session.user.id,
        target_user_id: user.id,
      });
      if (error) {
        console.error("Error fetching friend data:", error);
        throw new Error("Failed to fetch friend data");
      }
      if (!data || data.length === 0) {
        console.error("user not found: ", user.id);
        throw new Error("User not found");
      }
      console.log("friend data: ", data);
      navigation.navigate(routes.USERPROFILE, {
        user,
        ...data,
      });
    } catch (error) {
      console.error("Error navigating to user profile:", error);
      setError("Failed to load recipient wallet information");
    } finally {
      setLoading(false);
    }
  };
  return (
    <Screen style={styles.screen}>
      <Text>Testing Screen</Text>
      <Button onPress={() => navigation.goBack()}>Go back</Button>
      <View
        style={{
          flexDirection: "row",
          flexWrap: "wrap",
          justifyContent: "space-between",
          width: "100%",
          paddingHorizontal: 20,
        }}
      >
        <Button onPress={handleViewStorage}>View Storage</Button>
        <Button onPress={handleViewSecureStorage}>View Secure Storage</Button>
        <Button onPress={handleDataRefresh}>Refresh Data</Button>
      </View>
      <View
        style={{
          flexDirection: "row",
          flexWrap: "wrap",
          justifyContent: "space-between",
          width: "100%",
          paddingHorizontal: 20,
        }}
      >
        <Button onPress={retrieveBlockNumber}>View Mainnet Block</Button>
        <Button onPress={retrieveBlockNumberZK}>View ZKSync Block</Button>
      </View>
      <View
        style={{
          flexDirection: "row",
          flexWrap: "wrap",
          justifyContent: "space-between",
          width: "100%",
          paddingHorizontal: 20,
        }}
      >
        <Button onPress={retrieveBalance}>View Balance</Button>
        <Button onPress={retrieveBalanceZK}>View ZKSync Balance</Button>
      </View>
      <Button onPress={retrieveUSDCBalanceZK}>View ZKSync USDC balance</Button>
      <View
        style={{
          flexDirection: "row",
          flexWrap: "wrap",
          justifyContent: "space-between",
          width: "100%",
          paddingHorizontal: 20,
        }}
      >
        <Button onPress={retrieveNetwork}>View Current Network</Button>
        <Button onPress={retrieveNetworkZK}>View ZKSync Network</Button>
      </View>
      <Button onPress={handleSignTransaction}>Sign Transaction</Button>
      <Button onPress={handleSendTransaction}>Send Transaction</Button>
      <Button onPress={handleLogWebhooks}>Log Webhooks</Button>
      <Button onPress={() => navigation.navigate(routes.TESTNOTIFICATIONS)}>
        Test Notifications
      </Button>
      <Button onPress={getAccountNonce}>Get Account Nonce</Button>
      <Button onPress={handleShowCompletedTransactions}>
        Show Completed Transactions
      </Button>
      <Button onPress={handleClearCompletedTransactions}>
        Clear Completed Transactions
      </Button>
      <Button onPress={handleRefreshSession}>Refresh Session</Button>
      <Button onPress={handleUserPress}>Test User Profile</Button>
    </Screen>
  );
}

const styles = StyleSheet.create({
  screen: {
    paddingHorizontal: 0,
    alignItems: "center",
  },
  refreshButton: {
    padding: 20,
    alignItems: "center",
  },
  refreshText: {
    fontSize: 16,
    fontFamily: fonts.medium,
    color: colors.lightGray,
  },
});

export default TestingScreen;
