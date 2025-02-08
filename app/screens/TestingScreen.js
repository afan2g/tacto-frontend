import React, { useEffect } from "react";
import { View, StyleSheet } from "react-native";
import { Button, Text } from "react-native-paper";
import { AppText, Screen } from "../components/primitives";
import { Pressable } from "react-native";
import { storage } from "../../lib/storage";
import * as SecureStore from "expo-secure-store";
import { ethers } from "ethers";
import { useData } from "../contexts";
import { colors, fonts } from "../config";
import { supabase } from "../../lib/supabase";
function TestingScreen({ navigation }) {
  const { profile, wallet, fetchUserData } = useData();

  const handleViewStorage = () => {
    console.log("Storage pressed!");
    console.log("storage profile: ", profile);
    console.log("storage wallet: ", wallet);
  };

  const handleViewSecureStorage = async () => {
    console.log("Secure storage pressed!");
    const secureData = JSON.parse(
      await SecureStore.getItemAsync("ENCRYPTED_WALLET")
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
      console.log("Balance:", data);
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

  return (
    <Screen style={styles.screen}>
      <Text>Testing Screen</Text>
      <Button onPress={() => navigation.goBack()}>Go back</Button>
      <Pressable style={styles.refreshButton} onPress={handleViewStorage}>
        <AppText style={styles.refreshText}>View Storage</AppText>
      </Pressable>
      <Pressable style={styles.refreshButton} onPress={handleViewSecureStorage}>
        <AppText style={styles.refreshText}>View Secure Storage</AppText>
      </Pressable>
      <Pressable style={styles.refreshButton} onPress={handleDataRefresh}>
        <AppText style={styles.refreshText}>Refresh Data</AppText>
      </Pressable>
      <Pressable style={styles.refreshButton} onPress={retrieveBlockNumber}>
        <AppText style={styles.refreshText}>View Block</AppText>
      </Pressable>
      <Pressable style={styles.refreshButton} onPress={retrieveBalance}>
        <AppText style={styles.refreshText}>View Balance</AppText>
      </Pressable>
      <Pressable style={styles.refreshButton} onPress={retrieveNetwork}>
        <AppText style={styles.refreshText}>View Current Network</AppText>
      </Pressable>
      <Pressable
        style={styles.refreshButton}
        onPress={() =>
          createTransaction("0x328961a35076fF0610fb65d9e18cEB8f8B358dc6", 0.001)
        }
      >
        <AppText style={styles.refreshText}>Create Transaction</AppText>
      </Pressable>
      <Pressable style={styles.refreshButton} onPress={handleSignTransaction}>
        <AppText style={styles.refreshText}>Sign Transaction</AppText>
      </Pressable>
      <Pressable
        style={styles.refreshButton}
        onPress={() =>
          sendTransaction("0x328961a35076fF0610fb65d9e18cEB8f8B358dc6", 0.001)
        }
      >
        <AppText style={styles.refreshText}>Send Transaction</AppText>
      </Pressable>
    </Screen>
  );
}

const styles = StyleSheet.create({
  screen: {
    paddingHorizontal: 0,
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
