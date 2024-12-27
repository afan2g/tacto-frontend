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
import { clientValidation } from "../../validation/clientValidation"; // Add this import

import { AppButton, Screen, Header } from "../../components/primitives";
import { useFormData } from "../../contexts/FormContext";
import routes from "../../navigation/routes";
import { colors, fonts } from "../../config";
import { ErrorMessage } from "../../components/forms";
import { SSOOptions } from "../../components/login";
import { ChevronLeft } from "lucide-react-native";

function SignUpPassword({ navigation }) {
  const { formData, updateFormData } = useFormData();
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    updateFormData({ password: value });

    // Client-side validation
    const validationResult = clientValidation.password(value);
    if (!validationResult.success) {
      setError(validationResult.error || "Invalid password");
    }
  };

  const handleSubmit = async () => {
    try {
      // Final client-side validation check
      const validationResult = clientValidation.password(formData.password);
      if (!validationResult.success) {
        setError(validationResult.error || "Invalid password");
        return;
      }

      setIsSubmitting(true);
      setError("");
      Keyboard.dismiss();

      const signUpData = {
        email: formData.email,
        password: formData.password,
        options: {
          emailRedirectTo: "https://usetacto.com",
          data: {
            full_name: formData.fullName,
            first_name: formData.firstName,
            last_name: formData.lastName,
            username: formData.username,
          },
        },
      };
      console.log("Sign up data:", signUpData);
      const { data, signUpError } = await supabase.auth.signUp(signUpData);

      if (signUpError) throw signUpError;

      console.log("Success, sent code:", data);
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
        <ChevronLeft
          color={colors.lightGray}
          size={42}
          onPress={() => navigation.goBack()}
        />
        <Header style={styles.header}>Create a password</Header>
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
                autoComplete="new-password"
                autoCorrect={false}
                autoFocus={true}
                numberOfLines={1}
                onChangeText={handleInputChange}
                placeholder="Password"
                placeholderTextColor={colors.softGray}
                returnKeyType="done"
                secureTextEntry
                selectionColor={colors.lightGray}
                selectionHandleColor={colors.lightGray}
                style={[
                  styles.text,
                  {
                    fontFamily: formData.password ? fonts.black : fonts.italic,
                  },
                ]}
                value={formData.password}
                onSubmitEditing={isPasswordValid ? handleSubmit : undefined}
              />
              <ErrorMessage error={error} />
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

export default SignUpPassword;
