import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  TextInput,
  View,
  BackHandler,
  Keyboard,
  KeyboardAvoidingView,
  ScrollView,
  TouchableWithoutFeedback,
  Platform,
  Pressable,
} from "react-native";
import { ChevronLeft } from "lucide-react-native";
import { supabase } from "../../../lib/supabase";

import {
  AppButton,
  AppText,
  Header,
  Screen,
} from "../../components/primitives";
import { useFormData } from "../../contexts/FormContext";
import routes from "../../navigation/routes";
import { colors, fonts } from "../../config";
import ErrorMessage from "../../components/forms/ErrorMessage";
import SSOOptions from "../../components/login/SSOOptions";

function SignUpVerify({ navigation }) {
  const { formData, updateFormData } = useFormData();
  const [error, setError] = useState("");
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
    updateFormData({ verificationCode: value });
  };

  const handleResendOTP = async () => {
    const { error } = await supabase.auth.resend({
      type: "signup",
      email: formData.email,
      options: {
        emailRedirectTo: "https://usetacto.com",
      },
    });

    if (error) {
      setError(error.message);
      console.log("error", error);
    } else {
      setError("");
      console.log("success");
    }
  };
  const verifyOTP = async () => {
    try {
      const { data, error } = await supabase.auth.verifyOtp({
        email: formData.email,
        token: formData.verificationCode,
        type: "email",
      });

      if (error) throw error;

      // Add delay to allow session update
      await new Promise((resolve) => setTimeout(resolve, 500));
      navigation.navigate(routes.SIGNUPGENERATEWALLET);
    } catch (error) {
      setError(error.message);
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
        <Header style={styles.header}>Verify your account</Header>
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
            <AppText style={styles.grayText}>
              Enter the 6-digit verification code sent to{" "}
              <AppText style={styles.yellowText}>{formData.email}</AppText>
            </AppText>
            <View style={styles.content}>
              <View style={styles.textInputContainer}>
                <TextInput
                  autoComplete="one-time-code"
                  autoCorrect={false}
                  autoFocus={true}
                  inputMode="numeric"
                  numberOfLines={1}
                  onChangeText={handleInputChange}
                  placeholder="Verification code"
                  placeholderTextColor={colors.softGray}
                  returnKeyType="done"
                  selectionColor={colors.lightGray}
                  selectionHandleColor={colors.lightGray}
                  style={[
                    styles.text,
                    {
                      fontFamily: formData.verificationCode
                        ? fonts.black
                        : fonts.italic,
                    },
                  ]}
                  value={formData.verificationCode}
                />
                <Pressable onPress={handleResendOTP} style={styles.resend}>
                  <AppText style={{ color: colors.yellow }}>Resend</AppText>
                </Pressable>
              </View>
              <ErrorMessage error={error} />
              <AppButton
                color="yellow"
                onPress={verifyOTP}
                title="Verify"
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
  grayText: {
    paddingHorizontal: 20,
    color: colors.softGray,
    fontSize: 30,
    textAlign: "left",
  },
  yellowText: {
    color: colors.yellow,
    fontSize: 30,
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
  textInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.fadedGray,
    borderRadius: 5,
    marginTop: 10,
  },
  text: {
    color: colors.lightGray,
    fontSize: 18,
    width: "100%",
    lineHeight: 22,
    overflow: "hidden",
    paddingLeft: 10,
    textAlignVertical: "center",
    height: 40,
  },
  resend: {
    position: "absolute",
    right: 10,
  },
  next: {
    marginTop: 10,
  },
});

export default SignUpVerify;
