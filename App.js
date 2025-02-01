import { setupCrypto } from "./lib/setupCrypto";
setupCrypto();

import React from "react";

import { GoogleSignin } from "@react-native-google-signin/google-signin";
GoogleSignin.configure({
  webClientId:
    "785186330408-e70b787gaulcvn8m1qdfqvulem1su9q2.apps.googleusercontent.com",
});
import { NavigationContainer } from "@react-navigation/native";
import { View, StyleSheet, ActivityIndicator, Keyboard } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { StatusBar } from "expo-status-bar";
import * as SystemUI from "expo-system-ui";
SystemUI.setBackgroundColorAsync("#364156");

import AppNavigator from "./app/navigation/AppNavigator";
import navigationTheme from "./app/navigation/navigationTheme";
import useAuth from "./app/hooks/useAuth";
import { FormProvider } from "./app/contexts/FormContext";
import { AuthProvider } from "./app/contexts/AuthContext";
import { DataProvider } from "./app/contexts/DataContext";
import { colors } from "./app/config";
import SignUpScreen from "./app/screens/auth/SignUpScreen";

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
            <BottomSheetModalProvider>
              <StatusBar style="auto" />
              <View style={styles.container}>
                {session ? (
                  <DataProvider>
                    <FormProvider>
                      <AppNavigator
                        session={session}
                        needsWallet={needsWallet}
                      />
                    </FormProvider>
                  </DataProvider>
                ) : (
                  <FormProvider>
                    <AppNavigator session={session} needsWallet={needsWallet} />
                  </FormProvider>
                )}
              </View>
            </BottomSheetModalProvider>
          </GestureHandlerRootView>
        </SafeAreaProvider>
      </NavigationContainer>
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.blue,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F1F5F9",
  },
  pickerButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    paddingLeft: 10,
    paddingRight: 5,
    borderRightWidth: 1,
  },
  flag: {
    fontSize: 24,
  },
  dialCode: {
    fontSize: 16,
    color: "#64748B",
    marginLeft: 8,
  },
  chevronDown: {
    marginLeft: 5,
  },
  phoneInput: {
    flex: 1,
    height: 50,
    fontSize: 16,
    paddingHorizontal: 10,
  },
});

// const { session, isLoading, needsWallet } = useAuth();
// if (isLoading) {
//   return (
//     <View style={styles.loadingContainer}>
//       <ActivityIndicator size="large" color="#0000ff" />
//     </View>
//   );
// }

// return (
// <AuthProvider>
//   <NavigationContainer theme={navigationTheme}>
//     <SafeAreaProvider>
//       <GestureHandlerRootView style={styles.flex}>
//         <StatusBar style="auto" />
//         <View style={styles.container}>
//           {session ? (
//             <DataProvider>
//               <FormProvider>
//                 <AppNavigator session={session} needsWallet={needsWallet} />
//               </FormProvider>
//             </DataProvider>
//           ) : (
//             <FormProvider>
//               <AppNavigator session={session} needsWallet={needsWallet} />
//             </FormProvider>
//           )}
//         </View>
//       </GestureHandlerRootView>
//     </SafeAreaProvider>
//   </NavigationContainer>
// </AuthProvider>
