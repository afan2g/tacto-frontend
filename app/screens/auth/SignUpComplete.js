import React, { useEffect, useState } from "react";
import { View, StyleSheet, Text, Image } from "react-native";
import Svg, { Circle, Text as SvgText } from "react-native-svg";
import { Screen, AppButton } from "../../components/primitives";
import { colors, fonts } from "../../config";
import { supabase } from "../../../lib/supabase";
import getRandomContrastingColor from "../../utils/getRandomContrastingColor";

function SignUpComplete({ navigation }) {
  const [isLoading, setIsLoading] = useState(false);
  const [avatar, setAvatar] = useState(null);

  const generateAvatar = (firstName, lastName) => (
    <Svg height="80" width="80">
      <Circle cx="40" cy="40" r="40" fill={colors.blackShade10} />
      <SvgText
        fill={getRandomContrastingColor(colors.blackShade10)}
        fontSize="36"
        fontWeight="bold"
        x="40"
        y="40"
        textAnchor="end"
        alignmentBaseline="after-edge"
      >
        {firstName[0]}
        {lastName[0]}
      </SvgText>
    </Svg>
  );

  useEffect(() => {
    handleAvatar();
  }, []);

  useEffect(() => {
    if (avatar) {
      if (avatar.type === "url") {
        console.log("avatar is url", avatar.content);
      } else if (avatar.type === "svg") {
        console.log("avatar is svg");
      }
    }
  }, [avatar]);

  async function handleAvatar() {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session?.user) return;

      const { data: profile } = await supabase
        .from("profiles")
        .select("avatar_url, full_name")
        .eq("id", session.user.id)
        .single();

      if (!profile) return;

      if (profile.avatar_url) {
        // Check if the avatar_url is an external URL (e.g., Google profile picture)
        if (profile.avatar_url.startsWith("http")) {
          setAvatar({ type: "url", content: profile.avatar_url });
        } else {
          // It's a Supabase storage path
          const {
            data: { publicUrl },
          } = supabase.storage.from("avatars").getPublicUrl(profile.avatar_url);

          setAvatar({ type: "url", content: publicUrl });
        }
      } else {
        // Generate avatar from initials
        const [firstName, lastName] = profile.full_name.split(" ");
        const generatedAvatar = generateAvatar(firstName, lastName);
        setAvatar({ type: "svg", content: generatedAvatar });

        // Save generated avatar
        const svgString = `<svg height="80" width="80">
          <circle cx="40" cy="40" r="40" fill="${colors.blackShade10}" />
          <text
            fill="${getRandomContrastingColor(colors.blackShade10)}"
            font-size="36"
            font-weight="bold"
            x="40"
            y="40"
            text-anchor="middle"
            alignment-baseline="central"
          >${firstName[0]}${lastName[0]}</text>
        </svg>`;

        const { data, error } = await supabase.storage
          .from("avatars")
          .upload(`${session.user.id}.svg`, svgString, {
            contentType: "image/svg+xml",
          });

        if (!error) {
          await supabase
            .from("profiles")
            .update({ avatar_url: data.path })
            .eq("id", session.user.id);
        }
      }
    } catch (error) {
      console.error("Avatar handling error:", error);
    }
  }

  const handleButton = async () => {
    setIsLoading(true);
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) throw new Error("No session found");

      const { error: profileError } = await supabase
        .from("profiles")
        .update({ onboarding_complete: true })
        .eq("id", session.user.id);

      if (profileError) throw profileError;

      await new Promise((resolve) => setTimeout(resolve, 100));
      const { error: refreshError } = await supabase.auth.refreshSession();

      if (refreshError) throw refreshError;
    } catch (error) {
      console.error("Completion error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Screen style={styles.container}>
      <View style={styles.content}>
        <View style={styles.avatarContainer}>
          {avatar?.type === "url" ? (
            <Image source={{ uri: avatar.content }} style={styles.avatar} />
          ) : avatar?.type === "svg" ? (
            avatar.content
          ) : (
            <View style={styles.avatarPlaceholder} />
          )}
        </View>
        <Text style={styles.text}>Sign Up Complete</Text>
        <AppButton
          color="yellow"
          onPress={handleButton}
          title={isLoading ? "Loading..." : "Go to App"}
          disabled={isLoading}
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
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
  avatarPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.fadedGray,
  },
  text: {
    fontSize: 24,
    color: colors.lightGray,
    marginBottom: 20,
    fontFamily: fonts.medium,
  },
});

export default SignUpComplete;
