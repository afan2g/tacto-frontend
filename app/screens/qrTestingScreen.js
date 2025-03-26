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
import { runOnJS } from "react-native-reanimated";
function QRTestingScreen(props) {
  const camera = React.useRef(null);
  const device = useCameraDevice("back");
  const { hasPermission, requestPermission } = useCameraPermission();

  const format = useCameraFormat(device, Templates.Snapchat);
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

  //   const focus = useCallback((point) => {
  //     const c = camera.current;
  //     if (c) {
  //       c.focus(point);
  //     }
  //   }, []);

  //   const gesture = Gesture.Tap().onEnd(({ x, y }) => {
  //     runOnJS(focus)({ x, y });
  //   });
  const frameProcessor = useSkiaFrameProcessor((frame) => {
    "worklet";
    frame.render();

    const centerX = frame.width / 2;
    const centerY = frame.height / 2;
    const length = centerX / 2;
    const rect = Skia.XYWHRect(
      centerX - length / 2,
      centerY - length / 2,
      length,
      length
    );
    const paint = Skia.Paint();
    paint.setColor(Skia.Color("red"));
    paint.setStrokeWidth(5);
    paint.setStyle(PaintStyle.Stroke);
    const rrect = Skia.RRectXY(rect, 10, 10);
    frame.drawRect(rect, paint);
  }, []);

  return (
    // <GestureDetector gesture={gesture}>
    <Camera
      //   ref={camera}
      style={{ flex: 1 }}
      device={device}
      isActive={true}
      codeScanner={codeScanner}
      frameProcessor={frameProcessor}
      format={format}
    />
    // </GestureDetector>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  screen: {
    flex: 1,
  },
  cameraContainer: {
    width: "100%",
    height: "100%",
    backgroundColor: "black",
  },
});

export default QRTestingScreen;
