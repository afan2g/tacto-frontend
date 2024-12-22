// SignUpUsername.js
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
import { ChevronLeft } from "lucide-react-native";

import { ErrorMessage } from "../../components/forms";
import { SSOOptions } from "../../components/login";
import { AppButton, Header, Screen } from "../../components/primitives";
import { useFormData } from "../../contexts/FormContext";
import { colors, fonts } from "../../config";
import routes from "../../navigation/routes";

function SignUpUsername({ navigation }) {
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
    updateFormData({ username: value });
  };

  // const handleNext = async () => {
  //   try {
  //     await signUpValidationSchemas.username.validate({
  //       username: formData.username,
  //     });
  //     navigation.navigate(routes.SIGNUPPASSWORD);
  //   } catch (validationError) {
  //     setError(validationError.message);
  //   }
  // };

  const handleUsernameSubmit = async () => {
    console.log(formData);
    Keyboard.dismiss();
    //call edge function to check if username is available
    navigation.navigate(routes.SIGNUPFULLNAME);
  };

  return (
    <Screen style={styles.screen}>
      <View style={styles.headerContainer}>
        <Header style={styles.header}>Choose a username</Header>
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
                autoComplete="username"
                autoCorrect={false}
                autoFocus={true}
                onChangeText={handleInputChange}
                numberOfLines={1}
                placeholder="Username"
                placeholderTextColor={colors.softGray}
                returnKeyType="done"
                selectionColor={colors.lightGray}
                selectionHandleColor={colors.lightGray}
                style={[
                  styles.text,
                  {
                    fontFamily: formData.username ? fonts.black : fonts.italic,
                  },
                ]}
                value={formData.username}
              />
              <ErrorMessage error={error} />
              <AppButton
                color="yellow"
                onPress={handleUsernameSubmit}
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

export default SignUpUsername;
