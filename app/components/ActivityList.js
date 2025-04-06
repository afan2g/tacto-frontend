import React, { useImperativeHandle, useMemo } from "react";
import { View, StyleSheet, Text } from "react-native";
import Animated from "react-native-reanimated";
import { AppCardSeparator, TransactionCard } from "./cards";
import formatRelativeTime from "../utils/formatRelativeTime";
import { FlashList } from "@shopify/flash-list";
import TransactionCardSkeletonLoader from "./skeletons/TransactionCardSkeletonLoader";
const AnimatedFlashList = Animated.createAnimatedComponent(FlashList);

const ActivityList = React.forwardRef((props, ref) => {
  const { sharedTransactions, user, profile, navigation, minHeight } = props;
  const listRef = React.useRef(null);

  const dataPlaceholder = useMemo(() => {
    return Array.from({ length: 10 }, (_, index) => null);
  }, []);

  // Expose the scrollToOffset method to the parent component
  useImperativeHandle(ref, () => ({
    scrollToOffset: (params) => {
      listRef.current?.scrollToOffset(params);
    },
    // Pass through any other FlashList methods that might be needed
    recordInteraction: () => listRef.current?.recordInteraction(),
    scrollToEnd: (params) => listRef.current?.scrollToEnd(params),
    scrollToIndex: (params) => listRef.current?.scrollToIndex(params),
    getScrollableNode: () => listRef.current?.getScrollableNode(),
  }));

  return (
    <View style={[styles.container, minHeight]}>
      <AnimatedFlashList
        ref={listRef}
        data={sharedTransactions || dataPlaceholder}
        estimatedItemSize={110}
        renderItem={({ item }) =>
          // Render a placeholder if the item is null
          item === null ? (
            <TransactionCardSkeletonLoader />
          ) : (
            // Otherwise, render the actual TransactionCard component
            <TransactionCard
              transaction={{
                ...item,
                time: formatRelativeTime(item.updated_at),
                from: item.from_user_id === profile.id ? profile : user,
                to: item.to_user_id === profile.id ? profile : user,
                memo: "",
                score: 0,
                commentCount: 0,
                txid: item.hash,
              }}
              navigation={navigation}
            />
          )
        }
        nestedScrollEnabled={false}
        keyExtractor={(item, index) => item?.hash || `placeholder-${index}`}
        {...props}
        showsVerticalScrollIndicator={false}
        horizontal={false}
        ItemSeparatorComponent={() => <AppCardSeparator />}
        ListFooterComponent={() => <View style={styles.footer} />}
        overScrollMode="never"
        bounces={false}
        snapToEnd={false}
      />
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  footer: {
    height: 100, // Add some padding at the bottom to ensure scrollability
  },
});

export default ActivityList;
