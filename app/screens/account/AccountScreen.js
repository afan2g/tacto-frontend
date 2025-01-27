import React from "react";
import {
  ActivityIndicator,
  View,
  StyleSheet,
  SectionList,
  Pressable,
  Text,
} from "react-native";
import { ChevronRight, Settings } from "lucide-react-native";
import * as SecureStore from "expo-secure-store";
import { ethers } from "ethers";

import { AppText, Header, Screen } from "../../components/primitives";
import { colors, fonts } from "../../config";
import { FAKEPROFILE } from "../../data/fakeData";
import { supabase } from "../../../lib/supabase";
import {
  AccountBalanceCard,
  AppCardSeparator,
  UserCard,
} from "../../components/cards";
import { useData } from "../../contexts/DataContext";
import { storage } from "../../../lib/storage";
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
  const { profile, wallet } = useData();
  const handleUserCardPress = () => {
    console.log("User card pressed!");
  };

  const handleLogout = async () => {
    console.log("Logout pressed!");
    const { error } = await supabase.auth.signOut();
  };

  const handleViewStorage = () => {
    console.log("Refresh pressed!");
    console.log("storage profile: ", profile);
    console.log("storage wallet: ", wallet);
  };

  const handleViewSecureStorage = async () => {
    console.log("Secure storage pressed!");
    const secureData = JSON.parse(
      await SecureStore.getItemAsync("ENCRYPTED_WALLET")
    );
    console.log("Secure data: ", secureData);
    const secureWallet = ethers.HDNodeWallet.fromPhrase(
      secureData.phrase,
      undefined,
      secureData.path
    );
    console.log("Secure wallet: ", secureWallet);
  };

  return (
    <Screen style={styles.screen}>
      <View style={styles.accountContainer}>
        {profile ? (
          <UserCard
            user={profile}
            style={styles.userCard}
            onPress={handleUserCardPress}
          />
        ) : (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.yellow} />
          </View>
        )}
        <AccountBalanceCard balance={FAKEPROFILE.balance} />
        <Pressable style={styles.refreshButton} onPress={handleViewStorage}>
          <AppText style={styles.refreshText}>View Storage</AppText>
        </Pressable>
        <Pressable
          style={styles.refreshButton}
          onPress={handleViewSecureStorage}
        >
          <AppText style={styles.refreshText}>View Secure Storage</AppText>
        </Pressable>
      </View>
      <SectionList
        sections={SECTIONS}
        keyExtractor={(item, index) => item + index}
        renderItem={({ item }) => (
          <Pressable
            style={({ pressed }) => [
              styles.item,
              pressed ? styles.pressed : styles.notPressed,
            ]}
            onPress={() => console.log(item.title)}
            unstable_pressDelay={250}
          >
            <AppText style={styles.title}>{item.title}</AppText>
            <ChevronRight color={colors.lightGray} size={24} />
          </Pressable>
        )}
        renderSectionHeader={({ section: { title } }) => (
          <Header style={styles.sectionHeader}>{title}</Header>
        )}
        contentContainerStyle={styles.sectionList}
        ItemSeparatorComponent={() => <AppCardSeparator />}
      />
      <Pressable style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>Logout</Text>
      </Pressable>
    </Screen>
  );
}

const styles = StyleSheet.create({
  screen: {
    paddingHorizontal: 0,
  },
  accountContainer: {},
  userCard: {
    marginHorizontal: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  refreshButton: {
    padding: 20,
    alignItems: "center",
  },
  refreshText: {
    fontSize: 16,
    fontFamily: fonts.medium,
    color: colors.lightGray,
  },
  item: {
    padding: 20,
    flexDirection: "row",
    alignItems: "flex-start",
  },
  pressed: {
    backgroundColor: colors.blueShade40,
  },
  notPressed: {
    backgroundColor: "transparent",
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
    paddingBottom: 20,
  },
  logoutButton: {
    padding: 20,
    alignItems: "center",
  },
  logoutText: {
    fontSize: 16,
    fontFamily: fonts.medium,
    color: colors.red,
  },
});

export default AccountScreen;
