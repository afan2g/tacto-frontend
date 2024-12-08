import React from "react";
import { View, StyleSheet } from "react-native";
import { OtherUserHeader } from "../../components/cards";
import { FAKE_OTHER_USERS } from "../../data/fakeData";
import OtherUserTabView from "../../navigation/OtherUserTabView";
import { Screen } from "../../components/primitives";

function OtherUserScreen(props) {
  return (
    <Screen style={styles.screen}>
      <OtherUserHeader user={FAKE_OTHER_USERS[2]} />
      <OtherUserTabView />
    </Screen>
  );
}

const styles = StyleSheet.create({
  screen: {
    paddingHorizontal: 0,
  },
});

export default OtherUserScreen;
