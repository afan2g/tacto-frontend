import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import { GoogleSignin } from "@react-native-google-signin/google-signin";

import { supabase } from "../../../lib/supabase";
import { AppButton, AppText, Screen } from "../../components/primitives";
import { colors, fonts } from "../../config";
import { OrSeparator } from "../../components/login";
import routes from "../../navigation/routes";

function LandingScreen({ navigation }) {
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      if (!userInfo.data.idToken) throw new Error("No ID token!");

      const { error } = await supabase.auth.signInWithIdToken({
        provider: "google",
        token: userInfo.data.idToken,
      });

      if (error) throw error;

      console.log("Successfully signed in with Google");
    } catch (error) {
      console.error("Google sign-in error:", error);
    } finally {
      setIsLoading(false);
      await GoogleSignin.signOut(); // Clean up Google sign in state
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
        <AppButton
          color="lightGray"
          onPress={handleGoogleSignIn}
          style={styles.button}
          title={isLoading ? "Loading..." : "Continue With Google"}
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
