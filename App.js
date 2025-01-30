import { setupCrypto } from "./lib/setupCrypto";
setupCrypto();

import React, {
  use,
  useEffect,
  useRef,
  useState,
  useCallback,
  useMemo,
} from "react";
import {
  Button,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
} from "react-native";
import PhoneInput from "react-native-international-phone-number";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
GoogleSignin.configure({
  webClientId:
    "785186330408-e70b787gaulcvn8m1qdfqvulem1su9q2.apps.googleusercontent.com",
});
import { NavigationContainer } from "@react-navigation/native";
import { View, StyleSheet, ActivityIndicator, Keyboard } from "react-native";
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
import DropDownPickerComponent from "./app/components/forms/DropDownPickerComponent";
import DropDownPicker from "react-native-dropdown-picker";
import countries from "./lib/countryDialInfo.json";
import { getLocales } from "expo-localization";
import CountryPicker from "./app/testing/CountryPicker";
export default function App() {
  const onSelectCountry = (country) => {
    console.log("Selected country:", country);
  };
  return <CountryPicker onSelectCountry={onSelectCountry} />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  selectedCountry: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    backgroundColor: "white",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  bottomSheetContent: {
    flex: 1,
  },
  searchContainer: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
  },
  searchInput: {
    height: 40,
    backgroundColor: "#F1F5F9",
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 16,
  },
  listContent: {
    paddingBottom: 20,
  },
  countryItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
  },
  flag: {
    fontSize: 24,
    marginRight: 12,
  },
  countryName: {
    flex: 1,
    fontSize: 16,
  },
  dialCode: {
    fontSize: 16,
    color: "#64748B",
    marginLeft: 8,
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
