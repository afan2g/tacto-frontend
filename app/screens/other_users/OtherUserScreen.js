import React from "react";
import {
  StyleSheet,
  ScrollView,
  useWindowDimensions,
  View,
} from "react-native";
import { X } from "lucide-react-native";
import { OtherUserHeader } from "../../components/cards";
import { FAKE_OTHER_USERS } from "../../data/fakeData";
import OtherUserTabView from "../../navigation/OtherUserTabView";
import { Screen } from "../../components/primitives";
import colors from "../../config/colors";
import Animated, {
  useAnimatedScrollHandler,
  useSharedValue,
  useAnimatedStyle,
  interpolate,
} from "react-native-reanimated";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

const HEADER_MAX_HEIGHT = 300;
const HEADER_MIN_HEIGHT = 50;

function OtherUserScreen(props) {
  const handleClose = () => {
    console.log("Close");
  };

  const sv = useSharedValue(0);
  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      sv.value = event.contentOffset.y;
    },
  });

  const animatedHeaderStyle = useAnimatedStyle(() => {
    const height = interpolate(
      sv.value,
      [0, HEADER_MAX_HEIGHT],
      [HEADER_MAX_HEIGHT, HEADER_MIN_HEIGHT]
    );
    return {
      height,
    };
  });

  const { height: screenHeight } = useWindowDimensions();

  return (
    <Screen style={styles.screen}>
      <Animated.View style={[styles.topHeader]}>
        <X
          size={30}
          color={colors.lightGray}
          style={[styles.closeIcon]}
          onPress={handleClose}
        />
      </Animated.View>
      <Animated.View style={[styles.headerContainer, animatedHeaderStyle]}>
        <OtherUserHeader user={FAKE_OTHER_USERS[2]} />
      </Animated.View>

      <Animated.ScrollView
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        // This paddingTop ensures content starts below the header
        contentContainerStyle={{ paddingTop: HEADER_MAX_HEIGHT }}
      >
        {/* 
          Wrap the TabView in a View that ensures it has enough space.
          The minHeight ensures the TabView has room to display content.
        */}
        <View style={{ minHeight: screenHeight, backgroundColor: colors.blue }}>
          <OtherUserTabView />
        </View>
      </Animated.ScrollView>

      {/* The header is absolutely positioned on top */}
    </Screen>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.blue,
    paddingHorizontal: 0,
  },
  topHeader: {
    width: "100%",
    zIndex: 10,
  },
  closeIcon: {
    position: "absolute",
    left: 20,
    zIndex: 10,
  },
  headerContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    overflow: "hidden",
    backgroundColor: colors.blue,
    zIndex: 5,
    alignItems: "center",
    justifyContent: "flex-end",
    paddingBottom: 20,
  },
});

export default OtherUserScreen;
