// WalletManager.js
import { storage } from "../../lib/storage";
import * as SecureStore from "expo-secure-store";
import { ethers } from "ethers";
import React, { useState, useCallback, useEffect } from "react";
import { StyleSheet, Text, View, Pressable, Alert } from "react-native";
import * as Keychain from "react-native-keychain";
// Constants for secure storage
const WALLET_STORAGE_KEY = "ENCRYPTED_WALLET";
const WALLET_ENCRYPTION_PASSWORD = "your-secure-password"; // In production, this should be securely generated and stored

export default function CryptoHash() {
  const [wallet, setWallet] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  // NEW: Track whether or not a wallet is stored in the keychain
  const [isWalletStored, setIsWalletStored] = useState(false);

  // On mount, check if there is a wallet in the keychain already
  useEffect(() => {
    (async () => {
      try {
        const hasWallet = await SecureStore.getItemAsync("wallet");
        if (hasWallet) {
          console.log("Wallet found in storage:", hasWallet);
          setIsWalletStored(true);
        }
      } catch (e) {
        console.error("Failed to check wallet storage", e);
      }
    })();
  }, []);

  // Helper function to handle errors
  const handleError = useCallback((error, customMessage) => {
    console.error(customMessage, error);
    setError(customMessage);
    setIsLoading(false);
  }, []);

  // Create a new wallet with proper error handling
  const handleNewWalletPress = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Create wallet with entropy
      const randomBytes = ethers.randomBytes(32);
      const newWallet = ethers.Wallet.createRandom({
        extraEntropy: randomBytes,
      });

      setWallet(newWallet);

      // Reset the keychain since we've created a brand-new wallet
      //   await Keychain.resetGenericPassword();
      // Mark as not stored yet
      //   setIsWalletStored(false);

      // Confirm wallet creation
      Alert.alert(
        "Wallet Created",
        "Please backup your wallet's private key and mnemonic phrase securely.",
        [
          {
            text: "OK",
            onPress: () => {
              console.log("Private Key:", newWallet.privateKey);
              console.log("Mnemonic:", newWallet.mnemonic?.phrase);
            },
          },
        ]
      );
    } catch (err) {
      handleError(err, "Failed to create wallet");
    } finally {
      setIsLoading(false);
    }
  }, [handleError]);

  // Store wallet securely
  const handleStoreWalletPress = useCallback(async () => {
    if (!wallet) {
      handleError(new Error("No wallet to store"), "No wallet available");
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      console.log("Wallet to store:", wallet);

      //   // Encrypt the wallet
      //   const t1 = performance.now();
      //   const encryptedWallet = await wallet.encrypt(WALLET_ENCRYPTION_PASSWORD);
      //   console.log("Encryption Time:", performance.now() - t1);
      //   console.log("Encrypted Wallet:", encryptedWallet);

      //   // Store in keychain
      //   await Keychain.setGenericPassword(WALLET_STORAGE_KEY, encryptedWallet, {
      //     accessControl: Keychain.ACCESS_CONTROL.BIOMETRY_ANY,
      //     accessible: Keychain.ACCESSIBLE.WHEN_UNLOCKED,
      //     authenticationPrompt: {
      //       title: "Authenticate to access wallet",
      //     },
      //   });
      //   storage.set("wallet", JSON.stringify(wallet));
      SecureStore.setItemAsync("wallet", JSON.stringify(wallet), {
        requireAuthentication: true,
        promptMessage: "Authenticate to access wallet",
      });

      // Mark our state that a wallet is now stored
      setIsWalletStored(true);

      Alert.alert("Success", "Wallet stored securely");
    } catch (err) {
      handleError(err, "Failed to store wallet");
    } finally {
      setIsLoading(false);
    }
  }, [wallet, handleError]);

  // Retrieve wallet with biometric authentication
  const handleRetrieveWalletPress = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Check if there's an existing wallet in the keychain
      //   const hasPassword = await Keychain.hasGenericPassword();
      //   if (!hasPassword) {
      //     handleError(new Error("No stored wallet found"), "No wallet available");
      //     return;
      //   }

      //   const credentials = await Keychain.getGenericPassword();
      //   const decryptedWallet = await ethers.Wallet.fromEncryptedJson(
      //     credentials.password,
      //     WALLET_ENCRYPTION_PASSWORD
      //   );
      const decryptedWallet = await SecureStore.getItemAsync("wallet", {
        requireAuthentication: true,
      });
      console.log("Decrypted Wallet:", decryptedWallet);
      setWallet(decryptedWallet);
      Alert.alert("Success", "Wallet retrieved successfully");
    } catch (err) {
      handleError(err, "Failed to retrieve wallet");
    } finally {
      setIsLoading(false);
    }
  }, [handleError]);

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Wallet Address:</Text>
      <Text style={styles.address} numberOfLines={2} ellipsizeMode="middle">
        {wallet ? wallet.address : "No wallet loaded"}
      </Text>

      {error && <Text style={styles.error}>{error}</Text>}

      {/* Show whether or not the wallet is stored */}
      <Text style={styles.label}>
        {isWalletStored
          ? "A wallet is stored in the keychain."
          : "No wallet stored in the keychain."}
      </Text>
      <View style={styles.buttonContainer}>
        <Pressable
          onPress={handleNewWalletPress}
          style={[styles.button, isLoading && styles.buttonDisabled]}
          disabled={isLoading}
        >
          <Text style={styles.buttonText}>
            {isLoading ? "Creating..." : "New Wallet"}
          </Text>
        </Pressable>

        <Pressable
          onPress={handleStoreWalletPress}
          style={[
            styles.button,
            (!wallet || isLoading) && styles.buttonDisabled,
          ]}
          disabled={!wallet || isLoading}
        >
          <Text style={styles.buttonText}>
            {isLoading ? "Storing..." : "Store Wallet"}
          </Text>
        </Pressable>

        <Pressable
          onPress={handleRetrieveWalletPress}
          style={[
            styles.button,
            (!isWalletStored || isLoading) && styles.buttonDisabled,
          ]}
          disabled={!isWalletStored || isLoading}
        >
          <Text style={styles.buttonText}>
            {isLoading ? "Retrieving..." : "Retrieve Wallet"}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 10,
    fontWeight: "600",
  },
  address: {
    fontSize: 14,
    textAlign: "center",
    marginBottom: 20,
    paddingHorizontal: 20,
    maxWidth: "100%",
  },
  buttonContainer: {
    width: "100%",
    maxWidth: 300,
  },
  button: {
    marginTop: 20,
    padding: 15,
    backgroundColor: "#4A90E2",
    borderRadius: 8,
    alignItems: "center",
  },
  buttonDisabled: {
    backgroundColor: "#A0A0A0",
    opacity: 0.7,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  error: {
    color: "red",
    marginTop: 10,
    textAlign: "center",
    marginBottom: 10,
  },
});
