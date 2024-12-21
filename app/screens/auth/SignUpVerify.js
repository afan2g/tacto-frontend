import React, { useEffect, useState } from "react";
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
} from "react-native";
import { ChevronLeft } from "lucide-react-native";

import {
  AppButton,
  AppText,
  ErrorMessage,
  Header,
  Screen,
} from "../../components";
import { useFormData } from "../../contexts/FormContext";
import routes from "../../navigation/routes";
import { colors, fonts } from "../../config";
import ErrorMessage from "../../components/forms/ErrorMessage";
import SSOOptions from "../../components/login/SSOOptions";
import { signUpValidationSchemas } from "../../validation/validation";

function SignUpVerify({ navigation }) {
  const { formData, updateFormData } = useFormData();
  const [error, setError] = useState("");
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

  const handleInputChange = (value) => {
    setError("");
    updateFormData({ verificationCode: value });
  };

  const handleNext = async () => {
    try {
      await signUpValidationSchemas.verify.validate({
        verificationCode: formData.verificationCode,
      });
      navigation.navigate(routes.SIGNUPFULLNAME);
    } catch (validationError) {
      setError(validationError.message);
    }
  };
  return (
    <Screen style={styles.screen}>
      <View style={styles.headerContainer}>
        <ChevronLeft
          color={colors.lightGray}
          size={42}
          onPress={() => navigation.goBack()}
        />
        <Header style={styles.header}>Verify your account</Header>
      </View>
      <AppText style={styles.grayText}>
        Enter the 6-digit verification code sent to{" "}
        <AppText style={styles.yellowText}>{formData.emailOrPhone}</AppText>
      </AppText>
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
              <ErrorMessage error={error} />
              <AppButton
                color="yellow"
                onPress={handleNext}
                title="Next"
                style={styles.next}
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
    paddingTop: 20,
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
    textAlignVertical: "bottom",
  },
  next: {
    marginTop: 10,
  },
});

export default SignUpVerify;
