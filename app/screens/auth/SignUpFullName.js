import React, { useEffect, useState, useCallback, useRef } from "react";
import { useFocusEffect } from "@react-navigation/native";
import {
  View,
  StyleSheet,
  BackHandler,
  Keyboard,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  TouchableWithoutFeedback,
  Text,
} from "react-native";
import { TextInput, useTheme } from "react-native-paper";
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
  const inputRef = useRef(null);
  const { formData, updateFormData, updateProgress } = useFormData();
  const [error, setError] = useState("");
  const [isValid, setIsValid] = useState(false);
  const theme = useTheme();
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
              <TextInput
                {...theme.formInput}
                theme={{
                  colors: {
                    onSurfaceVariant: colors.softGray,
                  },
                }}
                label={
                  <Text style={{ fontFamily: fonts.black }}>Full name</Text>
                }
                ref={inputRef}
                value={formData.fullName}
                onChangeText={handleInputChange}
                autoComplete="name"
                autoCorrect={false}
                autoFocus={true}
                returnKeyType="done"
                onSubmitEditing={isValid ? submitFullName : undefined}
                accessibilityLabel="Username input"
              />
              <ErrorMessage error={error} />
              <AppButton
                color={colors.yellow}
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
    fontSize: 20,
    width: "100%",
    overflow: "hidden",
    lineHeight: 25,
  },
  next: {
    marginTop: 10,
  },
});

export default SignUpFullName;
