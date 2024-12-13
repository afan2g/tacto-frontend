import React from "react";
import { View, StyleSheet, FlatList } from "react-native";
import Animated from "react-native-reanimated";
import { AppCardSeparator, TransactionCard } from "../components/cards";
import { colors } from "../config";
import formatRelativeTime from "../utils/formatRelativeTime";

const ActivityList = React.forwardRef((props, ref) => {
  const { data, navigation } = props;

  return (
    <Animated.FlatList
      ref={ref}
      data={data}
      style={[styles.container]}
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
      ItemSeparatorComponent={() => <AppCardSeparator />}
    />
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.blue,
  },
});

export default ActivityList;
