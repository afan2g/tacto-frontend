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
  TouchableOpacity,
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
import { ChevronLeft, Mail, Phone } from "lucide-react-native";
import AppPhoneInput from "../../components/forms/AppPhoneInput";
import { countryLookup } from "../../../lib/countryData";
import ProgressBar from "../../components/ProgressBar";

const INPUT_TYPES = {
  EMAIL: "email",
  PHONE: "phone",
};

function SignUpScreen({ navigation, route }) {
  const { formData, updateFormData, updateProgress } = useFormData();
  const [error, setError] = useState("");
  const [isValid, setIsValid] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [inputType, setInputType] = useState(INPUT_TYPES.EMAIL);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [country, setCountry] = useState(countryLookup["US"]);

  // Back handler setup
  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      handleBack
    );
    return () => backHandler.remove();
  }, []);

  // Progress tracking
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
    return true;
  };

  const validateInput = useCallback(() => {
    if (!formData.identifier) {
      setError("This field is required");
      setIsValid(false);
      return;
    }

    if (inputType === INPUT_TYPES.EMAIL) {
      const validationResult = clientValidation.email(formData.identifier);
      setError(
        validationResult.success
          ? ""
          : validationResult.error || "Invalid email format"
      );
      setIsValid(validationResult.success);
    } else {
      try {
        const isValid = isValidPhoneNumber(phoneNumber, country.code);
        setError(isValid ? "" : "Please enter a valid phone number");
        setIsValid(isValid);
      } catch (err) {
        setError("Invalid phone number format");
        setIsValid(false);
      }
    }
  }, [formData.identifier, inputType, phoneNumber, country.code]);

  useEffect(() => {
    validateInput();
  }, [formData.identifier, phoneNumber, country, validateInput]);

  const handleInputTypeChange = (newType) => {
    if (newType === inputType) return;

    setError("");
    setIsValid(false);
    setInputType(newType);
    updateFormData({
      identifier: "",
      email: null,
      phone: null,
    });
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

      if (inputType === INPUT_TYPES.EMAIL) {
        const validationResult = clientValidation.email(identifier);
        if (!validationResult.success) {
          setError(validationResult.error || "Invalid email");
          return;
        }
        updateFormData({ email: identifier.toLowerCase(), phone: null });
      } else {
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

      navigation.navigate(routes.SIGNUPPASSWORD);
    } catch (err) {
      console.error("Submission error:", err);
      setError("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const InputTypeButton = ({ type, icon: Icon, isSelected }) => (
    <TouchableOpacity
      style={[
        styles.inputTypeButton,
        isSelected && styles.inputTypeButtonSelected,
      ]}
      onPress={() => handleInputTypeChange(type)}
    >
      <Icon size={24} color={isSelected ? colors.yellow : colors.lightGray} />
      <AppText
        style={[
          styles.inputTypeText,
          isSelected && styles.inputTypeTextSelected,
        ]}
      >
        {type === INPUT_TYPES.EMAIL ? "Email" : "Phone"}
      </AppText>
    </TouchableOpacity>
  );

  return (
    <Screen style={styles.screen}>
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <ChevronLeft color={colors.lightGray} size={42} />
        </TouchableOpacity>
        <Header style={styles.header}>
          Enter your{" "}
          {inputType === INPUT_TYPES.EMAIL ? "email" : "phone number"}
        </Header>
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
            <View style={styles.content}>
              <View style={styles.inputTypeContainer}>
                <InputTypeButton
                  type={INPUT_TYPES.EMAIL}
                  icon={Mail}
                  isSelected={inputType === INPUT_TYPES.EMAIL}
                />
                <InputTypeButton
                  type={INPUT_TYPES.PHONE}
                  icon={Phone}
                  isSelected={inputType === INPUT_TYPES.PHONE}
                />
              </View>

              {inputType === INPUT_TYPES.PHONE ? (
                <AppPhoneInput
                  onChangeNumber={handlePhoneNumberChange}
                  onChangeCountry={handleCountryChange}
                  initialCountry={country}
                  value={phoneNumber}
                />
              ) : (
                <View style={styles.inputContainer}>
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

  keyboardView: {
    flex: 1,
    backgroundColor: colors.blue,
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
  inputTypeContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  inputTypeButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: 8,
    backgroundColor: colors.blueShade10,
    flex: 0.48,
    justifyContent: "center",
  },
  inputTypeButtonSelected: {
    backgroundColor: colors.blueShade20,
    borderWidth: 1,
    borderColor: colors.yellow,
  },
  inputTypeText: {
    marginLeft: 8,
    color: colors.lightGray,
    fontSize: 16,
  },
  inputTypeTextSelected: {
    color: colors.yellow,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    backgroundColor: colors.blueShade10,
    borderRadius: 5,
    paddingHorizontal: 10,
    borderWidth: 2,
    borderColor: colors.fadedGray,
  },
  text: {
    color: colors.lightGray,
    fontSize: 20,
    width: "100%",
    overflow: "hidden",
    lineHeight: 25,
  },
  next: {
    marginTop: 10,
  },
});

export default SignUpScreen;
