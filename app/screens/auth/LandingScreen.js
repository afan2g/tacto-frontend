import React, { useState } from "react";
import { View, StyleSheet, Platform } from "react-native";
import {
  GoogleSignIn,
  GoogleSigninButton,
  statusCodes,
} from "@react-native-google-signin/google-signin";

import { AppButton, AppText, Screen } from "../../components/primitives";
import { colors, fonts } from "../../config";
import { OrSeparator } from "../../components/login";
import routes from "../../navigation/routes";
function LandingScreen({ navigation }) {
  const [isLoading, setIsLoading] = React.useState(false);
  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    console.log("google");
    if (Platform.OS === "android") {
      // Android
      console.log("android");
      GoogleSignIn.configure({
        webClientId: "autoDetect",
      });
      try {
        await GoogleSignIn.hasPlayServices();
        const userInfo = await GoogleSignIn.signIn();
        console.log("userInfo", userInfo);
      } catch (error) {
        if (error.code === statusCodes.SIGN_IN_CANCELLED) {
          // user cancelled the login flow
          console.log("cancelled");
        } else if (error.code === statusCodes.IN_PROGRESS) {
          console.log("in progress");
          // operation (e.g. sign in) is in progress already
        } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
          console.log("play services not available or outdated");
          // play services not available or outdated
        } else {
          console.log("error", error);
          // some other error happened
        }
      }
    } else {
      // iOS
      console.log("ios");
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
      });
      console.log("data", data);
      console.log("error", error);

      if (error) {
        console.log("error", error);
      }
    }
    setIsLoading(false);
  };
  return (
    <Screen style={styles.screen}>
      <View style={styles.headerContainer}>
        <AppText style={styles.heading}>tacto</AppText>
        <AppText style={styles.subHeading}>Banking reclaimed.</AppText>
      </View>
      <View style={styles.buttonContainer}>
        <AppButton
          color="yellow"
          onPress={() => navigation.navigate(routes.SIGNUPCREATE)}
          style={styles.button}
          title="Sign up"
        />
        <AppButton
          color="lightGray"
          onPress={() => navigation.navigate(routes.LOGIN)}
          style={styles.button}
          title="Log in"
        />
        <OrSeparator />
        {/* <AppButton
          color="lightGray"
          onPress={handleGoogleSignIn}
          style={styles.button}
          title="Continue With Google"
        /> */}
        <GoogleSigninButton
          style={styles.button}
          size={GoogleSigninButton.Size.Wide}
          color={GoogleSigninButton.Color.Dark}
          onPress={handleGoogleSignIn}
          disabled={isLoading}
        />
        <AppButton
          color="lightGray"
          onPress={() => console.log("apple")}
          style={styles.button}
          title="Continue With Apple"
        />
        <AppButton
          color="lightGray"
          onPress={() => console.log("meta")}
          style={styles.button}
          title="Continue With Meta"
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  screen: {
    justifyContent: "space-between",
  },
  headerContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: 40,
  },
  heading: {
    color: colors.lightGray,
    fontFamily: fonts.bold,
    fontSize: 48,
    textAlign: "center",
    paddingVertical: 10,
  },
  subHeading: {
    color: colors.lightGray,
    fontFamily: fonts.light,
    fontSize: 24,
    textAlign: "center",
  },
  buttonContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingBottom: 40,
  },
  button: {
    marginVertical: 5,
  },
});

export default LandingScreen;
