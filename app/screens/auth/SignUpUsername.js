import React, { useEffect, useState, useCallback } from "react";
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
  const [isValid, setIsValid] = useState(false);

  // Server-side validation
  const validateUsernameServer = async (username) => {
    try {
      const { data, error: rpcError } = await supabase.rpc(
        "validate_username",
        {
          username_input: username,
        }
      );

      if (rpcError) throw rpcError;

      return {
        success: data.valid === true,
        error: data.error || null,
      };
    } catch (err) {
      console.error("Server validation error:", err);
      return {
        success: false,
        error: err.message || "Failed to validate username",
      };
    }
  };

  // Client-side validation with debounce
  const debouncedClientValidation = useCallback(
    debounce((value) => {
      const validationResult = clientValidation.username(value);
      setIsValid(validationResult.success);
      setError(validationResult.success ? "" : validationResult.error);
    }, 300),
    []
  );

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      debouncedClientValidation.cancel();
    };
  }, [debouncedClientValidation]);

  // Handle input change - only client validation
  const handleInputChange = (value) => {
    const trimmedValue = value.trim().toLowerCase();
    updateFormData({ username: trimmedValue });

    if (!trimmedValue) {
      setError("");
      setIsValid(false);
      return;
    }

    debouncedClientValidation(trimmedValue);
  };

  // Final submission with server validation
  const handleUsernameSubmit = async () => {
    if (!formData.username || !isValid) {
      return;
    }

    setIsLoading(true);
    try {
      const serverValidation = await validateUsernameServer(formData.username);

      if (!serverValidation.success) {
        setError(serverValidation.error);
        setIsValid(false);
        return;
      }

      navigation.navigate(routes.SIGNUPFULLNAME);
    } catch (err) {
      setError("Failed to validate username. Please try again.");
      setIsValid(false);
    } finally {
      setIsLoading(false);
    }
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
                onSubmitEditing={
                  isValid && !isLoading ? handleUsernameSubmit : undefined
                }
              />
              <ErrorMessage error={error} />
              <AppButton
                color="yellow"
                onPress={handleUsernameSubmit}
                title={isLoading ? "Checking..." : "Next"}
                style={styles.next}
                disabled={isLoading || !isValid || !!error}
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
