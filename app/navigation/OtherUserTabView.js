import React from "react";
import { View, StyleSheet, useWindowDimensions } from "react-native";
import { TabView, SceneMap } from "react-native-tab-view";

import { OtherUserHeader } from "../components/cards";
import { FAKE_OTHER_USERS } from "../data/fakeData";
import { colors } from "../config";
import { Screen } from "../components/primitives";
const renderScene = SceneMap({
  activity: () => <View style={{ flex: 1, backgroundColor: "blue" }} />,
  stats: () => <View style={{ flex: 1, backgroundColor: "green" }} />,
});
const routes = [
  { key: "activity", title: "Activity" },
  { key: "stats", title: "Stats" },
];

function OtherUserTabView(props) {
  const layout = useWindowDimensions();
  const [index, setIndex] = React.useState(0);

  return (
    <TabView
      navigationState={{ index, routes }}
      renderScene={renderScene}
      onIndexChange={setIndex}
      initialLayout={{ width: layout.width }}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.blue,
    paddingHorizontal: 0,
  },
});

export default OtherUserTabView;
