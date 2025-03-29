import React, { useCallback } from "react";
import { View, StyleSheet, Button } from "react-native";
import {
  useCameraPermission,
  useCameraDevice,
  Camera,
  useCodeScanner,
  useFrameProcessor,
  useSkiaFrameProcessor,
  useCameraFormat,
  Templates,
} from "react-native-vision-camera";
import { AppText, Screen } from "../components/primitives";
import { Skia, PaintStyle } from "@shopify/react-native-skia";

import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { runOnJS, useSharedValue } from "react-native-reanimated";
import { colors } from "../config";
import { Flashlight } from "lucide-react-native";
import AnimatedSwitch from "../animations/AnimatedSwitch";
import { z } from "zod";
function QRTestingScreen(props) {
  const camera = React.useRef(null);
  const device = useCameraDevice("back", {
    physicalDevices: ["wide-angle-camera"],
  });
  const [showCamera, setShowCamera] = React.useState(true);
  const [torch, setTorch] = React.useState("off");
  const { hasPermission, requestPermission } = useCameraPermission();
  const position = useSharedValue(0);

  const format = useCameraFormat(device, Templates.Instagram);
  console.log(format);
  const codeScanner = useCodeScanner({
    codeTypes: ["qr"],
    onCodeScanned: (codes) => {
      console.log(codes);
    },
  });
  if (!hasPermission) {
    return (
      <View style={styles.container}>
        <Button title="Request permission" onPress={requestPermission} />
      </View>
    );
  }

  const handleShowCamera = useCallback((newPosition) => {
    console.log("toggling camera. new position: ", newPosition);
    position.value = newPosition;
    setShowCamera(!newPosition);
  });

  const handleTorch = useCallback(() => {
    console.log("torch");
    setTorch((prev) => (prev === "off" ? "on" : "off"));
  });

  const focus = useCallback((point) => {
    const c = camera.current;
    if (c) {
      console.log("focusing");
    }
  }, []);

  const gesture = Gesture.Tap().onEnd(({ x, y }) => {
    runOnJS(focus)({ x, y });
  });

  if (showCamera) {
    return (
      <View style={styles.container}>
        <View style={styles.switchContainer}>
          <AnimatedSwitch
            leftText="Scan Code"
            rightText="Your Code"
            onToggle={handleShowCamera}
            position={position}
            borderColor={colors.fadedGray}
            borderWidth={2}
          />
        </View>
        <Flashlight
          onPress={handleTorch}
          color={torch === "on" ? colors.yellow : colors.lightGray}
          size={36}
          style={styles.flashIcon}
        />
        <GestureDetector gesture={gesture}>
          <Camera
            ref={camera}
            style={StyleSheet.absoluteFill}
            device={device}
            isActive={showCamera}
            codeScanner={codeScanner}
            format={format}
            torch={torch}
          />
        </GestureDetector>
        <View style={styles.cameraBox} />
      </View>
    );
  }
  return (
    <View style={styles.container}>
      <View style={styles.switchContainer}>
        <AnimatedSwitch
          leftText="Scan Code"
          rightText="Your Code"
          onToggle={handleShowCamera}
          position={position}
          borderColor={colors.fadedGray}
          borderWidth={2}
        />
      </View>
      <View style={styles.cameraBox}>
        <AppText>Your Code</AppText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  flashIcon: {
    position: "absolute",
    top: 60,
    right: 40,
    zIndex: 100,
  },

  cameraContainer: {
    width: "100%",
    height: "100%",
    backgroundColor: "black",
  },
  cameraBox: {
    position: "absolute",
    width: 250,
    height: 250,
    borderWidth: 2,
    borderColor: colors.lightGray,
    borderRadius: 10,
    top: "50%",
    left: "50%",
    transform: [{ translateX: -125 }, { translateY: -125 }],
    margin: "auto",
    justifyContent: "center",
    alignItems: "center",
  },
  switchContainer: {
    top: 150,
    zIndex: 100,
  },
});

export default QRTestingScreen;
