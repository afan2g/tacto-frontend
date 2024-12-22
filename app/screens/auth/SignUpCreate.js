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
import { supabase } from "../../../lib/supabase";

import { Screen, Header, AppButton } from "../../components/primitives";
import ErrorMessage from "../../components/forms/ErrorMessage";
import SSOOptions from "../../components/login/SSOOptions";
import { colors, fonts } from "../../config";
import { useFormData } from "../../contexts/FormContext";
import routes from "../../navigation/routes";

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

  const handleIdentifierChange = (value) => {
    setError("");
    updateFormData({ emailOrPhone: value });
  };
  const handlePasswordChange = (value) => {
    setError("");
    updateFormData({ password: value });
  };

  const verifyIdentifier = async () => {
    console.log(formData);
    Keyboard.dismiss();
    let { data, error } = {};
    if (formData.emailOrPhone.includes("@")) {
      ({ data, error } = await supabase.auth.signUp({
        email: formData.emailOrPhone,
        password: formData.password,
        options: {
          emailRedirectTo: "https://usetacto.com",
        },
      }));
    } else {
      ({ data, error } = await supabase.auth.signUp({
        phone: formData.emailOrPhone,
        password: formData.password,
      }));
    }
    if (error) {
      setError(error.message);
    } else {
      console.log("success", data);
      navigation.navigate(routes.SIGNUPVERIFY);
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
              <View style={styles.textInputContainer}>
                <TextInput
                  autoComplete="email"
                  autoCorrect={false}
                  autoFocus={true}
                  inputMode="email"
                  numberOfLines={1}
                  onChangeText={handleIdentifierChange}
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
              </View>
              <View style={styles.textInputContainer}>
                <TextInput
                  autoComplete="new-password"
                  autoCorrect={false}
                  numberOfLines={1}
                  onChangeText={handlePasswordChange}
                  placeholder="Password"
                  placeholderTextColor={colors.softGray}
                  returnKeyType="done"
                  secureTextEntry
                  selectionColor={colors.lightGray}
                  selectionHandleColor={colors.lightGray}
                  style={[
                    styles.text,
                    {
                      fontFamily: formData.password
                        ? fonts.black
                        : fonts.italic,
                    },
                  ]}
                  value={formData.password}
                />
              </View>
              <ErrorMessage error={error} />
              <AppButton
                color="yellow"
                onPress={verifyIdentifier}
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
  textInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.fadedGray,
    borderRadius: 5,
    marginTop: 10,
  },
  text: {
    color: colors.lightGray,
    fontSize: 18,
    width: "100%",
    lineHeight: 22,
    overflow: "hidden",
    paddingLeft: 10,
    textAlignVertical: "center",
    height: 40,
  },
  next: {
    marginTop: 10,
  },
});

export default SignUpCreate;
