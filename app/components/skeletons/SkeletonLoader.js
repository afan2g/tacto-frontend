import React, { useEffect } from "react";
import { View, StyleSheet } from "react-native";
import { Canvas, LinearGradient, Rect, vec } from "@shopify/react-native-skia";
import {
  useSharedValue,
  withRepeat,
  withTiming,
  useDerivedValue,
} from "react-native-reanimated";

export default function SkeletonLoader({
  width = 200,
  height = 20,
  radius = height * (1 / 2),
  show = true,
  animated = true,
  duration = 3000,
}) {
  // Set default colors for the dark theme
  const colors = [
    "rgb(17, 17, 17)",
    "rgb(51, 51, 51)",
    "rgb(51, 51, 51)",
    "rgb(17, 17, 17)",
    "rgb(51, 51, 51)",
    "rgb(17, 17, 17)",
  ];

  const progress = useSharedValue(0);
  const measuredWidth = useSharedValue(width);

  useEffect(() => {
    // Update measured width when width prop changes
    measuredWidth.value = width;

    if (!animated) {
      progress.value = 0.5;
      return;
    }
    // Reset and start animation
    progress.value = 0;
    progress.value = withRepeat(
      withTiming(1, { duration: duration }),
      -1,
      true
    );
  }, []);

  // Calculate gradient start and end points based on progress
  const start = useDerivedValue(() => {
    const totalWidth = measuredWidth.value * 6; // backgroundSize = 6
    return vec(-totalWidth + totalWidth * progress.value, 0);
  });

  const end = useDerivedValue(() => {
    const totalWidth = measuredWidth.value * 6; // backgroundSize = 6
    return vec(totalWidth * progress.value, height);
  });

  const canvasWidth = useDerivedValue(() => {
    return measuredWidth.value * 6; // backgroundSize = 6
  });

  if (!show) {
    return null; // Don't render anything if show is false
  }

  return (
    <View
      style={{
        width,
        height,
        borderRadius: radius,
        overflow: "hidden",
        backgroundColor: "rgb(17, 17, 17)",
      }}
    >
      {show && (
        <Canvas
          style={[
            StyleSheet.absoluteFill,
            {
              width: canvasWidth,
            },
          ]}
        >
          <Rect x={0} y={0} width={canvasWidth} height={height} r={radius}>
            <LinearGradient colors={colors} start={start} end={end} />
          </Rect>
        </Canvas>
      )}
    </View>
  );
}
