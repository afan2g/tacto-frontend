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
import { getLocales } from "expo-localization";
import { AppText, Header, Screen } from "../../components/primitives";
import { colors, fonts } from "../../config";
import { supabase } from "../../../lib/supabase";
import {
  AccountBalanceCard,
  AppCardSeparator,
  UserCard,
} from "../../components/cards";
import { useData } from "../../contexts/DataContext";
import { Button } from "react-native-paper";
import routes from "../../navigation/routes";
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
  const { profile, wallet, completedTransactions } = useData();
  const handleUserCardPress = () => {
    console.log("User card pressed!");
    const locale = getLocales();
    console.log("locale: ", locale);
  };

  const handleLogout = async () => {
    console.log("Logout pressed!");
    const { error } = await supabase.auth.signOut();
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
        <AccountBalanceCard balance={wallet.usdc_balance} />
        <Button onPress={() => navigation.navigate(routes.TESTING)}>
          Go To Testing Screen
        </Button>
        <Button onPress={() => navigation.navigate(routes.QRTESTING)}>
          Go To QR Testing Screen
        </Button>
        <Button onPress={() => navigation.navigate(routes.TESTBOTTOMSHEET)}>
          Go To Bottom Sheet Test
        </Button>
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
    backgroundColor: colors.blueGray.shade40,
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
