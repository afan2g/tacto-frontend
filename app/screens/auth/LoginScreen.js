import React, { useRef, useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  TouchableWithoutFeedback,
  TextInput,
  Alert,
  BackHandler,
} from "react-native";
import { supabase } from "../../../lib/supabase";

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

function LoginScreen({ navigation }) {
  const passwordRef = useRef(null);
  const [loginForm, setLoginForm] = useState({
    identifier: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
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

    const { data, error } = await supabase.auth.signInWithPassword({
      email: loginForm.identifier,
      password: loginForm.password,
    });

    if (error) {
      Alert.alert("Login Failed", error.message, [{ text: "OK" }]);
    } else {
      console.log("Login form data:", loginForm);
    }
    setIsSubmitting(false);
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
                  autoCapitalize="none"
                  autoCorrect={false}
                  autoComplete="email"
                  name="identifier"
                  numberOfLines={1}
                  multiline={false}
                  onChangeText={(value) =>
                    handleInputChange("identifier", value)
                  }
                  onSubmitEditing={() => passwordRef.current?.focus()}
                  placeholder="Username, email, or phone #"
                  placeholderTextColor={colors.softGray}
                  returnKeyType="next"
                  selectionColor={colors.lightGray}
                  style={[
                    styles.text,
                    {
                      fontFamily: loginForm.identifier
                        ? fonts.black
                        : fonts.italic,
                    },
                    errors.username && styles.textError,
                  ]}
                  value={loginForm.identifier}
                />
                {errors.username && <ErrorMessage error={errors.username} />}

                <TextInput
                  autoCapitalize="none"
                  autoCorrect={false}
                  autoComplete="current-password"
                  name="password"
                  numberOfLines={1}
                  multiline={false}
                  onChangeText={(value) => handleInputChange("password", value)}
                  placeholder="Password"
                  placeholderTextColor={colors.softGray}
                  ref={passwordRef}
                  returnKeyType="done"
                  secureTextEntry
                  selectionColor={colors.lightGray}
                  style={[
                    styles.text,
                    {
                      fontFamily: loginForm.password
                        ? fonts.black
                        : fonts.italic,
                    },
                    errors.password && styles.textError,
                  ]}
                  textContentType="password"
                  value={loginForm.password}
                />
                {errors.password && <ErrorMessage error={errors.password} />}

                <AppText
                  style={styles.forgotPassword}
                  onPress={handleForgotPassword}
                >
                  Forgot password?
                </AppText>

                <AppButton
                  color="yellow"
                  title="Log in"
                  style={styles.button}
                  onPress={handleSignIn}
                  disabled={isSubmitting}
                />
              </View>
              <SSOOptions
                grayText="Don't have an account? "
                yellowText="Sign up"
                onPress={() => navigation.navigate(routes.SIGNUPCREATE)}
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
    paddingHorizontal: 20,
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
