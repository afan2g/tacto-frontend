import React, { useCallback, useMemo, useRef, useState } from "react";
import { StyleSheet, useWindowDimensions } from "react-native";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import Animated, {
  interpolate,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  Extrapolation,
  useAnimatedReaction,
  runOnJS,
} from "react-native-reanimated";
import { BottomSheetView } from "@gorhom/bottom-sheet";
import {
  NavigationContainer,
  NavigationIndependentTree,
  useNavigation,
} from "@react-navigation/native";

import { colors, fonts } from "../../config";
import ActivityList from "../ActivityList";
import { OtherUserHeader } from "../cards";
import AppTabBar from "../AppTabBar";
import CollapsedHeader from "../cards/CollapsedHeader";
import { useData } from "../../contexts"; // Import useData hook

const TAB_BAR_HEIGHT = 50;
const COLLAPSED_HEADER_HEIGHT = 80;
const OVERLAY_VISIBILTIY_OFFSET = 32;
const ANIMATION_CONFIG = {
  duration: 1,
  dampingRatio: 3,
  stiffness: 500,
  overshootClamping: true,
};
const Tab = createMaterialTopTabNavigator();

const ProfileSheetContent = ({
  user,
  friendData,
  sharedTransactions,
  handleClose,
}) => {
  // Get profile from context instead of props
  const { profile } = useData();
  const layout = useWindowDimensions();
  const [index, setIndex] = useState(0);
  const [headerHeight, setHeaderHeight] = useState(0);
  const navigation = useNavigation();
  console.log("current navigation psc:", navigation.getState().routes[0].name);
  const rendered = headerHeight > 0;

  const heightCollapsed = COLLAPSED_HEADER_HEIGHT;
  const heightExpanded = headerHeight;
  const headerDiff = heightExpanded - heightCollapsed;

  const handleHeaderLayout = useCallback((event) => {
    setHeaderHeight(event.nativeEvent.layout.height);
  }, []);

  const activityRef = useRef(null);
  const statsRef = useRef(null);

  const activityScrollValue = useSharedValue(0);
  const statsScrollValue = useSharedValue(0);

  // Function to scroll tabs that runs on JS thread
  const scrollStatsToOffset = useCallback((offset, animated) => {
    if (statsRef.current) {
      statsRef.current.scrollToOffset({
        offset,
        animated,
      });
    }
  }, []);

  const scrollActivityToOffset = useCallback((offset, animated) => {
    if (activityRef.current) {
      activityRef.current.scrollToOffset({
        offset,
        animated,
      });
    }
  }, []);

  // Create scroll handlers for each tab that update the scroll position only
  const createScrollHandler = (scrollValue) =>
    useAnimatedScrollHandler({
      onScroll: (event) => {
        // Update the individual tab's scroll position
        scrollValue.value = event.contentOffset.y;
      },
      // We don't need to handle snap events specially anymore
      // as isHeaderCollapsed is derived from scroll values
    });

  const activityScrollHandler = createScrollHandler(activityScrollValue);
  const statsScrollHandler = createScrollHandler(statsScrollValue);

  // Get current tab's scroll value
  const currentTabScrollValue = useDerivedValue(() => {
    return index === 0 ? activityScrollValue.value : statsScrollValue.value;
  }, [index]);

  // Define a small tolerance value for scroll position comparisons
  const SCROLL_TOLERANCE = 2.0;

  // Derive the header collapsed state from the current scroll position with tolerance
  const isHeaderCollapsed = useDerivedValue(() => {
    // Use tolerance to account for small differences in snap positions
    return currentTabScrollValue.value >= headerDiff - SCROLL_TOLERANCE;
  }, [currentTabScrollValue, headerDiff]);

  // Calculate translateY based on the current tab's scroll position
  const translateY = useDerivedValue(() => {
    return -Math.min(currentTabScrollValue.value, headerDiff);
  }, [currentTabScrollValue, headerDiff]);

  useAnimatedReaction(
    () => isHeaderCollapsed.value,
    (current, prev) => {
      if (current !== prev) {
        if (current) {
          // Header is collapsed
          if (index === 0) {
            runOnJS(scrollStatsToOffset)(headerDiff, false);
          } else if (index === 1) {
            runOnJS(scrollActivityToOffset)(headerDiff, false);
          }
        } else {
          // Header is expanded
          if (index === 0) {
            runOnJS(scrollStatsToOffset)(0, false);
          } else if (index === 1) {
            runOnJS(scrollActivityToOffset)(0, false);
          }
        }
      }
    }
  );
  const tabBarAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: translateY.value }],
    };
  });

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
  });

  // Calculate a proper minimum height to ensure scrollability
  const calculatedMinHeight = useMemo(() => {
    // We want to ensure the content is tall enough that:
    // 1. The header can be fully collapsed
    // 2. There's enough content to scroll even with minimal data
    return layout.height + headerDiff; // Add extra padding to ensure scrollability
  }, [layout.height, headerDiff]);

  const contentContainerStyle = useMemo(
    () => ({
      paddingTop: rendered ? headerHeight + TAB_BAR_HEIGHT : 0,
      backgroundColor: colors.black,
    }),
    [rendered, headerHeight, calculatedMinHeight]
  );

  const sharedProps = useMemo(
    () => ({
      minHeight: { height: calculatedMinHeight },
      contentContainerStyle,
      scrollIndicatorInsets: {
        top: headerHeight,
      },
      snapToOffsets: [0, headerDiff],
    }),
    [contentContainerStyle, headerHeight, headerDiff, calculatedMinHeight]
  );

  const renderActivityList = useCallback(() => {
    return (
      <ActivityList
        sharedTransactions={sharedTransactions}
        user={user}
        profile={profile}
        ref={activityRef}
        onScroll={activityScrollHandler}
        {...sharedProps}
      />
    );
  }, [sharedProps, activityScrollHandler, sharedTransactions, user, profile]);

  const renderStatsList = useCallback(() => {
    return (
      <ActivityList
        sharedTransactions={sharedTransactions}
        user={user}
        profile={profile}
        ref={statsRef}
        onScroll={statsScrollHandler}
        {...sharedProps}
      />
    );
  }, [sharedProps, statsScrollHandler, sharedTransactions, user, profile]);

  const tabBarStyle = useMemo(
    () => [
      rendered ? styles.tabBarContainer : undefined,
      { top: rendered ? headerHeight : undefined },
      tabBarAnimatedStyle,
    ],
    [rendered, headerHeight, tabBarAnimatedStyle]
  );

  const handleIndexChange = useCallback((newIndex) => {
    setIndex(newIndex);
  }, []);

  const renderTabBar = useCallback(
    (props) => (
      <Animated.View style={tabBarStyle}>
        <AppTabBar onIndexChange={handleIndexChange} {...props} />
      </Animated.View>
    ),
    [tabBarStyle, handleIndexChange]
  );

  const headerContainerStyle = useMemo(
    () => [rendered ? styles.headerContainer : undefined, headerAnimatedStyle],
    [rendered, headerAnimatedStyle]
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
  });

  const collapsedHeaderStyle = useMemo(
    () => [
      styles.collapsedHeaderStyle,
      {
        height: heightCollapsed,
      },
      collapsedHeaderAnimatedStyle,
    ],
    [heightCollapsed, collapsedHeaderAnimatedStyle]
  );

  return (
    <BottomSheetView style={styles.bottomSheetContainer}>
      <Animated.View onLayout={handleHeaderLayout} style={headerContainerStyle}>
        <OtherUserHeader
          user={user}
          friendData={friendData}
          style={styles.header}
          handleClose={handleClose}
        />
      </Animated.View>
      <Animated.View style={collapsedHeaderStyle}>
        <CollapsedHeader user={user} />
      </Animated.View>
      <NavigationIndependentTree>
        <NavigationContainer independent={true}>
          <Tab.Navigator
            tabBar={renderTabBar}
            screenOptions={{
              tabBarScrollEnabled: true,
              tabBarLabelStyle: {
                fontFamily: fonts.bold,
                textTransform: "capitalize",
                fontSize: 16,
              },
              tabBarStyle: {
                backgroundColor: colors.black,
                // Remove borders and elevation
                borderTopWidth: 0,
                borderBottomWidth: 0,
                elevation: 0,
                shadowOpacity: 0,
              },
              tabBarItemStyle: {
                width: layout.width / 2,
                // Remove any borders
                borderWidth: 0,
              },
              tabBarIndicatorStyle: { backgroundColor: colors.yellow },
              tabBarActiveTintColor: colors.lightGray,
              tabBarInactiveTintColor: colors.grayOpacity50,
              animationEnabled: false,
            }}
          >
            <Tab.Screen name="activity">{renderActivityList}</Tab.Screen>
            <Tab.Screen name="stats">{renderStatsList}</Tab.Screen>
          </Tab.Navigator>
        </NavigationContainer>
      </NavigationIndependentTree>
    </BottomSheetView>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.black,
  },
  header: {
    paddingTop: 0,
    paddingBottom: 20,
    backgroundColor: colors.black,
    // Remove any potential border
    borderWidth: 0,
  },
  bottomSheetContainer: {
    flex: 1,
    backgroundColor: colors.black, // Ensure this matches the modal background
    marginTop: -1,
    paddingTop: -1,
  },
  bottomSheetModal: {
    borderWidth: 0,
    backgroundColor: colors.black,
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    shadowColor: colors.lightGray,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.black,
    padding: 20,
  },
  errorText: {
    color: colors.lightGray,
    fontSize: 16,
    textAlign: "center",
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
    backgroundColor: colors.black, // Ensure consistent background
    // Remove any borders that might be causing lines
    borderTopWidth: 0,
    borderBottomWidth: 0,
    elevation: 0, // Remove Android elevation shadow
    shadowOpacity: 0, // Remove iOS shadow
  },
  headerContainer: {
    top: 0,
    left: 0,
    right: 0,
    position: "absolute",
    zIndex: 1,
    backgroundColor: colors.black, // Ensure consistent background
    // Remove any borders
    borderBottomWidth: 0,
  },
  collapsedHeaderStyle: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.black,
    justifyContent: "center",
    zIndex: 2,
    alignItems: "center",
    flexDirection: "row",
    // Remove any borders
    borderBottomWidth: 0,
    borderTopWidth: 0,
  },
});
export default ProfileSheetContent;
