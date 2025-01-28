import React, { useEffect, useState } from "react";
import { View, StyleSheet, Text, Image } from "react-native";
import Svg, { Circle, Text as SvgText } from "react-native-svg";

import { Screen, AppButton } from "../../components/primitives";
import { colors } from "../../config";
import { supabase } from "../../../lib/supabase";
import getRandomContrastingColor from "../../utils/getRandomContrastingColor";

function SignUpComplete({ navigation }) {
  const [isLoading, setIsLoading] = useState(false);
  const [avatar, setAvatar] = useState(null);
  const [profile, setProfile] = useState(null);
  const [avatarColors, setAvatarColors] = useState({
    background: colors.blackShade10,
    text: getRandomContrastingColor(colors.blackShade10),
  });

  // Generate SVG component for display
  const generateAvatarComponent = (
    firstName,
    lastName,
    backgroundColor,
    textColor
  ) => (
    <Svg height="80" width="80" xmlns="http://www.w3.org/2000/svg">
      <Circle cx="40" cy="40" r="40" fill={backgroundColor} />
      <SvgText
        fill={textColor}
        fontSize="36"
        fontWeight="bold"
        x="40"
        y="40"
        textAnchor="middle"
        alignmentBaseline="central"
      >
        {`${firstName[0]}${lastName[0]}`}
      </SvgText>
    </Svg>
  );

  // Generate SVG string for storage
  const generateAvatarString = (
    firstName,
    lastName,
    backgroundColor,
    textColor
  ) =>
    `
    <svg height="80" width="80" xmlns="http://www.w3.org/2000/svg">
      <circle cx="40" cy="40" r="40" fill="${backgroundColor}" />
      <text
        fill="${textColor}"
        font-size="36"
        font-weight="bold"
        x="40"
        y="40"
        text-anchor="middle"
        alignment-baseline="central"
        dominant-baseline="middle"
      >${firstName[0]}${lastName[0]}</text>
    </svg>
  `.trim();

  useEffect(() => {
    const checkAvatar = async () => {
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

        if (!profileData) return;
        setProfile(profileData);

        if (profileData.avatar_url) {
          setAvatar({ type: "url", content: profileData.avatar_url });
        } else {
          generateNewAvatar(profileData.full_name);
        }
      } catch (error) {
        console.error("Avatar check error:", error);
      }
    };

    checkAvatar();
  }, []);

  const generateNewAvatar = (fullName) => {
    const [firstName, lastName] = fullName.split(" ");
    const backgroundColor = colors.blackShade10;
    const textColor = getRandomContrastingColor(backgroundColor);

    setAvatarColors({ background: backgroundColor, text: textColor });
    const avatarComponent = generateAvatarComponent(
      firstName,
      lastName,
      backgroundColor,
      textColor
    );
    setAvatar(avatarComponent);
  };

  const handleRefreshAvatar = () => {
    if (profile && !profile.avatar_url) {
      generateNewAvatar(profile.full_name);
    }
  };

  const handleButton = async () => {
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
        const [firstName, lastName] = profile.full_name.split(" ");
        const svgString = generateAvatarString(
          firstName,
          lastName,
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
            avatar
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
        onPress={handleButton}
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
