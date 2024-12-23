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
import { ChevronLeft } from "lucide-react-native";
import debounce from "lodash.debounce";

import { ErrorMessage } from "../../components/forms";
import { SSOOptions } from "../../components/login";
import { AppButton, Header, Screen } from "../../components/primitives";
import { useFormData } from "../../contexts/FormContext";
import { colors, fonts } from "../../config";
import routes from "../../navigation/routes";
import { validateUsername } from "../../validation/validateUsername";

function SignUpUsername({ navigation }) {
  const { formData, updateFormData } = useFormData();
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Debounced server-side validation
  const debouncedValidateUsername = debounce(async (username) => {
    try {
      const { data, error } = await supabase.rpc("validate_username", {
        username_input: username,
      });

      if (error) {
        console.error("Supabase validation error:", error);
        setError("An error occurred. Please try again.");
        return;
      }

      if (!data.valid) {
        setError(data.error || "Invalid username.");
      } else {
        setError(""); // No error
      }
    } catch (err) {
      console.error("Error during server validation:", err);
      setError("An error occurred. Please try again.");
    }
  }, 300); // 300ms debounce delay

  // Handle input change with real-time validation
  const handleInputChange = (value) => {
    setError(""); // Clear any existing errors
    updateFormData({ username: value });

    // Client-side validation
    const clientError = validateUsernameClient(value);
    if (clientError) {
      setError(clientError);
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

    try {
      if (error) {
        // Prevent submission if there are validation errors
        setIsLoading(false);
        return;
      }

      // Success - proceed to next step
      navigation.navigate(routes.SIGNUPFULLNAME);
    } catch (err) {
      console.error("Error during username submission:", err);
      setError("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Screen style={styles.screen}>
      <View style={styles.headerContainer}>
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
                disabled={isLoading || Boolean(error)} // Disable if errors exist
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
