import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  StyleSheet,
  TextInput as RNTextInput,
  BackHandler,
  Keyboard,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  ScrollView,
  Platform,
  Text,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { TextInput, useTheme } from "react-native-paper";
import { supabase } from "../../../lib/supabase";
import { clientValidation } from "../../validation/clientValidation";
import { AppButton, Screen, Header } from "../../components/primitives";
import { useFormData } from "../../contexts/FormContext";
import routes from "../../navigation/routes";
import { colors, fonts } from "../../config";
import { ErrorMessage } from "../../components/forms";
import { SSOOptions } from "../../components/login";
import { ChevronLeft } from "lucide-react-native";
import { PROGRESS_STEPS } from "../../constants/progress";
import ProgressBar from "../../components/ProgressBar";
function SignUpPassword({ navigation, route }) {
  const { formData, updateFormData, updateProgress } = useFormData();
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const isPhoneVerification = formData.phone != null;
  const theme = useTheme();
  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      () => {
        handleBack();
        return true;
      }
    );

    return () => backHandler.remove();
  }, [navigation]);

  useFocusEffect(
    useCallback(() => {
      // Do something when the screen is focused
      updateProgress(route.name);
      return () => {
        // Do something when the screen is unfocused
        // Useful for cleanup functions
      };
    }, [route.name])
  );
  const handleBack = () => {
    navigation.goBack();
  };

  const handleInputChange = (value) => {
    setError("");
    setShowLoginPrompt(false);

    updateFormData({ password: value });

    // Client-side validation
    const validationResult = clientValidation.password(value);
    if (!validationResult.success) {
      setError(validationResult.error || "Invalid password");
    }
  };

  const handleSubmit = async () => {
    try {
      setShowLoginPrompt(false);

      // Final client-side validation check
      const validationResult = clientValidation.password(formData.password);
      if (!validationResult.success) {
        setError(validationResult.error || "Invalid password");
        return;
      }

      setIsSubmitting(true);
      setError("");

      // Structure the signup data
      const signUpData = isPhoneVerification
        ? {
            phone: formData.phone,
            password: formData.password,
            options: {
              data: {
                full_name: formData.fullName?.trim() || "",
                first_name: formData.firstName?.trim() || "",
                last_name: formData.lastName?.trim() || "",
                username: formData.username?.trim() || "",
              },
            },
          }
        : {
            email: formData.email,
            password: formData.password,
            options: {
              data: {
                full_name: formData.fullName?.trim() || "",
                first_name: formData.firstName?.trim() || "",
                last_name: formData.lastName?.trim() || "",
                username: formData.username?.trim() || "",
              },
              emailRedirectTo: "https://usetacto.com",
            },
          };

      console.log(
        "Attempting signup with data:",
        JSON.stringify(signUpData, null, 2)
      );

      const { data, error: signUpError } = await supabase.auth.signUp(
        signUpData
      );

      if (signUpError) throw signUpError;

      console.log("Signup success:", data);
      navigation.navigate(routes.SIGNUPVERIFY);
    } catch (err) {
      console.error("Sign up error:", err);
      setError(err.message || "An error occurred during sign up");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Use the validation result to determine if password is valid
  const isPasswordValid =
    formData.password && clientValidation.password(formData.password).success;

  return (
    <Screen style={styles.screen}>
      <View style={styles.headerContainer}>
        <ChevronLeft color={colors.lightGray} size={42} onPress={handleBack} />
        <Header style={styles.header}>Create a password</Header>
      </View>
      <ProgressBar />

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
                {...theme.formInput}
                theme={{
                  colors: {
                    onSurfaceVariant: colors.softGray,
                  },
                }}
                label={<Text style={{ fontFamily: fonts.bold }}>Password</Text>}
                autoComplete="new-password"
                autoCorrect={false}
                autoFocus
                value={formData.password}
                onChangeText={handleInputChange}
                onSubmitEditing={isPasswordValid ? handleSubmit : undefined}
                secureTextEntry
                returnKeyType="done"
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
                onPress={handleSubmit}
                title={isSubmitting ? "Sending..." : "Get Verification Code"}
                disabled={isSubmitting || !isPasswordValid}
                style={styles.next}
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
  headerContainer: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "flex-end",
    paddingBottom: 5,
    marginTop: 10,
  },
  header: {
    paddingLeft: 5,
  },
  keyboardView: {
    flex: 1,
  },
  scrollView: {
    flexGrow: 1,
    justifyContent: "space-between",
    paddingTop: 20,
  },
  content: {
    flex: 1,
    justifyContent: "flex-end",
    paddingBottom: Platform.OS === "ios" ? 20 : 40,
    paddingHorizontal: 20,
    width: "100%",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    backgroundColor: colors.blueShade10,
    borderRadius: 5,
    paddingHorizontal: 10,
    borderWidth: 2,
    borderColor: colors.fadedGray,
  },
  text: {
    color: colors.lightGray,
    fontSize: 20,
    width: "100%",
    overflow: "hidden",
    lineHeight: 25,
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

export default SignUpPassword;
