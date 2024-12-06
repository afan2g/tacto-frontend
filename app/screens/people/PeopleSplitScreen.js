import React from "react";
import { View, StyleSheet } from "react-native";
import PeopleSplitCardPreview from "../../components/cards/PeopleSplitCardPreview";
import { FAKE_SPLIT_GROUPS_PREVIEW } from "../../data/fakeData";
function PeopleSplitScreen(props) {
  return (
    <View style={styles.screen}>
      <PeopleSplitCardPreview group={FAKE_SPLIT_GROUPS_PREVIEW[0]} />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    paddingTop: 10,
    flex: 1,
  },
});

export default PeopleSplitScreen;
