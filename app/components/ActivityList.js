import React, {
  useImperativeHandle,
  useMemo,
  forwardRef,
  useRef,
  useCallback,
  useState,
} from "react";
import { View, StyleSheet, Text } from "react-native";
import Animated from "react-native-reanimated";
import { AppCardSeparator, TransactionCard } from "./cards";
import formatRelativeTime from "../utils/formatRelativeTime";
import { FlashList } from "@shopify/flash-list";
import TransactionCardSkeletonLoader from "./skeletons/TransactionCardSkeletonLoader";
import { colors } from "../config";
const AnimatedFlashList = Animated.createAnimatedComponent(FlashList);

const EmptyListComponent = () => {
  return (
    <View style={[styles.emptyList]}>
      <Text style={{ color: colors.lightGray, textAlign: "center" }}>
        No transactions with this user.
      </Text>
    </View>
  );
};

const ActivityList = forwardRef((props, ref) => {
  const {
    sharedTransactions,
    user,
    profile,
    navigation,
    minHeight,
    headerSize,
  } = props;
  const minListHeight = minHeight.height;
  const listRef = useRef(null);
  const initialRender = useRef(true);
  const [bottomPadding, setBottomPadding] = useState(0);
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

  const onContentSizeChange = useCallback(
    (_, contentHeight) => {
      // Don't adjust padding while showing skeleton placeholders
      if (!sharedTransactions) {
        return;
      }
      if (!initialRender.current) {
        return;
      }
      if (contentHeight < 10) {
        return;
      }
      // console.log("content height change");

      // console.log("Header height:", headerSize.height);
      // console.log("header expanded height:", headerSize.heightExpanded);
      // console.log("header collapsed height:", headerSize.heightCollapsed);
      // console.log("header diff:", headerSize.headerDiff);
      // console.log("content height:", contentHeight);
      // console.log("min list height:", minListHeight);
      const diff = minListHeight - contentHeight + 32;
      // console.log("min list height - content height:", diff);
      // console.log("diff:", diff);
      setBottomPadding(diff > 0 ? diff : 0);
      initialRender.current = false;
      console.log("-------------------");
    },
    [minListHeight, sharedTransactions]
  );
  return (
    <View style={[styles.container, minHeight]}>
      <AnimatedFlashList
        ref={listRef}
        data={sharedTransactions || dataPlaceholder}
        estimatedItemSize={110}
        onContentSizeChange={onContentSizeChange}
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
        ListFooterComponent={() => <View />}
        ListFooterComponentStyle={{ height: bottomPadding }}
        overScrollMode="never"
        bounces={false}
        snapToEnd={false}
        ListEmptyComponent={EmptyListComponent}
      />
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.black,
  },
  footer: {
    height: 100, // Add some padding at the bottom to ensure scrollability
  },
  emptyList: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 40,
    borderWidth: 1,
    borderColor: colors.lightGray,
    width: "100%",
  },
});

export default ActivityList;
