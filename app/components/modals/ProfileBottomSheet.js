import React, {
  useCallback,
  useMemo,
  useRef,
  useState,
  useEffect,
  forwardRef,
  useImperativeHandle,
} from "react";
import { View, StyleSheet, useWindowDimensions } from "react-native";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import Animated, {
  interpolate,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useAnimatedReaction,
  useDerivedValue,
  useSharedValue,
  withTiming,
  Extrapolation,
} from "react-native-reanimated";
import BottomSheet, {
  BottomSheetModal,
  BottomSheetView,
  BottomSheetBackdrop,
} from "@gorhom/bottom-sheet";
import {
  NavigationContainer,
  NavigationIndependentTree,
} from "@react-navigation/native";

import { colors, fonts } from "../../config";
import navigationTheme from "../../navigation/navigationTheme";
import ActivityList from "../ActivityList";
import { OtherUserHeader } from "../cards";
import AppTabBar from "../AppTabBar";
import CollapsedHeader from "../cards/CollapsedHeader";
import { useBottomSheetBackHandler } from "../../hooks/useBottomSheetBackHandler";
import { DataProvider, useData } from "../../contexts";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const TAB_BAR_HEIGHT = 50;
const COLLAPSED_HEADER_HEIGHT = 80;
const OVERLAY_VISIBILTIY_OFFSET = 32;
const ANIMATION_CONFIG = {
  duration: 0,
};
const Tab = createMaterialTopTabNavigator();

const ProfileContent = ({
  user,
  profile,
  friendData,
  sharedTransactions,
  handleClose,
}) => {
  const layout = useWindowDimensions();
  const [index, setIndex] = useState(0);
  const [headerHeight, setHeaderHeight] = useState(0);

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

  // This shared value tracks ONLY the header's collapsed state, not the entire scroll position
  const isHeaderCollapsed = useSharedValue(false);

  // Create scroll handlers for each tab that update the header state
  const createScrollHandler = (scrollValue) =>
    useAnimatedScrollHandler((event) => {
      // Update the individual tab's scroll position
      scrollValue.value = event.contentOffset.y;

      // Update the header state based on whether we've scrolled past the collapse threshold
      isHeaderCollapsed.value = event.contentOffset.y >= headerDiff;
    });

  const activityScrollHandler = createScrollHandler(activityScrollValue);
  const statsScrollHandler = createScrollHandler(statsScrollValue);

  // When switching tabs, apply the current header state to the new tab if needed
  useEffect(() => {
    // Only run after render and when we have header height
    if (!headerHeight) return;

    const currentRef = index === 0 ? activityRef : statsRef;
    const currentScrollValue =
      index === 0 ? activityScrollValue : statsScrollValue;

    // If header is collapsed but the current tab isn't scrolled enough to show it
    if (isHeaderCollapsed.value && currentScrollValue.value < headerDiff) {
      // Scroll just enough to collapse the header, not the entire previous position
      currentRef.current?.scrollToOffset({
        offset: headerDiff,
        animated: false,
      });
    }
    // If header is expanded but the current tab is showing it as collapsed
    else if (
      !isHeaderCollapsed.value &&
      currentScrollValue.value >= headerDiff
    ) {
      // Scroll back to show the expanded header
      currentRef.current?.scrollToOffset({
        offset: 0,
        animated: false,
      });
    }
  }, [index, headerHeight, headerDiff]);

  // Calculate translateY based on the current tab's scroll position
  // This ensures smooth animation within each tab
  const translateY = useDerivedValue(() => {
    const currentTabScrollValue =
      index === 0 ? activityScrollValue.value : statsScrollValue.value;

    return withTiming(
      -Math.min(currentTabScrollValue, headerDiff),
      ANIMATION_CONFIG
    );
  }, [index, activityScrollValue, statsScrollValue, headerDiff]);

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
      minHeight: calculatedMinHeight,
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

  const renderActivityList = useCallback(
    () => (
      <ActivityList
        data={sharedTransactions}
        user={user}
        profile={profile}
        ref={activityRef}
        onScroll={activityScrollHandler}
        {...sharedProps}
      />
    ),
    [sharedProps, activityScrollHandler, sharedTransactions, user, profile]
  );

  const renderStatsList = useCallback(
    () => (
      <ActivityList
        data={sharedTransactions}
        user={user}
        profile={profile}
        ref={statsRef}
        onScroll={statsScrollHandler}
        {...sharedProps}
      />
    ),
    [sharedProps, statsScrollHandler, sharedTransactions, user, profile]
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
  }, [translateY, headerDiff]);

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

const ProfileBottomSheet = forwardRef(
  ({ user, friendData, sharedTransactions, onDismiss, navigation }, ref) => {
    const bottomSheetRef = useRef(null);
    const { handleSheetPositionChange } = useBottomSheetBackHandler(
      bottomSheetRef,
      onDismiss
    );

    useImperativeHandle(ref, () => ({
      present: () => bottomSheetRef.current?.present(),
      dismiss: () => bottomSheetRef.current?.dismiss(),
    }));

    const insets = useSafeAreaInsets();
    const snapPoints = useMemo(() => [364 + insets.top, "100%"], []);
    const { profile } = useData();
    const renderBackdrop = useCallback(
      (props) => (
        <BottomSheetBackdrop
          {...props}
          appearsOnIndex={0}
          disappearsOnIndex={-1}
        />
      ),
      []
    );

    const handleClose = useCallback(() => {
      bottomSheetRef.current?.dismiss();
    }, []);
    return (
      <BottomSheetModal
        ref={bottomSheetRef}
        snapPoints={snapPoints}
        onChange={handleSheetPositionChange}
        backdropComponent={renderBackdrop}
        handleIndicatorStyle={{ backgroundColor: colors.lightGray }}
        backgroundStyle={{
          backgroundColor: colors.black,
        }}
        containerStyle={{ marginTop: insets.top }}
        enableOverDrag={false}
        enableContentPanningGesture={true}
        activeOffsetY={[-30, 30]}
        style={{
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
        }}
      >
        <ProfileContent
          user={user}
          friendData={friendData}
          sharedTransactions={sharedTransactions}
          profile={profile}
          navigation={navigation}
          handleClose={handleClose}
        />
      </BottomSheetModal>
    );
  }
);

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
    backgroundColor: colors.blackShade40,
    justifyContent: "center",
    zIndex: 2,
    alignItems: "center",
    flexDirection: "row",
    // Remove any borders
    borderBottomWidth: 0,
    borderTopWidth: 0,
  },
});

export default ProfileBottomSheet;
