import React, { useEffect, useState, useCallback } from "react";
import {
  StyleSheet,
  View,
  BackHandler,
  Keyboard,
  KeyboardAvoidingView,
  ScrollView,
  TouchableWithoutFeedback,
  Platform,
  Pressable,
} from "react-native";
import { OtpInput } from "react-native-otp-entry";
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
  console.log("formData:", formData);
  // ---------------------------
  // OTP Resend Cooldown Timer
  // ---------------------------
  const COOLDOWN_PERIOD = 60; // seconds
  const [lastSentTime, setLastSentTime] = useState(Date.now());
  const [timeLeft, setTimeLeft] = useState(0);

  // Effect that updates the countdown timer every second
  useEffect(() => {
    let interval = null;
    if (lastSentTime) {
      interval = setInterval(() => {
        const secondsElapsed = Math.floor((Date.now() - lastSentTime) / 1000);
        const remaining = COOLDOWN_PERIOD - secondsElapsed;

        if (remaining <= 0) {
          setTimeLeft(0);
          clearInterval(interval);
        } else {
          setTimeLeft(remaining);
        }
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [lastSentTime]);

  // ---------------------------
  // Existing Handlers & Effects
  // ---------------------------
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
      updateProgress(route.name);
      return () => {
        // Cleanup if needed when the screen is unfocused.
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

  // ---------------------------
  // Modified Resend OTP Function
  // ---------------------------
  const handleResendOTP = async () => {
    // Prevent resending OTP if the cooldown is active
    if (timeLeft > 0) return;

    try {
      let result;
      if (isPhoneVerification) {
        // Resend phone OTP
        result = await supabase.auth.resend({
          type: "sms",
          phone: formData.phone,
        });
        console.log("Sent phone OTP to", formData.phone);
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
        console.log("Error", result.error);
      } else {
        setError("");
        console.log("OTP resent successfully");
        // Start the cooldown by recording the current time.
        setLastSentTime(Date.now());
      }
    } catch (error) {
      setError(error.message);
    }
  };

  const handleOTPComplete = async (value) => {
    setLoading(true);
    try {
      let verifyResult;

      if (isPhoneVerification) {
        // Verify phone OTP
        verifyResult = await supabase.auth.verifyOtp({
          phone: formData.phone,
          token: value,
          type: "sms",
        });
      } else {
        // Verify email OTP
        verifyResult = await supabase.auth.verifyOtp({
          email: formData.email,
          token: value,
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
            <AppText style={styles.grayText}>
              Enter the {isPhoneVerification ? "6-digit" : "verification"} code
              sent to{" "}
              <AppText style={styles.yellowText}>{formatContactInfo()}</AppText>
            </AppText>
            <View style={styles.content}>
              <View style={styles.textInputContainer}>
                <OtpInput
                  blurOnFilled={true}
                  focusColor={colors.yellow}
                  numberOfDigits={6}
                  textInputProps={{
                    accessibilityLabel: "Verification code input",
                    autoComplete: "one-time-code",
                  }}
                  type="numeric"
                  onFilled={handleOTPComplete}
                  onTextChange={handleInputChange}
                  theme={{
                    containerStyle: styles.inputContainer,
                    pinCodeContainerStyle: styles.pinCodeContainer,
                    pinCodeTextStyle: styles.pinCodeText,
                    focusedPinCodeContainerStyle:
                      styles.focusedPinCodeContainer,
                    inputsContainerStyle: { gap: 10 },
                  }}
                />
              </View>
              <ErrorMessage error={error} />
              <AppButton
                color="yellow"
                onPress={verifyOTP}
                title={loading ? "Verifying..." : "Verify"}
                style={styles.next}
                disabled={loading}
              />
              <Pressable
                onPress={handleResendOTP}
                style={styles.resendContainer}
                disabled={timeLeft > 0}
              >
                <AppText
                  style={[
                    styles.resendText,
                    {
                      color: timeLeft > 0 ? colors.lightGray : colors.yellow,
                    },
                  ]}
                >
                  {timeLeft > 0 ? `Resend (${timeLeft}s)` : "Resend"}
                </AppText>
              </Pressable>
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
  grayText: {
    paddingHorizontal: 20,
    color: colors.softGray,
    fontSize: 24,
    textAlign: "left",
  },
  yellowText: {
    color: colors.yellow,
    fontSize: 24,
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
  textInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
  },
  resendContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 10,
  },
  resendText: {
    color: colors.lightGray,
    textAlign: "center",
    fontSize: 16,
  },
  next: {
    marginTop: 10,
  },
  inputContainer: {
    width: "auto",
  },
  pinCodeContainer: {
    flex: 1,
    borderRadius: 5,
    borderWidth: 2,
    borderColor: colors.fadedGray,
    backgroundColor: colors.blueShade10,
  },
  pinCodeText: {
    color: colors.lightGray,
    fontSize: 28,
    fontFamily: fonts.black,
  },
  focusedPinCodeContainer: {
    borderColor: colors.yellow,
  },
});

export default SignUpVerify;
