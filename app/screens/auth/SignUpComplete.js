import React, { useEffect, useState } from "react";
import { View, StyleSheet, Text, Image } from "react-native";
import Svg, { Circle, Text as SvgText, SvgUri } from "react-native-svg";

import { Screen, AppButton } from "../../components/primitives";
import { colors } from "../../config";
import { supabase } from "../../../lib/supabase";
import getRandomContrastingColor from "../../utils/getRandomContrastingColor";

function SignUpComplete({ navigation }) {
  const [isLoading, setIsLoading] = useState(false);
  const [avatar, setAvatar] = useState(null);
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
        .select("avatar_url, full_name")
        .eq("id", session.user.id)
        .single();
      console.log("Profile data:", profileData);
      if (!profileData) return;
      setProfile(profileData);

      if (profileData.avatar_url) {
        setAvatar({ type: "url", content: profileData.avatar_url });
      } else {
        // Instead of generating locally, call server endpoint
        await generateServerAvatar(session.user.id, profileData.full_name);
      }
    } catch (error) {
      console.error("Profile check error:", error);
    }
  };

  const generateServerAvatar = async (userId, fullName) => {
    setIsLoading(true);
    console.log("Generating avatar for", userId, fullName);
    try {
      if (!userId || !fullName) {
        throw new Error("Missing required userId or fullName");
      }

      // Call your server endpoint (Supabase Edge Function)
      const { data, error } = await supabase.functions.invoke(
        "generate-avatar",
        {
          body: { userId, fullName },
          // Add timeout and headers if needed
          options: {
            headers: {
              "Content-Type": "application/json",
            },
          },
        }
      );

      if (error) {
        console.error("Edge function error details:", error);
        throw error;
      }

      if (!data?.success) {
        throw new Error("Avatar generation failed");
      }

      // Refresh profile to get new avatar_url
      const { data: updatedProfile, error: profileError } = await supabase
        .from("profiles")
        .select("avatar_url")
        .eq("id", userId)
        .single();

      if (profileError) {
        throw profileError;
      }

      if (updatedProfile?.avatar_url) {
        setAvatar({ type: "url", content: updatedProfile.avatar_url });
      } else {
        throw new Error("No avatar URL in updated profile");
      }
    } catch (error) {
      console.error("Avatar generation error:", error.message);
      // You might want to show an error to the user here
      // Alert.alert('Error', 'Failed to generate avatar. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefreshAvatar = async () => {
    if (profile && !profile.avatar_url) {
      await generateServerAvatar(profile.id, profile.full_name);
    }
  };
  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session?.user?.id) {
        throw new Error("No authenticated user");
      }

      // Upload avatar if it's generated (not a URL)
      if (profile && !profile.avatar_url) {
        const split = profile.full_name.split(" ");
        const firstName = split[0];
        const lastName = split.length > 1 ? split[split.length - 1] : "";
        const initials = `${firstName[0] || ""}${lastName[0] || ""}`;
        const svgString = generateAvatarString(
          initials,
          avatarColors.background,
          avatarColors.text
        );

        // Construct the file path - IMPORTANT: Keep this format exactly
        const filePath = `${session.user.id}/avatar.svg`;

        // Upload the file
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from("avatars")
          .upload(filePath, svgString, {
            contentType: "image/svg+xml",
            cacheControl: "3600",
            upsert: true,
          });

        if (uploadError) {
          console.error("Upload error details:", uploadError);
          throw uploadError;
        }

        // Get public URL only after successful upload
        const {
          data: { publicUrl },
        } = supabase.storage.from("avatars").getPublicUrl(filePath);

        // Update profile with new avatar URL
        const { error: updateError } = await supabase
          .from("profiles")
          .update({ avatar_url: publicUrl })
          .eq("id", session.user.id);

        if (updateError) {
          console.error("Profile update error:", updateError);
          throw updateError;
        }
      }

      // Update onboarding status
      const { error: profileError } = await supabase
        .from("profiles")
        .update({ onboarding_complete: true })
        .eq("id", session.user.id);

      if (profileError) {
        console.error("Onboarding status update error:", profileError);
        throw profileError;
      }

      await supabase.auth.refreshSession();
    } catch (error) {
      console.error("Error in handleButton:", error);
      // You might want to show an error to the user here
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Screen style={styles.container}>
      <View style={styles.avatarContainer}>
        {avatar &&
          (typeof avatar === "object" && avatar.type === "url" ? (
            <Image source={{ uri: avatar.content }} style={styles.avatar} />
          ) : (
            <SvgUri width="80" height="80" uri={avatar} />
          ))}
      </View>
      {profile && !profile.avatar_url && (
        <AppButton
          color="lightGray"
          onPress={handleRefreshAvatar}
          title="Refresh Avatar"
          style={styles.refreshButton}
        />
      )}
      <Text style={styles.text}>Sign Up Complete</Text>
      <AppButton
        color="yellow"
        onPress={handleSubmit}
        title={isLoading ? "Loading..." : "Go to App"}
        disabled={isLoading}
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
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
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
