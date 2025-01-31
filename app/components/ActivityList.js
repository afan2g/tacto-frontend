import React from "react";
import { View, StyleSheet, FlatList } from "react-native";
import Animated from "react-native-reanimated";
import { AppCardSeparator, TransactionCard } from "./cards";
import { colors } from "../config";
import formatRelativeTime from "../utils/formatRelativeTime";
import { FlashList } from "@shopify/flash-list";

const AnimatedFlashList = Animated.createAnimatedComponent(FlashList);

const ActivityList = React.forwardRef((props, ref) => {
  const { data, navigation, minHeight } = props;
  return (
    <View style={[minHeight, { flex: 1 }]}>
      <AnimatedFlashList
        ref={ref}
        data={data}
        estimatedItemSize={110}
        renderItem={({ item }) => (
          <TransactionCard
            transaction={{ ...item, time: formatRelativeTime(item.time) }}
            navigation={navigation}
          />
        )}
        keyExtractor={(item) => item.txid.toString()}
        {...props}
        snapToEnd={false}
        showsVerticalScrollIndicator={false}
        horizontal={false}
        ItemSeparatorComponent={() => <AppCardSeparator />}
      />
    </View>
  );
});

const styles = StyleSheet.create({});

export default ActivityList;
