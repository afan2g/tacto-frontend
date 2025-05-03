import React, { useCallback, useEffect, useState, useRef } from "react";
import {
  View,
  StyleSheet,
  BackHandler,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  Pressable,
  Text,
} from "react-native";
import * as SecureStore from "expo-secure-store";
import { ethers } from "ethers";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { supabase } from "../../../lib/supabase";
import { AppText, Header, Screen } from "../../components/primitives";
import MnemonicTable from "../../components/MnemonicTable";
import routes from "../../navigation/routes";
import { AppButton } from "../../components/primitives";
import { colors, fonts } from "../../config";
import { Import, Info, RefreshCcw } from "lucide-react-native";
import { Checkbox, TextInput, useTheme } from "react-native-paper";
import { useModalContext } from "../../contexts";
const WALLET_STORAGE_KEY = "TACTO_ENCRYPTED_WALLET";

function SignUpGenerateWallet({ navigation }) {
  const [wallet, setWallet] = useState(null);
  const [error, setError] = useState(null);
  const [isStoring, setIsStoring] = useState(false);
  const [checked, setChecked] = useState(false);
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState(null);
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const passwordInputRef = useRef(null);
  const theme = useTheme();
  const { presentSheet } = useModalContext();
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
    if (!navigation.canGoBack()) {
      console.log("No previous screen to go back to.");
      Alert.alert(
        "Quit Signup",
        "Are you sure you want to quit the signup process?",
        [
          { text: "OK", onPress: () => supabase.auth.signOut() },
          {
            text: "Cancel",
            onPress: () => console.log("Cancel Pressed"),
          },
        ],
        { cancelable: true }
      );
      return;
    }
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
          setError(
            "Failed to retrieve existing wallet from your device. You can recover your wallet by importing it."
          );
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

      const { data: addToWebhookData, error: addToWebhookError } =
        await supabase.functions.invoke("add-wallet-to-webhook", {
          body: { address: publicInfo.address },
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

  const handleInputChange = (text) => {
    setPassword(text);
    setPasswordError(null);
  };

  const handleInfoSheet = () => {
    presentSheet("moreDetails", { info: "This is a test", navigation });
  };

  const handleSubmitPassword = async () => {
    if (!password) {
      setPasswordError("Password is required");
      return;
    }
    if (password.length < 8) {
      setPasswordError("Password must be at least 8 characters long");
      return;
    }
    if (password.length > 32) {
      setPasswordError("Password must be at most 32 characters long");
      return;
    }
    console.log("Password submitted:", password);
  };

  const insets = useSafeAreaInsets();

  useEffect(() => {
    const keyboardWillShowListener =
      Platform.OS === "ios"
        ? Keyboard.addListener("keyboardWillShow", () => {
            setKeyboardVisible(true);
          })
        : Keyboard.addListener("keyboardDidShow", () => {
            setKeyboardVisible(true);
          });

    const keyboardWillHideListener =
      Platform.OS === "ios"
        ? Keyboard.addListener("keyboardWillHide", () => {
            setKeyboardVisible(false);
          })
        : Keyboard.addListener("keyboardDidHide", () => {
            passwordInputRef.current?.blur();
            setKeyboardVisible(false);
          });

    return () => {
      keyboardWillShowListener.remove();
      keyboardWillHideListener.remove();
    };
  }, []);

  return (
    <Pressable onPress={Keyboard.dismiss} style={{ flex: 1 }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={[styles.keyboardView, styles.screen, { paddingTop: insets.top }]}
      >
        <Header>Generate Wallet</Header>

        {!keyboardVisible && (
          <View style={styles.info}>
            <AppText style={styles.infoText}>
              Below is your wallet recovery phrase. Please write it down and
              store it in a secure place. Never share this phrase with anyone.
              We will never ask you for this phrase.
            </AppText>
          </View>
        )}
        {error && <AppText style={styles.error}>{error}</AppText>}

        {wallet && (
          <View>
            {!keyboardVisible && (
              <View
                style={{
                  flexDirection: "row",
                  gap: 10,
                  marginHorizontal: 10,
                  alignSelf: "flex-end",
                }}
              >
                <View style={styles.iconContainer}>
                  <RefreshCcw
                    size={24}
                    color={colors.black}
                    onPress={generateWallet}
                    disabled={isStoring || keyboardVisible}
                  />
                </View>
                <View style={styles.iconContainer}>
                  <Import
                    size={24}
                    color={colors.black}
                    onPress={() =>
                      navigation.navigate(routes.SIGNUPIMPORTWALLET)
                    }
                    disabled={isStoring}
                  />
                </View>
              </View>
            )}
            {/* {!keyboardVisible ? (
            <MnemonicTable mnemonic={wallet?.mnemonic?.phrase.split(" ")} />
          ) : null} */}
            <MnemonicTable mnemonic={wallet?.mnemonic?.phrase.split(" ")} />
          </View>
        )}

        <View style={[styles.buttonContainer]}>
          <View style={styles.backupWalletContainer}>
            <Pressable
              style={styles.backupWalletContainer}
              onPress={() => setChecked(!checked)}
            >
              <Checkbox
                status={checked ? "checked" : "unchecked"}
                color={colors.lightGray}
              />
              <AppText style={styles.infoText}>
                Encrypt and backup my wallet to the cloud
              </AppText>
            </Pressable>
            <Info
              size={14}
              color={colors.grayOpacity70}
              style={{ alignSelf: "flex-start", marginLeft: 3, marginTop: 5 }}
              onPress={handleInfoSheet}
            />
          </View>
          {checked && (
            <TextInput
              {...theme.formInput}
              theme={{
                colors: {
                  onSurfaceVariant: colors.softGray,
                },
              }}
              ref={passwordInputRef}
              label={<Text style={{ fontFamily: fonts.bold }}>Password</Text>}
              autoComplete="new-password"
              autoCorrect={false}
              secureTextEntry
              onChangeText={handleInputChange}
              onSubmitEditing={handleSubmitPassword}
              value={password}
            />
          )}
          <AppButton
            style={styles.button}
            title={isStoring ? "Storing..." : "Store and Continue"}
            onPress={handleSaveWallet}
            disabled={!wallet || isStoring || (checked && !password)}
            color={colors.yellow}
            loading={isStoring}
          />
        </View>
      </KeyboardAvoidingView>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  screen: {
    paddingHorizontal: 10,
    backgroundColor: colors.blue,
  },
  info: {
    marginBottom: 20,
  },
  infoText: {
    fontSize: 16,
    color: colors.gray.shade20,
    fontFamily: fonts.regular,
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
  backupWalletContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  checkbox: {
    marginRight: 10,
  },
  iconContainer: {
    height: 32,
    width: 32,
    borderRadius: 16,
    backgroundColor: colors.yellow,
    justifyContent: "center",
    alignItems: "center",
  },
  keyboardView: {
    flex: 1,
  },
});

export default SignUpGenerateWallet;
