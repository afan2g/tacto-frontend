import React, { useState, useEffect } from "react";
import { View, StyleSheet, Text } from "react-native";
import { AppText } from "./primitives";
import { colors, fonts } from "../config";
import { Svg, Circle, Text as SvgText } from "react-native-svg";
import { Image } from "expo-image";

const uuidColor = (uuid) => {
  if (!uuid) return colors.blackShade10; // Default color if no UUID
  const hash = uuid
    .split("")
    .reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const hue = hash % 290;
  return `hsl(${hue}, 50%, 50%)`;
};

// Helper function to create SVG with initials
const InitialsSvg = ({ user, size }) => {
  const fontSize = size * 0.4; // Scale font relative to container size
  const radius = size / 2;
  // Get initials for placeholder
  const initials = user.full_name
    .split(" ")
    .map((name) => name?.[0] || "")
    .join("")
    .toUpperCase();
  return (
    <Svg height={size} width={size} viewBox={`0 0 ${size} ${size}`}>
      <Circle
        cx={radius}
        cy={radius}
        r={radius}
        fill={user.id ? uuidColor(user.id) : colors.black}
      />
      <SvgText
        fill={user.id ? colors.black : colors.lightGray}
        fontSize={fontSize}
        fontWeight="bold"
        x={radius}
        y={radius + fontSize / 3} // Vertical adjustment to center text
        textAnchor="middle"
      >
        {initials}
      </SvgText>
    </Svg>
  );
};
function AppAvatar({ user, scale = 1, style }) {
  const [url, setUrl] = useState(user.avatar_url || null);

  const isSvg = url?.toLowerCase().endsWith(".svg");
  const size = 54 * scale;
  const scaleStyle = {
    height: size,
    width: size,
    borderRadius: size / 2,
  };

  if (!user || !user.id) {
    return (
      <View style={[scaleStyle, styles.placeholderAvatar, style]}>
        <Text style={styles.placeholderText}>?</Text>
      </View>
    );
  }
  // If no avatar URL or if it's an SVG, render our custom InitialsSvg component
  if (!url || isSvg) {
    return (
      <View style={[scaleStyle, styles.svgContainer, style]}>
        <InitialsSvg user={user} size={size} />
      </View>
    );
  } else {
    // Regular image
    return (
      <Image
        source={{ uri: url }}
        contentFit="cover"
        style={[scaleStyle, styles.profilePic, style]}
      />
    );
  }
}

const styles = StyleSheet.create({
  profilePic: {
    overflow: "hidden",
  },
  svgContainer: {
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
  },
  placeholderAvatar: {
    backgroundColor: colors.blackShade10,
    justifyContent: "center",
    alignItems: "center",
  },
  placeholderText: {
    color: colors.lightGray,
    fontSize: 24,
    fontFamily: fonts.medium,
  },
});

export default AppAvatar;
