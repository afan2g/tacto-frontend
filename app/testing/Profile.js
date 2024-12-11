import React, { useCallback, useEffect, useLayoutEffect, useMemo } from "react";
import { View, StyleSheet, useWindowDimensions } from "react-native";
import { TabView, TabBar } from "react-native-tab-view";
import {
  createMaterialTopTabNavigator,
  useTabAnimation,
  MaterialTopTabBar,
} from "@react-navigation/material-top-tabs";
import Animated, {
  interpolate,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
} from "react-native-reanimated";

import { FAKE_HOME_SCREEN_DATA, FAKE_OTHER_USERS } from "../data/fakeData";
import { colors, fonts } from "../config";
import { AppText } from "../components/primitives";

import { useSafeAreaInsets } from "react-native-safe-area-context";
import ActivityList from "./ActivityList";
import { OtherUserHeader } from "../components/cards";
import AppTabBar from "./AppTabBar";
import { X } from "lucide-react-native";
import CollapsedHeader from "../components/cards/CollapsedHeader";

const TAB_BAR_HEIGHT = 50;
const COLLAPSED_HEADER_HEIGHT = 20;
const EXPANDED_HEADER_HEIGHT = 306;
const OVERLAY_VISIBILTIY_OFFSET = 32;
const Tab = createMaterialTopTabNavigator();
function Profile(props) {
  const layout = useWindowDimensions();
  const insets = useSafeAreaInsets();

  const [index, setIndex] = React.useState(0); // 0: activity, 1: stats
  const [headerHeight, setHeaderHeight] = React.useState(0); //determine the height of the header

  const rendered = headerHeight > 0; //determine if the header has been rendered
  const defaultHeaderHeight = insets.top + COLLAPSED_HEADER_HEIGHT; //default height of the header

  const headerConfig = {
    //configurations for the header
    heightCollapsed: defaultHeaderHeight,
    heightExpanded: headerHeight,
  };

  const { heightCollapsed, heightExpanded } = headerConfig;
  const headerDiff = heightExpanded - heightCollapsed; //difference between the expanded and collapsed header

  const handleHeaderLayout = (event) => {
    //handle the layout of the header
    setHeaderHeight(event.nativeEvent.layout.height - insets.top);
  };

  // useEffect(() => {
  //   console.log("Tab index:", index);
  // }, [index]);

  const activityRef = React.useRef(null);
  const statsRef = React.useRef(null);

  const activityScrollValue = useSharedValue(0);
  const activityScrollHandler = useAnimatedScrollHandler((event) => {
    activityScrollValue.value = event.contentOffset.y;
  });

  const handleScrollEndActivity = () => {
    if (activityScrollValue.value < headerDiff / 3) {
      activityRef.current.scrollToOffset({ offset: 0 });
    } else if (activityScrollValue.value < headerDiff) {
      activityRef.current.scrollToOffset({
        offset: headerDiff,
      });
    }
  };

  const handleScrollEndStats = () => {
    if (statsScrollValue.value < 306 / 2) {
      statsRef.current.scrollToOffset({ offset: 0 });
    } else if (statsScrollValue.value < headerDiff) {
      statsRef.current.scrollToOffset({
        offset: headerDiff,
      });
    }
  };

  const statsScrollValue = useSharedValue(0);
  const statsScrollHandler = useAnimatedScrollHandler((event) => {
    statsScrollValue.value = event.contentOffset.y;
  });

  const currentScrollValue = useDerivedValue(
    () => (index === 0 ? activityScrollValue.value : statsScrollValue.value),
    [index, activityScrollValue, statsScrollValue]
  );

  const translateY = useDerivedValue(() => {
    return -Math.min(currentScrollValue.value, headerDiff);
  });

  const tabBarAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: translateY.value }],
    };
  });

  const headerAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: translateY.value }],
      opacity: interpolate(translateY.value, [-headerDiff, 0], [0, 1]),
    };
  });

  const contentContainerStyle = {
    paddingTop: rendered ? headerHeight + TAB_BAR_HEIGHT : 0, // This ensures content starts below tab bar
    paddingBottom: insets.bottom,
    minHeight: layout.height + headerDiff,
  };

  const sharedProps = {
    contentContainerStyle,
    scrollEventThrottle: 16,
    scrollIndicatorInsets: {
      top: headerHeight,
      bottom: insets.bottom,
    },
  };

  const renderActivityList = useCallback(
    () => (
      <ActivityList
        data={FAKE_HOME_SCREEN_DATA}
        ref={activityRef}
        onScroll={activityScrollHandler}
        onScrollEndDrag={handleScrollEndActivity}
        {...sharedProps}
      />
    ),
    [sharedProps]
  );

  const renderStatsList = useCallback(
    () => (
      <ActivityList
        data={FAKE_HOME_SCREEN_DATA}
        ref={statsRef}
        onScroll={statsScrollHandler}
        onScrollEndDrag={handleScrollEndStats}
        {...sharedProps}
      />
    ),
    [sharedProps]
  );

  const tabBarStyle = useMemo(
    () => [
      rendered ? styles.tabBarContainer : "undefined",
      { top: rendered ? headerHeight : "undefined" },
      tabBarAnimatedStyle,
    ],
    [rendered, headerHeight, tabBarAnimatedStyle]
  );

  const renderTabBar = useCallback(
    (props) => (
      <Animated.View style={tabBarStyle}>
        <AppTabBar onIndexChange={setIndex} {...props} />
      </Animated.View>
    ),
    [tabBarStyle]
  );
  const headerContainerStyle = useMemo(
    () => [
      rendered ? styles.headerContainer : "undefined",
      { paddingTop: insets.top },
      headerAnimatedStyle,
    ],
    [rendered, insets.top, headerAnimatedStyle]
  );

  const collapsedHeaderAnimatedStyle = useAnimatedStyle(() => ({
    opacity: interpolate(
      translateY.value,
      [-headerDiff, OVERLAY_VISIBILTIY_OFFSET - headerDiff, 0],
      [1, 0, 0]
    ),
  }));
  const collapsedHeaderStyle = useMemo(
    () => [
      styles.collapsedHeaderStyle,
      {
        height: heightCollapsed + insets.top,
        paddingTop: insets.top,
      },
      collapsedHeaderAnimatedStyle,
    ],
    [heightCollapsed, insets.top]
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <Animated.View onLayout={handleHeaderLayout} style={headerContainerStyle}>
        <OtherUserHeader user={FAKE_OTHER_USERS[0]} />
      </Animated.View>
      <X
        color={colors.lightGray}
        size={24}
        style={[styles.closeIcon, { top: insets.top + 16 }]}
        onPress={() => console.log("Close profile")}
      />
      <Animated.View style={collapsedHeaderStyle}>
        <CollapsedHeader user={FAKE_OTHER_USERS[0]} />
      </Animated.View>
      <Tab.Navigator
        tabBar={renderTabBar}
        screenOptions={{
          tabBarLabelStyle: {
            fontFamily: fonts.bold,
            textTransform: "capitalize",
            fontSize: 16,
          },
          tabBarStyle: { backgroundColor: colors.blue },
          tabBarIndicatorStyle: { backgroundColor: colors.yellow },
          tabBarActiveTintColor: colors.lightGray,
          tabBarInactiveTintColor: colors.grayOpacity50,
        }}
      >
        <Tab.Screen name="activity">{renderActivityList}</Tab.Screen>
        <Tab.Screen name="stats">{renderStatsList}</Tab.Screen>
      </Tab.Navigator>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.blue,
  },
  closeIcon: {
    position: "absolute",
    marginLeft: 12,
    zIndex: 3,
  },
  tabBarContainer: {
    top: 0,
    left: 0,
    right: 0,
    position: "absolute",
    zIndex: 1,
  },
  tabBar: {
    backgroundColor: colors.blue,
  },
  headerContainer: {
    top: 0,
    left: 0,
    right: 0,
    position: "absolute",
    zIndex: 1,
  },
  collapsedHeaderStyle: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.blackShade40,
    justifyContent: "center",
    zIndex: 2,
    alignItems: "center",
    flexDirection: "row",
    // borderWidth: 1,
    // borderColor: "blue",
  },
});

export default Profile;
