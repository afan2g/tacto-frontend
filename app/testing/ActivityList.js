import React from "react";
import { View, StyleSheet, FlatList } from "react-native";
import Animated from "react-native-reanimated";
import { AppCardSeparator, TransactionCard } from "../components/cards";
import { colors } from "../config";
import formatRelativeTime from "../utils/formatRelativeTime";

const ActivityList = React.forwardRef((props, ref) => {
  return (
    <Animated.FlatList
      ref={ref}
      data={props.data}
      style={[styles.container]}
      renderItem={({ item }) => (
        <TransactionCard
          transaction={{ ...item, time: formatRelativeTime(item.time) }}
        />
      )}
      keyExtractor={(item) => item.txid.toString()}
      {...props}
      // onMomentumScrollEnd={() => console.log("Momentum scroll end")}
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
