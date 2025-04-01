import React, {
  useCallback,
  useMemo,
  useRef,
  useState,
  useEffect,
} from "react";
import { View, StyleSheet, useWindowDimensions } from "react-native";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import Animated, {
  interpolate,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withTiming,
  Extrapolation,
  useAnimatedReaction,
  runOnJS,
} from "react-native-reanimated";

import { colors, fonts } from "../config";

import { useSafeAreaInsets } from "react-native-safe-area-context";
import ActivityList from "../components/ActivityList";
import { OtherUserHeader } from "../components/cards";
import AppTabBar from "../components/AppTabBar";
import { X } from "lucide-react-native";
import CollapsedHeader from "../components/cards/CollapsedHeader";

const TAB_BAR_HEIGHT = 50;
const COLLAPSED_HEADER_HEIGHT = 20;
const OVERLAY_VISIBILTIY_OFFSET = 32;
const ANIMATION_CONFIG = {
  duration: 10,
};
const Tab = createMaterialTopTabNavigator();

function Profile({ navigation, route, ...props }) {
  const { user, friendData, sharedTransactions } = route.params;
  console.log("route.params", route.params);
  console.log("userprofilescreen friendData", friendData);
  const layout = useWindowDimensions();
  const insets = useSafeAreaInsets();

  const [index, setIndex] = useState(0);
  const [headerHeight, setHeaderHeight] = useState(0);

  const rendered = headerHeight > 0;
  const defaultHeaderHeight = insets.top + COLLAPSED_HEADER_HEIGHT;

  const headerConfig = {
    heightCollapsed: defaultHeaderHeight,
    heightExpanded: headerHeight,
  };

  const { heightCollapsed, heightExpanded } = headerConfig;
  const headerDiff = heightExpanded - heightCollapsed;

  const handleHeaderLayout = useCallback(
    (event) => {
      setHeaderHeight(event.nativeEvent.layout.height - insets.top);
    },
    [insets.top]
  );

  const activityRef = useRef(null);
  const statsRef = useRef(null);

  const activityScrollValue = useSharedValue(0);
  const statsScrollValue = useSharedValue(0);

  const createScrollHandler = (scrollValue) =>
    useAnimatedScrollHandler((event) => {
      scrollValue.value = event.contentOffset.y;
    });

  const activityScrollHandler = createScrollHandler(activityScrollValue);
  const statsScrollHandler = createScrollHandler(statsScrollValue);

  const currentScrollValue = useDerivedValue(
    () => (index === 0 ? activityScrollValue.value : statsScrollValue.value),
    [index]
  );

  const translateY = useDerivedValue(() => {
    return withTiming(
      -Math.min(currentScrollValue.value, headerDiff),
      ANIMATION_CONFIG
    );
  }, [currentScrollValue, headerDiff]);

  const tabBarAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: translateY.value }],
    };
  }, [translateY]);

  const headerAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: translateY.value }],
      opacity: interpolate(
        translateY.value,
        [-headerDiff, 0],
        [0, 1],
        Extrapolation.CLAMP
      ),
    };
  }, [translateY, headerDiff]);

  const contentContainerStyle = useMemo(
    () => ({
      paddingTop: rendered ? headerHeight + TAB_BAR_HEIGHT : 0,
      paddingBottom: insets.bottom,
      // minHeight: layout.height + headerDiff,
    }),
    [rendered, headerHeight, insets.bottom]
  );

  const sharedProps = useMemo(
    () => ({
      minHeight: layout.height + headerDiff,
      contentContainerStyle,
      scrollEventThrottle: 1,
      scrollIndicatorInsets: {
        top: headerHeight,
        bottom: insets.bottom,
      },
      snapToOffsets: [0, headerDiff],
    }),
    [
      contentContainerStyle,
      headerHeight,
      insets.bottom,
      headerDiff,
      layout.height,
    ]
  );

  const renderActivityList = useCallback(
    () => (
      <ActivityList
        data={sharedTransactions}
        user={user}
        ref={activityRef}
        onScroll={activityScrollHandler}
        {...sharedProps}
      />
    ),
    [sharedProps, activityScrollHandler]
  );

  const renderStatsList = useCallback(
    () => (
      <ActivityList
        data={sharedTransactions}
        user={user}
        ref={statsRef}
        onScroll={statsScrollHandler}
        {...sharedProps}
      />
    ),
    [sharedProps, statsScrollHandler]
  );

  const tabBarStyle = useMemo(
    () => [
      rendered ? styles.tabBarContainer : undefined,
      { top: rendered ? headerHeight : undefined },
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
      rendered ? styles.headerContainer : undefined,
      { paddingTop: insets.top },
      headerAnimatedStyle,
    ],
    [rendered, insets.top, headerAnimatedStyle]
  );

  const collapsedHeaderAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: interpolate(
        translateY.value,
        [-headerDiff, OVERLAY_VISIBILTIY_OFFSET - headerDiff, 0],
        [1, 0, 0],
        Extrapolation.CLAMP
      ),
    };
  }, [translateY, headerDiff]);

  const collapsedHeaderStyle = useMemo(
    () => [
      styles.collapsedHeaderStyle,
      {
        height: heightCollapsed + insets.top,
        paddingTop: insets.top,
      },
      collapsedHeaderAnimatedStyle,
    ],
    [heightCollapsed, insets.top, collapsedHeaderAnimatedStyle]
  );

  // Create states to hold the latest offsets in a React-friendly manner
  const [activityOffset, setActivityOffset] = useState(0);
  const [statsOffset, setStatsOffset] = useState(0);

  // Update activityOffset when activityScrollValue changes
  useAnimatedReaction(
    () => activityScrollValue.value,
    (val) => {
      runOnJS(setActivityOffset)(val);
    },
    []
  );

  // Update statsOffset when statsScrollValue changes
  useAnimatedReaction(
    () => statsScrollValue.value,
    (val) => {
      runOnJS(setStatsOffset)(val);
    },
    []
  );

  // Sync offsets between the lists
  useEffect(() => {
    const currentOffset = index === 0 ? activityOffset : statsOffset;
    const otherRef = index === 0 ? statsRef : activityRef;

    if (currentOffset >= 0 && currentOffset <= headerDiff) {
      otherRef.current?.scrollToOffset({
        offset: currentOffset,
        animated: false,
      });
    }
  }, [index, headerDiff, activityOffset, statsOffset]);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <Animated.View onLayout={handleHeaderLayout} style={headerContainerStyle}>
        <OtherUserHeader user={user} friendData={friendData} />
      </Animated.View>
      <X
        color={colors.lightGray}
        size={24}
        style={[styles.closeIcon, { top: insets.top + 16 }]}
        onPress={() => navigation.goBack()}
      />
      <Animated.View style={collapsedHeaderStyle}>
        <CollapsedHeader user={user} />
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
  },
});

export default React.memo(Profile);
