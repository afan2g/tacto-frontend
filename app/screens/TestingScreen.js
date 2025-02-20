import React, { useEffect } from "react";
import { View, StyleSheet } from "react-native";
import { Button, Text } from "react-native-paper";
import { AppText, Screen } from "../components/primitives";
import { Pressable } from "react-native";
import { storage } from "../../lib/storage";
import * as SecureStore from "expo-secure-store";
import { Wallet, utils, EIP712Signer, Provider, types } from "zksync-ethers";
import { ethers } from "ethers";
import { useData } from "../contexts";
import { colors, fonts } from "../config";
import { supabase } from "../../lib/supabase";
import routes from "../navigation/routes";
import { util } from "zod";

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
    const { data, error } = await supabase.functions.invoke("alchemy-test", {});
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

  const handleSend = async () => {
    try {
      // Get the wallet from secure storage
      const secureWallet = await SecureStore.getItemAsync("ENCRYPTED_WALLET");
      const walletData = JSON.parse(secureWallet);

      const wallet = Wallet.fromMnemonic(walletData.phrase);
      // Create the transaction
      const transaction = await populateUSDCTransferZK(
        0.0001,
        "0x328961a35076fF0610fb65d9e18cEB8f8B358dc6"
      );

      if (!transaction) {
        throw new Error("Failed to create transaction");
      }
      console.log("Transaction to sign:", transaction);
      const signer = new EIP712Signer(wallet, transaction.chainId);
      transaction.customData.customSignature = await signer.sign(transaction);

      const signedTx = utils.serializeEip712(transaction);
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

  const handleLocalProvider = async () => {
    const secureWallet = await SecureStore.getItemAsync("ENCRYPTED_WALLET");
    const walletData = JSON.parse(secureWallet);
    console.log("wallet: ", walletData);
    const privateKey = ethers.HDNodeWallet.fromPhrase(
      walletData.phrase
    ).privateKey;
    const zkProvider = Provider.getDefaultProvider(types.Network.Sepolia);
    console.log("private key: ", privateKey);
    console.log("provider: ", zkProvider);

    const usdcContractAddress = "0xAe045DE5638162fa134807Cb558E15A3F5A7F853";

    const signer = new Wallet(privateKey, zkProvider);
    console.log("signer: ", signer);
    const tx = signer.transfer({
      to: "0x328961a35076fF0610fb65d9e18cEB8f8B358dc6", // recipient address
      amount: ethers.parseUnits("0.0001", 6), // amount in USDC
      token: usdcContractAddress, // USDC token address
    });
    console.log("tx: ", tx);
    const receipt = await tx.wait();
    console.log("receipt: ", receipt);
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
      <Button onPress={populateUSDCTransferZK}>
        Create USDC Transaction on ZK Sync
      </Button>
      <Button onPress={handleSend}>Send ZK Sync USDC Transaction</Button>
      <Button onPress={handleSignTransaction}>Sign Transaction</Button>
      <Button onPress={handleSendTransaction}>Send Transaction</Button>
      <Button onPress={handleLogWebhooks}>Log Webhooks</Button>
      <Button onPress={() => navigation.navigate(routes.TESTNOTIFICATIONS)}>
        Test Notifications
      </Button>
      <Button onPress={handleLocalProvider}>Local Provider Test</Button>
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
