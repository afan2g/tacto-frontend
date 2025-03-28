import React, { useCallback, useEffect, useState } from "react";
import { View, StyleSheet, BackHandler } from "react-native";
import * as SecureStore from "expo-secure-store";
import { ethers } from "ethers";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { supabase } from "../../../lib/supabase";
import { AppText, Header, Screen } from "../../components/primitives";
import MnemonicTable from "../../components/MnemonicTable";
import routes from "../../navigation/routes";
import { AppButton } from "../../components/primitives";
import { colors } from "../../config";
const WALLET_STORAGE_KEY = "TACTO_ENCRYPTED_WALLET";

function SignUpGenerateWallet({ navigation }) {
  const [wallet, setWallet] = useState(null);
  const [error, setError] = useState(null);
  const [isStoring, setIsStoring] = useState(false);

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      () => {
        handleBack();
        return true;
      }
    );

    return () => backHandler.remove();
  }, [navigation]);

  const handleBack = () => {
    navigation.goBack();
  };

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
      console.log("Starting wallet check");
      const {
        data: { session },
      } = await supabase.auth.getSession();
      console.log("Session in wallet check:", session?.user?.id);

      if (!session?.user) return;

      // Check if user has any wallets
      const { data: existingWallets, error: walletError } = await supabase
        .from("wallets")
        .select("*")
        .eq("owner_id", session.user.id)
        .maybeSingle();

      console.log("Wallet check in db:", { existingWallets, walletError });

      if (walletError && walletError.code !== "PGRST116") {
        throw walletError;
      }

      if (existingWallets && existingWallets.length > 0) {
        navigation.replace(routes.SIGNUPCOMPLETE);

        // Create user-specific storage key
        const userWalletKey = `${WALLET_STORAGE_KEY}_${session.user.id}`;

        // Try to retrieve the wallet with the user-specific key
        const storedWallet = await SecureStore.getItemAsync(userWalletKey);

        if (storedWallet) {
          console.log("Found existing wallet in secure storage");
          navigation.replace(routes.SIGNUPCOMPLETE);
        } else {
          console.log("No wallet in secure storage");
          setError("Failed to retrieve existing wallet from your device. You can recover your wallet by importing it.");
          return;
        }
        return;
      }
      console.log("No existing wallet found. Generating new wallet.");
      generateWallet();
    } catch (error) {
      console.error("Error checking existing wallet:", error);
      setError("Failed to check existing wallet");
    }
  };
  const generateWallet = useCallback(() => {
    try {
      const randomBytes = ethers.randomBytes(32); // generate random bytes
      const newWallet = ethers.Wallet.createRandom({
        // create a new wallet. This creates a
        extraEntropy: randomBytes,
      });
      setWallet(newWallet);
      const neuteredWallet = newWallet.neuter();
      console.log("neuteredWallet", neuteredWallet);
      setError(null);
    } catch (error) {
      setError("Failed to generate wallet");
      console.error("Wallet generation error:", error);
    }
  }, []);

  const handleSaveWallet = async () => {
    setIsStoring(true);
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session?.user) {
        throw new Error("Authentication required");
      }

      const userWalletKey = `${WALLET_STORAGE_KEY}_${session.user.id}`;

      // Save encrypted wallet to secure storage
      try {
        // Attempt to save to secure storage
        await SecureStore.setItemAsync(
          userWalletKey,
          JSON.stringify({
            phrase: wallet.mnemonic.phrase,
            path: wallet.path || "m/44'/60'/0'/0/0",
          }),
          {
            requireAuthentication: true,
          }
        );
      } catch (secureStoreError) {
        // Check for authentication cancellation
        if (
          secureStoreError.message.includes(
            "Could not Authenticate the user: User canceled"
          )
        ) {
          throw new Error("Authentication was cancelled. Please try again.");
        }
        if (secureStoreError.message.includes("Could not Authenticate")) {
          throw new Error("Authentication failed. Please try again.");
        }
        // For any other secure storage errors
        throw new Error("Failed to securely store wallet. Please try again.");
      }

      console.log("Wallet saved to secure storage");
      // Get neutered wallet info
      const uncompressedPublicKey = wallet.publicKey;
      const neuteredWallet = wallet.neuter();
      // Save public wallet info
      const publicInfo = {
        owner_id: session.user.id,
        name: "Primary Wallet", // Default name for first wallet
        address: ethers.getAddress(neuteredWallet.address),
        public_key: uncompressedPublicKey,
        parent_fingerprint: neuteredWallet.parentFingerprint,
        chain_code: neuteredWallet.chainCode,
        path: neuteredWallet.path || "m/44'/60'/0'/0/0",
        index: neuteredWallet.index,
        depth: neuteredWallet.depth,
        is_primary: true, // First wallet is primary
      };

      const { error: walletError } = await supabase
        .from("wallets")
        .insert(publicInfo)
        .select()
        .single();

      if (walletError) throw walletError;

      const { data: addToWebhookData, error: addToWebhookError } = await supabase.functions.invoke("add-wallet-to-webhook", {
        body: { address: publicInfo.address }
      });

      if (addToWebhookError) throw addToWebhookError;
      clearMemory();
      navigation.navigate(routes.SIGNUPCOMPLETE);
    } catch (error) {
      setError(error.message);
      console.error("Failed to save wallet:", error);
    } finally {
      setIsStoring(false);
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
        <AppButton
          style={styles.button}
          title="Import Wallet"
          onPress={() => navigation.navigate(routes.SIGNUPIMPORTWALLET)}
          disabled={isStoring}
          color={colors.yellow}
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

export default SignUpGenerateWallet;
