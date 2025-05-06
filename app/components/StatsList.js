import React, { forwardRef, useImperativeHandle, useRef } from "react";
import { View, StyleSheet, ScrollView, Text } from "react-native";
import Animated from "react-native-reanimated";
import { colors } from "../config";

const StatsList = forwardRef((props, ref) => {
  const { minHeight, contentContainerStyle } = props;
  console.log("StatsList minHeight", minHeight);
  const listRef = useRef(null);

  useImperativeHandle(ref, () => ({
    scrollToOffset: (params) => listRef.current?.scrollTo(params),
    scrollToEnd: (params) => listRef.current?.scrollToEnd(params),
  }));

  const onLayout = (e) => {
    const { height } = e.nativeEvent.layout;
    console.log("StatsList onLayout height", height);
  };

  return (
    <View style={[styles.container]} onLayout={onLayout}>
      <Animated.ScrollView
        ref={listRef}
        style={styles.scrollView}
        nestedScrollEnabled={false}
        horizontal={false}
        {...props}
        contentContainerStyle={[props.contentContainerStyle, minHeight]}
        showsVerticalScrollIndicator={false}
        snapToEnd={false}
        bounces={false}
      >
        <View style={styles.cardsContainer}>
          <View style={styles.cardRow}>
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Total Balance</Text>
              <Text style={styles.cardValue}>$123,456.12</Text>
            </View>
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Total Transactions</Text>
              <Text style={styles.cardValue}>123</Text>
            </View>
          </View>
          <View style={styles.cardRow}>
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Total Balance</Text>
              <Text style={styles.cardValue}>$123,456.12</Text>
            </View>
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Total Transactions</Text>
              <Text style={styles.cardValue}>123</Text>
            </View>
          </View>
          <View style={styles.cardRow}>
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Total Balance</Text>
              <Text style={styles.cardValue}>$123,456.12</Text>
            </View>
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Total Transactions</Text>
              <Text style={styles.cardValue}>123</Text>
            </View>
          </View>
        </View>
      </Animated.ScrollView>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 16,
    paddingHorizontal: 10,
    backgroundColor: colors.black,
  },
  scrollView: {
    flex: 1,
    backgroundColor: colors.black,
  },
  contentContainer: {
    height: 1095,
  },
  cardsContainer: {
    flexDirection: "column",
    gap: 10,
  },

  cardRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
  },
  card: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f8f8f8",
    borderRadius: 8,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "bold",
  },
  cardValue: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 8,
  },
});

export default StatsList;
