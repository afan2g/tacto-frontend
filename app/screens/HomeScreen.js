import React from "react";
import { View, StyleSheet, FlatList } from "react-native";

import { TransactionCard, TransactionCardSeparator } from "../components/cards";
import { AppText, Header, Screen } from "../components/primitives";
import { colors } from "../config";
import useGreeting from "../hooks/useGreeting";
import getRandomDate from "../utils/getRandomDate";
import formatRelativeTime from "../utils/formatRelativeTime";

const FAKEDATA = [
  {
    from: {
      name: "Aaron Fan",
      profilePicUrl: "https://api.dicebear.com/9.x/bottts-neutral/png",
    },
    to: {
      name: "Kyle Li",
      profilePicUrl: "https://api.dicebear.com/9.x/bottts-neutral/png",
    },
    amount: 10.0,
    memo: "Ullamco excepteur reprehenderit reprehenderit non eiusmod velit ullamco ullamco eu ullamco voluptate.",
    score: 2,
    comments: 1,
    txid: 1,
    time: getRandomDate("week"),
  },
  {
    from: {
      name: "Kevin Liu",
      profilePicUrl: "https://api.dicebear.com/9.x/bottts-neutral/png",
    },
    to: {
      name: "Nate Gale",
      profilePicUrl: "https://api.dicebear.com/9.x/bottts-neutral/png",
    },
    amount: 121.1,
    memo: "Aute ad sunt nisi officia sunt consectetur esse labore ad deserunt occaecat.",
    score: 0,
    comments: 0,
    txid: 2,
    time: getRandomDate("day"),
  },
  {
    from: {
      name: "James Hill",
      profilePicUrl: "https://api.dicebear.com/9.x/bottts-neutral/png",
    },
    to: {
      name: "Michael Reeves",
      profilePicUrl: "https://api.dicebear.com/9.x/bottts-neutral/png",
    },
    amount: 6.51,
    memo: "Fugiat id et consequat ea nulla ex pariatur id amet mollit esse sit consectetur.",
    score: 3,
    comments: 11,
    txid: 3,
    time: getRandomDate("hour"),
  },
  {
    from: {
      name: "Jill Pyle",
      profilePicUrl: "https://api.dicebear.com/9.x/bottts-neutral/png",
    },
    to: {
      name: "Miranda Knox",
      profilePicUrl: "https://api.dicebear.com/9.x/bottts-neutral/png",
    },
    amount: 7.01,
    memo: "Magna deserunt ipsum fugiat reprehenderit anim velit.",
    score: 1,
    comments: 1,
    txid: 4,
    time: getRandomDate(),
  },
];
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
        data={FAKEDATA}
        renderItem={({ item }) => (
          <TransactionCard
            transaction={{ ...item, time: formatRelativeTime(item.time) }}
            navigation={navigation}
          />
        )}
        keyExtractor={(item) => item.txid.toString()}
        ItemSeparatorComponent={TransactionCardSeparator}
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
