import React, { useCallback, useEffect, useState } from "react";
import { View, StyleSheet, Button } from "react-native";
import * as SecureStore from "expo-secure-store";
import { ethers } from "ethers";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { supabase } from "../../../lib/supabase";
import { AppText, Header, Screen } from "../../components/primitives";
import MnemonicTable from "../../components/MnemonicTable";

const WALLET_STORAGE_KEY = "ENCRYPTED_WALLET";

function SignUpGenerateWallet(props) {
  const [wallet, setWallet] = useState(null);
  const [error, setError] = useState(null);

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

  useEffect(() => {
    generateWallet();
  }, [generateWallet]);

  const clearMemory = useCallback(() => {
    setWallet(null);
    if (global.gc) {
      global.gc();
    }
  }, []);

  const handleSaveWallet = async () => {
    try {
      // 1. Get user session
      // const {
      //   data: { session },
      //   error: authError,
      // } = await supabase.auth.getSession();
      // if (authError || !session?.user) {
      //   throw new Error("Authentication required");
      // }

      // 2. Save encrypted wallet to secure storage
      await SecureStore.setItemAsync(
        WALLET_STORAGE_KEY,
        JSON.stringify({
          phrase: wallet.mnemonic.phrase, // Store just the phrase
          path: wallet.path || "m/44'/60'/0'/0/0", // Include default path if not present
        }),
        {
          requireAuthentication: true,
        }
      );

      // 3. Prepare public info
      // const publicInfo = {
      //   user_id: session.user.id,
      //   path: wallet.path,
      //   address: ethers.utils.getAddress(wallet.address), // ensure checksum
      //   public_key: wallet.publicKey,
      //   index: 0, // first wallet
      //   is_active: true,
      // };

      // 4. Save public info to database
      // const { error: storeError } = await supabase
      //   .from("wallets")
      //   .insert(publicInfo)
      //   .select()
      //   .single();

      // if (storeError) {
      //   throw storeError;
      // }

      // 5. Clear sensitive data
      clearMemory();

      // 6. Navigate or callback
      // navigation.navigate(routes.SIGNUPCOMPLETE);
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
