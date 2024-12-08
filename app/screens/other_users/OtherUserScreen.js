import React from "react";
import { View, StyleSheet } from "react-native";
import { X } from "lucide-react-native";
import { OtherUserHeader } from "../../components/cards";
import { FAKE_OTHER_USERS } from "../../data/fakeData";
import OtherUserTabView from "../../navigation/OtherUserTabView";
import { Screen } from "../../components/primitives";
import colors from "../../config/colors";
function OtherUserScreen(props) {
  const handleClose = () => {
    console.log("Close");
  };
  return (
    <Screen style={styles.screen}>
      <X
        size={30}
        color={colors.lightGray}
        style={styles.closeIcon}
        onPress={handleClose}
      />

      <OtherUserHeader user={FAKE_OTHER_USERS[2]} />
      <OtherUserTabView />
    </Screen>
  );
}

const styles = StyleSheet.create({
  screen: {
    paddingHorizontal: 0,
  },
  closeIcon: {
    position: "absolute",
    left: 20,
  },
});

export default OtherUserScreen;
