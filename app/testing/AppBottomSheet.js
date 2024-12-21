import React, { useCallback, useMemo } from "react";
import { View, Text, StyleSheet } from "react-native";
import BottomSheet, { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import { forwardRef } from "react";
import { colors } from "../config";
const AppBottomSheet = forwardRef(({ onOpen }, ref) => {
  // ref
  // variables
  const data = useMemo(
    () =>
      Array(50)
        .fill(0)
        .map((_, index) => `index-${index}`),
    []
  );
  const snapPoints = useMemo(() => ["25%", "50%", "90%"], []);

  // callbacks
  const handleSheetChange = useCallback((index) => {
    console.log("handleSheetChange", index);
  }, []);

  // render
  const renderItem = useCallback(
    (item) => (
      <View key={item} style={styles.itemContainer}>
        <Text>{item}</Text>
      </View>
    ),
    []
  );
  console.log("AppBottomSheet");
  return (
    <BottomSheet
      ref={ref}
      index={1}
      snapPoints={snapPoints}
      enableDynamicSizing={false}
      onChange={handleSheetChange}
    >
      <BottomSheetScrollView contentContainerStyle={styles.contentContainer}>
        {data.map(renderItem)}
      </BottomSheetScrollView>
    </BottomSheet>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 200,
  },
  contentContainer: {
    backgroundColor: "white",
  },
  itemContainer: {
    padding: 6,
    margin: 6,
    backgroundColor: "#eee",
  },
});

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "grey",
//   },
//   contentContainer: {
//     flex: 1,
//     padding: 36,
//     alignItems: "center",
//   },
// });

export default AppBottomSheet;
