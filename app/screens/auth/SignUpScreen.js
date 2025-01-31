import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  StyleSheet,
  TextInput,
  BackHandler,
  Keyboard,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  TouchableWithoutFeedback,
} from "react-native";
import { getLocales } from "expo-localization";

import { clientValidation } from "../../validation/clientValidation";
import { supabase } from "../../../lib/supabase";
import {
  Screen,
  Header,
  AppButton,
  AppText,
} from "../../components/primitives";
import { useFormData } from "../../contexts/FormContext";
import routes from "../../navigation/routes";
import { colors, fonts } from "../../config";
import ErrorMessage from "../../components/forms/ErrorMessage";
import SSOOptions from "../../components/login/SSOOptions";
import { ChevronLeft } from "lucide-react-native";
import PhoneNumberInput from "../../components/forms/PhoneNumberInput";
function SignUpScreen({ navigation }) {
  const { formData, updateFormData } = useFormData();
  const [error, setError] = useState("");
  const [isValid, setIsValid] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [inputType, setInputType] = useState(null); // 'email' or 'phone'
  const [selectedCountry, setSelectedCountry] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [countryData, setCountryData] = useState({
    code: "US",
    dial_code: "+1",
    flag: "🇺🇸",
    name: "United States",
  });

  useEffect(() => {
    const locales = getLocales();
    console.log("Locale:", locales[0].regionCode);
    setSelectedCountry(locales[0].regionCode);
  }, []);

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

  const formatPhoneNumber = (text) => {
    if (!text) return ""; // Return empty string for empty/null values

    // Remove all non-numeric characters
    const cleaned = text.replace(/\D/g, "");

    // Format as (XXX) XXX-XXXX
    if (cleaned.length >= 10) {
      const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
      if (match) {
        return `(${match[1]}) ${match[2]}-${match[3]}`;
      }
    }
    return text;
  };

  const isEmail = (text) => {
    return text.includes("@");
  };

  const validatePhone = (phone) => {
    console.log("Phone:", phone);
    if (!phone) return false; // Return false for empty/null values
    return true;
  };

  const handleInputChange = (value) => {
    setError("");

    // Determine if input is email or phone
    const isEmailInput = isEmail(value);
    setInputType(isEmailInput ? "email" : "phone");

    if (!isEmailInput) {
      // Format phone number if it's not an email
      value = formatPhoneNumber(value);
    }

    updateFormData({ identifier: value });

    // Validate based on input type
    if (isEmailInput) {
      const validationResult = clientValidation.email(value);
      if (!validationResult.success) {
        setError(validationResult.error || "Invalid email");
        setIsValid(false);
      } else {
        setIsValid(true);
      }
    } else {
      // Phone validation
      if (validatePhone(value)) {
        setIsValid(true);
      } else {
        setError("Please enter a valid phone number");
        setIsValid(false);
      }
    }
  };

  const submitIdentifier = async () => {
    if (!isValid) return;

    try {
      setIsLoading(true);
      setError("");

      const identifier = formData.identifier;

      if (inputType === "email") {
        // Final client-side validation for email
        const validationResult = clientValidation.email(identifier);
        if (!validationResult.success) {
          setError(validationResult.error || "Invalid email");
          return;
        }
        updateFormData({ email: identifier, phone: null });
      } else {
        // Phone validation
        const cleanedPhone = identifier.replace(/\D/g, "");
        if (!validatePhone(cleanedPhone)) {
          setError("Invalid phone number");
          return;
        }
        updateFormData({ phone: cleanedPhone, email: null });
      }

      Keyboard.dismiss();

      navigation.navigate(routes.SIGNUPPASSWORD);
    } catch (err) {
      console.error("Validation error:", err);
      setError("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePhoneNumberChange = useCallback(
    (value) => {
      setPhoneNumber(value || ""); // Ensure value is never undefined
      // Only update form data if we have both country code and phone number
      if (value && countryData.dial_code) {
        const formattedNumber = `${countryData.dial_code}${value}`;
        updateFormData({ identifier: formattedNumber });
      }
    },
    [countryData.dial_code, updateFormData]
  );

  const handleCountryChange = useCallback(
    (country) => {
      setCountryData(country);
      // Only update form data if we have both country code and phone number
      if (phoneNumber && country.dial_code) {
        const formattedNumber = `${country.dial_code}${phoneNumber}`;
        updateFormData({ identifier: formattedNumber });
      }
    },
    [phoneNumber, updateFormData]
  );
  return (
    <Screen style={styles.screen}>
      <View style={styles.headerContainer}>
        <ChevronLeft
          color={colors.lightGray}
          size={42}
          onPress={() => navigation.goBack()}
        />
        <Header style={styles.header}>Enter your email or phone number</Header>
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
              <PhoneNumberInput
                value={phoneNumber}
                onChangeNumber={handlePhoneNumberChange}
                onChangeCountry={handleCountryChange}
                initialCountry={countryData}
              />
              <ErrorMessage error={error} />
              <AppButton
                color="yellow"
                onPress={submitIdentifier}
                title={isLoading ? "Checking..." : "Next"}
                style={styles.next}
                disabled={!isValid || isLoading}
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

export default SignUpScreen;

/* {inputType === "email" ? (
                <TextInput
                  autoComplete={"email"}
                  autoCorrect={false}
                  autoFocus={true}
                  inputMode={"email"}
                  numberOfLines={1}
                  onChangeText={handleInputChange}
                  placeholder="Email or phone number"
                  placeholderTextColor={colors.softGray}
                  returnKeyType="done"
                  selectionColor={colors.lightGray}
                  selectionHandleColor={colors.lightGray}
                  value={formData.identifier}
                  style={[
                    styles.text,
                    {
                      fontFamily: formData.identifier
                        ? fonts.black
                        : fonts.italic,
                    },
                  ]}
                  onSubmitEditing={isValid ? submitIdentifier : undefined}
                />
              ) : */
