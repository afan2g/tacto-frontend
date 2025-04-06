import React, { useEffect } from "react";
import { View, StyleSheet } from "react-native";
import {
  Canvas,
  LinearGradient,
  Rect,
  RoundedRect,
  vec,
} from "@shopify/react-native-skia";
import {
  useSharedValue,
  withRepeat,
  withTiming,
  useDerivedValue,
} from "react-native-reanimated";

export default function TransactionCardSkeletonLoader({
  show = true,
  animated = true,
  radius = 20,
  height = 96,
  width = 411,
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

  const amountWidth = 40;
  const nameWidth = 150;
  const actionWidth = 100;
  const dateWidth = 75;

  useEffect(() => {
    if (!animated) {
      progress.value = 0.5;
      return;
    }
    // Reset and start animation
    progress.value = 0;
    progress.value = withRepeat(withTiming(1, { duration: 3000 }), -1, true);
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
    <View style={styles.container}>
      <Canvas
        style={[
          StyleSheet.absoluteFill,
          {
            width: canvasWidth,
          },
        ]}
      >
        <RoundedRect x={10} y={10} width={nameWidth} height={20} r={radius}>
          <LinearGradient colors={colors} start={start} end={end} />
        </RoundedRect>
        <RoundedRect
          x={width - amountWidth - 10}
          y={10}
          width={amountWidth}
          height={20}
          r={radius}
        >
          <LinearGradient colors={colors} start={start} end={end} />
        </RoundedRect>
        <RoundedRect
          x={10}
          y={height - 20 - 10}
          width={actionWidth}
          height={20}
          r={radius}
        >
          <LinearGradient colors={colors} start={start} end={end} />
        </RoundedRect>
        <RoundedRect
          x={width - dateWidth - 10}
          y={height - 20 - 10}
          width={dateWidth}
          height={20}
          r={radius}
        >
          <LinearGradient colors={colors} start={start} end={end} />
        </RoundedRect>
      </Canvas>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: 96,
    overflow: "hidden",
  },
});
