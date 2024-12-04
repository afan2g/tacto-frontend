import React, { useRef } from "react";
import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";
import * as Yup from "yup";

import Header from "../../components/Header";
import Screen from "../../components/Screen";
import AppForm from "../../components/AppForm";
import AppFormField from "../../components/AppFormField";
import SubmitButton from "../../components/SubmitButton";
import OrSeparator from "../../components/OrSeparator";
import SignInWith from "../../components/SignInWith";
import AppText from "../../components/AppText";
import colors from "../../config/colors";
import fonts from "../../config/fonts";
import routes from "../../navigation/routes";

const validationSchema = Yup.object().shape({
  emailOrPhone: Yup.string()
    .required("Email / Phone is required")
    .test("email_or_phone", "Email / Phone is invalid", (value) => {
      return validateEmail(value) || validatePhone(parseInt(value ?? "0"));
    }),
  password: Yup.string().required(),
});

const validateEmail = (email) => {
  return Yup.string().email().isValidSync(email);
};

const validatePhone = (phone) => {
  return Yup.number()
    .integer()
    .positive()
    .test((phone) => {
      return phone &&
        phone.toString().length >= 8 &&
        phone.toString().length <= 14
        ? true
        : false;
    })
    .isValidSync(phone);
};

function SignUpScreen({ navigation }) {
  const passwordRef = useRef();
  const handleSubmit = (values) => {
    console.log(values);
  };

  return (
    <Screen style={styles.screen}>
      <View style={styles.header}>
        <Header style={styles.header}>Sign Up</Header>
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
              <AppForm
                initialValues={{ emailOrPhone: "", password: "" }}
                onSubmit={handleSubmit}
                validationSchema={validationSchema}
              >
                <AppFormField
                  autoComplete="off"
                  autoCorrect={false}
                  name="emailOrPhone"
                  onSubmitEditing={() => passwordRef.current?.focus()}
                  placeholder="Email or phone #"
                  returnKeyType="next"
                />
                <AppFormField
                  autoComplete="off"
                  autoCorrect={false}
                  name="password"
                  placeholder="Password"
                  ref={passwordRef}
                  returnKeyType="done"
                  secureTextEntry
                  textContentType="password"
                />
                <View style={styles.button}>
                  <SubmitButton name="Sign up" color="yellow" />
                </View>
              </AppForm>
              <OrSeparator />
              <SignInWith />
              <View style={styles.logInContainer}>
                <AppText style={styles.gray}>Already have an account? </AppText>
                <AppText
                  style={styles.yellow}
                  onPress={() => navigation.navigate(routes.LOGIN)}
                >
                  Log in
                </AppText>
              </View>
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
    marginHorizontal: 20,
  },
  content: {
    flex: 1,
    justifyContent: "flex-end",
    paddingBottom: Platform.OS === "ios" ? 20 : 40,
    paddingHorizontal: 20,
  },
  button: {
    paddingTop: 20,
  },
  logInContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 40,
  },
  gray: {
    color: colors.gray,
    fontFamily: fonts.light,
    fontSize: 16,
  },
  yellow: {
    color: colors.yellow,
    fontFamily: fonts.bold,
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default SignUpScreen;
