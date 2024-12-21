import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  TextInput,
  BackHandler,
  Keyboard,
  KeyboardAvoidingView,
  ScrollView,
  TouchableWithoutFeedback,
  Platform,
} from "react-native";

import { Screen, Header, AppButton } from "../../components/primitives";
import ErrorMessage from "../../components/forms/ErrorMessage";
import SSOOptions from "../../components/login/SSOOptions";
import { colors, fonts } from "../../config";
import { useFormData } from "../../contexts/FormContext";
import routes from "../../navigation/routes";
import { signUpValidationSchemas } from "../../validation/validation";

function SignUpCreate({ navigation }) {
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
    updateFormData({ emailOrPhone: value });
  };

  const handleNext = async () => {
    try {
      await signUpValidationSchemas.create.validate({
        emailOrPhone: formData.emailOrPhone,
      });
      //check if email/phone is already registered; TC
      navigation.navigate(routes.SIGNUPVERIFY);
    } catch (validationError) {
      setError(validationError.message);
    }
  };
  return (
    <Screen style={styles.screen}>
      <Header style={styles.header}>Create an account</Header>

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
                autoComplete="email"
                autoCorrect={false}
                autoFocus={true}
                inputMode="email"
                numberOfLines={1}
                onChangeText={handleInputChange}
                placeholder="Email or phone #"
                placeholderTextColor={colors.softGray}
                returnKeyType="done"
                selectionColor={colors.lightGray}
                selectionHandleColor={colors.lightGray}
                value={formData.emailOrPhone}
                style={[
                  styles.text,
                  {
                    fontFamily: formData.emailOrPhone
                      ? fonts.black
                      : fonts.italic,
                  },
                ]}
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
  keyboardView: {
    flex: 1,
  },
  scrollView: {
    flexGrow: 1,
    justifyContent: "space-between",
    paddingTop: 20,
  },
  header: {
    paddingHorizontal: 20,
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

export default SignUpCreate;
