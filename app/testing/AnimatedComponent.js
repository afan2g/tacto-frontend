import React from "react";
import { View, StyleSheet, Button } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
  useAnimatedProps,
} from "react-native-reanimated";
import { Circle, Svg } from "react-native-svg";
function AnimatedComponent(props) {
  //   const translateX = useSharedValue(0);

  //   const handlePress = () => {
  //     translateX.value += 50;
  //   };

  //   const animatedStyle = useAnimatedStyle(() => ({
  //     transform: [{ translateX: withSpring(translateX.value) }],
  //   }));

  //   return (
  //     <View style={styles.container}>
  //       <Animated.View style={[styles.box, animatedStyle]} />
  //       <Button title="Change x" onPress={handlePress} />
  //     </View>
  //   );

  const r = useSharedValue(20);
  const animatedProps = useAnimatedProps(() => {
    return {
      r: withTiming(r.value),
    };
  });

  const handlePress = () => {
    r.value += 20;
  };
  const AnimatedCircle = Animated.createAnimatedComponent(Circle);
  return (
    <View style={styles.container}>
      <Svg style={styles.svg}>
        <AnimatedCircle
          cx="50%"
          cy="50%"
          fill="red"
          animatedProps={animatedProps}
        />
      </Svg>
      <Button title="Change radius" onPress={handlePress} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
  },
  svg: {
    width: 200,
    height: 200,
  },
  box: {
    width: 100,
    height: 100,
    backgroundColor: "red",
  },
});

export default AnimatedComponent;
