import React from "react";
import { View, StyleSheet } from "react-native";
import { X } from "lucide-react-native";
import { OtherUserHeader } from "../../components/cards";
import { FAKE_OTHER_USERS } from "../../data/fakeData";
import OtherUserTabView from "../../navigation/OtherUserTabView";
import { Screen } from "../../components/primitives";
import colors from "../../config/colors";
import Animated, {
  useAnimatedScrollHandler,
  useSharedValue,
} from "react-native-reanimated";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
function OtherUserScreen(props) {
  const handleClose = () => {
    console.log("Close");
  };
  const sv = useSharedValue(0); // scrollview offset
  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      sv.value = event.contentOffset.y;
      console.log(sv.value);
    },
  });
  const inset = useSafeAreaInsets();
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
    flex: 1,
  },
  closeIcon: {
    position: "absolute",
    left: 20,
  },
});

export default OtherUserScreen;
