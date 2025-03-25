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
function LoginScreen({ navigation }) {
  const passwordRef = useRef(null);
  const [loginForm, setLoginForm] = useState({
    identifier: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const theme = useTheme();
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

  const handleInputChange = (name, value) => {
    setLoginForm((prev) => ({
      ...prev,
      [name]: value,
    }));
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
      if (!loginForm.identifier) {
        setErrors((prev) => ({
          ...prev,
          identifier: "Please enter your username, email, or phone #",
        }));
      }
      if (!loginForm.password) {
        setErrors((prev) => ({
          ...prev,
          password: "Please enter your password",
        }));
      }

      const { success: emailSuccess, error: emailError } =
        clientValidation.email(loginForm.identifier);
      const { success: phoneSuccess, error: phoneError } =
        clientValidation.phone(loginForm.identifier);
      const { success: passwordSuccess, error: passwordError } =
        clientValidation.password(loginForm.password);
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
          email: loginForm.identifier,
          password: loginForm.password,
        });
        if (error) throw error;
      } else if (phoneSuccess) {
        const { data, error } = await supabase.auth.signInWithPassword({
          phone: `+1${loginForm.identifier}`,
          password: loginForm.password,
        });
        if (error) throw error;
      } else {
        throw new Error("Invalid email or phone number");
      }

      await new Promise((resolve) => setTimeout(resolve, 500));
      // Session update will handle navigation
    } catch (error) {
      Alert.alert("Login Failed", error.message);
    } finally {
      setIsSubmitting(false);
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
                  value={loginForm.identifier}
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
                  value={loginForm.password}
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
                  Forgot password?
                </AppText>

                <AppButton
                  color={colors.yellow}
                  title="Log in"
                  style={styles.button}
                  onPress={handleSignIn}
                  disabled={isSubmitting}
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
