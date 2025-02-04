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
const SEPARATOR_WIDTH = 5;

const SPRING_CONFIG = {
  damping: 15,
  stiffness: 90,
  mass: 1,
  overshootClamping: false,
  restDisplacementThreshold: 0.01,
  restSpeedThreshold: 2,
};

const ProgressSegment = ({ step, start, end, currentStep, containerWidth }) => {
  // Shift the progress segment right to avoid overlapping the separator.
  const adjustedStart = start * containerWidth + SEPARATOR_WIDTH;
  const progress = useSharedValue(step < currentStep - 1 ? 1 : 0);

  useEffect(() => {
    const isCurrentStep = step === currentStep - 1;
    const isGoingBackwards = step > currentStep - 1 && progress.value === 1;

    if (isCurrentStep || isGoingBackwards) {
      progress.value = withSpring(
        step <= currentStep - 1 ? 1 : 0,
        SPRING_CONFIG
      );
    } else if (step < currentStep - 1) {
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
      style={[styles.progressSegment, segmentStyle, { left: adjustedStart }]}
    />
  );
};

const Separator = ({ position, isEnd }) => {
  // For the end separator, subtract the SEPARATOR_WIDTH so it remains within the container.
  const stylePosition =
    position !== undefined
      ? isEnd
        ? { left: position - SEPARATOR_WIDTH }
        : { left: position }
      : { right: 0 };

  return (
    <View
      style={[styles.separator, isEnd && styles.endSeparator, stylePosition]}
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
          {/* Render separators including the end separator */}
          {[...segments, { id: "end", start: 1 }].map(
            (separator, index, array) => (
              <Separator
                key={`separator-${separator.id}`}
                position={separator.start * containerWidth}
                isEnd={index === array.length - 1}
              />
            )
          )}
        </View>

        {/* Render progress segments once the container width is known */}
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
    overflow: "hidden",
  },
  progressContainer: {
    height: 4,
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
    backgroundColor: colors.black,

    zIndex: 2,
  },
  endSeparator: {
    backgroundColor: colors.black,
  },
  progressSegment: {
    position: "absolute",
    height: "100%",
    backgroundColor: colors.yellow,
    zIndex: 1,
  },
});

export default ProgressBar;
