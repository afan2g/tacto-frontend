import React from "react";
import { View, StyleSheet, Text } from "react-native";
import SkeletonLoader from "./SkeletonLoader";
function UserCardSkeletonLoader({ scale = 1, style }) {
  return (
    <View style={[styles.container, style]}>
      <SkeletonLoader
        height={54 * scale}
        width={54 * scale}
        radius={(54 * scale) / 2}
        duration={1000}
      />
      <View style={styles.usernameContainer}>
        <SkeletonLoader width={200} height={20} duration={1000} />
        <SkeletonLoader width={80} height={16} duration={1000} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    justifyContent: "flex-start",
    paddingHorizontal: 10,
  },
  usernameContainer: {
    alignItems: "flex-start",
    paddingHorizontal: 10,
    justifyContent: "space-between",
    gap: 5,
  },
});

export default UserCardSkeletonLoader;
