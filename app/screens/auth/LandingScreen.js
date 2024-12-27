import React, { useState } from "react";
import { View, StyleSheet, Platform } from "react-native";
import {
  GoogleSignin,
  GoogleSigninButton,
  statusCodes,
} from "@react-native-google-signin/google-signin";

import { supabase } from "../../../lib/supabase";
import { AppButton, AppText, Screen } from "../../components/primitives";
import { colors, fonts } from "../../config";
import { OrSeparator } from "../../components/login";
import routes from "../../navigation/routes";
function LandingScreen({ navigation }) {
  const [isLoading, setIsLoading] = React.useState(false);

  const handleGoogleSignIn = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      if (!userInfo.data.idToken) throw new Error("No ID token!");

      // Step 1: Sign in with Google
      const { data, error } = await supabase.auth.signInWithIdToken({
        provider: "google",
        token: userInfo.data.idToken,
      });

      if (error) throw error;

      // Step 2: Now update user_metadata (or the profiles table directly)
      const { user } = data;
      if (user) {
        const metaData = {
          first_name: userInfo.data.user.givenName,
          last_name: userInfo.data.user.familyName,
        };
        // If you want to store in user_metadata:
        await supabase.auth.updateUser({ data: metaData });

        // Or if you want to store directly in "profiles" after the trigger
        // (We assume the trigger inserted a row with empty strings for first/last name.)
        await supabase
          .from("profiles")
          .update({
            first_name: userInfo.data.user.givenName,
            last_name: userInfo.data.user.familyName,
          })
          .eq("id", user.id);
      }

      console.log("Successfully signed in with Google");
    } catch (error) {
      // handle error
      console.log("Google sign-in error:", error);
    }
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
