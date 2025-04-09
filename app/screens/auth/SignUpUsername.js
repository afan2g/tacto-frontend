import React, {
  useEffect,
  useState,
  useCallback,
  useRef,
  useLayoutEffect,
} from "react";
import { useFocusEffect } from "@react-navigation/native";
import {
  View,
  StyleSheet,
  BackHandler,
  Keyboard,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  ScrollView,
  Platform,
  Text,
} from "react-native";
import { ChevronLeft } from "lucide-react-native";
import debounce from "lodash.debounce";
import { TextInput, useTheme } from "react-native-paper";
import { supabase } from "../../../lib/supabase";
import { ErrorMessage } from "../../components/forms";
import { SSOOptions } from "../../components/login";
import { AppButton, Header, Screen } from "../../components/primitives";
import { useFormData } from "../../contexts/FormContext";
import { colors, fonts } from "../../config";
import routes from "../../navigation/routes";
import { clientValidation } from "../../validation/clientValidation";
import ProgressBar from "../../components/ProgressBar";
function SignUpUsername({ navigation, route }) {
  const { formData, updateFormData, updateProgress } = useFormData();
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isValid, setIsValid] = useState(false);
  const theme = useTheme();
  // Handle hardware back press
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
    updateFormData({
      progress: 0,
      prevProgress: 0,
      username: "",
      fullName: "",
      email: "",
      password: "",
      identifier: null,
    });
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

  // Server-side validation
  const validateUsernameServer = async (username) => {
    try {
      const { data, error: rpcError } = await supabase.rpc(
        "validate_username",
        {
          username_input: username,
        }
      );
      if (rpcError) throw rpcError;
      return {
        success: data.valid === true,
        error: data.error || null,
      };
    } catch (err) {
      console.error("Server validation error:", err);
      return {
        success: false,
        error: err.message || "Failed to validate username",
      };
    }
  };

  // Debounced client-side validation
  const debouncedClientValidation = useCallback(
    debounce((value) => {
      const validationResult = clientValidation.username(value);
      setIsValid(validationResult.success);
      setError(validationResult.success ? "" : validationResult.error);
    }, 300),
    []
  );

  // Cleanup debounce on unmount
  useEffect(() => {
    return () => {
      debouncedClientValidation.cancel();
    };
  }, [debouncedClientValidation]);

  // Handle input change and update validation
  const handleInputChange = (value) => {
    const trimmedValue = value.trim().toLowerCase();
    updateFormData({ username: trimmedValue });
    if (!trimmedValue) {
      setError("");
      setIsValid(false);
      return;
    }
    debouncedClientValidation(trimmedValue);
  };

  // Final submission with server-side validation
  const handleUsernameSubmit = async () => {
    setIsLoading(true);
    try {
      const serverValidation = await validateUsernameServer(formData.username);
      if (!serverValidation.success) {
        setError(serverValidation.error);
        setIsValid(false);
        return;
      }
      navigation.navigate(routes.SIGNUPFULLNAME);
    } catch (err) {
      setError("Failed to validate username. Please try again.");
      setIsValid(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Screen style={styles.screen}>
      <View style={styles.headerContainer}>
        <ChevronLeft color={colors.lightGray} size={42} onPress={handleBack} />
        <Header style={styles.header}>Choose a username</Header>
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
                label={<Text style={{ fontFamily: fonts.bold }}>Username</Text>}
                accessibilityLabel="Username input"
                autoComplete="username"
                autoCorrect={false}
                autoFocus={true}
                onChangeText={handleInputChange}
                onSubmitEditing={
                  isValid && !isLoading ? handleUsernameSubmit : undefined
                }
                returnKeyType="done"
                value={formData.username}
              />
              <ErrorMessage error={error} />
              <AppButton
                color={colors.yellow}
                onPress={handleUsernameSubmit}
                title={isLoading ? "Checking..." : "Next"}
                loading={isLoading}
                style={styles.next}
                disabled={
                  isLoading || !isValid || !!error || !formData.username
                }
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
    paddingHorizontal: 15,
    width: "100%",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    backgroundColor: colors.blueGray.shade10,
    borderRadius: 5,
    paddingHorizontal: 10,
    borderWidth: 2,
    borderColor: colors.fadedGray,
  },
  text: {
    fontFamily: fonts.black,
    backgroundColor: colors.blueGray.shade10,
  },
  next: {
    marginTop: 10,
  },
});

export default SignUpUsername;
