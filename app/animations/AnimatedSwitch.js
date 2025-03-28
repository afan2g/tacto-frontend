import React from "react";
import { View, StyleSheet, Pressable, Text } from "react-native";
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { colors, fonts } from "../config";
import {
  GestureDetector,
  Gesture,
  Directions,
} from "react-native-gesture-handler";

function AnimatedSwitch({
  leftText = "left",
  rightText = "right",
  onToggle = () => {},
  position,
  style = {
    padding: 1,
    borderRadius: 20,
    height: 40,
    width: 300,
    borderColor: colors.lightGray,
    borderWidth: 2,
  },
}) {
  const width = useSharedValue(0);
  const switchWidth = useSharedValue(0);
  const switchAnimatedStyle = useAnimatedStyle(() => {
    // Calculate the exact position for the right state
    // The padding is 5px, so we need to account for that
    const moveValue = position.value === 0 ? 0 : switchWidth.value;

    // Apply smooth animation
    return {
      transform: [{ translateX: withTiming(moveValue, { duration: 200 }) }],
      left: style.padding,
      borderRadius: style.borderRadius,
    };
  });

  const swipeLeft = Gesture.Fling()
    .direction(Directions.LEFT)
    .onStart((e) => {
      if (position.value === 1) {
        runOnJS(onToggle)(0);
      }
    });

  const swipeRight = Gesture.Fling()
    .direction(Directions.RIGHT)
    .onStart((e) => {
      if (position.value === 0) {
        runOnJS(onToggle)(1);
      }
    });

  const composed = Gesture.Simultaneous(swipeLeft, swipeRight);
  return (
    <View style={{ flex: 1 }}>
      <GestureDetector gesture={composed}>
        <Animated.View
          style={[styles.track, style]}
          onLayout={(e) => {
            width.value = e.nativeEvent.layout.width;
          }}
        >
          <Animated.View
            style={[styles.switch, switchAnimatedStyle]}
            onLayout={(e) => {
              switchWidth.value = e.nativeEvent.layout.width;
            }}
          />
          <Pressable
            onPress={() => onToggle(0)}
            style={[styles.button, { paddingRight: style.padding }]}
          >
            <Text style={styles.text}>{leftText}</Text>
          </Pressable>
          <Pressable
            onPress={() => onToggle(1)}
            style={[styles.button, { paddingLeft: style.padding }]}
          >
            <Text style={styles.text}>{rightText}</Text>
          </Pressable>
        </Animated.View>
      </GestureDetector>
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    backgroundColor: colors.lightGray,
    width: 300,
    height: 40,
  },
  switch: {
    position: "absolute",
    backgroundColor: colors.yellow,
    height: "100%",
    width: "50%",
    left: 3,
  },
  button: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1, // Ensure buttons are above the switch
  },
  text: {
    fontFamily: fonts.medium,
    fontSize: 16,
  },
});

export default AnimatedSwitch;
