import React from "react";
import { View, StyleSheet, useWindowDimensions } from "react-native";
import { TabView, TabBar } from "react-native-tab-view";

import { FAKE_HOME_SCREEN_DATA } from "../data/fakeData";
import { colors, fonts } from "../config";
import { AppText } from "../components/primitives";
import OtherUserActivity from "../screens/other_users/OtherUserActivity";
import OtherUserStatsScreen from "../screens/other_users/OtherUserStatsScreen";

const renderScene = ({ route, jumpTo }) => {
  switch (route.key) {
    case "activity":
      return <OtherUserActivity transactions={FAKE_HOME_SCREEN_DATA} />;
    case "stats":
      return <OtherUserStatsScreen />;
    default:
      return null;
  }
};
const routes = [
  { key: "activity", title: "Activity" },
  { key: "stats", title: "Stats" },
];

const renderTabBar = (props) => (
  <TabBar
    {...props}
    indicatorStyle={{ backgroundColor: colors.yellow }}
    style={{ backgroundColor: colors.blue, paddingVertical: 5 }}
  />
);

function OtherUserTabView(props) {
  const layout = useWindowDimensions();
  const [index, setIndex] = React.useState(0);

  return (
    <TabView
      navigationState={{ index, routes }}
      renderScene={renderScene}
      onIndexChange={setIndex}
      initialLayout={{ width: layout.width }}
      renderTabBar={renderTabBar}
      commonOptions={{
        labelStyle: {
          fontFamily: fonts.medium,
          fontSize: 16,
          textTransform: "capitalize",
        },
      }}
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
