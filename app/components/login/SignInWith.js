import React from "react";
import { View, StyleSheet, Pressable } from "react-native";
import colors from "../../config/colors";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { supabase } from "../../../lib/supabase";
import GoogleIcon from "../../assets/icons/google/android/neutral/android_neutral_rd_na.svg"
import AppleIcon from "../../assets/icons/apple/SVG/logo_black.svg";


function SignInWith() {
  const [isLoading, setIsLoading] = React.useState(false);
  const handleGoogleSignIn = async (setIsLoading) => {
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
    <View style={styles.container}>
      <Pressable
        style={styles.circle}
        onPress={() => handleGoogleSignIn(setIsLoading)}
        disabled={isLoading}
      >
        <View style={styles.iconContainer}>
          <GoogleIcon width={56} height={56} />
        </View>
      </Pressable>
      <Pressable
        style={[styles.circle]}
        onPress={() => console.log("Apple sign-in")}
        disabled={isLoading}
      >
        <View style={styles.iconContainer}>
          <AppleIcon width={72} height={72} />
        </View>
      </Pressable>
      <View style={styles.circle} />
      <View style={styles.circle} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",  // Removed the "*" typo
  },
  circle: {
    backgroundColor: "#f2f2f2",
    borderColor: colors.black,
    borderRadius: 30,
    borderWidth: 2,
    height: 60,
    width: 60,
    alignItems: "center",
    justifyContent: "center",
  },
  iconContainer: {
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    height: "100%",
  }
});

export default SignInWith;