import React, { useEffect, useState } from "react";
import { View, StyleSheet, Text } from "react-native";
import { Screen, AppButton } from "../../components/primitives";
import { colors } from "../../config";
import { supabase } from "../../../lib/supabase";
import AppAvatar from "../../components/AppAvatar";
import { NotificationManager } from "../../lib/NotificationManager";
import { useAuthContext } from "../../contexts";

function SignUpComplete({ navigation }) {
  const [isLoading, setIsLoading] = useState(false);
  const [profile, setProfile] = useState(null);
  const [userId, setUserId] = useState(null);
  const { session, setNeedsWallet } = useAuthContext();
  useEffect(() => {
    checkProfile();
  }, []);

  const checkProfile = async () => {
    try {
      if (!session?.user) return;

      setUserId(session.user.id);

      const { data: profileData } = await supabase
        .from("profiles")
        .select("avatar_url, full_name, id")
        .eq("id", session.user.id)
        .single();

      if (!profileData) return;

      setProfile({
        ...profileData,
      });

      // Register for push notifications after profile check
      await registerForPushNotifications(session.user.id);
    } catch (error) {
      console.error("Profile check error:", error);
    }
  };

  async function registerForPushNotifications(userId) {
    try {
      const token = await NotificationManager.registerForPushNotifications(
        userId
      );
      console.log("Expo Push Token:", token.data);
    } catch (error) {
      console.error("Error registering for push notifications:", error);
    }
  }

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      if (!userId) {
        const {
          data: { session },
        } = await supabase.auth.getSession();
        if (!session?.user?.id) throw new Error("No authenticated user");
        setUserId(session.user.id);
      }

      // Update onboarding status
      const { error: profileError } = await supabase
        .from("profiles")
        .update({ onboarding_complete: true })
        .eq("id", userId);

      if (profileError) throw profileError;
      setNeedsWallet(false);
    } catch (error) {
      console.error("Error in handleSubmit:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Screen style={styles.container}>
      <View style={styles.avatarContainer}>
        {profile && <AppAvatar user={profile} scale={1.5} />}
      </View>

      <Text style={styles.text}>Sign Up Complete</Text>

      <AppButton
        color={colors.yellow}
        onPress={handleSubmit}
        title={isLoading ? "Loading..." : "Go to App"}
        disabled={isLoading}
        loading={isLoading}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
  },
  avatarContainer: {
    marginBottom: 20,
  },
  text: {
    fontSize: 20,
    color: colors.lightGray,
    marginBottom: 20,
  },
  refreshButton: {
    marginBottom: 20,
  },
});

export default SignUpComplete;
