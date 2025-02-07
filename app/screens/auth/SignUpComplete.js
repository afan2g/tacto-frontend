import React, { useEffect, useState } from "react";
import { View, StyleSheet, Text } from "react-native";
import { Screen, AppButton } from "../../components/primitives";
import { colors } from "../../config";
import { supabase } from "../../../lib/supabase";
import AppAvatar from "../../components/AppAvatar";
import { ethers } from "ethers";

function SignUpComplete({ navigation }) {
  const [isLoading, setIsLoading] = useState(false);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    checkProfile();
  }, []);

  const checkProfile = async () => {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session?.user) return;

      const { data: profileData } = await supabase
        .from("profiles")
        .select("avatar_url, full_name, id")
        .eq("id", session.user.id)
        .single();

      if (!profileData) return;

      setProfile({
        ...profileData,
        profilePicUrl: profileData.avatar_url, // Map avatar_url to profilePicUrl for AppAvatar
      });

      if (!profileData.avatar_url) {
        await generateServerAvatar(session.user.id, profileData.full_name);
      }
    } catch (error) {
      console.error("Profile check error:", error);
    }
  };

  const generateServerAvatar = async (userId, fullName) => {
    setIsLoading(true);
    try {
      if (!userId || !fullName) {
        throw new Error("Missing required userId or fullName");
      }

      const { data, error } = await supabase.functions.invoke(
        "generate-avatar",
        {
          body: { userId, fullName },
          options: {
            headers: { "Content-Type": "application/json" },
          },
        }
      );

      if (error) throw error;
      if (!data?.success) throw new Error("Avatar generation failed");

      // Fetch the updated profile to get the new avatar URL
      const { data: updatedProfile, error: profileError } = await supabase
        .from("profiles")
        .select("avatar_url, full_name, id")
        .eq("id", userId)
        .single();

      if (profileError) throw profileError;

      if (updatedProfile) {
        setProfile({
          ...updatedProfile,
          profilePicUrl: updatedProfile.avatar_url,
        });
      }
    } catch (error) {
      console.error("Avatar generation error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefreshAvatar = async () => {
    if (profile && !profile.profilePicUrl) {
      await generateServerAvatar(profile.id, profile.full_name);
    }
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session?.user?.id) throw new Error("No authenticated user");

      // Update onboarding status
      const { error: profileError } = await supabase
        .from("profiles")
        .update({ onboarding_complete: true })
        .eq("id", session.user.id);

      if (profileError) throw profileError;

      await supabase.auth.refreshSession();
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

      {profile && !profile.profilePicUrl && (
        <AppButton
          color={colors.lightGray}
          onPress={handleRefreshAvatar}
          title="Refresh Avatar"
          style={styles.refreshButton}
        />
      )}

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
