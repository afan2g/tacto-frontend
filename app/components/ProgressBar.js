import React, { useEffect, useState } from "react";
import { View, StyleSheet } from "react-native";
import Animated, {
  useAnimatedStyle,
  withSpring,
  useSharedValue,
} from "react-native-reanimated";
import { colors } from "../config";
import { useFormData } from "../contexts/FormContext";

const TOTAL_STEPS = 5;
const SEPARATOR_WIDTH = 0;

const SPRING_CONFIG = {
  damping: 15,
  stiffness: 90,
  mass: 1,
  overshootClamping: false,
  restDisplacementThreshold: 0.01,
  restSpeedThreshold: 2,
};

const ProgressSegment = ({ start, end, step, currentStep, containerWidth }) => {
  // Initialize as filled if it's a previous step, empty otherwise
  const progress = useSharedValue(step < currentStep - 1 ? 1 : 0);

  useEffect(() => {
    // Animate if this is the current step OR if we're going backwards
    if (
      step === currentStep - 1 ||
      (step > currentStep - 1 && progress.value === 1)
    ) {
      progress.value = withSpring(
        step <= currentStep - 1 ? 1 : 0,
        SPRING_CONFIG
      );
    } else if (step < currentStep - 1) {
      // Immediately fill previous steps without animation
      progress.value = 1;
    }
  }, [currentStep, step]);

  const segmentStyle = useAnimatedStyle(() => {
    const segmentWidth = (end - start) * containerWidth - SEPARATOR_WIDTH;
    return {
      width: segmentWidth * progress.value,
      opacity: progress.value,
    };
  });

  return (
    <Animated.View
      style={[
        styles.progressSegment,
        segmentStyle,
        {
          left: start * containerWidth + SEPARATOR_WIDTH / 2,
        },
      ]}
    />
  );
};

const ProgressBar = () => {
  const { formData } = useFormData();
  const [containerWidth, setContainerWidth] = useState(0);

  const segments = Array.from({ length: TOTAL_STEPS }, (_, index) => ({
    id: `segment-${index}`,
    step: index,
    start: index / TOTAL_STEPS,
    end: (index + 1) / TOTAL_STEPS,
  }));

  const onLayoutHandler = (event) => {
    const { width } = event.nativeEvent.layout;
    setContainerWidth(width);
  };

  return (
    <View style={styles.container}>
      <View style={styles.progressContainer} onLayout={onLayoutHandler}>
        <View style={styles.track}>
          {segments.map((segment) => (
            <View
              key={`separator-${segment.id}`}
              style={[
                styles.separator,
                {
                  left: segment.start * containerWidth - SEPARATOR_WIDTH / 2,
                },
              ]}
            />
          ))}
        </View>

        {containerWidth > 0 &&
          segments.map((segment) => (
            <ProgressSegment
              key={segment.id}
              step={segment.step}
              start={segment.start}
              end={segment.end}
              currentStep={formData.progress}
              containerWidth={containerWidth}
            />
          ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
  progressContainer: {
    height: 2,
    width: "100%",
    backgroundColor: "transparent",
    overflow: "hidden",
  },
  track: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: "100%",
    backgroundColor: colors.fadedGray,
  },
  separator: {
    position: "absolute",
    width: SEPARATOR_WIDTH,
    height: "100%",
    backgroundColor: "transparent",
  },
  progressSegment: {
    position: "absolute",
    height: "100%",
    backgroundColor: colors.yellow,
  },
});

export default ProgressBar;
