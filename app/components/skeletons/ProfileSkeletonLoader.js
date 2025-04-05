import React from "react";
import { View, StyleSheet, useWindowDimensions } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withDelay,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { colors } from "../../config";
import { BottomSheetView } from "@gorhom/bottom-sheet";
import { UserCardVertical } from "../cards";

const TAB_BAR_HEIGHT = 50;
const SKELETON_ANIMATION_DURATION = 1500;

const ProfileSkeletonLoader = ({ user }) => {
  const layout = useWindowDimensions();
  const insets = useSafeAreaInsets();

  // Animation values for shimmer effect
  const shimmerAnimation = useSharedValue(0);
  console.log("skeletonloader");
  // Start shimmer animation
  React.useEffect(() => {
    shimmerAnimation.value = withRepeat(
      withTiming(1, { duration: SKELETON_ANIMATION_DURATION }),
      -1, // Infinite repeat
      true // Reverse
    );
  }, []);

  // Create shimmer animation style
  const createShimmerStyle = (delay = 0) => {
    return useAnimatedStyle(() => {
      const animatedValue =
        delay > 0
          ? withDelay(delay, shimmerAnimation.value)
          : shimmerAnimation.value;

      return {
        opacity: 0.3 + animatedValue * 0.4,
        backgroundColor: colors.grayOpacity50,
      };
    });
  };

  // Shimmer styles with different delays for a wave effect
  const headerShimmerStyle = createShimmerStyle(0);
  const statsShimmerStyle = createShimmerStyle(100);
  const contentShimmerStyle = createShimmerStyle(200);

  // Render the skeleton items for the activity feed
  const renderSkeletonItems = () => {
    return Array(8)
      .fill(0)
      .map((_, index) => (
        <View
          key={`skeleton-item-${index}`}
          style={styles.skeletonItemContainer}
        >
          <Animated.View
            style={[styles.skeletonAvatar, createShimmerStyle(index * 50)]}
          />
          <View style={styles.skeletonContent}>
            <Animated.View
              style={[
                styles.skeletonText,
                { width: "60%" },
                createShimmerStyle(index * 50 + 25),
              ]}
            />
            <Animated.View
              style={[
                styles.skeletonText,
                { width: "80%", height: 12 },
                createShimmerStyle(index * 50 + 50),
              ]}
            />
          </View>
          <Animated.View
            style={[styles.skeletonAmount, createShimmerStyle(index * 50 + 75)]}
          />
        </View>
      ));
  };

  return (
    <BottomSheetView style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header skeleton */}
      <View style={styles.headerContainer}>
        {user ? (
          <UserCardVertical user={user} scale={0.8} />
        ) : (
          <View style={styles.headerTop}>
            <Animated.View
              style={[
                styles.skeletonAvatar,
                styles.profileAvatar,
                headerShimmerStyle,
              ]}
            />
            <View style={styles.headerTopContent}>
              <Animated.View
                style={[
                  styles.skeletonText,
                  { width: 160 },
                  headerShimmerStyle,
                ]}
              />
              <Animated.View
                style={[
                  styles.skeletonText,
                  { width: 120, height: 12 },
                  headerShimmerStyle,
                ]}
              />
            </View>
          </View>
        )}

        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Animated.View
              style={[styles.skeletonText, { width: 50 }, statsShimmerStyle]}
            />
            <Animated.View
              style={[
                styles.skeletonText,
                { width: 70, height: 12 },
                statsShimmerStyle,
              ]}
            />
          </View>
          <View style={styles.statItem}>
            <Animated.View
              style={[styles.skeletonText, { width: 50 }, statsShimmerStyle]}
            />
            <Animated.View
              style={[
                styles.skeletonText,
                { width: 70, height: 12 },
                statsShimmerStyle,
              ]}
            />
          </View>
          <View style={styles.statItem}>
            <Animated.View
              style={[styles.skeletonText, { width: 50 }, statsShimmerStyle]}
            />
            <Animated.View
              style={[
                styles.skeletonText,
                { width: 70, height: 12 },
                statsShimmerStyle,
              ]}
            />
          </View>
        </View>
      </View>

      {/* Tab bar skeleton */}
      <View style={styles.tabBarContainer}>
        <Animated.View
          style={[
            styles.skeletonTab,
            { width: layout.width / 2 },
            contentShimmerStyle,
          ]}
        />
        <Animated.View
          style={[
            styles.skeletonTab,
            { width: layout.width / 2 },
            contentShimmerStyle,
          ]}
        />
      </View>

      {/* Activity list skeleton */}
      <View style={styles.contentContainer}>{renderSkeletonItems()}</View>
    </BottomSheetView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.black,
  },
  headerContainer: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 20,
  },
  headerTop: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  headerTopContent: {
    marginLeft: 16,
    flex: 1,
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 16,
  },
  statItem: {
    alignItems: "center",
    justifyContent: "center",
  },
  tabBarContainer: {
    height: TAB_BAR_HEIGHT,
    flexDirection: "row",
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.grayOpacity50,
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  skeletonItemContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.grayOpacity50,
  },
  skeletonAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  profileAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  skeletonContent: {
    flex: 1,
    marginLeft: 12,
    justifyContent: "center",
  },
  skeletonText: {
    height: 16,
    borderRadius: 4,
    marginVertical: 4,
  },
  skeletonAmount: {
    width: 60,
    height: 24,
    borderRadius: 4,
  },
  skeletonTab: {
    height: TAB_BAR_HEIGHT - 4,
    borderRadius: 4,
    margin: 2,
  },
});

export default ProfileSkeletonLoader;
