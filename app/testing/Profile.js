import React, { useCallback, useEffect, useMemo } from "react";
import { View, StyleSheet, useWindowDimensions } from "react-native";
import { TabView, TabBar } from "react-native-tab-view";
import {
  createMaterialTopTabNavigator,
  useTabAnimation,
  MaterialTopTabBar,
} from "@react-navigation/material-top-tabs";
import Animated, {
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

const TAB_BAR_HEIGHT = 50;
const HEADER_HEIGHT = 50;

const Tab = createMaterialTopTabNavigator();
function Profile(props) {
  const layout = useWindowDimensions();
  const insets = useSafeAreaInsets();

  const [index, setIndex] = React.useState(0); // 0: activity, 1: stats
  const [headerHeight, setHeaderHeight] = React.useState(0); //determine the height of the header

  const rendered = headerHeight > 0; //determine if the header has been rendered
  const defaultHeaderHeight = insets.top + HEADER_HEIGHT; //default height of the header

  const headerConfig = {
    //configurations for the header
    heightCollapsed: defaultHeaderHeight,
    heightExpanded: headerHeight,
  };

  const { heightCollapsed, heightExpanded } = headerConfig;
  const headerDiff = heightExpanded - heightCollapsed; //difference between the expanded and collapsed header

  const handleHeaderLayout = (event) => {
    //handle the layout of the header
    setHeaderHeight(306);
  };

  useEffect(() => {
    console.log("Tab index:", index);
  }, [index]);

  const activityRef = React.useRef(null);
  const statsRef = React.useRef(null);

  const activityScrollValue = useSharedValue(0);
  const activityScrollHandler = useAnimatedScrollHandler((event) => {
    activityScrollValue.value = event.contentOffset.y;
  });

  const statsScrollValue = useSharedValue(0);
  const statsScrollHandler = useAnimatedScrollHandler((event) => {
    console.log("Stats scroll offset:", event.contentOffset.y);

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
      top: heightExpanded + TAB_BAR_HEIGHT, // Add tab bar height to the top inset
    },
  };

  const renderActivityList = useCallback(
    () => (
      <ActivityList
        data={FAKE_HOME_SCREEN_DATA}
        ref={activityRef}
        onScroll={activityScrollHandler}
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

  const renderTabBar = (props) =>
    useCallback(
      <Animated.View style={tabBarStyle}>
        <AppTabBar onIndexChange={setIndex} {...props} />
      </Animated.View>,
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
  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <Animated.View onLayout={handleHeaderLayout} style={headerContainerStyle}>
        <OtherUserHeader user={FAKE_OTHER_USERS[0]} />
      </Animated.View>
      {/* <Animated.View style={styles.collapsedHeaderStyle}>
        <AppText>{FAKE_OTHER_USERS[0].fullName}</AppText>
      </Animated.View> */}
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
    zIndex: 0,
    height: 50,
    backgroundColor: colors.blue,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default Profile;
