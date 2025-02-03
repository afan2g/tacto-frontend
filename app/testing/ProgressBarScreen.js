import React, { useState } from "react";
import { View, StyleSheet, Button, Text } from "react-native";
import ProgressBar from "../components/ProgressBar";
const STEPS = [
  { id: "username", progress: 0 },
  { id: "fullname", progress: 0.2 },
  { id: "email", progress: 0.4 },
  { id: "password", progress: 0.6 },
  { id: "verify", progress: 0.8 },
  { id: "wallet", progress: 1.0 },
];
function ProgressBarScreen(props) {
  const [index, setIndex] = useState(0);
  const [prevIndex, setPrevIndex] = useState(0);
  const handleNext = () => {
    setPrevIndex(index);
    setIndex((prevIndex) => prevIndex + 1);
  };
  const handlePrev = () => {
    setPrevIndex(index);
    setIndex((prevIndex) => prevIndex - 1);
  };
  return (
    <View style={styles.container}>
      <ProgressBar
        curProgress={STEPS[index].progress}
        prevProgress={STEPS[prevIndex].progress}
      />
      <Button title="Next" onPress={handleNext} />
      <Button title="Previous" onPress={handlePrev} />
      <Text>{STEPS[index].id}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default ProgressBarScreen;
