import React from "react";
import { View, StyleSheet, FlatList } from "react-native";
import PeopleSplitCardPreview from "../../components/cards/PeopleSplitCardPreview";
import { FAKE_SPLIT_GROUPS_PREVIEW } from "../../data/fakeData";
import { TransactionCardSeparator } from "../../components/cards";
function PeopleSplitScreen(props) {
  const handleCardPress = (group) => {
    console.log("Group pressed:", group);
  };
  const handleLongPress = (group) => {
    console.log("Group long pressed:", group);
  };
  return (
    <View style={styles.screen}>
      <FlatList
        data={FAKE_SPLIT_GROUPS_PREVIEW}
        renderItem={({ item }) => (
          <PeopleSplitCardPreview
            group={item}
            onPress={() => handleCardPress(item)}
            onLongPress={() => handleLongPress(item)}
          />
        )}
        keyExtractor={(item) => item.title}
        ItemSeparatorComponent={() => <TransactionCardSeparator />}
        style={styles.flatList}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    paddingTop: 10,
    flex: 1,
  },
  flatList: {},
});

export default PeopleSplitScreen;
