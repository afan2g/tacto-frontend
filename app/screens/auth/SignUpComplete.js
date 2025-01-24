import React, { useState } from "react";
import { View, StyleSheet, Text } from "react-native";
import { Screen } from "../../components/primitives";
import { colors } from "../../config";
import { supabase } from "../../../lib/supabase";
import { AppButton } from "../../components/primitives";
import { CommonActions, StackActions } from "@react-navigation/native";
import routes from "../../navigation/routes";

function SignUpComplete({ navigation }) {
  const [isLoading, setIsLoading] = useState(false);

  // SignUpComplete.js
  const handleButton = async () => {
    setIsLoading(true);
    try {
      // Refresh session
      await supabase.auth.refreshSession();
      await new Promise((resolve) => setTimeout(resolve, 500)); // Delay for session update

      // Get updated session
      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();
      if (sessionError) throw sessionError;

      if (!session?.user) {
        throw new Error("No valid session after refresh");
      }

      // Update profile
      const { error: profileError } = await supabase
        .from("profiles")
        .update({ wallet_created: true })
        .eq("id", session.user.id);
      if (profileError) throw profileError;

      // Trigger another session refresh
      await supabase.auth.refreshSession();
      await new Promise((resolve) => setTimeout(resolve, 500)); // Delay to ensure `useAuth.js` updates

      console.log("Navigating to ROOT stack");
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: routes.ROOT }],
        })
      );
    } catch (error) {
      console.error("Error in handleButton:", error);
      Alert.alert("Error", "Failed to complete setup. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Screen style={styles.container}>
      <Text style={styles.text}>Sign Up Complete</Text>
      <AppButton
        color="yellow"
        onPress={handleButton}
        title={isLoading ? "Loading..." : "Go to App"}
        disabled={isLoading}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontSize: 20,
    color: colors.lightGray,
    marginBottom: 20,
  },
});

export default SignUpComplete;
