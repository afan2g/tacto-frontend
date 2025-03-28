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
import { Screen } from "../components/primitives";
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
    setShowCamera(!position.value);
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

  return (
    <GestureDetector gesture={gesture}>
      <View style={StyleSheet.absoluteFill}>
        {showCamera && (
          <Flashlight
            onPress={handleTorch}
            color={colors.lightGray}
            size={36}
            style={styles.flashIcon}
          />
        )}
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
        <Camera
          ref={camera}
          style={StyleSheet.absoluteFill}
          device={device}
          isActive={showCamera}
          codeScanner={codeScanner}
          format={format}
          torch={torch}
        />
        <View style={styles.cameraBox} />
      </View>
    </GestureDetector>
  );
}

const styles = StyleSheet.create({
  flashIcon: {
    position: "absolute",
    top: 80,
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
  },
  switchContainer: {
    position: "absolute",
    top: 40,
    left: 20,
    zIndex: 100,
    padding: 0,
    margin: 0,
  },
});

export default QRTestingScreen;
