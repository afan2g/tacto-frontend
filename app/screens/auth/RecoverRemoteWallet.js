import React, { useState, useEffect } from "react";
import { View, StyleSheet, Text, BackHandler, Alert } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { colors, fonts } from "../../config";
import { AppButton, AppText, Header } from "../../components/primitives";
import { useAuthContext } from "../../contexts";
import { TextInput, useTheme } from "react-native-paper";
import { decryptKeystoreJson } from "../../utils/CryptographicFunctions";
import { ethers } from "ethers";
import * as SecureStore from "expo-secure-store";
import { set } from "zod";
import { supabase } from "../../../lib/supabase";
import routes from "../../navigation/routes";
const WALLET_STORAGE_KEY = "TACTO_ENCRYPTED_WALLET";

function RecoverRemoteWallet({ navigation }) {
  const insets = useSafeAreaInsets();
  const { remoteBackup, session, setSecureWalletState } = useAuthContext();
  const [backupPassword, setBackupPassword] = useState("");
  const [error, setError] = useState(null);
  const [isDecrypting, setIsDecrypting] = useState(false);
  const [decryptedPhrase, setDecryptedPhrase] = useState("");
  const [isStoring, setIsStoring] = useState(false);
  const theme = useTheme();

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
        "Quit Recovery",
        "Are you sure you want to quit?",
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

  const handlePasswordChange = (value) => {
    setBackupPassword(value);
  };

  const handleDecrypt = async () => {
    setIsDecrypting(true);
    setIsStoring(false);
    setError(null);
    try {
      console.log("Decrypting backup with password:", backupPassword);
      const decryptedData = await decryptKeystoreJson(
        backupPassword,
        remoteBackup
      );
      console.log("Decrypted data:", decryptedData);
      setDecryptedPhrase(decryptedData.phrase);

      const secretWallet = ethers.HDNodeWallet.fromPhrase(decryptedData.phrase);

      console.log("Secret wallet:", secretWallet);

      setIsStoring(true);
      await SecureStore.setItemAsync(
        `${WALLET_STORAGE_KEY}_${session.user.id}`,
        JSON.stringify({
          phrase: decryptedData.phrase,
          path: secretWallet.path,
          address: secretWallet.address,
        }),
        {
          requireAuthentication: true,
        }
      );
      console.log("Wallet stored successfully!");
      setIsStoring(false);
      setSecureWalletState("present");
    } catch (err) {
      console.error("Decryption error:", err.message);
      setError("Invalid password. Please try again.");
    } finally {
      setIsDecrypting(false);
    }
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <Header>Recover From Backup</Header>
      <View style={styles.info}>
        <AppText style={styles.infoText}>
          We found an encrypted backup of your wallet. You can recover it by
          typing in your wallet recovery password. If you don't remember your
          password, you can also recover your wallet using your 12-word recovery
          phrase.
        </AppText>
        <AppText style={styles.walletInfoText}>
          Wallet address: {remoteBackup.address}
        </AppText>
        <AppText style={styles.walletInfoText}>
          Encrypted cipher: {remoteBackup.Crypto.ciphertext}
        </AppText>
        <View style={styles.inputContainer}>
          <TextInput
            {...theme.formInput}
            theme={{
              colors: {
                onSurfaceVariant: colors.softGray,
              },
            }}
            style={[theme.formInput.style, { marginBottom: 5 }]}
            label={<Text style={{ fontFamily: fonts.bold }}>Password</Text>}
            autoCapitalize="none"
            autoCorrect={false}
            name="password"
            onChangeText={handlePasswordChange}
            value={backupPassword}
          />
          {error && <AppText style={{ color: colors.red }}>{error}</AppText>}
          <AppButton
            color={colors.yellow}
            title="Recover"
            onPress={handleDecrypt}
            loading={isDecrypting || isStoring}
            disabled={isDecrypting || isStoring || !backupPassword}
          />
          <AppButton
            color={colors.yellow}
            title="Restore from phrase"
            onPress={() => navigation.navigate(routes.SIGNUPIMPORTWALLET)}
          />
          <AppButton
            color={colors.yellow}
            title="Create new wallet"
            onPress={() => navigation.navigate(routes.SIGNUPGENERATEWALLET)}
          />
        </View>
        <AppText style={styles.infoText}>
          Wallet phrase: {decryptedPhrase}
        </AppText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.blue,
    paddingHorizontal: 10,
  },
  info: {
    marginBottom: 20,
  },
  infoText: {
    fontSize: 16,
  },
  walletInfoText: {
    fontSize: 16,
    marginBottom: 10,
  },
  inputContainer: {
    marginBottom: 20,
  },
});

export default RecoverRemoteWallet;
