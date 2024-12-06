import React from "react";
import { View, StyleSheet, Image, SectionList } from "react-native";
import { Settings } from "lucide-react-native";

import { AppText, Header, Screen } from "../components/primitives";
import { colors, fonts } from "../config";
import { FAKEPROFILE } from "../data/fakeData";
import {
  AccountBalanceCard,
  TransactionCard,
  TransactionCardSeparator,
  UserCard,
} from "../components/cards";

const SECTIONS = [
  {
    title: "Settings",
    data: [
      { title: "Edit Profile", icon: Settings },
      { title: "Privacy & Security", icon: Settings },
      { title: "Notifications", icon: Settings },
      { title: "Help & Support", icon: Settings },
    ],
  },
  {
    title: "Wallet",
    data: [
      { title: "Add Funds", icon: Settings },
      { title: "Withdraw Funds", icon: Settings },
      { title: "Transfer Funds", icon: Settings },
    ],
  },
  {
    title: "Stats",
    data: [
      { title: "Total Balance", value: "$123,456.12" },
      { title: "Total Transactions", value: "123" },
    ],
  },
  {
    title: "About",
    data: [
      { title: "About Us", icon: Settings },
      { title: "Terms of Service", icon: Settings },
      { title: "Privacy Policy", icon: Settings },
    ],
  },
];

function AccountScreen({ navigation }) {
  return (
    <Screen style={styles.screen}>
      <UserCard user={FAKEPROFILE} style={styles.userCard} />
      <AccountBalanceCard balance={FAKEPROFILE.balance} />
      <SectionList
        sections={SECTIONS}
        keyExtractor={(item, index) => item + index}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <AppText style={styles.title}>{item.title}</AppText>
          </View>
        )}
        renderSectionHeader={({ section: { title } }) => (
          <Header style={styles.sectionHeader}>{title}</Header>
        )}
        style={styles.sectionList}
        ItemSeparatorComponent={() => <TransactionCardSeparator />}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  screen: {
    paddingHorizontal: 0,
  },
  userCard: {},
  item: {
    padding: 20,
  },
  title: {
    fontSize: 16,
    fontFamily: fonts.medium,
    color: colors.lightGray,
  },
  sectionHeader: {
    paddingHorizontal: 10,
    textAlignVertical: "bottom",
    borderBottomWidth: 1,
    borderBottomColor: colors.grayOpacity40,
    fontSize: 24,
  },
  sectionList: {
    width: "100%",
    paddingTop: 10,
  },
});

export default AccountScreen;
