import { setupCrypto } from "./lib/setupCrypto";
setupCrypto();

import { useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { View, StyleSheet, ActivityIndicator } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { StatusBar } from "expo-status-bar";

import AppNavigator from "./app/navigation/AppNavigator";
import WalletNavigator from "./app/navigation/entry/WalletNavigator";
import navigationTheme from "./app/navigation/navigationTheme";
import useAuth from "./app/hooks/useAuth";

export default function App() {
  const { session, isLoading, needsWallet } = useAuth();

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <NavigationContainer theme={navigationTheme}>
      <SafeAreaProvider>
        <GestureHandlerRootView style={styles.flex}>
          <StatusBar style="auto" />
          <View style={styles.container}>
            {needsWallet ? (
              <WalletNavigator />
            ) : (
              <AppNavigator session={session} />
            )}
          </View>
        </GestureHandlerRootView>
      </SafeAreaProvider>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
  },
});
