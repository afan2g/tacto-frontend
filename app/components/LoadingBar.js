import React, { useEffect } from "react";
import { View, StyleSheet, Text } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from "react-native-reanimated";

const AnimatedProgressBar = ({
  progress = 0,
  width = "100%",
  height = 20,
  backgroundColor = "#e0e0e0",
  fillColor = "#6200ee",
  duration = 1000,
  showPercentage = true,
  borderRadius = 5,
  easing = Easing.bezier(0.25, 0.1, 0.25, 1),
  style,
}) => {
  // Validate progress is between 0 and 1
  const validProgress = Math.min(Math.max(progress, 0), 1);

  // Create animated value for progress
  const animatedProgress = useSharedValue(0);

  // Update animated value when progress prop changes
  useEffect(() => {
    animatedProgress.value = withTiming(validProgress, {
      duration,
      easing,
    });
  }, [validProgress, duration, easing]);

  useEffect(() => {
    console.log("loading bar progress", progress);
    console.log("loading bar animatedProgress", animatedProgress.value);
  }, [progress, animatedProgress]);

  // Create animated style for the fill
  const animatedStyle = useAnimatedStyle(() => {
    return {
      width: `${animatedProgress.value * 100}%`,
      backgroundColor: fillColor,
      borderRadius,
    };
  });

  return (
    <View style={[styles.container, { width, height, borderRadius }, style]}>
      <View style={[styles.backgroundBar, { backgroundColor, borderRadius }]} />
      <Animated.View style={[styles.progressBar, animatedStyle]} />
      {showPercentage && (
        <View style={styles.textContainer}>
          <Text style={styles.percentageText}>
            {Math.round(validProgress * 100)}%
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "relative",
    overflow: "hidden",
  },
  backgroundBar: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  progressBar: {
    position: "absolute",
    top: 0,
    left: 0,
    bottom: 0,
  },
  textContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
  },
  percentageText: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#000",
  },
});

export default AnimatedProgressBar;
