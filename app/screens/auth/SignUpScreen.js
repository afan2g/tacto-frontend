import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  StyleSheet,
  BackHandler,
  Keyboard,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  TouchableWithoutFeedback,
  TouchableOpacity,
  Text,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { isValidPhoneNumber, parsePhoneNumber } from "libphonenumber-js/mobile";
import { TextInput, useTheme } from "react-native-paper";

import {
  Screen,
  Header,
  AppButton,
  AppText,
} from "../../components/primitives";
import { useFormData } from "../../contexts/FormContext";
import ErrorMessage from "../../components/forms/ErrorMessage";
import SSOOptions from "../../components/login/SSOOptions";
import { ChevronLeft, Mail, Phone } from "lucide-react-native";
import AppPhoneInput from "../../components/forms/AppPhoneInput";
import { countryLookup } from "../../../lib/countryData";
import ProgressBar from "../../components/ProgressBar";
import routes from "../../navigation/routes";
import { colors, fonts } from "../../config";

const SignUpScreen = ({ navigation, route }) => {
  const { formData, updateFormData, updateProgress } = useFormData();
  const [formState, setFormState] = useState({
    isEmail: true,
    error: "",
    isValid: false,
    isLoading: false,
    phoneNumber: "",
    country: countryLookup["US"],
  });
  const theme = useTheme();

  // Handle back navigation
  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      () => {
        navigation.goBack();
        return true;
      }
    );
    return () => backHandler.remove();
  }, []);

  // Track progress
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

  // Validate input based on type
  const validateInput = (value, isEmailType = formState.isEmail) => {
    if (!value) {
      return { isValid: false, error: "This field is required" };
    }

    if (isEmailType) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return {
        isValid: emailRegex.test(value),
        error: emailRegex.test(value) ? "" : "Invalid email format",
      };
    }

    try {
      const isValid = isValidPhoneNumber(value, formState.country.code);
      return {
        isValid,
        error: isValid ? "" : "Please enter a valid phone number",
      };
    } catch {
      return {
        isValid: false,
        error: "Invalid phone number format",
      };
    }
  };

  // Handle input type toggle
  const toggleInputType = (isEmail) => {
    if (isEmail === formState.isEmail) return;

    setFormState((prev) => ({
      ...prev,
      isEmail,
      error: "",
      isValid: false,
    }));
    updateFormData({
      identifier: "",
      email: null,
      phone: null,
    });
  };

  // Handle input changes
  const handleInputChange = (value) => {
    const input = formState.isEmail ? value.trim() : value;
    const validation = validateInput(input);

    setFormState((prev) => ({
      ...prev,
      error: validation.error,
      isValid: validation.isValid,
    }));

    if (formState.isEmail) {
      updateFormData({ identifier: input });
    } else {
      setFormState((prev) => ({ ...prev, phoneNumber: value }));
      updateFormData({ identifier: value });
    }
  };

  // Handle form submission
  const handleSubmit = async () => {
    if (!formState.isValid) return;

    try {
      setFormState((prev) => ({ ...prev, isLoading: true, error: "" }));

      if (formState.isEmail) {
        updateFormData({
          email: formData.identifier.toLowerCase(),
          phone: null,
        });
      } else {
        const cleanedPhone = parsePhoneNumber(
          formState.phoneNumber,
          formState.country.code
        ).format("E.164");
        updateFormData({
          phone: cleanedPhone,
          email: null,
        });
      }

      navigation.navigate(routes.SIGNUPPASSWORD);
    } catch (err) {
      setFormState((prev) => ({
        ...prev,
        error: "An error occurred. Please try again.",
      }));
    } finally {
      setFormState((prev) => ({ ...prev, isLoading: false }));
    }
  };

  const InputTypeButton = ({ isEmail, icon: Icon }) => (
    <TouchableOpacity
      style={[
        styles.inputTypeButton,
        formState.isEmail === isEmail && styles.inputTypeButtonSelected,
      ]}
      onPress={() => toggleInputType(isEmail)}
    >
      <Icon
        size={24}
        color={formState.isEmail === isEmail ? colors.yellow : colors.lightGray}
      />
      <AppText
        style={[
          styles.inputTypeText,
          formState.isEmail === isEmail && styles.inputTypeTextSelected,
        ]}
      >
        {isEmail ? "Email" : "Phone"}
      </AppText>
    </TouchableOpacity>
  );

  return (
    <Screen style={styles.screen}>
      <View style={styles.headerContainer}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <ChevronLeft color={colors.lightGray} size={42} />
        </TouchableOpacity>
        <Header style={styles.header}>
          Enter your {formState.isEmail ? "email" : "phone number"}
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
                <InputTypeButton isEmail={true} icon={Mail} />
                <InputTypeButton isEmail={false} icon={Phone} />
              </View>

              {formState.isEmail ? (
                <TextInput
                  {...theme.formInput}
                  theme={{
                    colors: {
                      onSurfaceVariant: colors.softGray,
                    },
                  }}
                  label={<Text style={{ fontFamily: fonts.bold }}>Email</Text>}
                  autoComplete="email"
                  autoCorrect={false}
                  autoFocus
                  value={formData.identifier}
                  onChangeText={handleInputChange}
                  onSubmitEditing={formState.isValid ? handleSubmit : undefined}
                />
              ) : (
                <AppPhoneInput
                  onChangeNumber={handleInputChange}
                  onChangeCountry={(country) =>
                    setFormState((prev) => ({ ...prev, country }))
                  }
                  initialCountry={formState.country}
                  value={formState.phoneNumber}
                />
              )}

              <ErrorMessage
                error={formState.error}
                visible={!!formState.error}
              />

              <AppButton
                color={colors.yellow}
                onPress={handleSubmit}
                title={formState.isLoading ? "Checking..." : "Next"}
                style={styles.next}
                disabled={!formState.isValid || formState.isLoading}
                loading={formState.isLoading}
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
};

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
