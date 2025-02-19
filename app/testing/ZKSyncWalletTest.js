import React, { useCallback, useEffect, useState } from "react";
import { View, StyleSheet, Button, BackHandler } from "react-native";
import * as SecureStore from "expo-secure-store";
import { ethers, id } from "ethers";
import { Wallet } from "zksync-ethers";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useFormData } from "../../contexts/FormContext";
import { supabase } from "../../../lib/supabase";
import { AppText, Header, Screen } from "../../components/primitives";
import MnemonicTable from "../../components/MnemonicTable";
import routes from "../../navigation/routes";
import { AppButton } from "../../components/primitives";
import { colors } from "../../config";
const WALLET_STORAGE_KEY = "ENCRYPTED_WALLET_ZK";

function ZKSyncWalletTest({ navigation }) {
  const [wallet, setWallet] = useState(null);
  const [error, setError] = useState(null);

  const generateWallet = useCallback(() => {
    try {
      const randomBytes = ethers.randomBytes(32); // generate random bytes
      const newWallet = Wallet.createRandom({ extraEntropy: randomBytes });
      setWallet(newWallet);
      console.log("newWallet", newWallet);
      const neuteredWallet = newWallet.neuter();
      console.log("neuteredWallet", neuteredWallet);
      setError(null);
    } catch (error) {
      setError("Failed to generate wallet");
      console.error("Wallet generation error:", error);
    }
  }, []);

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
        <AppButton
          style={styles.button}
          title="Generate New Wallet"
          onPress={generateWallet}
          disabled={isStoring}
          color={colors.lightGray}
        />
        <AppButton
          style={styles.button}
          title={isStoring ? "Storing..." : "Store and Continue"}
          onPress={handleSaveWallet}
          disabled={!wallet || isStoring}
          color={colors.yellow}
          loading={isStoring}
        />
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
  button: {},
});

export default ZKSyncWalletTest;
