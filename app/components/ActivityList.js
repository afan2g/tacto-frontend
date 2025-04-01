import React from "react";
import { View, StyleSheet, FlatList } from "react-native";
import Animated from "react-native-reanimated";
import { AppCardSeparator, TransactionCard } from "./cards";
import { colors } from "../config";
import formatRelativeTime from "../utils/formatRelativeTime";
import { FlashList } from "@shopify/flash-list";
import { useData } from "../contexts";

const AnimatedFlashList = Animated.createAnimatedComponent(FlashList);

const ActivityList = React.forwardRef((props, ref) => {
  const { data, user, navigation, minHeight } = props;
  const { profile } = useData();
  return (
    <View style={[minHeight, { flex: 1 }]}>
      <AnimatedFlashList
        ref={ref}
        data={data}
        estimatedItemSize={110}
        renderItem={({ item }) => (
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
        )}
        keyExtractor={(item) => item.id}
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
