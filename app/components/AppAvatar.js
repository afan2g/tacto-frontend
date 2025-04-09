import React, { useState, useEffect } from "react";
import { View, StyleSheet } from "react-native";
import { AppText } from "./primitives";
import { colors, fonts } from "../config";
import { Svg, Circle, Text as SvgText } from "react-native-svg";
import { Image } from "expo-image";

const uuidColor = (uuid) => {
  if (!uuid) return colors.blackShade10; // Default color if no UUID
  const hash = uuid
    .split("")
    .reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const hue = (hash % 360) / 360;
  return `hsl(${hue * 360}, 70%, 50%)`;
};

// Helper function to create SVG with initials
const InitialsSvg = ({ initials, size, color }) => {
  const fontSize = size * 0.4; // Scale font relative to container size
  const radius = size / 2;

  return (
    <Svg height={size} width={size} viewBox={`0 0 ${size} ${size}`}>
      <Circle cx={radius} cy={radius} r={radius} fill={color} />
      <SvgText
        fill="#2D3748"
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
function AppAvatar({ user, scale = 1 }) {
  const [url, setUrl] = useState(user.avatar_url || null);

  useEffect(() => {
    if (user.avatar_url) {
      setUrl(user.avatar_url);
    }
  }, [user.avatar_url]);

  const isSvg = url?.toLowerCase().endsWith(".svg");
  const size = 54 * scale;

  // Get initials for placeholder
  const initials = user.full_name
    .split(" ")
    .map((name) => name?.[0] || "")
    .join("")
    .toUpperCase();

  const scaleStyle = {
    height: size,
    width: size,
    borderRadius: size / 2,
  };

  // If no avatar URL or if it's an SVG, render our custom InitialsSvg component
  if (!url || isSvg) {
    return (
      <View style={[scaleStyle, styles.svgContainer]}>
        <InitialsSvg
          initials={initials}
          size={size}
          color={uuidColor(user.id)}
        />
      </View>
    );
  } else {
    // Regular image
    return (
      <Image
        source={{ uri: url }}
        contentFit="cover"
        style={[scaleStyle, styles.profilePic]}
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
  },
  placeholderAvatar: {
    backgroundColor: colors.blackShade10,
    justifyContent: "center",
    alignItems: "center",
  },
  placeholderText: {
    color: colors.lightGray,
    fontSize: 20,
    fontFamily: fonts.medium,
  },
});

export default AppAvatar;
