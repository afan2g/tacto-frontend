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
  Button,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { isValidPhoneNumber, parsePhoneNumber } from "libphonenumber-js/mobile";
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
import AppPhoneInput from "../../components/forms/AppPhoneInput";
import { countryLookup } from "../../../lib/countryData";
import ProgressBar from "../../components/ProgressBar";
function SignUpScreen({ navigation, route }) {
  const { formData, updateFormData, updateProgress } = useFormData();
  const [error, setError] = useState("");
  const [isValid, setIsValid] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [inputType, setInputType] = useState("email"); // Default to email
  const [phoneNumber, setPhoneNumber] = useState("");
  const [country, setCountry] = useState(countryLookup["US"]);
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
  const validateInput = useCallback(() => {
    if (!formData.identifier) {
      setError("This field is required");
      setIsValid(false);
      return;
    }

    if (inputType === "email") {
      const validationResult = clientValidation.email(formData.identifier);
      if (!validationResult.success) {
        setError(validationResult.error || "Invalid email format");
        setIsValid(false);
      } else {
        setError("");
        setIsValid(true);
      }
    } else {
      try {
        if (!isValidPhoneNumber(phoneNumber, country.code)) {
          setError("Please enter a valid phone number");
          setIsValid(false);
        } else {
          setError("");
          setIsValid(true);
        }
      } catch (err) {
        setError("Invalid phone number format");
        setIsValid(false);
      }
    }
  }, [formData.identifier, inputType, phoneNumber, country.code]);

  useEffect(() => {
    validateInput();
  }, [formData.identifier, phoneNumber, country, validateInput]);

  const handleInputTypeChange = () => {
    setError("");
    setIsValid(false);
    if (inputType === "email") {
      setInputType("phone");
      updateFormData({ identifier: "", email: null });
    } else {
      setInputType("email");
      updateFormData({ identifier: "", phone: null });
    }
  };

  const handleEmailChange = (value) => {
    setError("");
    updateFormData({ identifier: value.trim() });
  };

  const handlePhoneNumberChange = useCallback(
    (value) => {
      setPhoneNumber(value || "");
      updateFormData({ identifier: value });
    },
    [updateFormData]
  );

  const handleCountryChange = useCallback(
    (newCountry) => {
      setCountry(newCountry);
      // Reset phone validation when country changes
      validateInput();
    },
    [validateInput]
  );

  const handleSubmit = async () => {
    if (!isValid) return;

    try {
      setIsLoading(true);
      setError("");

      const identifier = formData.identifier;

      if (inputType === "email") {
        // Final validation check before submission
        const validationResult = clientValidation.email(identifier);
        if (!validationResult.success) {
          setError(validationResult.error || "Invalid email");
          return;
        }
        updateFormData({ email: identifier.toLowerCase(), phone: null });
      } else {
        // Phone validation before submission
        try {
          if (!isValidPhoneNumber(phoneNumber, country.code)) {
            setError("Invalid phone number");
            return;
          }
          const cleanedPhone = parsePhoneNumber(
            phoneNumber,
            country.code
          ).format("E.164");
          updateFormData({ phone: cleanedPhone, email: null });
        } catch (err) {
          setError("Invalid phone number format");
          return;
        }
      }

      Keyboard.dismiss();
      navigation.navigate(routes.SIGNUPPASSWORD);
    } catch (err) {
      console.error("Submission error:", err);
      setError("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Screen style={styles.screen}>
      <View style={styles.headerContainer}>
        <ChevronLeft color={colors.lightGray} size={42} onPress={handleBack} />
        <Header style={styles.header}>
          Enter your {inputType === "email" ? "email" : "phone number"}
        </Header>
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
              <Button
                title={`Switch to ${inputType === "email" ? "phone" : "email"}`}
                onPress={handleInputTypeChange}
              />
              {inputType === "phone" ? (
                <AppPhoneInput
                  onChangeNumber={handlePhoneNumberChange}
                  onChangeCountry={handleCountryChange}
                  initialCountry={country}
                  value={phoneNumber}
                />
              ) : (
                <View style={styles.keyboardView}>
                  <TextInput
                    autoComplete="email"
                    autoCorrect={false}
                    autoFocus={true}
                    inputMode="email"
                    numberOfLines={1}
                    onChangeText={handleEmailChange}
                    placeholder="Email"
                    placeholderTextColor={colors.softGray}
                    returnKeyType="done"
                    selectionColor={colors.lightGray}
                    value={formData.identifier}
                    style={[
                      styles.text,
                      {
                        fontFamily: formData.identifier
                          ? fonts.black
                          : fonts.italic,
                      },
                    ]}
                    onSubmitEditing={isValid ? handleSubmit : undefined}
                  />
                </View>
              )}
              <ProgressBar />
              <ErrorMessage error={error} visible={!!error} />

              <AppButton
                color="yellow"
                onPress={handleSubmit}
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
    backgroundColor: colors.blue,
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
    paddingBottom: 5,
    marginTop: 10,
  },
  header: {
    paddingLeft: 5,
  },
  progressContainer: {
    borderTopWidth: 2,
    borderTopColor: colors.fadedGray,
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
