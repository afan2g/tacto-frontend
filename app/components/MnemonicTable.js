import React from "react";
import { View, StyleSheet } from "react-native";
import { AppText } from "./primitives";
import { colors, fonts } from "../config";

function MnemonicTable({ mnemonic }) {
  return (
    <View style={styles.container}>
      {/* First Column */}
      <View style={styles.column}>
        {mnemonic.slice(0, 6).map((word, index) => {
          return (
            <View
              key={index}
              style={[
                styles.wordContainer,
                index === 5 && { borderBottomWidth: 0 },
              ]}
            >
              <AppText style={styles.wordIndex}>{index + 1}</AppText>
              <AppText style={styles.word}>{word}</AppText>
            </View>
          );
        })}
      </View>
      {/* Second Column */}
      <View style={styles.column}>
        {mnemonic.slice(6, 12).map((word, index) => {
          return (
            <View
              key={index}
              style={[
                styles.wordContainer,
                styles.wordContainerRight,
                index === 5 && { borderBottomWidth: 0 },
              ]}
            >
              <AppText style={[styles.wordIndex, styles.wordIndexRight]}>
                {index + 7}
              </AppText>
              <AppText style={styles.word}>{word}</AppText>
            </View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row", // Arrange columns side by side
    justifyContent: "space-between", // Add space between the columns
    padding: 10,
  },
  column: {
    flex: 1, // Each column takes equal space
    alignItems: "center",
  },
  wordContainer: {
    flexDirection: "row", // Arrange number and word side by side
    justifyContent: "space-between", // Space between number and word
    alignItems: "center",
    width: "100%", // Ensure container takes full width
    paddingVertical: 5, // Space between rows
    borderBottomWidth: 1,
    borderColor: colors.lightGray,
  },
  wordContainerRight: {
    flexDirection: "row-reverse", // Arrange number and word side by side
    borderLeftWidth: 1,
    borderColor: colors.lightGray,
  },
  wordIndex: {
    fontSize: 16,
    color: colors.lightGray,
    width: 30, // Fixed width for consistent alignment
    textAlign: "left", // Align text to the left within the space
  },
  wordIndexRight: {
    textAlign: "right", // Align text to the right within the space
  },
  word: {
    fontFamily: fonts.medium,
    color: colors.yellow,
    fontSize: 16,
    flex: 1, // Allow the word to take the remaining space
    textAlign: "center", // Center-align the word
  },
});

export default MnemonicTable;
