import { setupCrypto } from "./lib/setupCrypto";
setupCrypto();

import { GoogleSignin } from "@react-native-google-signin/google-signin";
GoogleSignin.configure({
  webClientId:
    "785186330408-e70b787gaulcvn8m1qdfqvulem1su9q2.apps.googleusercontent.com",
});
import { NavigationContainer } from "@react-navigation/native";
import { View, StyleSheet, ActivityIndicator } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { StatusBar } from "expo-status-bar";

import AppNavigator from "./app/navigation/AppNavigator";
import navigationTheme from "./app/navigation/navigationTheme";
import useAuth from "./app/hooks/useAuth";
import { FormProvider } from "./app/contexts/FormContext";
import { AuthProvider } from "./app/contexts/AuthContext";
import { DataProvider } from "./app/contexts/DataContext";
import { colors } from "./app/config";
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
    <AuthProvider>
      <NavigationContainer theme={navigationTheme}>
        <SafeAreaProvider>
          <GestureHandlerRootView style={styles.flex}>
            <StatusBar style="auto" />
            <View style={styles.container}>
              {session ? (
                <DataProvider>
                  <FormProvider>
                    <AppNavigator session={session} needsWallet={needsWallet} />
                  </FormProvider>
                </DataProvider>
              ) : (
                <FormProvider>
                  <AppNavigator session={session} needsWallet={needsWallet} />
                </FormProvider>
              )}
            </View>
          </GestureHandlerRootView>
        </SafeAreaProvider>
      </NavigationContainer>
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: colors.blue,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
  },
});
