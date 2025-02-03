import React, { useEffect, useState, useCallback } from "react";
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
import { parsePhoneNumber } from "libphonenumber-js/mobile";
import { useFocusEffect } from "@react-navigation/native";
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
import ProgressBar from "../../components/ProgressBar";
function SignUpVerify({ navigation, route }) {
  const { formData, updateFormData, updateProgress } = useFormData();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const isPhoneVerification = formData.phone != null;
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
    updateFormData({ verificationCode: value });
  };

  const handleResendOTP = async () => {
    try {
      let result;

      if (isPhoneVerification) {
        // Resend phone OTP
        result = await supabase.auth.resend({
          type: "sms",
          phone: formData.phone,
        });
        console.log("sent phone OTP to ", formData.phone);
      } else {
        // Resend email OTP
        result = await supabase.auth.resend({
          type: "signup",
          email: formData.email,
          options: {
            emailRedirectTo: "https://usetacto.com",
          },
        });
      }

      if (result.error) {
        setError(result.error.message);
        console.log("error", result.error);
      } else {
        setError("");
        console.log("success");
      }
    } catch (error) {
      setError(error.message);
    }
  };

  const verifyOTP = async () => {
    setLoading(true);
    try {
      let verifyResult;

      if (isPhoneVerification) {
        // Verify phone OTP
        verifyResult = await supabase.auth.verifyOtp({
          phone: formData.phone,
          token: formData.verificationCode,
          type: "sms",
        });
      } else {
        // Verify email OTP
        verifyResult = await supabase.auth.verifyOtp({
          email: formData.email,
          token: formData.verificationCode,
          type: "email",
        });
      }

      if (verifyResult.error) throw verifyResult.error;

      // Get session
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session?.user?.id) throw new Error("Session not found");

      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", session.user.id)
        .single();

      console.log("Profile check in verify:", { profile, profileError });
      if (profileError) throw profileError;

      navigation.navigate(routes.SIGNUPGENERATEWALLET);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const formatContactInfo = () => {
    if (isPhoneVerification) {
      // Format phone number for display
      const phoneNumber = parsePhoneNumber(formData.phone);
      return phoneNumber.format("NATIONAL", { nationalPrefix: true });
    }
    return formData.email;
  };

  return (
    <Screen style={styles.screen}>
      <View style={styles.headerContainer}>
        <ChevronLeft color={colors.lightGray} size={42} onPress={handleBack} />
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
              Enter the {isPhoneVerification ? "6-digit" : "verification"} code
              sent to{" "}
              <AppText style={styles.yellowText}>{formatContactInfo()}</AppText>
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
                  maxLength={6}
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
              <ProgressBar />
              <ErrorMessage error={error} />
              <AppButton
                color="yellow"
                onPress={verifyOTP}
                title={loading ? "Verifying..." : "Verify"}
                style={styles.next}
                disabled={loading}
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
    marginTop: 10,
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
