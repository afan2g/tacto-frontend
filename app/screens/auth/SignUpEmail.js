import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  TextInput,
  BackHandler,
  Keyboard,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  TouchableWithoutFeedback,
} from "react-native";
import { clientValidation } from "../../validation/clientValidation";
import { supabase } from "../../../lib/supabase";

import {
  Screen,
  Header,
  AppButton,
  AppText,
} from "../../components/primitives";
import { useFormData } from "../../contexts/FormContext";
import routes from "../../navigation/routes";
import { colors, fonts } from "../../config";
import ErrorMessage from "../../components/forms/ErrorMessage";
import SSOOptions from "../../components/login/SSOOptions";
import { ChevronLeft } from "lucide-react-native";

function SignUpEmail({ navigation }) {
  const { formData, updateFormData } = useFormData();
  const [error, setError] = useState("");
  const [isValid, setIsValid] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      () => {
        navigation.goBack();
        return true;
      }
    );

    return () => backHandler.remove();
  }, [navigation]);

  const handleInputChange = (value) => {
    setError("");
    setShowLoginPrompt(false);
    updateFormData({ email: value });

    // Client-side validation only
    const validationResult = clientValidation.email(value);
    if (!validationResult.success) {
      setError(validationResult.error || "Invalid email");
      setIsValid(false);
    } else {
      setIsValid(true);
    }
  };

  const checkExistingEmail = async (email) => {
    try {
      // We use signUp with a random password to check if the email exists
      // This is more secure than having a dedicated endpoint
      const { data, error } = await supabase.auth.signUp({
        email: email,
        password: Math.random().toString(36) + "Abc123!!", // Random secure password
      });

      // If the response indicates the user already exists
      if (
        error?.message?.includes("User already registered") ||
        error?.message?.toLowerCase().includes("email already")
      ) {
        return { exists: true };
      }

      // If we got here, the email is new (cancel the signup attempt)
      if (data?.user?.id) {
        await supabase.auth.admin.deleteUser(data.user.id);
      }

      return { exists: false };
    } catch (err) {
      console.error("Error checking email:", err);
      throw new Error("Unable to verify email availability");
    }
  };

  const submitIdentifier = async () => {
    if (!isValid) return;

    try {
      setIsLoading(true);
      setError("");
      setShowLoginPrompt(false);

      // Final client-side validation
      const validationResult = clientValidation.email(formData.email);
      if (!validationResult.success) {
        setError(validationResult.error || "Invalid email");
        return;
      }

      Keyboard.dismiss();

      // Check if email exists
      const { exists } = await checkExistingEmail(formData.email);

      if (exists) {
        setShowLoginPrompt(true);
        setError("This email is already registered");
        return;
      }

      // If we get here, the email is valid and new
      navigation.navigate(routes.SIGNUPPASSWORD);
    } catch (err) {
      console.error("Email validation error:", err);
      setError("An error occurred. Please try again.");
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
        <Header style={styles.header}>Enter your email</Header>
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
                autoComplete="email"
                autoCorrect={false}
                autoFocus={true}
                inputMode="email"
                numberOfLines={1}
                onChangeText={handleInputChange}
                placeholder="Email"
                placeholderTextColor={colors.softGray}
                returnKeyType="done"
                selectionColor={colors.lightGray}
                selectionHandleColor={colors.lightGray}
                value={formData.email}
                style={[
                  styles.text,
                  {
                    fontFamily: formData.email ? fonts.black : fonts.italic,
                  },
                ]}
                onSubmitEditing={isValid ? submitIdentifier : undefined}
              />
              <ErrorMessage error={error} />
              {showLoginPrompt && (
                <View style={styles.loginPrompt}>
                  <AppText style={styles.loginPromptText}>
                    Want to sign in instead?
                  </AppText>
                  <AppButton
                    color="yellow"
                    onPress={() => {
                      navigation.navigate(routes.LOGIN, {
                        email: formData.email,
                      });
                    }}
                    title="Go to Login"
                    style={styles.loginButton}
                  />
                </View>
              )}
              <AppButton
                color="yellow"
                onPress={submitIdentifier}
                title={isLoading ? "Checking..." : "Next"}
                style={styles.next}
                disabled={!isValid || isLoading}
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
  loginPrompt: {
    marginTop: 10,
    alignItems: "center",
  },
  loginPromptText: {
    color: colors.lightGray,
    marginBottom: 5,
  },
  loginButton: {
    marginTop: 5,
  },
});

export default SignUpEmail;
