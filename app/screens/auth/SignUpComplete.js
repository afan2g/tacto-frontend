import React, { useEffect, useState } from "react";
import { View, StyleSheet, Text } from "react-native";
import Svg, { Circle } from "react-native-svg";
import { CommonActions, StackActions } from "@react-navigation/native";

import { Screen } from "../../components/primitives";
import { colors } from "../../config";
import { supabase } from "../../../lib/supabase";
import { AppButton } from "../../components/primitives";
import routes from "../../navigation/routes";
import getRandomContrastingColor from "../../utils/getRandomContrastingColor";

function SignUpComplete({ navigation }) {
  const [isLoading, setIsLoading] = useState(false);

  const generateAvatar = (firstName, lastName) => {
    return (
      <Svg height="100" width="100">
        <Circle cx="50" cy="50" r="40" fill={colors.blackTint20} />
        <Svg.Text
          fill={getRandomContrastingColor(colors.blackTint20)}
          fontSize="20"
          fontWeight="bold"
          x="50%"
          y="50%"
          textAnchor="middle"
          alignmentBaseline="middle"
        >
          {firstName[0]}
          {lastName[0]}
        </Svg.Text>
      </Svg>
    );
  };

  async function handleAvatar(session) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("avatar_url, full_name")
      .eq("id", session.user.id)
      .single();

    // If Google avatar doesn't exist, generate one
    if (!profile.avatar_url) {
      const [firstName, lastName] = profile.full_name.split(" ");
      const svg = generateAvatar(firstName, lastName);

      const { data, error } = await supabase.storage
        .from("avatars")
        .upload(`${session.user.id}.svg`, svg, {
          contentType: "image/svg+xml",
        });

      if (!error) {
        await supabase
          .from("profiles")
          .update({ avatar_url: data.path })
          .eq("id", session.user.id);
      }
    }
  }

  // SignUpComplete.js
  const handleButton = async () => {
    setIsLoading(true);
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      await handleAvatar(session);
      await supabase
        .from("profiles")
        .update({ wallet_created: true })
        .eq("id", session.user.id);

      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: routes.ROOT }],
        })
      );
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Screen style={styles.container}>
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
  text: {
    fontSize: 20,
    color: colors.lightGray,
    marginBottom: 20,
  },
});

export default SignUpComplete;
