import React from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import fonts from "../config/fonts";
import colors from "../config/colors";
import { Delete } from "lucide-react-native";

const CustomKeypad = ({ onPress }) => {
  return (
    <View style={styles.keypadContainer}>
      <View style={[styles.row, styles.firstRow]}>
        <TouchableOpacity
          style={[styles.key, styles.keyOne]}
          onPress={() => onPress("1")}
        >
          <Text style={styles.keyText}>1</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.key, styles.keyTwo]}
          onPress={() => onPress("2")}
        >
          <Text style={styles.keyText}>2</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.key, styles.keyThree]}
          onPress={() => onPress("3")}
        >
          <Text style={styles.keyText}>3</Text>
        </TouchableOpacity>
      </View>

      <View style={[styles.row, styles.secondRow]}>
        <TouchableOpacity
          key={"4"}
          style={[styles.key, styles.keyFour]}
          onPress={() => onPress("4")}
        >
          <Text style={styles.keyText}>4</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.key, styles.keyFive]}
          onPress={() => onPress("5")}
        >
          <Text style={styles.keyText}>5</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.key, styles.keySix]}
          onPress={() => onPress("6")}
        >
          <Text style={styles.keyText}>6</Text>
        </TouchableOpacity>
      </View>
      <View style={[styles.row, styles.thirdRow]}>
        <TouchableOpacity
          style={[styles.key, styles.keySeven]}
          onPress={() => onPress("7")}
        >
          <Text style={styles.keyText}>7</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.key, styles.keyEight]}
          onPress={() => onPress("8")}
        >
          <Text style={styles.keyText}>8</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.key, styles.keyNine]}
          onPress={() => onPress("9")}
        >
          <Text style={styles.keyText}>9</Text>
        </TouchableOpacity>
      </View>
      <View style={[styles.row, styles.fourthRow]}>
        <TouchableOpacity
          style={[styles.key, styles.keyDot]}
          onPress={() => onPress(".")}
        >
          <Text style={styles.keyText}>.</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.key, styles.keyZero]}
          onPress={() => onPress("0")}
        >
          <Text style={styles.keyText}>0</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.key, styles.keyDelete]}
          onPress={() => onPress("<")}
        >
          <Delete color={colors.lightGray} size={40} style={styles.delete} />
        </TouchableOpacity>
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
