import React, { useState, useEffect } from "react";
import { View, StyleSheet, Pressable } from "react-native";
import { OtpInput } from "react-native-otp-entry";
import {
  AppText,
  Screen,
  Header,
  AppButton,
} from "../../components/primitives";
import { ChevronLeft } from "lucide-react-native";
import { colors, fonts } from "../../config";
import routes from "../../navigation/routes";
import { supabase } from "../../../lib/supabase";
import { ErrorMessage } from "../../components/forms";
import { useAuthContext } from "../../contexts";

const COOLDOWN_PERIOD = 60;
function VerifyOTPScreen({ navigation, route }) {
  const { identifier, identifierType } = route.params;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastSentTime, setLastSentTime] = useState(Date.now());
  const [timeLeft, setTimeLeft] = useState(60);
  const [otp, setOtp] = useState("");
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

  const handleInputChange = (value) => {
    setError("");
    setOtp(value);
  };

  const verifyOTP = async (value) => {
    console.log("Verifying OTP:", value);
    if (loading) return;
    const otp = value || otp;
    setLoading(true);

    try {
      let verifyResult;

      if (identifierType === "phone") {
        // Verify phone OTP
        verifyResult = await supabase.auth.verifyOtp({
          phone: identifier,
          token: otp,
          type: "sms",
        });
      } else {
        // Verify email OTP
        verifyResult = await supabase.auth.verifyOtp({
          email: identifier,
          token: otp,
          type: "email",
        });
      }

      if (verifyResult.error) throw verifyResult.error;
    } catch (error) {
      console.error("Error verifying OTP:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    // Prevent resending OTP if the cooldown is active
    if (timeLeft > 0) return;
    const prevSentTime = lastSentTime;

    try {
      let result;
      setLastSentTime(Date.now());
      if (identifierType === "phone") {
        // Resend phone OTP
        result = await supabase.auth.resend({
          type: "sms",
          phone: identifier,
        });
        console.log("Sent phone OTP to", identifier);
      } else if (identifierType === "email") {
        // Resend email OTP
        result = await supabase.auth.resend({
          type: "signup",
          email: identifier,
        });
        console.log("Sent email OTP to", identifier);
      } else {
        throw new Error("Invalid identifier type");
      }

      if (result.error) {
        throw new Error(result.error);
      } else {
        setError("");
        console.log("OTP resent successfully");
      }
    } catch (error) {
      console.error("Error resending OTP:", error);
      setError(error.message);
      setLastSentTime(prevSentTime);
    }
  };

  return (
    <Screen style={styles.screen}>
      <View style={styles.headerContainer}>
        <ChevronLeft
          color={colors.lightGray}
          size={42}
          onPress={() => navigation.goBack()}
          style={styles.icon}
        />
        <Header style={styles.header}>Verify Pin</Header>
      </View>
      <View style={styles.container}>
        <AppText style={styles.info}>
          Verify your account by entering the one time password sent to{" "}
          {identifier}
        </AppText>
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
            onFilled={verifyOTP}
            onTextChange={handleInputChange}
            disabled={loading}
            theme={{
              containerStyle: styles.inputContainer,
              pinCodeContainerStyle: styles.pinCodeContainer,
              pinCodeTextStyle: styles.pinCodeText,
              focusedPinCodeContainerStyle: styles.focusedPinCodeContainer,
              inputsContainerStyle: { gap: 10 },
            }}
          />
        </View>
        <ErrorMessage error={error} />
        <AppButton
          color={colors.yellow}
          onPress={verifyOTP}
          title={loading ? "Verifying..." : "Verify"}
          style={styles.next}
          disabled={loading || otp.length < 6}
          loading={loading}
        />
        <Pressable
          onPress={handleResendOTP}
          style={styles.resendContainer}
          disabled={timeLeft > 0 || loading}
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
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  screen: {
    paddingHorizontal: 0,
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "flex-end",
    paddingHorizontal: 0,
    marginHorizontal: 0,
  },
  icon: {
    margin: 0,
    padding: 0,
  },
  header: {
    fontSize: 24,
    marginLeft: 10,
  },
  container: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    flex: 1,
  },
  info: {
    fontSize: 16,
    color: colors.fadedGray,
    marginBottom: 20,
  },
  textInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
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
});

export default VerifyOTPScreen;
