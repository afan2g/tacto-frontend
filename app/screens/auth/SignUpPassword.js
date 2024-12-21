import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  TextInput,
  BackHandler,
  Keyboard,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  ScrollView,
  Platform,
} from "react-native";
import { AppButton, Screen, Header } from "../../components";
import { useFormData } from "../../contexts/FormContext";
import routes from "../../navigation/routes";
import { colors, fonts } from "../../config";
import { ErrorMessage } from "../../components/forms";
import { SSOOptions } from "../../components/login";
import { signUpValidationSchemas } from "../../validation/validation";
import { ChevronLeft } from "lucide-react-native";
function SignUpPassword({ navigation }) {
  const { formData, updateFormData } = useFormData();
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    updateFormData({ password: value });
  };

  const handleSubmit = async () => {
    try {
      setError("");
      setIsSubmitting(true);

      await signUpValidationSchemas.password.validate({
        password: formData.password,
      });

      // Simulate API call
      try {
        // await createAccount(formData);
        console.log(formData);
        navigation.navigate(routes.APP);
      } catch (apiError) {
        Alert.alert("Error", "Failed to create account. Please try again.", [
          { text: "OK" },
        ]);
      }
    } catch (validationError) {
      setError(validationError.message);
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
        />
        <Header style={styles.header}>Create a password</Header>
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
                autoComplete="new-password"
                autoCorrect={false}
                autoFocus={true}
                numberOfLines={1}
                onChangeText={handleInputChange}
                placeholder="Password"
                placeholderTextColor={colors.softGray}
                returnKeyType="done"
                secureTextEntry
                selectionColor={colors.lightGray}
                selectionHandleColor={colors.lightGray}
                style={[
                  styles.text,
                  {
                    fontFamily: formData.password ? fonts.black : fonts.italic,
                  },
                ]}
                value={formData.password}
              />
              <ErrorMessage error={error} />
              <AppButton
                color="yellow"
                onPress={handleSubmit}
                title="Create Account"
                disabled={isSubmitting}
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
  },
  next: {
    marginTop: 10,
  },
});

export default SignUpPassword;
