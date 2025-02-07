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
