import React from "react";
import { View, StyleSheet } from "react-native";
import { AppText } from "./primitives";

function MnemonicTable({ mnemonic }) {
  return (
    <View style={styles.container}>
      {/* First Column */}
      <View style={styles.column}>
        {mnemonic.slice(0, 6).map((word, index) => {
          return (
            <View key={index} style={styles.wordContainer}>
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
            <View key={index} style={styles.wordContainer}>
              <AppText style={styles.wordIndex}>{index + 7}</AppText>
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
  },
  wordContainer: {
    flexDirection: "row", // Arrange index and word side by side
    alignItems: "center",
    marginBottom: 10, // Space between rows
  },
  wordIndex: {
    fontSize: 16,
    marginRight: 5,
  },
  word: {
    fontSize: 16,
  },
});

export default MnemonicTable;
