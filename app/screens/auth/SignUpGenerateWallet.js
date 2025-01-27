import React, { useCallback, useEffect, useState } from "react";
import { View, StyleSheet, Button } from "react-native";
import * as SecureStore from "expo-secure-store";
import { ethers } from "ethers";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { supabase } from "../../../lib/supabase";
import { AppText, Header, Screen } from "../../components/primitives";
import MnemonicTable from "../../components/MnemonicTable";
import routes from "../../navigation/routes";
const WALLET_STORAGE_KEY = "ENCRYPTED_WALLET";

function SignUpGenerateWallet({ navigation }) {
  const [wallet, setWallet] = useState(null);
  const [error, setError] = useState(null);

  const clearMemory = useCallback(() => {
    setWallet(null);
    if (global.gc) {
      global.gc();
    }
  }, []);

  // Add check for existing wallet on component mount
  useEffect(() => {
    checkExistingWallet();
  }, []);

  const checkExistingWallet = async () => {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session?.user) return;

      // Check if wallet exists in database
      const { data: existingWallet, error: walletError } = await supabase
        .from("wallets")
        .select("*")
        .eq("id", session.user.id)
        .single();

      if (walletError && walletError.code !== "PGRST116") {
        // PGRST116 is "not found" error
        throw walletError;
      }

      if (existingWallet) {
        // If wallet exists, navigate directly to completion
        navigation.replace(routes.SIGNUPCOMPLETE);
        return;
      }

      // If no wallet exists, generate a new one
      generateWallet();
    } catch (error) {
      console.error("Error checking existing wallet:", error);
      setError("Failed to check existing wallet");
    }
  };

  const generateWallet = useCallback(() => {
    try {
      const randomBytes = ethers.randomBytes(32);
      const newWallet = ethers.Wallet.createRandom({
        extraEntropy: randomBytes,
      });
      setWallet(newWallet);
      setError(null);
    } catch (error) {
      setError("Failed to generate wallet");
      console.error("Wallet generation error:", error);
    }
  }, []);

  const handleSaveWallet = async () => {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session?.user) {
        throw new Error("Authentication required");
      }

      // Check again if wallet exists right before saving
      const { data: existingWallet, error: checkError } = await supabase
        .from("wallets")
        .select("*")
        .eq("id", session.user.id)
        .single();

      if (existingWallet) {
        // If wallet exists, just navigate to completion
        navigation.navigate(routes.SIGNUPCOMPLETE);
        return;
      }

      // Save encrypted wallet to secure storage
      await SecureStore.setItemAsync(
        WALLET_STORAGE_KEY,
        JSON.stringify({
          phrase: wallet.mnemonic.phrase,
          path: wallet.path || "m/44'/60'/0'/0/0",
        }),
        {
          requireAuthentication: true,
        }
      );

      // Save public wallet info
      const publicInfo = {
        id: session.user.id,
        path: wallet.path || "m/44'/60'/0'/0/0",
        address: ethers.getAddress(wallet.address),
        public_key: wallet.publicKey,
        index: 0,
      };

      const { error: walletError } = await supabase
        .from("wallets")
        .insert(publicInfo)
        .select()
        .single();

      if (walletError) throw walletError;

      clearMemory();
      navigation.navigate(routes.SIGNUPCOMPLETE);
    } catch (error) {
      setError(error.message);
      console.error("Failed to save wallet:", error);
    }
  };

  const handleRetrieveWallet = async () => {
    try {
      const storedWallet = await SecureStore.getItemAsync(WALLET_STORAGE_KEY, {
        requireAuthentication: true,
      });

      if (!storedWallet) {
        throw new Error("No wallet found in secure storage");
      }

      const { phrase, path } = JSON.parse(storedWallet);

      // Use ethers.HDNodeWallet for v6
      const recoveredWallet = ethers.HDNodeWallet.fromPhrase(
        phrase,
        undefined,
        path
      );
      setWallet(recoveredWallet);
      setError(null);
    } catch (error) {
      setError("Failed to retrieve wallet");
      console.error("Wallet retrieval error:", error);
    }
  };

  const insets = useSafeAreaInsets();

  return (
    <Screen style={[styles.screen, { paddingTop: insets.top }]}>
      <Header>Generate Wallet</Header>

      <View style={styles.info}>
        <AppText style={styles.infoText}>
          Below is your wallet recovery phrase. Please write it down and store
          it in a secure place. Never share this phrase with anyone. We will
          never ask you for this phrase.
        </AppText>
      </View>

      {error && <AppText style={styles.error}>{error}</AppText>}

      {wallet && (
        <MnemonicTable mnemonic={wallet?.mnemonic?.phrase.split(" ")} />
      )}

      <View style={styles.buttonContainer}>
        <Button
          title="Generate New Wallet"
          onPress={generateWallet}
          style={styles.button}
        />
        <Button
          title="Save and Continue"
          onPress={handleSaveWallet}
          disabled={!wallet}
        />
        <Button title="Retrieve Wallet" onPress={handleRetrieveWallet} />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  screen: {
    paddingHorizontal: 20,
  },
  info: {
    marginBottom: 20,
  },
  infoText: {
    fontSize: 16,
  },
  error: {
    color: "red",
    marginBottom: 10,
  },
  buttonContainer: {
    gap: 10,
    marginTop: 20,
  },
  button: {
    marginTop: 20,
  },
});

export default SignUpGenerateWallet;
