import React, { useLayoutEffect, useRef } from "react";
import { View, StyleSheet } from "react-native";
import Animated from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { OtherUserHeader } from "../components/cards";
import { FAKE_OTHER_USERS } from "../data/fakeData";
import { colors } from "../config";
import { TabView } from "react-native-tab-view";
const TAB_BAR_HEIGHT = 48;
const HEADER_HEIGHT = 306;

function Profile1(props) {
  const insets = useSafeAreaInsets();

  const headerStyle = {};
  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View>
        <OtherUserHeader user={FAKE_OTHER_USERS[0]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.blue,
  },
  header: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
  },
});

export default Profile1;
