import React from "react";
import { View, StyleSheet, FlatList } from "react-native";

import {
  AppCardSeparator,
  TransactionCard,
  TransactionCardSeparator,
} from "../components/cards";
import { AppText, Header, Screen } from "../components/primitives";
import { colors } from "../config";
import useGreeting from "../hooks/useGreeting";
import formatRelativeTime from "../utils/formatRelativeTime";
import { FAKE_HOME_SCREEN_DATA } from "../data/fakeData";

function HomeScreen({ navigation }) {
  const greeting = useGreeting();

  const handleCardPress = () => {
    console.log(item);
  };

  const handleProfilePress = () => {
    console.log(item.from);
  };
  return (
    <Screen style={styles.screen}>
      <View style={styles.headerContainer}>
        <Header style={styles.header}>
          {greeting},{" "}
          <AppText style={[styles.header, styles.firstName]}>Aaron.</AppText>
        </Header>
      </View>

      <FlatList
        data={FAKE_HOME_SCREEN_DATA}
        renderItem={({ item }) => (
          <TransactionCard
            transaction={{ ...item, time: formatRelativeTime(item.time) }}
            navigation={navigation}
          />
        )}
        keyExtractor={(item) => item.txid.toString()}
        ItemSeparatorComponent={() => <AppCardSeparator />}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  screen: {
    paddingHorizontal: 0,
  },
  headerContainer: {
    borderBottomWidth: 1,
    borderColor: colors.softGray,
    marginBottom: 10,
  },
  header: {
    paddingHorizontal: 10,
    paddingBottom: 10,
  },
  firstName: {
    color: colors.yellow,
  },
});

export default HomeScreen;
