import { MaterialTopTabBar } from "@react-navigation/material-top-tabs";
import React, { useEffect, useCallback } from "react";
import { View, StyleSheet } from "react-native";

function AppTabBar({ onIndexChange, ...props }) {
  const { index } = props.state;
  // Use useCallback to memoize the function and prevent unnecessary re-renders
  const handleIndexChange = useCallback(() => {
    if (onIndexChange) {
      onIndexChange(index);
    }
  }, [index, onIndexChange]);

  // Call the index change handler directly in the render
  useEffect(() => {
    console.log("Tab index:", index);
    handleIndexChange();
  }, [handleIndexChange]);
  return <MaterialTopTabBar {...props} />;
}

const styles = StyleSheet.create({
  container: {},
});

export default AppTabBar;
