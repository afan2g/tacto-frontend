// App.js
import { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { supabase } from "./lib/supabase";
import { View, StyleSheet, ActivityIndicator } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { StatusBar } from "expo-status-bar";

import RootNavigator from "./app/navigation/RootNavigator";
import AuthNavigator from "./app/navigation/entry/AuthNavigator";
import navigationTheme from "./app/navigation/navigationTheme";

// Custom hook for authentication state
const useAuth = () => {
  const [session, setSession] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check active session
    const checkSession = async () => {
      try {
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession();
        if (error) throw error;
        setSession(session);
      } catch (error) {
        console.error("Error checking session:", error.message);
      } finally {
        setIsLoading(false);
      }
    };

    checkSession();

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setIsLoading(false);
    });

    // Cleanup subscription
    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  return { session, isLoading };
};

export default function App() {
  const { session, isLoading } = useAuth();

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
            {session?.user ? <RootNavigator /> : <AuthNavigator />}
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
