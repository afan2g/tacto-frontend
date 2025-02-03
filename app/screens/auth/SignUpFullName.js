import React, { useEffect, useState, useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
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
import { clientValidation } from "../../validation/clientValidation"; // Add this import

import parseFullName from "../../utils/parseFullName";
import { Screen, Header, AppButton } from "../../components/primitives";
import { useFormData } from "../../contexts/FormContext";
import routes from "../../navigation/routes";
import { colors, fonts } from "../../config";
import ErrorMessage from "../../components/forms/ErrorMessage";
import SSOOptions from "../../components/login/SSOOptions";
import { ChevronLeft } from "lucide-react-native";
import ProgressBar from "../../components/ProgressBar";

function SignUpFullName({ navigation, route }) {
  const { formData, updateFormData, updateProgress } = useFormData();
  const [error, setError] = useState("");
  const [isValid, setIsValid] = useState(false);
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

  const handleBack = () => {
    navigation.goBack();
  };

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

  const handleInputChange = (value) => {
    setError("");
    updateFormData({ fullName: value });

    // Client-side validation
    const validationResult = clientValidation.fullName(value);
    if (!validationResult.success) {
      setError(validationResult.error || "Invalid name");
      setIsValid(false);
    } else {
      setIsValid(true);
    }
  };

  const submitFullName = () => {
    Keyboard.dismiss();
    const validationResult = clientValidation.fullName(formData.fullName);
    if (!validationResult.success) {
      setError(validationResult.error || "Invalid name");
      return;
    }
    const parsedName = parseFullName(formData.fullName);
    console.log("Parsed first name:", parsedName.first_name);
    console.log("Parsed last name:", parsedName.last_name);
    const updatedFormData = {
      ...formData,
      firstName: parsedName.first_name,
      lastName: parsedName.last_name,
    };
    updateFormData(updatedFormData);
    console.log("Form data with parsed names:", updatedFormData);

    navigation.navigate(routes.SIGNUPIDENTIFIER);
  };

  return (
    <Screen style={styles.screen}>
      <View style={styles.headerContainer}>
        <ChevronLeft color={colors.lightGray} size={42} onPress={handleBack} />
        <Header style={styles.header}>What's your name?</Header>
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
              <TextInput
                autoComplete="name"
                autoCorrect={false}
                autoFocus={true}
                numberOfLines={1}
                onChangeText={handleInputChange}
                placeholder="Full name"
                placeholderTextColor={colors.softGray}
                returnKeyType="done"
                selectionColor={colors.lightGray}
                selectionHandleColor={colors.lightGray}
                style={[
                  styles.text,
                  {
                    fontFamily: formData.fullName ? fonts.black : fonts.italic,
                  },
                ]}
                value={formData.fullName}
                onSubmitEditing={isValid ? submitFullName : undefined}
              />
              <ProgressBar />

              <ErrorMessage error={error} />
              <AppButton
                color="yellow"
                onPress={submitFullName}
                title="Next"
                style={styles.next}
                disabled={!isValid || Boolean(error)}
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
    paddingBottom: 5,
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

export default SignUpFullName;
