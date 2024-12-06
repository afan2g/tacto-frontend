import React from "react";
import { View, StyleSheet } from "react-native";
import { AppText } from "../primitives";
import { colors, fonts } from "../../config";

function PeopleSplitCardPreview({ group, style }) {
  const { title, recentTransactions, volume } = group;
  return (
    <View style={[styles.container, style]}>
      <View style={styles.leftContainer}>
        <AppText style={styles.title}>{title}</AppText>
        <AppText style={styles.subtitle}>
          {recentTransactions} new transaction{recentTransactions !== 1 && "s"}
        </AppText>
      </View>
      <View style={styles.rightContainer}>
        <AppText style={styles.title}>${volume}</AppText>
        <AppText style={styles.subtitle}>volume</AppText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
  },
  leftContainer: {
    justifyContent: "flex-start",
    alignItems: "flex-start",
  },
  rightContainer: {
    justifyContent: "flex-end",
    alignItems: "flex-end",
  },
  title: {
    fontSize: 24,
    fontFamily: fonts.medium,
    color: colors.lightGray,
    paddingBottom: 2,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: fonts.regular,
    color: colors.fadedGray,
  },
});

export default PeopleSplitCardPreview;
