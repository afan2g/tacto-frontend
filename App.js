// App.js
import { setupCrypto } from "./lib/setupCrypto";
setupCrypto();
import * as SystemUI from "expo-system-ui";
SystemUI.setBackgroundColorAsync("#364156");
import { GoogleSignin } from "@react-native-google-signin/google-signin";
GoogleSignin.configure({
  webClientId:
    "785186330408-e70b787gaulcvn8m1qdfqvulem1su9q2.apps.googleusercontent.com",
});
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
const queryClient = new QueryClient();
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { View, StyleSheet, ActivityIndicator } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { StatusBar } from "expo-status-bar";
import { PaperProvider } from "react-native-paper";

import AppNavigator from "./app/navigation/AppNavigator";
import navigationTheme from "./app/navigation/navigationTheme";
import useAuth from "./app/hooks/useAuth";
import { AuthProvider, FormProvider } from "./app/contexts";
import { colors } from "./app/config";
import { theme } from "./app/themes/themes";

// Create a loading component
const LoadingScreen = () => (
  <View style={styles.loadingContainer}>
    <ActivityIndicator size="large" color="#0000ff" />
  </View>
);

export default function App() {
  // Move authentication logic to App.js
  const authData = useAuth();
  const { isLoading } = authData;

  return (
    <QueryClientProvider client={queryClient}>
      <PaperProvider theme={theme}>
        <AuthProvider value={authData}>
          <NavigationContainer theme={navigationTheme}>
            <SafeAreaProvider>
              <GestureHandlerRootView style={styles.flex}>
                <BottomSheetModalProvider>
                  <StatusBar style="auto" />
                  <View style={styles.container}>
                    <FormProvider>
                      {isLoading ? <LoadingScreen /> : <AppNavigator />}
                    </FormProvider>
                  </View>
                </BottomSheetModalProvider>
              </GestureHandlerRootView>
            </SafeAreaProvider>
          </NavigationContainer>
        </AuthProvider>
      </PaperProvider>
    </QueryClientProvider>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    flex: 1,
    backgroundColor: colors.blue,
  },
});