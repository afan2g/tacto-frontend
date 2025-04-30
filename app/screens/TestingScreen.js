import React from "react";
import { View, StyleSheet } from "react-native";
import { Button, Text, TextInput } from "react-native-paper";
import { Screen } from "../components/primitives";
import * as SecureStore from "expo-secure-store";
import { ethers, randomBytes } from "ethers";
import { useData } from "../contexts";
import { colors, fonts } from "../config";
import { supabase } from "../../lib/supabase";
import { useAuthContext } from "../contexts/AuthContext";
import argon2 from "react-native-argon2";
import AesGcmCrypto from "react-native-aes-gcm-crypto";
import { ArrowRightCircle } from "lucide-react-native";
const WALLET_STORAGE_KEY = "TACTO_ENCRYPTED_WALLET";

function TestingScreen({ navigation }) {
  const { profile, wallet, completedTransactions } = useData();
  const { session } = useAuthContext();
  const [loading, setLoading] = React.useState(false);
  const [recoveryPassword, setRecoveryPassword] = React.useState("");
  const [walletBackup, setWalletBackup] = React.useState(null);
  const [error, setError] = React.useState(null);
  const [decryptedData, setDecryptedData] = React.useState(null);
  const handleViewStorage = () => {
    console.log("Storage pressed!");
    console.log("storage profile: ", profile);
    console.log("storage wallet: ", wallet);
    console.log("storage completedTransactions: ", completedTransactions);
  };

  const handleEncryptWallet = async (password) => {
    console.log("deriving key...");
    const salt = Buffer.from(randomBytes(32)).toString("base64");
    console.log("saltbytes:", salt);

    const kdfoptions = {
      hashLength: 32,
      memory: 128 * 1024,
      parallelism: 4,
      mode: "argon2id",
      iterations: 5,
    };
    const result = await generateKey("password", salt, kdfoptions);
    const { rawHash, encodedHash } = result;
    console.log("rawHash:", rawHash);
    console.log("encodeHash:", encodedHash);
    console.log("encrypting wallet...");
    const walletString = await SecureStore.getItemAsync(
      `${WALLET_STORAGE_KEY}_${profile.id}`
    );
    if (!walletString) throw new Error("No wallet found");

    const { iv, tag, encryptedData } = await encryptData(walletString, rawHash);
    console.log("iv:", iv);
    console.log("tag:", tag);
    console.log("encryptedData:", encryptedData);

    const encryptedWalletJson = JSON.stringify({
      address: wallet.address,
      id: ethers.id(ethers.hexlify(randomBytes(16))),
      version: 3,
      Crypto: {
        cipher: "aes-256-gcm",
        cipherparams: {
          iv: iv,
        },
        mac: tag,
        ciphertext: encryptedData,
        kdf: "argon2id",
        kdfparams: {
          salt: salt,
          ...kdfoptions,
        },
      },
    });
    console.log("encryptedWalletJson:", encryptedWalletJson);
    return encryptedWalletJson;
  };

  const encryptData = async (data, key) => {
    try {
      const base64Key = Buffer.from(key, "hex").toString("base64");
      console.log("base64Key:", base64Key);
      const { iv, tag, content } = await AesGcmCrypto.encrypt(
        data,
        false,
        base64Key
      );
      return { iv, tag, encryptedData: content };
    } catch (error) {
      console.error("Error encrypting data:", error);
      throw error;
    }
  };

  const generateKey = async (password, salt, options = {}) => {
    const {
      hashLength = 32,
      memory = 128 * 1024,
      parallelism = 4,
      mode = "argon2id",
      iterations = 5,
    } = options;
    console.log("generating key...");
    try {
      const key = await argon2(password, salt, {
        hashLength,
        memory,
        parallelism,
        mode,
        iterations,
      });
      return key;
    } catch (error) {
      console.error("Error generating key:", error);
      throw error;
    }
  };

  const handleDecryptWallet = async (password) => {
    console.log("Decrypting wallet with password:", password);

    const { Crypto } = walletBackup;
    const { ciphertext, kdf, kdfparams, cipher } = Crypto;
    const { salt } = kdfparams;
    const iv = Crypto.cipherparams.iv;
    const tag = Crypto.mac;

    console.log("ciphertext:", ciphertext);
    console.log("kdf:", kdf);
    console.log("kdfparams:", kdfparams);
    console.log("salt:", salt);
    console.log("iv:", iv);
    console.log("cipher:", cipher);
    console.log("tag:", tag);
    try {
      const { rawHash, encodedHash } = await generateKey(
        password,
        salt,
        kdfparams
      );
      console.log("rawHash:", rawHash);
      const base64Key = Buffer.from(rawHash, "hex").toString("base64");
      console.log("base64Key:", base64Key);
      const decryptedData = await AesGcmCrypto.decrypt(
        ciphertext,
        base64Key,
        iv,
        tag,
        false
      );
      console.log("decryptedData:", decryptedData);
      const parsedDecryptedData = JSON.parse(decryptedData);
      console.log("Parsed decrypted data:", parsedDecryptedData);
      setDecryptedData(parsedDecryptedData);
    } catch (error) {
      console.error("Error decrypting wallet:", error);
    }
  };

  const handleBackupWalletRemote = async () => {
    console.log("Backing up wallet remotely...");
    const encryptedWallet = await handleEncryptWallet("password");

    console.log("Encrypted wallet:", encryptedWallet);
    const { data, error } = await supabase.from("wallet_backups").upsert(
      {
        owner_id: session.user.id,
        wallet_id: wallet.id,
        keystore_json: encryptedWallet,
        updated_at: new Date().toISOString(),
      },
      {
        onConflict: "wallet_id",
      }
    );

    if (error) {
      console.error("Error backing up wallet:", error);
    } else {
      console.log("Backup successful:", data);
    }
  };

  const handleRetrieveWalletBackup = async () => {
    console.log("Retrieving wallet backup...");
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("wallet_backups")
        .select("*")
        .eq("owner_id", session.user.id)
        .eq("wallet_id", wallet.id)
        .single();

      if (error) {
        throw error;
      } else {
        console.log("Retrieved wallet backup:", data);
        const { keystore_json } = data;
        const parsedWalletData = JSON.parse(keystore_json);
        console.log("Parsed wallet data:", parsedWalletData);
        setWalletBackup(parsedWalletData);
      }
    } catch (error) {
      console.error("Error retrieving wallet backup:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Screen style={styles.screen}>
      <Text>Testing Screen</Text>
      <Button onPress={() => navigation.goBack()}>Go back</Button>
      <Button onPress={handleViewStorage}>View Storage</Button>
      <Button onPress={handleEncryptWallet}>Encrypt Wallet</Button>
      <Button onPress={handleBackupWalletRemote}>Backup Wallet</Button>
      <Button onPress={handleDecryptWallet}>Decrypt Wallet</Button>
      <Button onPress={handleRetrieveWalletBackup}>
        Retrieve Wallet Backup
      </Button>

      {walletBackup && (
        <View style={{ flex: 1 }}>
          <Text
            style={{
              fontSize: 16,
              fontFamily: fonts.medium,
              color: colors.lightGray,
            }}
          >
            Wallet Backup: {walletBackup.address}
          </Text>
          <View style={styles.backupDecryptContainer}>
            <TextInput
              label="Recovery Password"
              value={recoveryPassword}
              onChangeText={setRecoveryPassword}
              secureTextEntry
              style={styles.backupDecryptInput}
            />
            <View style={styles.backupDecryptButton}>
              <ArrowRightCircle
                size={44}
                color={colors.lightGray}
                onPress={() => handleDecryptWallet(recoveryPassword)}
              />
            </View>
          </View>
          {decryptedData && (
            <Text
              style={styles.backupDecryptText}
            >{`Decrypted Data: ${decryptedData.phrase}`}</Text>
          )}
        </View>
      )}
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
  progressBarContainer: {
    width: "100%",
    paddingHorizontal: 20,
    marginTop: 10,
  },
  progressBar: {
    height: 10,
    borderRadius: 5,
  },
  backupDecryptContainer: {
    width: "100%",
    paddingHorizontal: 10,
    marginTop: 10,
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
  },
  backupDecryptText: {
    fontSize: 16,
    fontFamily: fonts.medium,
    color: colors.lightGray,
  },
  backupDecryptInput: {
    marginTop: 10,
    width: "90%",
  },
  backupDecryptButton: {
    marginTop: 10,
    backgroundColor: colors.primary,
  },
});

export default TestingScreen;
