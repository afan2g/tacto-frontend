import React, { useState } from "react";
import { View, StyleSheet, Text } from "react-native";
import { Screen } from "../../components/primitives";
import { colors } from "../../config";
import { supabase } from "../../../lib/supabase";
import { AppButton } from "../../components/primitives";
import { CommonActions } from "@react-navigation/native";
import routes from "../../navigation/routes";

function SignUpComplete({ navigation }) {
  const [isLoading, setIsLoading] = useState(false);

  const handleButton = async () => {
    setIsLoading(true);
    try {
      // First refresh the session
      const { error: refreshError } = await supabase.auth.refreshSession();
      if (refreshError) {
        console.error("Error refreshing session:", refreshError.message);
        return;
      }

      // Then get the current session to verify
      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();
      if (sessionError) {
        console.error("Error getting session:", sessionError.message);
        return;
      }

      if (session?.user) {
        console.log("Valid session obtained:", session.user.id);
        // Reset the entire navigation state
        navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [
              {
                name: routes.ROOT,
                state: {
                  routes: [
                    {
                      name: routes.APPTABS,
                    },
                  ],
                },
              },
            ],
          })
        );
      } else {
        console.error("No valid session after refresh");
      }
    } catch (error) {
      console.error("Error in handleButton:", error);
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
