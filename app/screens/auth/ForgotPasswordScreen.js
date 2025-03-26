import React, { useState, useEffect } from "react";
import { View, StyleSheet, Text } from "react-native";
import { ChevronLeft } from "lucide-react-native";
import { supabase } from "../../../lib/supabase";
import { useTheme, TextInput } from "react-native-paper";
import {
  AppText,
  Header,
  Screen,
  AppButton,
} from "../../components/primitives";
import { ErrorMessage } from "../../components/forms";
import { colors, fonts } from "../../config";
import routes from "../../navigation/routes";
import { clientValidation } from "../../validation/clientValidation";
function ForgotPasswordScreen({ navigation }) {
  const theme = useTheme();
  const [identifier, setIdentifier] = useState("");
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const handleInputChange = (value) => {
    setIdentifier(value);
    if (errors.identifier) {
      setErrors((prev) => ({
        ...prev,
        identifier: undefined,
      }));
    }
  };

  const handleSubmit = async () => {
    // Validate the input
    const {
      success: emailSuccess,
      error: emailError,
      formatted: emailFormatted,
    } = clientValidation.email(identifier);
    const {
      success: phoneSuccess,
      error: phoneError,
      formatted: phoneFormatted,
    } = clientValidation.phone(identifier);
    if (!emailSuccess && !phoneSuccess) {
      setErrors({ identifier: "Invalid email or phone number" });
      return;
    }

    setIsSubmitting(true);
    // navigate to the next screen
    try {
      if (emailSuccess) {
        const { data, error } = await supabase.auth.signInWithOtp({
          email: emailFormatted,
        });
        if (error) {
          throw new Error(error.message);
        }
        navigation.navigate(routes.VERIFYOTP, {
          identifier: emailFormatted,
          identifierType: "email",
        });
      } else if (phoneSuccess) {
        const { data, error } = await supabase.auth.signInWithOtp({
          phone: phoneFormatted,
        });
        if (error) {
          throw new Error(error.message);
        }
        navigation.navigate(routes.VERIFYOTP, {
          identifier: phoneFormatted,
          identifierType: "phone",
        });
      } else {
        throw new Error("Invalid identifier");
      }
    } catch (error) {
      console.log("error", error);
      setErrors({ identifier: error.message });
    } finally {
      setIsSubmitting(false);
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
        <Header style={styles.header}>Sign in With OTP</Header>
      </View>
      <View style={styles.container}>
        <AppText style={styles.info}>
          Sign in with a one time password sent to your email or phone number
        </AppText>
        <TextInput
          {...theme.formInput}
          theme={{
            colors: {
              onSurfaceVariant: colors.softGray,
            },
          }}
          style={[theme.formInput.style, { marginBottom: 5 }]}
          label={
            <Text style={{ fontFamily: fonts.bold }}>Email or phone #</Text>
          }
          autoCapitalize="none"
          autoCorrect={false}
          autoComplete="email"
          autoFocus={true}
          name="identifier"
          onChangeText={(value) => handleInputChange(value)}
          onSubmitEditing={handleSubmit}
          value={identifier}
        />
        {errors.identifier && <ErrorMessage error={errors.identifier} />}
        <AppButton
          color={colors.yellow}
          title="Get Code"
          style={styles.button}
          onPress={handleSubmit}
          disabled={isSubmitting}
          loading={isSubmitting}
        />
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
  },
  info: {
    fontSize: 16,
    color: colors.fadedGray,
    marginBottom: 20,
  },
  button: {
    marginTop: 10,
  },
});

export default ForgotPasswordScreen;
