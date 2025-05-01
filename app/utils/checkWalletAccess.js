import * as SecureStore from "expo-secure-store";
import { useNavigation } from "@react-navigation/native";
const WALLET_STORAGE_KEY = "TACTO_ENCRYPTED_WALLET"; // Make sure this matches your existing key

export const checkWalletAccess = async (userId) => {
  console.log("Checking wallet access for user:", userId);
  try {
    const walletData = await SecureStore.getItemAsync(
      `${WALLET_STORAGE_KEY}_${userId}`
    );
    console.log("secure store data:", walletData);
    return {
      hasWallet: !!walletData,
      error: null,
    };
  } catch (error) {
    console.error("Error checking wallet access:", error.message);
    return {
      hasWallet: false,
      error: error.message,
    };
  }
};
