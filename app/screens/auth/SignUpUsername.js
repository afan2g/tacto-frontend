// SignUpUsername.js
import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  TextInput,
  BackHandler,
  Keyboard,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  ScrollView,
  Platform,
} from "react-native";

import { supabase } from "../../../lib/supabase";
import debounce from "lodash.debounce";
import { ChevronLeft } from "lucide-react-native";
import { ErrorMessage } from "../../components/forms";
import { SSOOptions } from "../../components/login";
import { AppButton, Header, Screen } from "../../components/primitives";
import { useFormData } from "../../contexts/FormContext";
import { colors, fonts } from "../../config";
import routes from "../../navigation/routes";
import { clientValidation } from "../../validation/clientValidation";

function SignUpUsername({ navigation }) {
  const { formData, updateFormData } = useFormData();
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Cancel validation if the component unmounts
  useEffect(() => {
    return () => {
      debouncedValidateUsername.cancel();
    };
  }, []);

  // Helper function for validation
  const validateUsername = async (username) => {
    try {
      const { data, error } = await supabase.rpc("validate_username", {
        username_input: username,
      });

      if (error) {
        throw new Error("Supabase validation error");
      }

      return { success: data.valid, error: data.error || null };
    } catch (err) {
      console.error("Error during server validation:", err);
      return { success: false, error: "An error occurred. Please try again." };
    }
  };

  // Debounced server-side validation
  const debouncedValidateUsername = debounce(async (username) => {
    const result = await validateUsername(username);
    setError(result.success ? "" : result.error);
  }, 300);

  // Handle input change
  const handleInputChange = (value) => {
    setError(""); // Clear existing errors
    updateFormData({ username: value });

    // Client-side validation
    const validationResult = clientValidation.username(value);
    if (!validationResult.success) {
      setError(validationResult.error);
      return;
    }

    // Trigger debounced server-side validation
    debouncedValidateUsername(value);
  };

  // Final submission
  const handleUsernameSubmit = async () => {
    setError("");
    setIsLoading(true);
    Keyboard.dismiss();

    navigation.navigate(routes.SIGNUPFULLNAME);
  };

  return (
    <Screen style={styles.screen}>
      <View style={styles.headerContainer}>
        <ChevronLeft
          color={colors.lightGray}
          size={42}
          onPress={() => navigation.goBack()}
        />
        <Header style={styles.header}>Choose a username</Header>
      </View>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.keyboardView}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView
            contentContainerStyle={styles.scrollView}
            keyboardShouldPersistTaps="handled"
            bounces={false}
          >
            <View style={styles.content}>
              <TextInput
                autoComplete="username"
                autoCorrect={false}
                autoFocus={true}
                onChangeText={handleInputChange}
                numberOfLines={1}
                placeholder="Username"
                placeholderTextColor={colors.softGray}
                returnKeyType="done"
                selectionColor={colors.lightGray}
                accessibilityLabel="Username input"
                style={[
                  styles.text,
                  {
                    fontFamily: formData.username ? fonts.black : fonts.italic,
                  },
                ]}
                value={formData.username}
              />
              <ErrorMessage error={error} />
              <AppButton
                color="yellow"
                onPress={handleUsernameSubmit}
                title={isLoading ? "Loading..." : "Next"}
                style={styles.next}
                disabled={!!error} // Only disable if validation errors exist
              />
              <SSOOptions
                grayText="Have an account? "
                yellowText="Sign In"
                onPress={() => navigation.navigate(routes.LOGIN)}
              />
            </View>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    paddingHorizontal: 0,
  },
  keyboardView: {
    flex: 1,
  },
  scrollView: {
    flexGrow: 1,
    justifyContent: "space-between",
    paddingTop: 20,
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "flex-end",
    paddingBottom: 20,
    marginHorizontal: 10,
  },
  header: {
    paddingLeft: 5,
  },
  content: {
    flex: 1,
    justifyContent: "flex-end",
    paddingBottom: Platform.OS === "ios" ? 20 : 40,
    paddingHorizontal: 20,
    width: "100%",
  },
  text: {
    color: colors.lightGray,
    fontSize: 18,
    width: "100%",
    borderColor: colors.fadedGray,
    borderWidth: 1,
    borderRadius: 5,
    lineHeight: 22,
    overflow: "hidden",
    paddingLeft: 10,
    height: 40,
  },
  next: {
    marginTop: 10,
  },
});

export default SignUpUsername;
