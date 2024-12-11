import { MaterialTopTabBar } from "@react-navigation/material-top-tabs";
import React, { useEffect, useCallback } from "react";
import { View, StyleSheet } from "react-native";

function AppTabBar({ onIndexChange, ...props }) {
  const { index } = props.state;
  // Use useCallback to memoize the function and prevent unnecessary re-renders
  useEffect(() => {
    onIndexChange(index);
  }, [index, onIndexChange]);

  return <MaterialTopTabBar {...props} />;
}

const styles = StyleSheet.create({
  container: {},
});

export default AppTabBar;
