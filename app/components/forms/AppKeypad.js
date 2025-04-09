import React, { useState } from "react";
import { View, Pressable, Text, StyleSheet } from "react-native";
import fonts from "../../config/fonts";
import colors from "../../config/colors";
import { Delete } from "lucide-react-native";

const PRESS_DELAY = 40;
const LONG_PRESS_DELAY = 500;
const CustomKeypad = ({ onPress }) => {
  const [deleteInterval, setDeleteInterval] = useState(null);

  const handleLongPress = () => {
    const timer = setInterval(() => {
      onPress("<");
    }, 100);
    setDeleteInterval(timer);
  };

  const handlePressOut = () => {
    clearInterval(deleteInterval);
  };
  return (
    <View style={styles.keypadContainer}>
      <View style={[styles.row, styles.firstRow]}>
        <Pressable
          style={({ pressed }) => [
            styles.key,
            styles.keyOne,
            pressed ? styles.pressed : styles.notPressed,
          ]}
          unstable_pressDelay={PRESS_DELAY}
          onPress={() => onPress("1")}
        >
          <Text style={styles.keyText}>1</Text>
        </Pressable>
        <Pressable
          style={({ pressed }) => [
            styles.key,
            styles.keyTwo,
            pressed ? styles.pressed : styles.notPressed,
          ]}
          unstable_pressDelay={PRESS_DELAY}
          onPress={() => onPress("2")}
        >
          <Text style={styles.keyText}>2</Text>
        </Pressable>
        <Pressable
          style={({ pressed }) => [
            styles.key,
            styles.keyThree,
            pressed ? styles.pressed : styles.notPressed,
          ]}
          unstable_pressDelay={PRESS_DELAY}
          onPress={() => onPress("3")}
        >
          <Text style={styles.keyText}>3</Text>
        </Pressable>
      </View>

      <View style={[styles.row, styles.secondRow]}>
        <Pressable
          key={"4"}
          style={({ pressed }) => [
            styles.key,
            styles.keyFour,
            pressed ? styles.pressed : styles.notPressed,
          ]}
          unstable_pressDelay={PRESS_DELAY}
          onPress={() => onPress("4")}
        >
          <Text style={styles.keyText}>4</Text>
        </Pressable>
        <Pressable
          style={({ pressed }) => [
            styles.key,
            styles.keyFive,
            pressed ? styles.pressed : styles.notPressed,
          ]}
          unstable_pressDelay={PRESS_DELAY}
          onPress={() => onPress("5")}
        >
          <Text style={styles.keyText}>5</Text>
        </Pressable>
        <Pressable
          style={({ pressed }) => [
            styles.key,
            styles.keySix,
            pressed ? styles.pressed : styles.notPressed,
          ]}
          unstable_pressDelay={PRESS_DELAY}
          onPress={() => onPress("6")}
        >
          <Text style={styles.keyText}>6</Text>
        </Pressable>
      </View>
      <View style={[styles.row, styles.thirdRow]}>
        <Pressable
          style={({ pressed }) => [
            styles.key,
            styles.keySeven,
            pressed ? styles.pressed : styles.notPressed,
          ]}
          unstable_pressDelay={PRESS_DELAY}
          onPress={() => onPress("7")}
        >
          <Text style={styles.keyText}>7</Text>
        </Pressable>
        <Pressable
          style={({ pressed }) => [
            styles.key,
            styles.keyEight,
            pressed ? styles.pressed : styles.notPressed,
          ]}
          unstable_pressDelay={PRESS_DELAY}
          onPress={() => onPress("8")}
        >
          <Text style={styles.keyText}>8</Text>
        </Pressable>
        <Pressable
          style={({ pressed }) => [
            styles.key,
            styles.keyNine,
            pressed ? styles.pressed : styles.notPressed,
          ]}
          unstable_pressDelay={PRESS_DELAY}
          onPress={() => onPress("9")}
        >
          <Text style={styles.keyText}>9</Text>
        </Pressable>
      </View>
      <View style={[styles.row, styles.fourthRow]}>
        <Pressable
          style={({ pressed }) => [
            styles.key,
            styles.keyDot,
            pressed ? styles.pressed : styles.notPressed,
          ]}
          unstable_pressDelay={PRESS_DELAY}
          onPress={() => onPress(".")}
        >
          <Text style={styles.keyText}>.</Text>
        </Pressable>
        <Pressable
          style={({ pressed }) => [
            styles.key,
            styles.keyZero,
            pressed ? styles.pressed : styles.notPressed,
          ]}
          unstable_pressDelay={PRESS_DELAY}
          onPress={() => onPress("0")}
        >
          <Text style={styles.keyText}>0</Text>
        </Pressable>
        <Pressable
          style={({ pressed }) => [
            styles.key,
            styles.keyDelete,
            pressed ? styles.pressed : styles.notPressed,
          ]}
          onPress={() => onPress("<")}
          onLongPress={handleLongPress}
          onPressOut={handlePressOut}
          delayLongPress={LONG_PRESS_DELAY}
        >
          <Delete color={colors.lightGray} size={40} style={styles.delete} />
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  keypadContainer: {
    // Add styles for the keypad container
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  row: {
    flexDirection: "row",
    // Add styles for each row
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  key: {
    // Add styles for each key
    width: 140,
    height: 80,
    justifyContent: "center",
    alignItems: "center",
  },
  pressed: {
    // Add styles for the pressed key
    backgroundColor: colors.blueGray.shade40,
  },
  notPressed: {
    // Add styles for the not pressed key
    backgroundColor: "transparent",
  },
  keyText: {
    // Add styles for the key text
    fontFamily: fonts.bold,
    fontSize: 40,
    color: colors.lightGray,
    textAlign: "center",
    textAlignVertical: "bottom",
  },
  firstRow: {
    borderBottomWidth: 1,
    borderBottomColor: colors.invisibleGray,
  },
  secondRow: {
    borderBottomWidth: 1,
    borderColor: colors.invisibleGray,
  },
  thirdRow: {
    borderBottomWidth: 1,
    borderColor: colors.invisibleGray,
  },
  keyTwo: {
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: colors.invisibleGray,
  },
  keyFive: {
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: colors.invisibleGray,
  },
  keyEight: {
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: colors.invisibleGray,
  },
  keyZero: {
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: colors.invisibleGray,
  },
  delete: {
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
  },
});

export default CustomKeypad;
