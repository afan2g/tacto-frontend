import React, { useRef, useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  TouchableWithoutFeedback,
  // TextInput,
  Text,
  Alert,
  BackHandler,
} from "react-native";
import { supabase } from "../../../lib/supabase";
import { TextInput, useTheme } from "react-native-paper";
import { colors, fonts } from "../../config";
import {
  AppText,
  Header,
  Screen,
  AppButton,
} from "../../components/primitives";
import routes from "../../navigation/routes";
import SSOOptions from "../../components/login/SSOOptions";
import ErrorMessage from "../../components/forms/ErrorMessage";
import { clientValidation } from "../../validation/clientValidation";
import { useAuthContext, useFormData } from "../../contexts";
import { isAuthApiError } from "@supabase/supabase-js";
function LoginScreen({ navigation }) {
  const passwordRef = useRef(null);
  const { formData, updateFormData, clearFormData } = useFormData();
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { isLoading } = useAuthContext();
  const theme = useTheme();
  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      () => {
        clearFormData();
        navigation.goBack();
        return true;
      }
    );
    return () => backHandler.remove();
  }, [navigation]);

  useEffect(() => {
    clearFormData();
  }, []);

  const handleInputChange = (name, value) => {
    // setLoginForm((prev) => ({
    //   ...prev,
    //   [name]: value,
    // }));
    updateFormData({ [name]: value });
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const handleSignIn = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      if (!formData.identifier) {
        setErrors((prev) => ({
          ...prev,
          identifier: "Please enter your username, email, or phone #",
        }));
      }
      if (!formData.password) {
        setErrors((prev) => ({
          ...prev,
          password: "Please enter your password",
        }));
      }

      const { success: emailSuccess, error: emailError } =
        clientValidation.email(formData.identifier);
      const { success: phoneSuccess, error: phoneError } =
        clientValidation.phone(formData.identifier);
      const { success: passwordSuccess, error: passwordError } =
        clientValidation.password(formData.password);
      if (!emailSuccess && !phoneSuccess) {
        setErrors((prev) => ({
          ...prev,
          identifier: emailError || phoneError,
        }));
      }
      if (!passwordSuccess) {
        setErrors((prev) => ({ ...prev, password: passwordError }));
      }

      if (emailSuccess) {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: formData.identifier,
          password: formData.password,
        });
        if (error) throw error;
      } else if (phoneSuccess) {
        const { data, error } = await supabase.auth.signInWithPassword({
          phone: `+1${formData.identifier}`,
          password: formData.password,
        });
        if (error) throw error;
      } else {
        throw new Error("Invalid email or phone number");
      }

      await new Promise((resolve) => setTimeout(resolve, 500));
      // Session update will handle navigation
    } catch (error) {
      console.error("Login error:", error);

      if (isAuthApiError(error)) {
        if (
          error.code === "email_not_confirmed" ||
          error.code === "phone_not_confirmed"
        ) {
          error.code === "email_not_confirmed"
            ? updateFormData({ email: formData.identifier, phone: null })
            : updateFormData({ email: null, phone: formData.identifier });
          Alert.alert(
            "Email or Phone Not Confirmed",
            "Please confirm your email or phone number before logging in.",
            [
              {
                text: "Resend Confirmation",
                onPress: handleVerify,
              },
            ]
          );
        } else {
          Alert.alert("Login Failed", error.message);
        }
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerify = async () => {
    const isPhoneVerification = clientValidation.phone(
      formData.identifier
    ).success;
    const isEmailVerification = clientValidation.email(
      formData.identifier
    ).success;

    console.log("isPhoneVerification", isPhoneVerification);
    console.log("isEmailVerification", isEmailVerification);
    if (!isPhoneVerification && !isEmailVerification) {
      setErrors((prev) => ({
        ...prev,
        identifier: "Please enter a valid email or phone #",
      }));
      return;
    }
    try {
      if (isPhoneVerification) {
        console.log("Sending SMS verification to", formData.identifier);
        const { error } = await supabase.auth.resend({
          type: "sms",
          phone: `+1${formData.identifier}`,
        });
        if (error) throw error;
      } else if (isEmailVerification) {
        console.log("Sending email verification to", formData.identifier);
        const { error } = await supabase.auth.resend({
          type: "signup",
          email: formData.identifier,
        });
        if (error) throw error;
      }
      navigation.navigate(routes.SIGNUPVERIFY);
    } catch (error) {
      console.error("Error sending verification:", error);
      Alert.alert("Error", "Failed to send verification. Please try again.");
    }
  };

  const handleForgotPassword = () => {
    navigation.navigate(routes.FORGOTPASSWORD);
  };

  return (
    <Screen style={styles.screen}>
      <View style={styles.header}>
        <Header>Log In</Header>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardView}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView
            contentContainerStyle={styles.scrollView}
            keyboardShouldPersistTaps="handled"
            bounces={false}
          >
            <View style={styles.content}>
              <View style={styles.formContainer}>
                <TextInput
                  {...theme.formInput}
                  theme={{
                    colors: {
                      onSurfaceVariant: colors.softGray,
                    },
                  }}
                  style={[theme.formInput.style, { marginBottom: 5 }]}
                  label={
                    <Text style={{ fontFamily: fonts.bold }}>
                      Email or phone #
                    </Text>
                  }
                  autoCapitalize="none"
                  autoCorrect={false}
                  autoComplete="email"
                  name="identifier"
                  onChangeText={(value) =>
                    handleInputChange("identifier", value)
                  }
                  onSubmitEditing={() => passwordRef.current?.focus()}
                  value={formData.identifier}
                />
                {errors.identifier && (
                  <ErrorMessage error={errors.identifier} />
                )}

                <TextInput
                  {...theme.formInput}
                  theme={{
                    colors: {
                      onSurfaceVariant: colors.softGray,
                    },
                  }}
                  label={
                    <Text style={{ fontFamily: fonts.bold }}>Password</Text>
                  }
                  autoCapitalize="none"
                  autoCorrect={false}
                  autoComplete="current-password"
                  name="password"
                  onChangeText={(value) => handleInputChange("password", value)}
                  ref={passwordRef}
                  returnKeyType="done"
                  secureTextEntry={!showPassword}
                  value={formData.password}
                  right={
                    <TextInput.Icon
                      color={
                        !showPassword ? colors.fadedGray : colors.lightGray
                      }
                      forceTextInputFocus={false}
                      icon={showPassword ? "eye" : "eye-off"}
                      onPress={() => setShowPassword((prev) => !prev)}
                    />
                  }
                />
                {errors.password && <ErrorMessage error={errors.password} />}

                <AppText
                  style={styles.forgotPassword}
                  onPress={handleForgotPassword}
                >
                  Sign in with OTP
                </AppText>

                <AppButton
                  color={colors.yellow}
                  title="Log in"
                  style={styles.button}
                  onPress={handleSignIn}
                  disabled={isSubmitting || isLoading}
                  loading={isSubmitting || isLoading}
                />
              </View>
              <SSOOptions
                grayText="Don't have an account? "
                yellowText="Sign up"
                onPress={() => navigation.navigate(routes.SIGNUPUSERNAME)}
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
  header: {
    marginHorizontal: 20,
  },
  content: {
    flex: 1,
    justifyContent: "flex-end",
    paddingBottom: Platform.OS === "ios" ? 20 : 40,
    paddingHorizontal: 15,
    width: "100%",
  },
  formContainer: {
    width: "100%",
  },
  forgotPassword: {
    alignSelf: "flex-end",
    color: colors.yellow,
    fontFamily: fonts.regular,
    fontSize: 12,
    paddingTop: 10,
  },
  button: {
    marginTop: 20,
  },
  text: {
    borderColor: colors.fadedGray,
    borderWidth: 1,
    borderRadius: 5,
    paddingLeft: 10,
    color: colors.lightGray,
    fontSize: 18,
    lineHeight: 22,
    marginTop: 15,
    overflow: "hidden",
    padding: 10,
    width: "100%",
    textAlignVertical: "bottom",
  },
  textError: {
    borderColor: colors.danger,
  },
});

export default LoginScreen;
