import React from "react";
import { View, StyleSheet } from "react-native";

import Animated, {
  useanimatedScrollHandler,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
function AnimatedScroll(props) {
  const offsetY = useSharedValue(0);
  const scrollHandler = useanimatedScrollHandler({
    onScroll: (event) => {
      offsetY.value = event.contentOffset.y;
    },
  });

  return (
    <Animated.ScrollView
      style={styles.container}
      onScroll={scrollHandler}
      scrollEventThrottle={16}
    >
      <Animated.View
        style={[styles.box, { transform: [{ translateY: offsetY.value }] }]}
      />
    </Animated.ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  box: {
    width: 100,
    height: 100,
    backgroundColor: "red",
  },
});

export default AnimatedScroll;
